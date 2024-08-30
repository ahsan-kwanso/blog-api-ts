import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
// Define an interface for the user object

export interface User {
    id: number;
    name: string;
    email: string;
  }
  
  // Extend Express Request interface to include the user property
 export interface CustomRequest extends Request {
    user?: User | JwtPayload;
  }