import { CustomField } from "./customField.types";

export interface ItemData {
  id: string,
  inventoryId: string,
  createdBy: string,
  creator: {
    id: string;
    name: string;
    email: string;
  },
  fieldValues: CustomField,
  createdAt: string,
  updatedAt: string
}

export interface ItemCreateRequest {
  inventoryId: string;
  fieldValues: CustomField;
}

export interface ItemUpdateRequest {
  id: string;
  fieldValues?: CustomField;
}

export interface ItemListResponse {
  items: ItemData[];
}