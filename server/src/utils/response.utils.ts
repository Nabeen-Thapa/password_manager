import { Response } from "express";

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

