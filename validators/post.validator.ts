import { body, query, param, ValidationChain } from "express-validator";
// Create Post Validation Rules
const createPostValidationRules : ValidationChain[] = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
];

// Update Post Validation Rules
const updatePostValidationRules : ValidationChain[] = [
  param("post_id").isInt().withMessage("Valid PostId is required"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("content").optional().notEmpty().withMessage("Content cannot be empty"),
];

// Delete Post Validation Rules , +ve int check
const deletePostValidationRules : ValidationChain[] = [param("post_id").isInt({ gt: 0 }).withMessage("Valid post ID is required")];

const getPostByIdValidationRules : ValidationChain[] = [param("post_id").isInt({ gt: 0 }).withMessage("Valid post ID is required")];

const getPostsByUserWithCommentsValidator : ValidationChain[] = [param("user_id").isInt({ gt: 0 }).withMessage("Valid user ID is required")];

const searchByTitleValidationRules : ValidationChain[] = [
  query("page").optional().isInt({ gt: 0 }).withMessage("Valid page is required"),
  query("limit").optional().isInt({ gt: 0 }).withMessage("Valid limit is required"),
  query("title").optional().isString().withMessage("Title must be a string"),
  query("content").optional().isString().withMessage("Content must be a string"),
];

export {
  createPostValidationRules,
  updatePostValidationRules,
  deletePostValidationRules,
  getPostByIdValidationRules,
  searchByTitleValidationRules,
  getPostsByUserWithCommentsValidator,
};
