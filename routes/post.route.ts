import express from "express";
import { authenticateJWT } from "../middlewares/authmiddleware.ts";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  getPostsByTitle,
  searchUserPostsByTitle,
} from "../controllers/post.controller.ts";

import {
  createPostValidationRules,
  updatePostValidationRules,
  deletePostValidationRules,
  getPostByIdValidationRules,
} from "../validators/post.validator.ts";

import { validate } from "../validators/validate.ts";

const router = express.Router();

router.post("/", authenticateJWT, validate(createPostValidationRules), createPost);
router.get("/", getPosts); //removed jwt authentication
router.get("/search", getPostsByTitle); //removed jwt auth
router.get("/me/search", authenticateJWT, searchUserPostsByTitle);
router.get("/me", authenticateJWT, getMyPosts);
router.get("/:post_id", validate(getPostByIdValidationRules), authenticateJWT, getPostById);
router.put("/:post_id", authenticateJWT, validate(updatePostValidationRules), updatePost);
router.delete("/:post_id", authenticateJWT, validate(deletePostValidationRules), deletePost);

export default router;
