import type { UserRole } from "../users/types.js";

export interface UserClaims {
  userId: string;
  role: UserRole;
}
