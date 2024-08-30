import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import configFile from "./db.config.ts";
import { NODE_ENV } from "../../utils/settings.ts";
dotenv.config();

const env = NODE_ENV || "development";
//@ts-ignore
const config = configFile[env];

let sequelize : any;
if (env === "production") {
  sequelize = new Sequelize(config.production_db_url, {
    dialect: config.dialect,
    protocol: config.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For Heroku, you may need to adjust SSL settings
      },
    },
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
  });
}
export { sequelize };