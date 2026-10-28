import apiClient from "./apiClient";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../models/authModels";

const BASE_URL = "auth";

export const login = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log("Login request:", { email, password });
    const response = await apiClient.post(
      `${BASE_URL}/login?useCookies=false`,
      {
        email,
        password,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const register = async ({
  email,
  password,
  username,
}: RegisterRequest): Promise<LoginResponse> => {
  try {
    console.log("Register request:", { email, password, username });
    const response = await apiClient.post(`${BASE_URL}/register`, {
      email,
      password,
      username,
    });
    return response.data;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
};
