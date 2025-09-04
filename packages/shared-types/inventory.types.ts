import { CustomField } from "./customField.types";

export interface InventoryListItem {
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
  createdAt: string;
  updatedAt: string;
}

export interface InventoryListResponse {
  inventories: InventoryListItem[];
}

export interface InventoryDetail {
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
    email: string;
  };
  editors: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
  version: number;
  createdAt: string;
  updatedAt: string;
  customFields: CustomField[];
}

export interface InventoryCreateRequest {
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  tags: string[];
  isPublic: boolean;
  imageUrl: string | null;
}

export interface InventoryUpdate {
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
}

export interface InventoryQueryFilters {
  limit?: string;
  category?: string;
  tag?: string;
  isPublic?: string;
  search?: string;
  sortBy?: string;
}

export interface InventoryCreateResponse extends InventoryListItem {}