import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./settings.ts";
import { Payload } from "../types/module";

export const generateToken = (user: Payload): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  //just pass id
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "24h" });
  //The ! operator tells TypeScript that you are confident JWT_SECRET is not undefined.
};
