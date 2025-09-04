import { Request } from 'express';
import { UserProfile, UserRole } from '@intransition/shared-types';

export interface AuthenticatedRequest extends Request {
  user?: UserProfile;
}

export interface InventoryMiddlewareRequest<T = any> extends AuthenticatedRequest {
  inventory?: {
    id: string;
    createdBy: string;
    isPublic: boolean;
    creator: {
      id: string;
      name: string;
      email: string;
    };
  };
  userRole?: UserRole.OWNER | UserRole.EDITOR | null;
  body: T;
}