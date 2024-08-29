import dotenv from "dotenv";
dotenv.config();

export const DB_USERNAME_DEV = process.env.DB_USERNAME_DEV;
export const DB_PASSWORD_DEV = process.env.DB_PASSWORD_DEV;
export const DB_NAME_DEV = process.env.DB_NAME_DEV;
export const DB_HOST_DEV = process.env.DB_HOST_DEV;
export const DB_DIALECT_DEV = process.env.DB_DIALECT_DEV || "postgres";

export const DB_USERNAME_TEST = process.env.DB_USERNAME_TEST;
export const DB_PASSWORD_TEST = process.env.DB_PASSWORD_TEST;
export const DB_NAME_TEST = process.env.DB_NAME_TEST;
export const DB_HOST_TEST = process.env.DB_HOST_TEST;
export const DB_DIALECT_TEST = process.env.DB_DIALECT_TEST || "postgres";

export const DATABASE_URL = process.env.DATABASE_URL;
export const DB_DIALECT_PROD = process.env.DB_DIALECT_PROD || "postgres";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT || 3000;
