import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err.message === 'Campaign not found') {
    return res.status(404).json({ error: err.message });
  }

  if (err.message === 'No coupons left') {
    return res.status(400).json({ error: err.message });
  }

  if (err.message === 'You have already claimed a coupon for this campaign') {
    return res.status(400).json({ error: err.message });
  }

  if (err.message === 'User already exists') {
    return res.status(400).json({ error: err.message });
  }

  if (err.message === 'Invalid credentials') {
    return res.status(401).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
};
