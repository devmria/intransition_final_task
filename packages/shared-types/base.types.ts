export interface SuccessResponse { 
  message: string 
}

export interface ErrorResponse {
  error: string;
}

export interface JWTPayload {
  id: string;
}