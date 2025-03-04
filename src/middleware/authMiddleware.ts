/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../config/config';
import { TUserRole } from '../modules/users/userInterface';
import AppError from './AppError';

const auth = (...userRoles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) {
        return next(
          new AppError(StatusCodes.UNAUTHORIZED, 'You are UNAUTHORIZED'),
        );
      }

      // Verify token
      jwt.verify(token, `${config.jwtAccessToken}`, (err, decoded) => {
        if (err) {
          return next(
            new AppError(StatusCodes.UNAUTHORIZED, 'You are UNAUTHORIZED'),
          );
        }

        const {userId, role } = decoded as JwtPayload;

        // Check user role
        if (userRoles.length && !userRoles.includes(role as TUserRole)) {
          return next(
            new AppError(StatusCodes.UNAUTHORIZED, 'You are UNAUTHORIZED'),
          );
        }
        // Attach the decoded token to the request object
        req.user = { userId, role } as JwtPayload;

        next();
      });
    } catch (error: any) {
      next(
        new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          `${error.message || 'Something went wrong'}`,
        ),
      );
    }
  };
};

export default auth;
