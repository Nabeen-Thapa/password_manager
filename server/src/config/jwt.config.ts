import { TokenPayload } from "../types/user.types";
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { AppError } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";


const TOKEN_SECRET = process.env.TOKEN_SECRET || "Q@SpU87P17rByoN0+%43$odlu?gVO2zieRdGAq!%UDNffLExA3K";
const TOKEN_EXPIRY ='20d';

export const generateToken = (payload: TokenPayload)=>{
    return sign(payload, TOKEN_SECRET, {expiresIn:TOKEN_EXPIRY});
}

export const verifyToken=(token:string):TokenPayload=>{
    if(!token) throw new AppError("token is not found", StatusCodes.UNAUTHORIZED);
    return verify(token, TOKEN_SECRET) as TokenPayload;
}