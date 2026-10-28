import type {
  User,
  EditUserRequest,
  UserRoleRequest,
} from "../models/userModels";

import apiClient from "./apiClient";
import { getAuthConfig } from "../utils/AuthConfig";

const BASE_URL = "users";

export const getUsers = async (signal?: AbortSignal): Promise<User[]> => {
  try {
    const response = await apiClient.get(`${BASE_URL}`, {
      ...getAuthConfig(),
      signal,
    });
    return response.data.data as User[];
  } catch (error) {
    if (!signal?.aborted) console.error("Error fetching users:", error);
    throw error;
  }
};

export const editUser = async (
  userId: string,
  userData: EditUserRequest,
): Promise<User> => {
  try {
    const response = await apiClient.put(
      `${BASE_URL}/${userId}`,
      userData,
      getAuthConfig(),
    );
    return response.data.data as User;
  } catch (error) {
    console.error(`Error editing user with ID ${userId}:`, error);
    throw error;
  }
};

export const assignRoleToUser = async ({
  userId,
  roleId,
}: UserRoleRequest): Promise<void> => {
  try {
    await apiClient.post(
      `${BASE_URL}/${userId}/roles`,
      { roleId },
      getAuthConfig(),
    );
  } catch (error) {
    console.error(`Error assigning role ${roleId} to user ${userId}:`, error);
    throw error;
  }
};

export const removeRoleFromUser = async ({
  userId,
  roleId,
}: UserRoleRequest): Promise<void> => {
  try {
    await apiClient.delete(
      `${BASE_URL}/${userId}/roles/${roleId}`,
      getAuthConfig(),
    );
  } catch (error) {
    console.error(`Error removing role ${roleId} from user ${userId}:`, error);
    throw error;
  }
};
