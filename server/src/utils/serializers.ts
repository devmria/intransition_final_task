import { UserProfile } from "~types";

export const serializeUser = (user: UserProfile | any) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    status: user.status,
    isAdmin: user.isAdmin,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}