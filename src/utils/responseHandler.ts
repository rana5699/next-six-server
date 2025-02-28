import { Response } from 'express';

// Define responseHandler for global response
const responseHandler = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | null,
) => {
  res.status(statusCode).json({
    success,
    message,
    statusCode,
    data,
  });
};

export default responseHandler;
