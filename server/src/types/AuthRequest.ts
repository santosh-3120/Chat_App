// src/types/AuthRequest.ts
import { Request } from 'express';
import { IUser } from '../models/userModel';

export interface AuthRequest extends Request {
  user?: IUser; // Add optional user property
}
