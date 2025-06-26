import { IsString } from "class-validator";
import { userBaseDto } from "./userBase.dto";

export class userRegisterDto extends userBaseDto{
    @IsString()
    masterId!:string;
}