import jwt, { JwtPayload } from "jsonwebtoken";
import { UNAUTHORIZED, FORBIDDEN } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../utils/settings.ts";
import { TokenValidation } from "../utils/messages.ts";
import { Payload } from "../types/module";


export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  
  if (!token) {
    return res.status(UNAUTHORIZED).json({
      message: TokenValidation.ACCESS_DENIED,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Payload; // Explicitly type the decoded token
    req.user = decoded; // Assign the decoded token to req.user
    next();
  } catch (ex) {
    return res.status(FORBIDDEN).json({
      message: TokenValidation.INVALID_TOKEN,
    });
  }
};
