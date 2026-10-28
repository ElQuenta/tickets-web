export interface User {
  id: string;
  username: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  accessFailedCount: number;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}

export interface EditUserRequest {
  username: string;
  email: string;
  phoneNumber: string | null;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  password?: string;
}

export interface UserRoleRequest {
  roleId: string;
  userId: string;
}
