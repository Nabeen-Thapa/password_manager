import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export const sendSuccess = (res: Response, StatusCodes: number, message: string, data?: unknown) => {
    return res.status(StatusCodes).json({
        success: true,
        message,
        data
    })
}

export const sendError = (res: Response, StatusCode: number, error: any) => {
    return res.status(StatusCode).json({
        success: false,
        message: error?.message || "Something went wrong",
    })
}


export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
  }
}

