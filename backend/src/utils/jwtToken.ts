import { authConfig } from '@config/auth.config.js';
import jwt, { JwtPayload } from "jsonwebtoken";

if (!authConfig.secret || !authConfig.refreshSecret) {
  throw new Error("JWT secrets are not defined");
}

//generating access token
export const generateAccessToken = (payload: {userId: number; tokenVersion: number;}) => 
    jwt.sign(payload,authConfig.secret,{ expiresIn: authConfig.expiresIn as any})


export const verifyAccessToken = (token: string):JwtPayload => {
    return jwt.verify(token,authConfig.secret) as JwtPayload;
}

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, authConfig.refreshSecret) as JwtPayload;
}

//generating refresh token
export const generateRefreshToken = (payload: {userId: number;tokenVersion: number;}) => 
    jwt.sign(payload, authConfig.refreshSecret, { expiresIn: authConfig.refreshExpiresIn as any})




