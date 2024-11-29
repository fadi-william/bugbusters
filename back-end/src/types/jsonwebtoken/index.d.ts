// src/types/jsonwebtoken.d.ts
import 'jsonwebtoken';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: number;
    email: string;
  }
}