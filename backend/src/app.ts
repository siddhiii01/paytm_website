import express from "express";
import type {Request, Response, NextFunction} from "express";
import {prisma, connectDB} from "./db/prisma.js"
import { appConfig } from "@config/app.config.js";
import { AuthController } from "@controllers/auth.controllers.js";
import { AuthMiddleware } from "@middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

//every incoming requesting that browser is sending is goes through this middleware before acutally hitting our route
//This looks at header: Content-Type: application/json
app.use(express.json()); 

//Logging Middleware
// app.use((req: Request,res:Response, next: NextFunction) => {
//     console.log("Incoming req: ");
//     console.log(`req.headers: ${JSON.stringify(req.headers)}`)
//     console.log(`req.body: ${JSON.stringify(req.body)}`);
//     console.log(`req.url: ${req.originalUrl}`);
//     next();
// });


async function testConnection(){
  const isConnected = await connectDB();
  if(!isConnected){
    console.error("Failed to connected to db");
    process.exit(1) //stop the whole server is db is not connected
  }
}
testConnection();

//signup route
app.post('/signup', AuthController.register);

//login route
app.post('/login',AuthController.login);

//refresh token
app.post('/refreshToken', AuthMiddleware.authenticateUser, AuthController.refreshToken, (req,res) => {
  res.json({message:'refresh token page '})
});

//logout page
app.get('/logout',AuthMiddleware.authenticateUser, AuthController.logout, (req, res) => {
  console.log((req as any).user?.userId)
});

app.get("/auth", AuthMiddleware.authenticateUser, (req, res) => {
  console.log("req.userId", (req as any).userId)
});

app.listen(appConfig.port, ()=>{
  console.log("Server is running")
});


