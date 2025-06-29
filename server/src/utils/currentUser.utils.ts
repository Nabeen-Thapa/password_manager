import { Request, Response } from "express"
import { AppError, sendError, sendSuccess } from "./response.utils";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../config/jwt.config";

export function getCurrentUser(req: Request, res: Response) {
    try {
        const token = req.cookies?.pwdToken;
        if (!token) throw new AppError("token not found", StatusCodes.NOT_FOUND);
        const payload = verifyToken(token);
        if (!payload) return sendError(res, StatusCodes.NOT_FOUND, "token not found");

        return sendSuccess(res, 200, "User authenticated", {
            id: payload.id,
            email: payload.email
        });
    } catch (error) {
        return sendError(res, 401, error.message);
    }
}