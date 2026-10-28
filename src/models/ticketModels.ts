export interface Ticket {
  id: string;
  stateId: string;
  userId: string;
  title: string;
  description: string;
  equipment: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TicketByState {
  id: string;
  name: string;
  tickets: Ticket[];
}

export interface TicketHistory {
  id: string;
  ticketId: string;
  userId: string;
  comment: string;
  prevState: string;
  newState: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketDetails extends Ticket {
  history: TicketHistory[];
}

export interface TicketState {
  id: string;
  name: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  equipment: string;
}

export interface UpdateTicketRequest {
  title: string;
  description: string;
  equipment: string;
}

export interface UpdateTicketStateRequest {
  stateId: string;
  comment: string;
}

export interface DeleteTicketRequest {
  comment: string;
}

export type TicketModal =
  | { kind: "create" }
  | { kind: "edit"; ticket: Ticket }
  | { kind: "delete"; ticket: Ticket }
  | { kind: "state"; ticket: Ticket; targetState: TicketState }
  | { kind: "details"; ticketId: string }
  | null;
