import { sequelize } from "../config/sequelize.ts";
import { Sequelize } from "sequelize";
import User from "./user.model.ts";
import Post from "./post.model.ts";
import Comment from "./comment.model.ts";
import { IDb } from "../../types/models";


enum DbModelNames {
  User = "User",
  Post = "Post",
  Comment = "Comment",
}

const db: IDb = {} as IDb;

db.User = User;
db.Post = Post;
db.Comment = Comment;

(Object.keys(db) as Array<keyof typeof DbModelNames>).forEach((modelName) => {
  const model = db[modelName as DbModelNames];
  if (model?.associate) {
    model.associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
