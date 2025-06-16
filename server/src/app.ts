import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { registerRoutes } from "./decorator/registerRoute";
import { PasswordController } from "./password.controller";

const app = express();
const port = 5555;

app.use(cors())

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


registerRoutes(app,[PasswordController]);

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
