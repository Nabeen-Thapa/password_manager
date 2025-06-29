import { Request, Response } from "express";
import { Controller } from "../decorator/controller.decorator";
import { Route } from "../decorator/route.decotrator";
import { sendError, sendSuccess } from "../utils/response.utils";
import { StatusCodes } from "http-status-codes";
import { PasswordService } from "../services/password.service";
import { authenticate } from "../middleware/auth.middleware";


@Controller("/password")
export class PasswordController {
  protected passwordService = new PasswordService();

  @Route("post", "/save", [authenticate])
  async savePassword(req: Request, res: Response) {
    try {
      const passwordInfo = { ...req.body };
      console.log("contrller:", passwordInfo)
      const id = req.user?.id as string;
      const result = await this.passwordService.add(passwordInfo, id);
      //if (!result) return sendError(res, StatusCodes.BAD_REQUEST, "someting wrong");
      sendSuccess(res, StatusCodes.OK, "successfully added");
    } catch (err: any) {
      console.log("error during save new password", err.message);
      sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "internal server error during add new password")
    }
  }

  @Route("get", "/view", [authenticate])
  async viewPassowrd(req: Request, res: Response) {

    if (!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
    const { id } = req.user;
    try {
      const result = await this.passwordService.getAll(id);
      sendSuccess(res, StatusCodes.OK, "view success", result)
    } catch (error) {
      console.log("error during view new password", (error as Error).message);
      sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "internal server error during add new password")
    }
  }

  @Route("delete", "/delete/:id")
  async deletePassowrd(req: Request, res: Response) {
    const { id } = req.params;
    try {

      const result = await this.passwordService.delete(id)
      sendSuccess(res, StatusCodes.OK, "view success", result)
    } catch (error) {
      console.log("error during delete password", (error as Error).message);
      sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "internal server error during add new password")
    }
  }

  @Route("put", "/update/:id", [authenticate])
  async updatePassowrd(req: Request, res: Response) {

    if (!req.user) return sendError(res, StatusCodes.UNAUTHORIZED, "you are not authorized");
    const userId = req.user.id;
    
    const id = req.params.id as string;
    const updateData = { id, ...req.body, newService: req.body.service };
    console.log("update controller:", updateData);
    try {
      const result = await this.passwordService.update(updateData, userId);
      sendSuccess(res, StatusCodes.OK, "view success", result)
    } catch (error) {
      console.log("error during update password", (error as Error).message);
      sendError(res, StatusCodes.INTERNAL_SERVER_ERROR, "internal server error during add new password")
    }
  }
}