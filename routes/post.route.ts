import express, { Router } from "express";
import { authenticateJWT } from "../middlewares/authmiddleware.ts";
import { createPost, getPosts, getPostById, updatePost, deletePost, getPostsByTitle } from "../controllers/post.controller.ts";

import {
  createPostValidationRules,
  updatePostValidationRules,
  deletePostValidationRules,
  getPostByIdValidationRules,
  searchByTitleValidationRules,
  searchByTitleValidationRules as getPostsValidationRules,
} from "../validators/post.validator.ts";

import { validate } from "../validators/validate.ts";

const router: Router = express.Router();

const conditionalAuthenticateJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.query.filter === "my-posts") {
    // If the filter is 'my-posts', apply JWT authentication
    return authenticateJWT(req, res, next);
  }
  // Otherwise, skip authentication
  next();
};

router.post("/", authenticateJWT, validate(createPostValidationRules), createPost);
router.get("/", conditionalAuthenticateJWT, validate(getPostsValidationRules), getPosts); //removed jwt authentication
router.get("/search", conditionalAuthenticateJWT, validate(searchByTitleValidationRules), getPostsByTitle); //removed jwt auth add validation
router.get("/:post_id", authenticateJWT, validate(getPostByIdValidationRules), getPostById);
router.put("/:post_id", authenticateJWT, validate(updatePostValidationRules), updatePost);
router.delete("/:post_id", authenticateJWT, validate(deletePostValidationRules), deletePost);

export default router;
