import type {
  TicketByState,
  Ticket,
  TicketDetails,
  CreateTicketRequest,
  UpdateTicketRequest,
  UpdateTicketStateRequest,
  DeleteTicketRequest,
} from "../models/ticketModels";

import apiClient from "./apiClient";
import { getAuthConfig } from "../utils/AuthConfig";

const BASE_URL = "tickets";

interface TicketSummaryResponse extends Omit<
  Ticket,
  "id" | "userId" | "stateId" | "deletedAt"
> {
  ID: string;
  User_id: string;
  State_id: string;
}

interface TicketGroupResponse {
  stateId: string;
  stateName: string;
  tickets: TicketSummaryResponse[];
}

export const getTickets = async (): Promise<TicketByState[]> => {
  try {
    const response = await apiClient.get(`${BASE_URL}`, getAuthConfig());
    return (response.data.data as TicketGroupResponse[]).map((group) => ({
      id: group.stateId,
      name: group.stateName,
      tickets: group.tickets.map(({ ID, User_id, State_id, ...ticket }) => ({
        ...ticket,
        id: ID,
        userId: User_id,
        stateId: State_id,
        deletedAt: null,
      })),
    }));
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const getDeletedTickets = async (): Promise<Ticket[]> => {
  try {
    const response = await apiClient.get(
      `${BASE_URL}/deleted`,
      getAuthConfig(),
    );
    return response.data.data as Ticket[];
  } catch (error) {
    console.error("Error fetching deleted tickets:", error);
    throw error;
  }
};

export const getTicketById = async (
  ticketId: string,
): Promise<TicketDetails> => {
  try {
    const response = await apiClient.get(
      `${BASE_URL}/${ticketId}`,
      getAuthConfig(),
    );
    const { ticket, history } = response.data.data as {
      ticket: Ticket;
      history: TicketDetails["history"];
    };
    return { ...ticket, history };
  } catch (error) {
    console.error(`Error fetching ticket with ID ${ticketId}:`, error);
    throw error;
  }
};

export const createTicket = async ({
  description,
  title,
  equipment,
}: CreateTicketRequest): Promise<Ticket> => {
  try {
    const response = await apiClient.post(
      `${BASE_URL}`,
      { description, title, equipment },
      getAuthConfig(),
    );
    return response.data.data as Ticket;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const updateTicket = async (
  { description, title, equipment }: UpdateTicketRequest,
  ticketId: string,
): Promise<void> => {
  try {
    await apiClient.put(
      `${BASE_URL}/${ticketId}`,
      { description, title, equipment },
      getAuthConfig(),
    );
  } catch (error) {
    console.error(`Error updating ticket with ID ${ticketId}:`, error);
    throw error;
  }
};

export const updateTicketState = async (
  { stateId, comment }: UpdateTicketStateRequest,
  ticketId: string,
): Promise<void> => {
  try {
    await apiClient.put(
      `${BASE_URL}/${ticketId}/state`,
      { stateId, comment },
      getAuthConfig(),
    );
  } catch (error) {
    console.error(
      `Error updating state for ticket with ID ${ticketId}:`,
      error,
    );
    throw error;
  }
};

export const deleteTicket = async (
  { comment }: DeleteTicketRequest,
  ticketId: string,
): Promise<void> => {
  try {
    await apiClient.delete(`${BASE_URL}/${ticketId}`, {
      ...getAuthConfig(),
      data: { comment },
    });
  } catch (error) {
    console.error(`Error deleting ticket with ID ${ticketId}:`, error);
    throw error;
  }
};
