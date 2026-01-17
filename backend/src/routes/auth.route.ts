import { Router } from "express";
import { AuthController } from "@controllers/auth.controllers.js";

const authRoutes = Router();

//Signup Route
authRoutes.post('/signup', AuthController.register);

//Login Router
authRoutes.post('/login', AuthController.login);

export default authRoutes;