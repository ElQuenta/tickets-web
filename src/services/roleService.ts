import type { Role } from "../models/roleModels";

import apiClient from "./apiClient";
import { getAuthConfig } from "../utils/AuthConfig";

const BASE_URL = "roles";

export const getRoles = async (signal?: AbortSignal): Promise<Role[]> => {
  try {
    const response = await apiClient.get(`${BASE_URL}`, {
      ...getAuthConfig(),
      signal,
    });
    return response.data.data as Role[];
  } catch (error) {
    if (!signal?.aborted) console.error("Error fetching roles:", error);
    throw error;
  }
};
