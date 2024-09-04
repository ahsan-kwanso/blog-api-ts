import settings from "../../utils/settings.ts";

const config = {
  development: {
    username: settings.DB_USERNAME_DEV,
    password: settings.DB_PASSWORD_DEV,
    database: settings.DB_NAME_DEV,
    host: settings.DB_HOST_DEV,
    dialect: settings.DB_DIALECT_DEV,
  },
  test: {
    username: settings.DB_USERNAME_TEST,
    password: settings.DB_PASSWORD_TEST,
    database: settings.DB_NAME_TEST,
    host: settings.DB_HOST_TEST,
    dialect: settings.DB_DIALECT_TEST,
  },
  production: {
    production_db_url: settings.DATABASE_URL, // Heroku provides the database URL in this environment variable
    dialect: settings.DB_DIALECT_PROD,
  },
};

export default config;