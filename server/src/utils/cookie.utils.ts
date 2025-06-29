import { Response } from "express";
import { AUTH_COOKIE_OPTIONS, AUTH_COOKIE_OPTIONS_CLEAR } from "../constants/cookie.constant";

export function setCookie(res:Response, token:string):void{
    res.cookie("pwdToken", token,  AUTH_COOKIE_OPTIONS)
}

export function clearCookie(res:Response):void{
    res.clearCookie("pwdToken", {...AUTH_COOKIE_OPTIONS_CLEAR});
}