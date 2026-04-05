import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import * as boom from '@hapi/boom';
import { AuthenticatedUser } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw boom.unauthorized('Token no proporcionado');
    }

    const token = authHeader.slice(7);
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw boom.unauthorized('Token inválido o expirado');
    }

    const user = data.user;
    const metadata = (user.user_metadata || {}) as any;

    req.user = {
      id: user.id,
      email: user.email || '',
      role: metadata.role || 'consumer',
      metadata,
    };

    next();
  } catch (error) {
    if (boom.isBoom(error)) {
      return res.status(error.output.statusCode).json(error.output.payload);
    }
    return res.status(401).json({ statusCode: 401, message: 'No autorizado' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const err = boom.unauthorized('Usuario no autenticado');
      return res.status(err.output.statusCode).json(err.output.payload);
    }

    if (!roles.includes(req.user.role)) {
      const err = boom.forbidden('Rol no autorizado');
      return res.status(err.output.statusCode).json(err.output.payload);
    }

    next();
  };
};
