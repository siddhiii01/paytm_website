export const authConfig = {
    secret: process.env.AUTH_JWT_SECRET || "dsjhfakjhwieijnv_sfowriune9sohdjsoewojiekn",
    expiresIn: process.env.AUTH_JWT_SECRET_EXPIRES_IN || '15m',
    refreshSecret: process.env.AUTH_JWT_REFRESH_SECRET || "djafowuriennmnijioqweqoqweidjsdnjsadjskj",
    refreshExpiresIn: process.env.AUTH_JWT_REFRESH_SECRET_EXPIRES_IN || '24h'
} as const;