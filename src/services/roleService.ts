import type { Role } from "../models/roleModels";

import apiClient from "./apiClient";

const BASE_URL = "roles";

export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get(`${BASE_URL}`);
    return response.data.data as Role[];
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};
