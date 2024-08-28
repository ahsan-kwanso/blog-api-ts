import { body, query, param } from "express-validator";
// Create Comment Validation Rules
const createCommentValidationRules = [
  body("PostId").isInt().withMessage("Valid PostId is required"),
  body("title").optional().trim().notEmpty().withMessage("Title is required"),
  body("content")
    .trim() // Remove leading and trailing spaces
    .notEmpty()
    .withMessage("Content is required")
    .custom((value) => value.length > 0)
    .withMessage("Content cannot be only spaces"),
];

// Update Comment Validation Rules
const updateCommentValidationRules = [
  param("comment_id").isInt().withMessage("Valid comment Id is required"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("content").optional().notEmpty().withMessage("Content cannot be empty"),
];

// Delete Comment Validation Rules
const deleteCommentValidationRules = [param("comment_id").isInt().withMessage("Valid comment ID is required")];

const getCommentByIdValidationRules = [param("comment_id").isInt().withMessage("Valid comment ID is required")];

const getCommentByPostIdValidationRules = [param("post_id").isInt().withMessage("Valid post ID is required")];

const searchByTitleOrContentValidator = [
  query("title").optional().isString().withMessage("Title must be a string"),
  query("content").optional().isString().withMessage("Content must be a string"),
];

export {
  createCommentValidationRules,
  updateCommentValidationRules,
  deleteCommentValidationRules,
  getCommentByIdValidationRules,
  getCommentByPostIdValidationRules,
  searchByTitleOrContentValidator,
};

//add separate method for body params and query params
