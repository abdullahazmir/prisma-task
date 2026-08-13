import { Response } from 'express';

interface IMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

interface IResponseData<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: IMeta;
}

export const sendResponse = <T>(res: Response, data: IResponseData<T>): void => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data !== undefined ? data.data : null,
    ...(data.meta && { meta: data.meta }),
  });
};
