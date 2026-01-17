import { registerSchema, loginSchema } from "shared_schemas";
import type {NextFunction, Request, Response} from "express";
import {prisma} from "@db/prisma.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { authConfig } from "@config/auth.config.js";
import {appConfig} from "@config/app.config.js"
import { generateAccessToken } from "@utils/jwtToken.js";
import { comparePassword, hashPassword } from "@utils/password.utils.js";
import { asyncHanlder } from '../utils/asyncHandler.js';
import { AppError } from "@utils/AppError.js";



export class AuthController {
    static login = asyncHanlder(async (req: Request, res: Response) => {
        const validation = loginSchema.safeParse(req.body);
        if(!validation.success){
            throw new AppError("Zod Validation Failed", 400, validation.error.flatten().fieldErrors)
        }

        const {email, password} = validation.data;
        //find user & select only necessary field
        const user = await prisma.user.findUnique({
            where: {email},
            select: {
                id: true,
                email: true,
                phoneNumber: true,
                passwordHash: true,
                name: true,
                tokenVersion: true
            }
        });
        if (!user) {
            throw new AppError("Invalid credentials", 401);
        } 

        //compare the given password with the hashed password
        const isPasswordValid= await comparePassword(password, user.passwordHash)
        if(!isPasswordValid){
            throw new AppError("Invalid credentials", 401);
        }

        //Generate tokens 
        await generateAccessToken({ 
            userId: user.id,
            tokenVersion: user.tokenVersion
        });
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
        });
    });

    static register = asyncHanlder(async (req: Request, res: Response) => {
        //Validate Input using Zod
        let  validation= registerSchema.safeParse(req.body);
        if (!validation.success) {
            throw new AppError("Zod Validation Failed", 400, validation.error.flatten().fieldErrors);
        }
        const {name, email, password, phoneNumber} = validation.data;
        
            //check if the user already exist in db thru email 
            const existingUser = await prisma.user.findFirst({ 
                where: { OR: [{ email }, { phoneNumber }] } 
            });
            // user exists -> LOGIN FLOW
            if(existingUser){
                throw new AppError("Account already exists. Please login instead.", 409);
            }

            // user not found -> SIGNUP FLOW
            const hashedPassword = await hashPassword(password);

        //Create a new user & default balance
        const newUser = await prisma.user.create({
            data: {
                email, 
                phoneNumber,
                name,
                passwordHash: hashedPassword, // Store hashed password
                createdAt: new Date(),
                tokenVersion: 0,
                balances: {
                    create: {
                        amount: 0,
                        locked: 0
                    }
                }
            }
        });
        
        //Generate tokens for auto-login
        await generateAccessToken({userId: newUser.id, tokenVersion: newUser.tokenVersion});

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                name: newUser.name
            }
        });
        
    });

    static logout = async (req: Request, res: Response) => {
    //    const userId = (req as any).user?.userId;  //nai samjha
        try{
            const userId = (req as any).userId;

            if(userId){
                await prisma.user.update({where : {id: userId}, data: {refreshToken: null}})
            }

            res.clearCookie("accessToken")
            res.clearCookie("refreshToken")

            return res.json({
                message: "logout successfully"
            })
        }catch(error){
             console.error("Logout failed:", error);
        }
    }
    
    //acess token expires fast and refresh token last long -> from this function we will allow or not allow user to get new access token
    static refreshToken = async (req: Request, res: Response) => {
        try {

            //browser automatically sends cookies
            const refreshToken = req.cookies.refreshToken;
            if(!refreshToken){
                return res.status(401).json({
                    message: "No refresh token provided"
                })
            }
            //verfiying refresh token
            let decoded: any;
            try{
                decoded = jwt.verify(refreshToken, authConfig.refreshSecret)
            } catch(error){
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }

            const userId = decoded.userId;
            //checking if the user exist and refersh token matches
            const user = await prisma.user.findUnique({
                where: { id: userId}
            });
            if(!user || user.refreshToken != refreshToken){
                //token mistmatch
                res.clearCookie("refreshToken");
                res.clearCookie("accessToken");
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            //generate new Access Token
            const newAccessToken = jwt.sign(
                { userId },
                authConfig.secret,
                { expiresIn: authConfig.expiresIn as any }
            );

            //setting new access token cookie
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: appConfig.nodeEnv === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });

            return res.status(200).json({ message: "Token refreshed" });
        
        } catch(error){
            console.error("Refresh error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    
}