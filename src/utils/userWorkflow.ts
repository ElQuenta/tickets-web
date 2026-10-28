import { isAxiosError } from "axios";
import type { Role } from "../models/roleModels";
import type { User } from "../models/userModels";

export const getUserErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError(error))
    return error instanceof Error ? error.message : fallback;
  if (error.response?.status === 401)
    return "Tu sesión expiró. Vuelve a iniciar sesión.";
  if (error.response?.status === 403)
    return "No tienes permiso para realizar esta acción.";
  const data = error.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors)
      .flat()
      .filter((value): value is string => typeof value === "string");
    if (messages.length) return messages.join(" ");
  }
  return typeof data?.message === "string" ? data.message : fallback;
};

export const userHasRole = (user: User, role: Role) =>
  user.roles.some((name) => name.toLowerCase() === role.name.toLowerCase());

export const toLocalDateTime = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 19);
};
