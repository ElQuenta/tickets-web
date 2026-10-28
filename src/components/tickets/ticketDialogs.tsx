import { CloseRounded, ArrowForwardRounded } from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import type { FormikProps } from "formik";
import type {
  CreateTicketRequest,
  Ticket,
  TicketDetails,
  TicketModal,
  TicketState,
} from "../../models/ticketModels";
import { getAllowedStates } from "../../utils/ticketWorkflow";
import TicketForm from "./ticketForm";
import TicketCommentForm from "./ticketCommentForm";
import TicketDetail from "./ticketDetail";

interface TicketDialogsProps {
  modal: TicketModal;
  details: TicketDetails | null;
  detailsLoading: boolean;
  states: TicketState[];
  canChangeState: boolean;
  error: string;
  busy: boolean;
  ticketFormik: FormikProps<CreateTicketRequest>;
  commentFormik: FormikProps<{ comment: string }>;
  onClose: () => void;
  onChangeState: (ticket: Ticket) => void;
  onSelectState: (stateId: string) => void;
  onRetryDetails: (id: string) => void;
}

const TicketDialogs = ({
  modal,
  details,
  detailsLoading,
  states,
  canChangeState,
  error,
  busy,
  ticketFormik,
  commentFormik,
  onClose,
  onChangeState,
  onSelectState,
  onRetryDetails,
}: TicketDialogsProps) => {
  const title =
    modal?.kind === "create"
      ? "Crear ticket"
      : modal?.kind === "edit"
        ? "Editar ticket"
        : modal?.kind === "delete"
          ? "Eliminar ticket"
          : modal?.kind === "state"
            ? "Cambiar estado"
            : "Detalle del ticket";
  return (
    <Dialog
      open={modal !== null}
      onClose={onClose}
      fullWidth
      maxWidth={modal?.kind === "details" ? "sm" : "xs"}
      className="ticket-dialog"
      aria-labelledby="ticket-dialog-title"
    >
      <DialogTitle id="ticket-dialog-title" className="ticket-dialog-title">
        <span>{title}</span>
        <IconButton aria-label="Cerrar modal" onClick={onClose} disabled={busy}>
          <CloseRounded fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" className="ticket-modal-error">
            {error}
            {modal?.kind === "details" && (
              <Button
                color="inherit"
                onClick={() => onRetryDetails(modal.ticketId)}
              >
                Reintentar
              </Button>
            )}
          </Alert>
        )}
        {(modal?.kind === "create" || modal?.kind === "edit") && (
          <>
            <p className="ticket-dialog-description">
              {modal.kind === "edit"
                ? "Actualiza la información de este ticket."
                : "Un nuevo paso hacia una solución. Completa los datos para empezar."}
            </p>
            <TicketForm
              formik={ticketFormik}
              editing={modal.kind === "edit"}
              busy={busy}
              onCancel={onClose}
            />
          </>
        )}
        {modal?.kind === "delete" && (
          <>
            <p className="ticket-dialog-description">
              Vas a eliminar <strong>{modal.ticket.title}</strong>. Dejará de
              aparecer en el tablero y conservará su historial.
            </p>
            <TicketCommentForm
              formik={commentFormik}
              deleting
              busy={busy}
              onCancel={onClose}
            />
          </>
        )}
        {modal?.kind === "state" && (
          <>
            <p className="ticket-dialog-description">
              Registra el cambio de estado de{" "}
              <strong>{modal.ticket.title}</strong>.
            </p>
            <div className="ticket-state-transition">
              <span>
                {
                  states.find((state) => state.id === modal.ticket.stateId)
                    ?.name
                }
              </span>
              <ArrowForwardRounded fontSize="small" />
              <strong>{modal.targetState.name}</strong>
            </div>
            <TicketCommentForm
              formik={commentFormik}
              deleting={false}
              busy={busy}
              onCancel={onClose}
              transition={{
                states: getAllowedStates(modal.ticket, states),
                targetStateId: modal.targetState.id,
                onSelectState,
              }}
            />
          </>
        )}
        {modal?.kind === "details" &&
          (detailsLoading ? (
            <div className="ticket-detail-loading" role="status">
              <CircularProgress size={28} />
              <span>Cargando detalles e historial…</span>
            </div>
          ) : (
            details && (
              <TicketDetail
                ticket={details}
                states={states}
                allowedStates={getAllowedStates(details, states)}
                canChangeState={canChangeState}
                onChangeState={() => onChangeState(details)}
              />
            )
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default TicketDialogs;
