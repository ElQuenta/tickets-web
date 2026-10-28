import { useCallback, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { isAxiosError } from "axios";
import type { DropResult } from "@hello-pangea/dnd";
import type {
  CreateTicketRequest,
  Ticket,
  TicketByState,
  TicketDetails,
  TicketModal,
  TicketState,
} from "../models/ticketModels";
import { ticketSchema, ticketCommentSchema } from "../schemas/ticketSchema";
import {
  createTicket,
  deleteTicket,
  getDeletedTickets,
  getTicketById,
  getTickets,
  updateTicket,
  updateTicketState,
} from "../services/ticketService";
import { getTicketStates } from "../services/ticketStateService";
import { useAuthStore } from "../store/authstore";
import {
  getAllowedStates,
  stateOrder,
  ticketPermissions,
} from "../utils/ticketWorkflow";

const emptyTicket: CreateTicketRequest = {
  title: "",
  equipment: "",
  description: "",
};

const errorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    if (error.response?.status === 401)
      return "Tu sesión expiró. Vuelve a iniciar sesión.";
    if (error.response?.status === 403)
      return "No tienes permiso para realizar esta acción.";
    const data = error.response?.data;
    if (typeof data?.message === "string") return data.message;
  }
  return fallback;
};

export const useTicketBoard = () => {
  const user = useAuthStore((state) => state.user);
  const { isAdmin, canChangeState } = ticketPermissions(user.roles);
  const [columns, setColumns] = useState<TicketByState[]>([]);
  const [states, setStates] = useState<TicketState[]>([]);
  const [deletedTickets, setDeletedTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardError, setBoardError] = useState("");
  const [deletedError, setDeletedError] = useState("");
  const [modal, setModal] = useState<TicketModal>(null);
  const [details, setDetails] = useState<TicketDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{
    message: string;
    severity: "success" | "warning";
  } | null>(null);
  const mutationLock = useRef(false);
  const loadSequence = useRef(0);
  const detailSequence = useRef(0);

  const loadBoard = useCallback(() => {
    const sequence = ++loadSequence.current;
    return Promise.allSettled([
      Promise.all([getTickets(), getTicketStates()]),
      isAdmin ? getDeletedTickets() : Promise.resolve([] as Ticket[]),
    ]).then(([boardResult, deletedResult]) => {
      if (sequence !== loadSequence.current) return;
      if (boardResult.status === "fulfilled") {
        const [groups, ticketStates] = boardResult.value;
        const orderedStates = [...ticketStates].sort(
          (a, b) => stateOrder(a.name) - stateOrder(b.name),
        );
        setStates(orderedStates);
        setColumns(
          orderedStates.map((state) => ({
            ...state,
            tickets: (
              groups.find((group) => group.id === state.id)?.tickets ?? []
            ).filter((ticket) => ticket.deletedAt === null),
          })),
        );
        setBoardError("");
      } else {
        setBoardError(
          errorMessage(
            boardResult.reason,
            "No se pudo actualizar el tablero. Intenta nuevamente.",
          ),
        );
      }
      if (deletedResult.status === "fulfilled") {
        setDeletedTickets(
          [...deletedResult.value].sort(
            (a, b) =>
              Date.parse(b.deletedAt ?? "") - Date.parse(a.deletedAt ?? ""),
          ),
        );
        setDeletedError("");
      } else {
        setDeletedError(
          errorMessage(
            deletedResult.reason,
            "No se pudieron cargar los tickets eliminados.",
          ),
        );
      }
      setLoading(false);
    });
  }, [isAdmin]);

  useEffect(() => {
    void loadBoard();
    return () => {
      loadSequence.current += 1;
      detailSequence.current += 1;
    };
  }, [loadBoard]);

  const reload = async () => {
    setLoading(true);
    await loadBoard();
  };

  const closeModal = () => {
    if (mutationLock.current) return;
    detailSequence.current += 1;
    setModal(null);
    setModalError("");
  };

  const mutate = async (action: () => Promise<unknown>, message: string) => {
    if (mutationLock.current) return;
    mutationLock.current = true;
    setBusy(true);
    setModalError("");
    try {
      await action();
      detailSequence.current += 1;
      setModal(null);
      setNotice({ message, severity: "success" });
      await reload();
    } catch (error) {
      setModalError(
        errorMessage(
          error,
          "No se pudo guardar el cambio. Intenta nuevamente.",
        ),
      );
    } finally {
      mutationLock.current = false;
      setBusy(false);
    }
  };

  const ticketFormik = useFormik<CreateTicketRequest>({
    initialValues: emptyTicket,
    validationSchema: ticketSchema,
    onSubmit: async (values) => {
      const request = {
        title: values.title.trim(),
        equipment: values.equipment.trim(),
        description: values.description.trim(),
      };
      if (modal?.kind === "create") {
        await mutate(
          () => createTicket(request),
          "Ticket creado correctamente.",
        );
      } else if (
        modal?.kind === "edit" &&
        isAdmin &&
        modal.ticket.deletedAt === null
      ) {
        await mutate(
          () => updateTicket(request, modal.ticket.id),
          "Ticket actualizado correctamente.",
        );
      }
    },
  });

  const commentFormik = useFormik({
    initialValues: { comment: "" },
    validationSchema: ticketCommentSchema,
    onSubmit: async ({ comment }) => {
      if (
        modal?.kind === "delete" &&
        isAdmin &&
        modal.ticket.deletedAt === null
      ) {
        await mutate(
          () => deleteTicket({ comment: comment.trim() }, modal.ticket.id),
          "Ticket eliminado correctamente.",
        );
      } else if (
        modal?.kind === "state" &&
        canChangeState &&
        getAllowedStates(modal.ticket, states).some(
          (state) => state.id === modal.targetState.id,
        )
      ) {
        await mutate(
          () =>
            updateTicketState(
              { stateId: modal.targetState.id, comment: comment.trim() },
              modal.ticket.id,
            ),
          "Estado actualizado correctamente.",
        );
      }
    },
  });

  const openCreate = () => {
    ticketFormik.resetForm({ values: emptyTicket });
    setModalError("");
    setModal({ kind: "create" });
  };

  const openEdit = (ticket: Ticket) => {
    if (!isAdmin || ticket.deletedAt !== null) return;
    ticketFormik.resetForm({
      values: {
        title: ticket.title,
        description: ticket.description,
        equipment: ticket.equipment,
      },
    });
    setModalError("");
    setModal({ kind: "edit", ticket });
  };

  const openDelete = (ticket: Ticket) => {
    if (!isAdmin || ticket.deletedAt !== null) return;
    commentFormik.resetForm();
    setModalError("");
    setModal({ kind: "delete", ticket });
  };

  const openStateChange = (ticket: Ticket, destinationId?: string) => {
    if (!canChangeState || ticket.deletedAt !== null || mutationLock.current)
      return;
    const allowedStates = getAllowedStates(ticket, states);
    const currentState = states.find((state) => state.id === ticket.stateId);
    const targetState = destinationId
      ? allowedStates.find((state) => state.id === destinationId)
      : (allowedStates.find(
          (state) =>
            stateOrder(state.name) > stateOrder(currentState?.name ?? ""),
        ) ?? allowedStates.at(-1));
    if (!targetState) {
      setNotice({
        message:
          "Solo puedes avanzar un estado por vez. Puedes retroceder a cualquier estado anterior.",
        severity: "warning",
      });
      return;
    }
    commentFormik.resetForm();
    setModalError("");
    setModal({ kind: "state", ticket, targetState });
  };

  const selectTargetState = (stateId: string) => {
    if (modal?.kind !== "state" || busy || !canChangeState) return;
    const targetState = getAllowedStates(modal.ticket, states).find(
      (state) => state.id === stateId,
    );
    if (targetState) setModal({ ...modal, targetState });
  };

  const openDetails = async (ticketId: string) => {
    const sequence = ++detailSequence.current;
    setModal({ kind: "details", ticketId });
    setDetails(null);
    setDetailsLoading(true);
    setModalError("");
    try {
      const ticket = await getTicketById(ticketId);
      if (sequence === detailSequence.current) setDetails(ticket);
    } catch (error) {
      if (sequence === detailSequence.current)
        setModalError(
          errorMessage(error, "No se pudieron cargar los detalles del ticket."),
        );
    } finally {
      if (sequence === detailSequence.current) setDetailsLoading(false);
    }
  };

  const onDragEnd = ({
    source,
    destination,
    draggableId,
    reason,
  }: DropResult) => {
    if (
      reason === "CANCEL" ||
      !destination ||
      !canChangeState ||
      busy ||
      modal ||
      loading ||
      boardError
    )
      return;
    const sourceColumn = columns.find(
      (column) => column.id === source.droppableId,
    );
    const ticket = sourceColumn?.tickets.find(
      (item) => item.id === draggableId,
    );
    if (!sourceColumn || !ticket || ticket.deletedAt !== null) return;
    if (source.droppableId === destination.droppableId) {
      const reordered = [...sourceColumn.tickets];
      reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, ticket);
      setColumns(
        columns.map((column) =>
          column.id === source.droppableId
            ? { ...column, tickets: reordered }
            : column,
        ),
      );
      return;
    }
    openStateChange(ticket, destination.droppableId);
  };

  return {
    isAdmin,
    canChangeState,
    columns,
    states,
    deletedTickets,
    loading,
    boardError,
    deletedError,
    modal,
    details,
    detailsLoading,
    modalError,
    busy,
    notice,
    ticketFormik,
    commentFormik,
    reload,
    closeModal,
    openCreate,
    openEdit,
    openDelete,
    openStateChange,
    selectTargetState,
    openDetails,
    onDragEnd,
    clearNotice: () => setNotice(null),
  };
};
