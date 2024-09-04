import { sequelize } from "../config/sequelize.ts";
import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import { CommentInstance } from "../../types/comment";
import Comment from "../../sequelize/models/comment.model.ts";
import User from "../../sequelize/models/user.model.ts";
import Post from "../../sequelize/models/post.model.ts";

export interface IDb {
  User: typeof User;
  Post: typeof Post;
  Comment: typeof Comment;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}
