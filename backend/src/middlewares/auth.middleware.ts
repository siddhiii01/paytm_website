import { authConfig } from "@config/auth.config.js";
import type {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken";


export interface DecodedToken {
    userId: number
}

export class AuthMiddleware {
    static authenticateUser =  (req: Request, res: Response, next: NextFunction) => {
        console.log('Refresh endpoint called');
  console.log('Received refresh token:', req.cookies.refreshToken ? 'YES' : 'NO');
        //now server has sended the cookies in res.cookies in login route
        //from client to access the cookie uses req.cookies
        const token = req.cookies.accessToken; //getting token from user 
        console.log("Access token from req.cookies.accessToken: ", token)

        if(!token){
             return res.status(401).json({
                message: "User is not authorised"
            })
        }

        try{

            //first verify is the token recieved from client is right and not tampered with
            const decodedToken = jwt.verify(token, authConfig.secret) as DecodedToken;
            console.log("Decoded Token: ", decodedToken);

            //now attaching userId on req obj so server know about the user 
            (req as any).userId = decodedToken.userId;
            next();
        } catch(error){
             console.error("Authentication failed:", error);  
             // Token expired or invalid → frontend will auto-refresh
            return res.status(401).json({ message: "Unauthorized" });
             
        }
    }
}