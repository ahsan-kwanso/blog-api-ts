import { Optional } from "sequelize";

export interface PostAttributes {
  id: number;
  title: string;
  content: string;
  UserId: number;
}

export interface PostCreationAttributes
  extends Optional<PostAttributes, "id" | "UserId"> {}

export type PostInstance = data<PostAttributes, PostCreationAttributes>;