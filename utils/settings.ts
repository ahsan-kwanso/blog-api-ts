import dotenv from "dotenv";
dotenv.config();

// Define an interface for the settings object
interface Settings {
  DB_USERNAME_DEV: string;
  DB_PASSWORD_DEV: string;
  DB_NAME_DEV: string;
  DB_HOST_DEV: string;
  DB_DIALECT_DEV: string;

  DB_USERNAME_TEST: string;
  DB_PASSWORD_TEST: string;
  DB_NAME_TEST: string;
  DB_HOST_TEST: string;
  DB_DIALECT_TEST: string;

  DATABASE_URL: string;
  DB_DIALECT_PROD: string;
}

// Create the settings object
const settings: Settings = {
  DB_USERNAME_DEV: process.env.DB_USERNAME_DEV || "",
  DB_PASSWORD_DEV: process.env.DB_PASSWORD_DEV || "",
  DB_NAME_DEV: process.env.DB_NAME_DEV || "",
  DB_HOST_DEV: process.env.DB_HOST_DEV || "",
  DB_DIALECT_DEV: process.env.DB_DIALECT_DEV || "postgres",

  DB_USERNAME_TEST: process.env.DB_USERNAME_TEST || "",
  DB_PASSWORD_TEST: process.env.DB_PASSWORD_TEST || "",
  DB_NAME_TEST: process.env.DB_NAME_TEST || "",
  DB_HOST_TEST: process.env.DB_HOST_TEST || "",
  DB_DIALECT_TEST: process.env.DB_DIALECT_TEST || "postgres",

  DATABASE_URL: process.env.DATABASE_URL || "",
  DB_DIALECT_PROD: process.env.DB_DIALECT_PROD || "postgres",
};

export const NODE_ENV = process.env.NODE_ENV || "development";
export const JWT_SECRET = process.env.JWT_SECRET || "3768&&*((";
export const PORT = process.env.PORT || 3000;

// Export the settings object
export default settings;
