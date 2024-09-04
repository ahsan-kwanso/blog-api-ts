import express, { Router } from "express";
import authRoutes from "./auth.route.ts";
import postRoutes from "./post.route.ts";
import commentRoutes from "./comment.route.ts"
import userRoute from "./user.route.ts";

const router : Router = express.Router();
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/users", userRoute);

export default router;

//versioning in routes
/*
 Versioning in routes is a practice used in API development to manage and control changes in the API over time. As APIs evolve, new features, changes in existing functionality, or even breaking changes might be introduced. To ensure that clients using the API are not disrupted by these changes, versioning allows the API to offer different versions of the same endpoint.
*/
