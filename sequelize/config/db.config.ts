import {
  DB_USERNAME_DEV,
  DB_PASSWORD_DEV,
  DB_NAME_DEV,
  DB_HOST_DEV,
  DB_DIALECT_DEV,
  DB_USERNAME_TEST,
  DB_PASSWORD_TEST,
  DB_NAME_TEST,
  DB_HOST_TEST,
  DB_DIALECT_TEST,
  DATABASE_URL,
  DB_DIALECT_PROD,
} from "../../utils/settings.ts";

const config = {
  development: {
    username: DB_USERNAME_DEV,
    password: DB_PASSWORD_DEV,
    database: DB_NAME_DEV,
    host: DB_HOST_DEV,
    dialect: DB_DIALECT_DEV,
  },
  test: {
    username: DB_USERNAME_TEST,
    password: DB_PASSWORD_TEST,
    database: DB_NAME_TEST,
    host: DB_HOST_TEST,
    dialect: DB_DIALECT_TEST,
  },
  production: {
    production_db_url: DATABASE_URL, // Heroku provides the database URL in this environment variable
    dialect: DB_DIALECT_PROD,
  },
};

export default config;