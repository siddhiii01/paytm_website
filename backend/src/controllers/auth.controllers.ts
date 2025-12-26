import { registerSchema, loginSchema } from "shared_schemas";
import type {NextFunction, Request, Response} from "express";
import {prisma} from "@db/prisma.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { authConfig } from "@config/auth.config.js";
import {appConfig} from "@config/app.config.js"
import { generateToken } from "@utils/jwtToken.js";


export class AuthController {
    static login = async (req: Request, res: Response) => {
        const validation = loginSchema.safeParse(req.body);
        if(!validation.success){
            return res.status(400).json({
                success: false,
                message: "validation failed",
                errors: validation.error.flatten()
            })
        }

        const {email, password} = validation.data;

        try{
            //find user from database
            const user = await prisma.user.findUnique({
                where: {email},
                select: {
                    id: true,
                    email: true,
                    phoneNumber: true,
                    password: true,
                    name: true
                }
            });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            } 

            //compare the given password with the hashed password
            const isPasswordValid: any = await bcrypt.compare(password, user.password)
            if(!isPasswordValid){
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            //Generate tokens 
            const tokens = await generateToken({ id: user.id }, res);
           
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
        } catch(error){
            console.error("Login error: ", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    static register = async (req: Request, res: Response) => {
        //Validate Input using Zod
        let  validation= registerSchema.safeParse(req.body);
        if (!validation.success) {
            console.log(validation.error.flatten());
            return res.status(400).json({
                success: false,
                message: "Zod validation failed",
                errors: validation.error.flatten()
            });
        }
        //Extract Values
        const {name, email, password, phoneNumber} = validation.data;
        try {
            //check if the user already exist in db thru email 
            const existingUser = await prisma.user.findUnique({ where: {phoneNumber} });
            // user exists -> LOGIN FLOW
            if(existingUser){
                return res.status(409).json({
                    success: false,
                    message: "User already exists with this email or phone number",    
                });
            }

            // user not found -> SIGNUP FLOW
            //hash the password before storing in database
            const hashedPassword = await bcrypt.hash(password, 10);
            //Create a new user
            const newUser = await prisma.user.create({
                data: {
                    email, 
                    phoneNumber,
                    name,
                    password: hashedPassword // Store hashed password
                }
            });
            
            //Generate tokens for auto-login
            const tokens = await generateToken(newUser, res)
            console.log("Successful : ", tokens, newUser )
            return res.status(201).json({
                success: true,
                message: "User created successfully",
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber,
                    name: newUser.name
                },
                data:tokens
            });
        }catch(error){
            console.error("Signup error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

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
    static refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {//getting the user from req -> who the user is? -> this is set by authmiddleware
            const userId = (req as any).userId;
            //getting refresh token from the from the cookies
            const refreshToken = req.cookies.refreshToken;

            //if anyone of the missing user is not authorised
            if(!userId || !refreshToken){
                return res.json({
                    message: "U are not authorised"
                })
            }

            //now since userId -> is the has the same value from databse id key -> what id if someone tries to manually set userId
            //so check whether that use is in the db
            const user = await prisma.user.findUnique({where : {id: userId}});
            if(!user || !user?.refreshToken){
                res.json({
                    message: "User doesn't exist in db or user dosen't have refreshToken"
                });
            }

            if(refreshToken !== user?.refreshToken){
                return res.json({
                    message: "Token mistmatch"
                })
            }

            //generate new access token
            const newAccessToken = jwt.sign(
                { userId },
                authConfig.secret,
                { expiresIn: authConfig.expiresIn as any}
            );

            
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: appConfig.nodeEnv === "production",
                maxAge: 15 * 60 * 1000,
                sameSite: "strict",

            })

            //return res.json({ message: "Access token refreshed" });
            next()
        } catch(error){
            return res.status(500).json({ message: "Refresh failed" });
        }
    }

    
}