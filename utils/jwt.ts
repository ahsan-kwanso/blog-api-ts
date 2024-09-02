import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./settings.ts"
import { User } from "../types/CustomRequest.ts";

export const generateToken = (user: User) : string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "3h" });
  //The ! operator tells TypeScript that you are confident JWT_SECRET is not undefined.
};
