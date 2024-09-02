import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.ts";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] }, // Exclude password from default queries
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] }, // Include password in this scope if needed
      },
    },
    hooks: {
      //@ts-ignore
      beforeSave: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

//@ts-ignore
User.associate = function (models) {
  User.hasMany(models.Post, {
    foreignKey: "UserId",
    onDelete: "CASCADE",
  });

  User.hasMany(models.Comment, {
    foreignKey: "UserId",
    onDelete: "CASCADE",
  });
};

export default User;
