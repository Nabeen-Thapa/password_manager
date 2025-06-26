import { DataSource } from "typeorm";
import { Users } from "../models/user.model";
import { Passwords } from "../models/password.models";
import dotenv from "dotenv";
dotenv.config();
export const passwordConnection = new DataSource({
    type:"postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Nt@post",
    database: process.env.DATABASE || "PasswordManager",
    synchronize: true,
    logging: false,
    entities: [Users, Passwords]
});

passwordConnection.initialize()
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch((error) => {
        console.log("Error during Data Source initialization:", error.message);
    })