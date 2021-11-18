import {Express} from 'express';
import { AppRequest } from './AppRequest';

export interface App extends Express {
  request: AppRequest
}