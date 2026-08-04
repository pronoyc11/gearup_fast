export type Role = "ADMIN" | "CUSTOMER" | "PROVIDER";

export type UserStatus = "ACTIVE" | "SUSPENDED";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: UserStatus;
  phone?: string;
  address?: string;
  createdAt?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: Exclude<Role, "ADMIN">;
  phone?: string;
  address?: string;
};

export type LoginResponse = {
  accessToken: string;
  user?: User;
};
