export const userRoles = ["user", "author", "editor", "admin"] as const;

export type UserRole = (typeof userRoles)[number];

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
