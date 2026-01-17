import { generateAccessToken, generateRefreshToken } from "./jwtToken.js";

export const issueToken = (user: {userId: number, tokenVersion: number}) => {
    const accessToken = generateAccessToken({
        userId: user.userId,
        tokenVersion: user.tokenVersion
    });

    const refreshToken = generateRefreshToken({
        userId: user.userId,
        tokenVersion: user.tokenVersion
    });

    return {accessToken, refreshToken}
}