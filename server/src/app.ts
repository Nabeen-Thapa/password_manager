import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./decorator/registerRoute";
import { PasswordController } from "./controllers/password.controller";
import { userControllers } from "./controllers/user.auth.controllers";
import "./types/express";

const app = express();
const port = 5555;

app.use(cors({
  origin: "http://localhost:3001", // your frontend origin
  credentials: true,              // allow cookies
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


registerRoutes(app,[PasswordController, userControllers]);

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
