import { sequelize } from "../config/sequelize.ts";
import { DataTypes } from "sequelize";

const Post = sequelize.define("Posts", {
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

//@ts-ignore
Post.associate = (models) => {
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

// import { Model, DataTypes, Optional } from "sequelize";
// import { sequelize } from "../config/sequelize.ts";
// import  User from "./user.model.ts"; // Adjust the path according to your project structure
// import  Comment  from "./comment.model.ts"; // Adjust the path according to your project structure

// // Define the Post model's attributes
// interface PostAttributes {
//   id: number;
//   title: string;
//   content: string;
//   UserId: number;
//   updatedAt?: Date;
// }

// // Optional attributes for creating a Post
// interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}

// // Extend the Model class with the Post attributes
// export class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
//   public id!: number;
//   public title!: string;
//   public content!: string;
//   public UserId!: number;

//   // Association fields
//   public readonly updatedAt!: Date;
//   public readonly User?: typeof User;
//   public readonly Comments?: Comment[];

//   // Define associations inside the model definition
//   static associate(models: any) {
//     Post.belongsTo(models.User, {
//       foreignKey: "UserId",
//       onDelete: "CASCADE",
//     });

//     Post.hasMany(models.Comment, {
//       foreignKey: "PostId",
//       onDelete: "CASCADE",
//     });
//   }
// }

// // Initialize the Post model with attributes
// Post.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     content: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     UserId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: "Users",
//         key: "id",
//       },
//     },
//   },
//   {
//     sequelize,
//     modelName: "Post",
//     tableName: "posts",
//   }
// );

// // Ensure associations are correctly set up
// Post.associate = (models) => {
//   Post.belongsTo(models.User, {
//     foreignKey: "UserId",
//     onDelete: "CASCADE",
//   });

//   Post.hasMany(models.Comment, {
//     foreignKey: "PostId",
//     onDelete: "CASCADE",
//   });
// };

// export default Post;

