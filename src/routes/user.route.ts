import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const routerAuth = Router();
const authController = new AuthController();

routerAuth.post("/register", authController.register);
routerAuth.post("/login", authController.login);

export default routerAuth;
