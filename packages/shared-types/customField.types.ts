export type FieldType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE';

export interface CustomField {
  id: string;
  inventoryId: string;
  type: FieldType;
  title: string;
  description: string;
  showInTable: boolean;
  createdAt: string;
}

export interface CustomFieldsList {
  customFields: CustomField[]
}

export interface CustomFieldCreateRequest {
  inventoryId: string;
  type: FieldType;
  title: string;
  description: string;
  showInTable: boolean;
}

export interface CustomFieldDeleteRequest {
  id: string
}

export interface ChangeField {
  type: FieldType;
  title: string;
  description: string;
  showInTable: boolean;
}