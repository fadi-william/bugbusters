import { Request, Response, NextFunction } from 'express';
import logger from '../../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Get the start time of the request
  const start = Date.now();

  // Log when the request completes
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
};
