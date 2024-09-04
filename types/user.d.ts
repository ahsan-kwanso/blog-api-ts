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

export interface AuthResult {
  success: boolean;
  message?: string;
  token?: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest extends SignInRequest {
  name: string;
}

// Define interfaces for service results
export interface UserResult {
  success: boolean;
  message?: string;
  user?: UserAttributes;
}

export interface UsersResult {
  success: boolean;
  users?: UserAttributes[];
}
