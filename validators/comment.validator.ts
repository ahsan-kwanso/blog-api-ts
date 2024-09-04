import { body, query, param, ValidationChain } from "express-validator";
// Create Comment Validation Rules
const createCommentValidationRules : ValidationChain[] = [
  body("PostId").isInt({ gt: 0 }).withMessage("Valid PostId is required"),
  body("title").optional().trim().notEmpty().withMessage("Title is required"),
  body("content")
    .trim() // Remove leading and trailing spaces
    .notEmpty()
    .withMessage("Content is required")
    .custom((value) => value.length > 0)
    .withMessage("Content cannot be only spaces"),
];

// Update Comment Validation Rules
const updateCommentValidationRules : ValidationChain[] = [
  param("comment_id").isInt({ gt: 0 }).withMessage("Valid comment Id is required"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("content").optional().notEmpty().withMessage("Content cannot be empty"),
];

// Delete Comment Validation Rules
const deleteCommentValidationRules : ValidationChain[] = [param("comment_id").isInt({ gt: 0 }).withMessage("Valid comment ID is required")];

const getCommentByIdValidationRules : ValidationChain[] = [param("comment_id").isInt({ gt: 0 }).withMessage("Valid comment ID is required")];

const getCommentByPostIdValidationRules : ValidationChain[] = [param("post_id").isInt({ gt: 0 }).withMessage("Valid post ID is required")];

const searchByTitleOrContentValidator : ValidationChain[] = [
  query("page").optional().isInt({ gt: 0 }).withMessage("Valid page is required"),
  query("limit").optional().isInt({ gt: 0 }).withMessage("Valid limit is required"),
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
