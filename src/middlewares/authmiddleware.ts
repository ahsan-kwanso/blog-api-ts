import jwt from "jsonwebtoken";
import { UNAUTHORIZED, FORBIDDEN } from "http-status-codes";
export const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(UNAUTHORIZED).json({
      message: "Access Denied! You are not authenticated",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(FORBIDDEN).json({
      message: "Token is not valid",
    });
  }
};
