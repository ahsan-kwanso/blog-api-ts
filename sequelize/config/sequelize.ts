import dotenv from "dotenv";
import { Sequelize, Dialect } from "sequelize";
import configFile from "./db.config.ts";
import { NODE_ENV } from "../../utils/settings.ts";
dotenv.config();

enum Environment {
  Development = "development",
  Test = "test",
  Production = "production",
}

type DevelopmentOrTestConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
};

type ProductionConfig = {
  production_db_url: string;
  dialect: Dialect;
};

type Config = {
  development: DevelopmentOrTestConfig;
  test: DevelopmentOrTestConfig;
  production: ProductionConfig;
};

const env = (NODE_ENV as keyof Config) || Environment.Development;

const configFileTyped: Config = configFile as Config;
const config = configFileTyped[env];

let sequelize: Sequelize;
if (env === Environment.Production) {
  const productionConfig = config as ProductionConfig;
  sequelize = new Sequelize(productionConfig.production_db_url, {
    dialect: productionConfig.dialect,
    protocol: productionConfig.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For Heroku, you may need to adjust SSL settings
      },
    },
  });
} else {
  const devTestConfig = config as DevelopmentOrTestConfig;
  sequelize = new Sequelize(devTestConfig.database, devTestConfig.username, devTestConfig.password, {
    host: devTestConfig.host,
    dialect: devTestConfig.dialect,
  });
}

export { sequelize };
