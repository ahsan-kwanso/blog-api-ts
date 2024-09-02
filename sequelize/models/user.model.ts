import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize.ts";
import bcrypt from "bcrypt";

// Define the User attributes interface
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Define the User creation attributes, making `id` optional (auto-incremented)
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

// Define the User model class that extends Sequelize's Model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  // Timestamps (createdAt and updatedAt) will be added automatically by Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define method to associate models
  public static associate(models: any) {
    User.hasMany(models.Post, {
      foreignKey: "UserId",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Comment, {
      foreignKey: "UserId",
      onDelete: "CASCADE",
    });
  }
}

// Initialize the model
User.init(
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
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["password"] }, // Exclude password by default
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] }, // Include password when needed
      },
    },
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
