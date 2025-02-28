import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// //! Define error interface
interface IError extends Error {
  status: number;
  stack: string;
  errors: object;
}

// //! Define global error
const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = err as IError;
  const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    message: error.message || 'Something went wrong',
    success: false,
    error: error,
    stack: error.stack,
  });

  next();
};

export default globalErrorHandler;
