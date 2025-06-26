import { Column, Entity, OneToMany } from "typeorm";
import { Passwords } from "./password.models";
import { baseModel } from "./baseModel";

@Entity("users_deails")
export class Users extends baseModel{
    @Column()
    email!:string;

    @Column()
    password!: string;

    @Column()
    masterId!:string;

    @OneToMany(()=> Passwords, Password => Password.users)
    passowrds!: Passwords;
}