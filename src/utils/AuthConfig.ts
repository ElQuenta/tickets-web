import { useAuthStore } from "../store/authstore";
import apiClient from "../services/apiClient";


export const getAuthConfig = () => {
  const { isAuthenticated, user } = useAuthStore.getState();
  const token = isAuthenticated ? user?.accessToken : undefined;
  if (!token) return { headers: {} };

  const authorization = `Bearer ${token}`;
  const baseURL = apiClient.defaults.baseURL || "/api";
  const usesProxy = !/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(baseURL);

  return {
    headers: {
      Authorization: authorization,
      // Azure SWA puede reemplazar Authorization al invocar la función.
      ...(usesProxy ? { "X-Tickets-Authorization": authorization } : {}),
    },
  };
};
