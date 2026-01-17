export const authConfig = {
    secret: process.env.JWT_ACCESS_SECRET || "dsjhfakjhwieijnv_sfowriune9sohdjsoewojiekn",
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || "djafowuriennmnijioqweqoqweidjsdnjsadjskj",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRY || '24h'
} as const;