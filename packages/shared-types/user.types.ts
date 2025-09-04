export enum UserRole {
  OWNER = 'owner', 
  EDITOR = 'editor',
}

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string;
  updatedAt: string;
}

export interface UserInventoryItem {
  id: string;
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  tags: string[];
  isPublic: boolean;
  imageUrl: string | null;
  itemCount: number;
  createdBy: {
    id: string;
    name: string;
  };
  userRole: UserRole.OWNER | UserRole.EDITOR;
  createdAt: string;
  updatedAt: string;
}

export interface UserInventoriesResponse {
  inventories: UserInventoryItem[];
}

export interface UsersListResponse {
  users: UserProfile[]
}