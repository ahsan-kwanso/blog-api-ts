import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./settings.ts"

// Define an interface for the user object
interface User {
  id: string;
  name: string;
  email: string;
}

export const generateToken = (user: User) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "3h" });
};
