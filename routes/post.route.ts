import express, { Router } from "express";
import { authenticateJWT } from "../middlewares/authmiddleware.ts";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByTitle,
} from "../controllers/post.controller.ts";

import {
  createPostValidationRules,
  updatePostValidationRules,
  deletePostValidationRules,
  getPostByIdValidationRules,
} from "../validators/post.validator.ts";

import { validate } from "../validators/validate.ts";

const router : Router = express.Router();

router.post("/", authenticateJWT, validate(createPostValidationRules), createPost);
router.get("/", getPosts); //removed jwt authentication
router.get("/search", getPostsByTitle); //removed jwt auth add validation
router.get("/:post_id", authenticateJWT, validate(getPostByIdValidationRules), getPostById);
router.put("/:post_id", authenticateJWT, validate(updatePostValidationRules), updatePost);
router.delete("/:post_id", authenticateJWT, validate(deletePostValidationRules), deletePost);

export default router;
