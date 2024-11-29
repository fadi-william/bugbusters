import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../../utils/logger';
import { JWT_SECRET } from '../../utils/env';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get the token from the "Bearer <token>" format

  if (!token) {
    logger.warn('Authentication token not found');
    return res.status(401).json({ error: 'Authentication token is required' });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      logger.error('Invalid authentication token', { error: err.message });
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = { id: (payload as JwtPayload).userId }; // Assign user ID to req.user.id
    next(); // Proceed to the next middleware or route handler
  });
};
