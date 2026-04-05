import { Request, Response, NextFunction } from 'express';
import * as boom from '@hapi/boom';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Si ya es un error de Boom
  if (boom.isBoom(error)) {
    return res.status(error.output.statusCode).json(error.output.payload);
  }

  // Si es error de Supabase
  if (error.code || error.message) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      statusCode,
      message: error.message || 'Error del servidor',
      error: error.code || 'INTERNAL_SERVER_ERROR',
    });
  }

  // Error genérico
  console.error('Unhandled error:', error);
  return res.status(500).json({
    statusCode: 500,
    message: 'Error interno del servidor',
    error: 'INTERNAL_SERVER_ERROR',
  });
};
