import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { AppError, sendError } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { TokenPayload } from "../types/user.types";
import { passwordConnection } from "../config/typeORM.config";
import { Users } from "../models/user.model";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.pwdToken;
    if (!token) throw new AppError('Authentication token required', StatusCodes.UNAUTHORIZED);

    const tokenKey = process.env.TOKEN_SECRET || 'Q@SpU87P17rByoN0+%43$odlu?gVO2zieRdGAq!%UDNffLExA3K';
    const decodeToken = jwt.verify(token, tokenKey) as TokenPayload;

    const userRepo = passwordConnection.getRepository(Users);
    const user = await userRepo.findOne({ where: { id: decodeToken.id } });

    if (!user) throw new AppError('Session expired or invalid', StatusCodes.UNAUTHORIZED);

    req.user = {
      id: decodeToken.id,
      email: decodeToken.email,
    } as Users;

    next(); 
  } catch (error) {
    console.log("authenticate middleware error:", (error as Error).message);
    sendError(res, StatusCodes.UNAUTHORIZED, "error during authentication");
  }
};
