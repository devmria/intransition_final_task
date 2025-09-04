import { UserRole } from './user.types';

export interface GrantAccessData {
  userId: string;
}

export interface RevokeAccessData {
  userId: string;
}

export interface InventoryUser {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: UserRole;
  isOwner: boolean;
}

export interface UpdateRoleData {
  role: UserRole.EDITOR;
}

export interface MyAccessResponse {
  role: string | null;
  hasAccess: boolean;
}

export interface InventoryAccessListResponse {
  accesseUsersList: InventoryUser[]
}

export interface AddAccessResponse {
  addedUser: InventoryUser
}

export interface RevokeAccessResponse {
  id: string;
}