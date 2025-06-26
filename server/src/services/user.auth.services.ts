import { StatusCodes } from "http-status-codes";
import { passwordConnection } from "../config/typeORM.config";
import { userRegisterDto } from "../dtos/userRegister.dto";
import { Users } from "../models/user.model";
import { AppError } from "../utils/response.utils";
import { hash } from "bcrypt";

export class userServices{
    protected userRepo = passwordConnection.getRepository(Users);
    async userRegsiter(registerData: userRegisterDto){
        try {
            const userExist = await this.userRepo.findOne({where:{email: registerData.email}});
            if(userExist) throw new AppError("user with this email is already registerd", StatusCodes.NOT_ACCEPTABLE);

            const hashedPassword = await hash(registerData.password, 10);

            const newUser = this.userRepo.create({
                ...registerData,
                password: hashedPassword
            })
            await this.userRepo.save(newUser);
        } catch (error) {
            console.log("user register service error:", (error as Error).message)
            throw  (error as Error).message;
        }
    }

    async userLogin(){
        try {
            
        } catch (error) {
            
        }
    }
}