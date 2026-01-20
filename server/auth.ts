import type { Request, Response, NextFunction } from 'express';
import { getAdminIdFromRequest } from './session';

export const requireAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const sessionAdminId = getAdminIdFromRequest(req);
  if (sessionAdminId) return next();

  const expected = process.env.ADMIN_API_TOKEN || '';
  if (!expected) {
    return res.status(500).json({ error: 'ADMIN_API_TOKEN is not set' });
  }
  const auth = req.header('authorization') || '';
  const match = auth.match(/^Bearer\s+(.+)$/i);
  const got = match?.[1] || '';
  if (got !== expected) return res.status(401).json({ error: 'unauthorized' });
  next();
};
