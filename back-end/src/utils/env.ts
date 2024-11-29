export const NODE_ENV_PRODUCTION = process.env.NODE_ENV === "production";
export const JWT_SECRET = process.env.JWT_SECRET || "abc-123-abc";
export const APP_LOG_LEVEL = process.env.LOG_LEVEL || "debug";
export const APP_PORT = process.env.PORT || 3000;
