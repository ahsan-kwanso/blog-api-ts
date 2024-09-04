import { Optional } from "sequelize";
import { data } from "../@types/sequelize";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Interface for UserCreationAttributes, representing the attributes required to create a User
export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "name"> {}

export type UserInstance = data<UserAttributes, UserCreationAttributes>;
