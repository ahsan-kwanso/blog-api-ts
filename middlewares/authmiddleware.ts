import jwt, { JwtPayload } from "jsonwebtoken";
import { UNAUTHORIZED, FORBIDDEN } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../utils/settings.ts";
import { User } from "../types/CustomRequest.ts";
import { CustomRequest } from "../types/CustomRequest.ts";


export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  
  if (!token) {
    return res.status(UNAUTHORIZED).json({
      message: "Access Denied! You are not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as User; // Explicitly type the decoded token
    req.user = decoded; // Assign the decoded token to req.user
    next();
  } catch (ex) {
    return res.status(FORBIDDEN).json({
      message: "Token is not valid",
    });
  }
};
