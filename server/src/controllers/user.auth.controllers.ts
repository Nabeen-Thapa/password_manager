import { Request, Response } from "express";
import { Controller } from "../decorator/controller.decorator";
import { Route } from "../decorator/route.decotrator";
import { userServices } from "../services/user.auth.services";
import { sendError, sendSuccess } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { validateDto } from "../utils/dtoResponces.utls";
import { userRegisterDto } from "../dtos/userRegister.dto";
import { clearCookie, setCookie } from "../utils/cookie.utils";
import { userBaseDto } from "../dtos/userBase.dto";
import { userLoginDto } from "../dtos/userLogin.dto";
import { authenticate } from "../middleware/auth.middleware";
import { getCurrentUser } from "../utils/currentUser.utils";
import { log } from "console";

@Controller('/user')
export class userControllers {
    protected userService = new userServices();
    @Route("post", "/register")
    async userRegister(req: Request, res: Response) {
        try {
            console.log("user register controller>:", req.body)
            const registerData = { ...req.body };
            const regsiterDtos = await validateDto(userRegisterDto, registerData, res);
            if (!regsiterDtos.valid) return;
            const regsiterResult = await this.userService.userRegsiter(regsiterDtos.data);
            sendSuccess(res, StatusCodes.OK, "register success")
        } catch (error) {
            console.log("user register conteroller error:", (error as Error).message);
            return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message);
        }
    }
    @Route("post", "/login")
    async userLogin(req: Request, res: Response) {
        try {

            const userData = req.body;
            console.log("user login controller:", userData);

            // if (req.user) return sendError(res, StatusCodes.BAD_REQUEST, "you are already logged in");

            const loginDto = await validateDto(userLoginDto, userData, res);
            if (!loginDto.valid) return;
            const loginResult = await this.userService.userLogin(loginDto.data);
            if (!loginResult) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authrized");
            console.log("Generated token:", loginResult);
            setCookie(res, loginResult);
            return sendSuccess(res, StatusCodes.OK, "login success", loginResult);
        } catch (error) {
            console.log("user login controller error:", (error as Error).message);
            sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message);
        }
    }

    @Route("get", "/auth/me", [authenticate])
    async correntUser(req: Request, res: Response) {
        return getCurrentUser(req, res);
    }

    @Route("get", "/auth/logout", [authenticate])
    async useLogoutController(req: Request, res: Response) {
        try {
             if (!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
            clearCookie(res);
            return sendSuccess(res, StatusCodes.OK, "successfully logout");
        } catch (error) {
            return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "problem in logout");
        }
    }
} 