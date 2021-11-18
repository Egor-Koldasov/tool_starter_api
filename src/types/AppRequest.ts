import { Request } from 'express';
import User from '../database/User';

export interface AppRequest extends Request { getUser: () => Promise<User | null>; }
