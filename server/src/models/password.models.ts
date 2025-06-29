import { Column, Entity, ManyToOne } from "typeorm";
import { baseModel } from "./baseModel";
import { Users } from "./user.model";

@Entity("passwords")
export class Passwords extends baseModel{
    @Column()
    service!:string;

    @Column()
    username!:string;

    @Column()
    password!:string;

    @Column()
    userId?:string;

    @ManyToOne(()=>Users, users=>users.passowrds)
    user?:Users;
}