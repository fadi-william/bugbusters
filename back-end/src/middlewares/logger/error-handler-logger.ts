import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger';
import { NODE_ENV_PRODUCTION } from '../../utils/env';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  
  logger.error('Error occurred', {
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code,
    },
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
    },
  });

  res.status(statusCode).json({
    status: 'error',
    message: NODE_ENV_PRODUCTION
      ? 'An error occurred' 
      : err.message,
  });
};
