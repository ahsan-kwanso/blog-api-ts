import express from "express";
import { authenticateJWT } from "../middlewares/authmiddleware.ts";
import {
  getPostsWithComments,
  getPostsByUserWithComments,
  searchPostsByTitleOrContent,
  getPostWithCommentsById,
} from "../controllers/post.comment.controller.ts";
import { getPostsByUserWithCommentsValidator, searchByTitleOrContentValidator } from "../validators/post.validator.ts";
import { validate } from "../validators/validate.ts";

const router = express.Router();

// Route to get all posts with nested comments
router.get("/", authenticateJWT, getPostsWithComments);

// Route to get posts by user with nested comments
router.get("/comments/user/:user_id", authenticateJWT, validate(getPostsByUserWithCommentsValidator), getPostsByUserWithComments);
router.get("/comments/search", authenticateJWT, validate(searchByTitleOrContentValidator), searchPostsByTitleOrContent);
router.get("/:id/comments", authenticateJWT, getPostWithCommentsById);

export default router;
