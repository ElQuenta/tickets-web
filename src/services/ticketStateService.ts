import type { TicketState } from "../models/ticketModels";

import apiClient from "./apiClient";
import { getAuthConfig } from "../utils/AuthConfig";

const BASE_URL = "states";

export const getTicketStates = async (): Promise<TicketState[]> => {
  try {
    const response = await apiClient.get(`${BASE_URL}`, getAuthConfig());
    return response.data.data as TicketState[];
  } catch (error) {
    console.error("Error fetching ticket states:", error);
    throw error;
  }
};
