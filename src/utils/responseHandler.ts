import { Response } from 'express';


interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Define responseHandler for global response
const responseHandler = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  meta:IMeta | null,
  data: T | null,
) => {
  res.status(statusCode).json({
    success,
    message,
    meta,
    data,
  });
};

export default responseHandler;
