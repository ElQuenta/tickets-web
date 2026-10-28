import type { EditUserRequest, User } from "./userModels";

export interface EditUserValues extends Omit<
  EditUserRequest,
  "phoneNumber" | "lockoutEnd"
> {
  phoneNumber: string;
  lockoutEnd: string;
  password: string;
}

export type UserModal =
  | { kind: "create" }
  | { kind: "edit"; user: User }
  | { kind: "roles"; user: User }
  | null;
