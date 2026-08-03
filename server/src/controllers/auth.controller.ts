import { Request, Response } from 'express';
import authService from '../services/auth.service';

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.register({ email, password });
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await authService.login({ email, password });
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
