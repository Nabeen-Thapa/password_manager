import { IsEmail, IsString } from "class-validator";

export class userBaseDto{
    @IsString()
    @IsEmail()
    email!:string

    @IsString()
    password!:string;
}