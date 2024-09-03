import { sequelize } from "../config/sequelize.ts";
import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import { CommentInstance } from "../../types/comment";
import User from "./user.model.ts";
import Post from "./post.model.ts";

export interface IDb {
  User: typeof User;
  Post: typeof Post;
  Comment: typeof Comment;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}