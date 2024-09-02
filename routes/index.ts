import express from "express";
import authRoutes from "./auth.route.ts";
import postRoutes from "./post.route.ts";
import commentRoutes from "./comment.route.ts"
import userRoute from "./user.route.ts";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/users", userRoute);

export default router;
