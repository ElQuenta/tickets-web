import { useAuthStore } from "../store/authstore";


export const getAuthConfig = () => {
  const { isAuthenticated, user } = useAuthStore.getState();
  const token = isAuthenticated ? user?.accessToken : undefined;

  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};