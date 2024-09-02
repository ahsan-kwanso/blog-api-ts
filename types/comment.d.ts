import { Optional } from "sequelize";

export interface CommentAttributes {
  id: number;
  title: string;
  content: string;
  UserId: number;
  PostId: number;
  ParentId?: number | null;
}

export interface CommentCreationAttributes
  extends Optional<CommentAttributes, "id" | "ParentId"> {}

export type CommentInstance = data<
  CommentAttributes,
  CommentCreationAttributes
>;