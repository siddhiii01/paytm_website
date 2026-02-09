import type { CookieOptions } from "express";

const isProd = process.env.NODE_ENV === 'production';

export const accessCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, //15min
    path: '/'
}

export const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 1 * 24 * 60 * 60* 1000, //1 day
    path: '/api/auth/refresh' // only sent here
};
