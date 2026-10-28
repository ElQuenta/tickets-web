import type { Ticket, TicketState } from "../models/ticketModels";

export const STATE_FLOW = ["Pendiente", "En Proceso", "Resuelto"] as const;

export const stateOrder = (name: string) => {
  const index = STATE_FLOW.findIndex(
    (state) => state.toLowerCase() === name.toLowerCase(),
  );
  return index < 0 ? STATE_FLOW.length : index;
};

export const ticketPermissions = (roles: readonly string[] = []) => {
  const normalized = roles.map((role) => role.toLowerCase());
  const isAdmin = normalized.includes("admin");
  return {
    isAdmin,
    canChangeState: isAdmin || normalized.includes("technician"),
  };
};

export const getAllowedStates = (
  ticket: Ticket,
  states: TicketState[],
): TicketState[] => {
  if (ticket.deletedAt !== null) return [];
  const current = states.find((state) => state.id === ticket.stateId);
  if (!current) return [];
  const index = stateOrder(current.name);
  if (index >= STATE_FLOW.length) return [];
  return states
    .filter((state) => {
      const targetIndex = stateOrder(state.name);
      return (
        targetIndex < STATE_FLOW.length &&
        (targetIndex < index || targetIndex === index + 1)
      );
    })
    .sort((a, b) => stateOrder(a.name) - stateOrder(b.name));
};

export const formatTicketDate = (value: string | null | undefined) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};
