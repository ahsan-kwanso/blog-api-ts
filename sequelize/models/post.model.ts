import { sequelize } from "../config/sequelize.ts";
import { DataTypes } from "sequelize";
import { PostInstance } from "../../types/post";
import { IDb } from "../../types/models";

const Post: PostInstance = sequelize.define<PostInstance>("Posts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
});


Post.associate = (models: IDb) => {
  Post.belongsTo(models.User, {
    foreignKey: "UserId",
    onDelete: "CASCADE",
  });

  Post.hasMany(models.Comment, {
    foreignKey: "PostId",
    onDelete: "CASCADE",
  });
};

export default Post;