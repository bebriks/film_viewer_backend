import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      user_type_id: number;
    };
  }
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    iat: number;
    exp: number;
  };
}