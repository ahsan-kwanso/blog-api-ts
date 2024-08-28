import { sequelize } from "../config/sequelize.ts";
import { Sequelize } from "sequelize";
import User from "./user.model.ts";
import Post from "./post.model.ts";
import Comment from "./comment.model.ts";

interface IDb {
  User: typeof User;
  Post: typeof Post;
  Comment: typeof Comment;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}
const db: IDb = {} as IDb;

db.User = User;
db.Post = Post;
db.Comment = Comment;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
