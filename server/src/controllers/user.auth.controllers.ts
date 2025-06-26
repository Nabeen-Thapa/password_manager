import { Request, Response } from "express";
import { Controller } from "../decorator/controller.decorator";
import { Route } from "../decorator/route.decotrator";
import { userServices } from "../services/user.auth.services";
import { sendError, sendSuccess } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { validateDto } from "../utils/dtoResponces.utls";
import { userRegisterDto } from "../dtos/userRegister.dto";

@Controller('/user')
export class userControllers{
protected userService = new userServices();
    @Route("post", "/register")
    async userRegister(req:Request, res:Response){
        try {
            console.log("user register controller>:", req.body)
            const registerData = {...req.body};
            const regsiterDtos = await validateDto(userRegisterDto, registerData, res);
            if(!regsiterDtos.valid) return;
            const regsiterResult = await this.userService.userRegsiter(regsiterDtos.data);
            sendSuccess(res, StatusCodes.OK, "register success")
        } catch (error) {
            console.log("user register conteroller error:", (error as Error).message);
            return sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, (error as Error).message);
        }
    }

     async userLogin(userData:string){
        try {
            
        } catch (error) {
            
        }
    }
} 