import { StatusCodes } from "http-status-codes";
import { passwordConnection } from "../config/typeORM.config";
import { userRegisterDto } from "../dtos/userRegister.dto";
import { Users } from "../models/user.model";
import { AppError } from "../utils/response.utils";
import { compare, hash } from "bcrypt";
import { userBaseDto } from "../dtos/userBase.dto";
import { generateToken } from "../config/jwt.config";
import { TokenPayload } from "../types/user.types";

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

    async userLogin(userLoginData: userBaseDto){
        const { email, password} = userLoginData;
        try {
            const user = await this.userRepo.findOne({where:{email}});
            if(!user) throw new AppError("you are not registerd yet", StatusCodes.NOT_FOUND);

            const isPasswordValid = await compare(password, user?.password);
            if (!isPasswordValid) throw new AppError("invalid password", StatusCodes.UNAUTHORIZED);

            const payload:TokenPayload = {
                id: user.id,
                email: user.email
            };
            
             const jwtToken =  generateToken(payload);

             return jwtToken;
        } catch (error) {
            console.log("user login service:", (error as Error).message);
            throw (error as Error).message;
        }
    }

    
}