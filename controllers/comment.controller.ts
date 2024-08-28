import {
  createComment as createCommentService,
  getCommentsByPostId as getCommentsByPostIdService,
  getCommentById as getCommentByIdService,
  updateComment as updateCommentService,
  deleteComment as deleteCommentService,
  searchCommentsByTitleOrContent as searchCommentsByTitleOrContentService,
} from "../services/comment.service.ts";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK, NOT_FOUND } from "http-status-codes";

// Create a new comment
const createComment = async (req, res) => {
  const { title = "reply", content, PostId, ParentId } = req.body;
  const { id } = req.user; // Extract UserId from authenticated user

  try {
    const result = await createCommentService(title, content, PostId, ParentId, id);
    if (!result.success) {
      if (result.message === "Post not Found") return res.status(NOT_FOUND).json({ message: result.message });
      return res.status(BAD_REQUEST).json({ message: result.message });
    }
    return res.status(CREATED).json(result.comment);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Get comments by post ID
const getCommentsByPostId = async (req, res) => {
  try {
    const comments = await getCommentsByPostIdService(req);
    if (!comments.success) return res.status(NOT_FOUND).json({ message: comments.message });
    return res.status(OK).json(comments.data);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error. " });
  }
};

// Get a single comment by ID
const getCommentById = async (req, res) => {
  const { comment_id } = req.params;

  try {
    const result = await getCommentByIdService(comment_id);
    if (!result.success) res.status(NOT_FOUND).json({ message: result.message });
    return res.status(OK).json(result.comment);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};
// Update a comment
const updateComment = async (req, res) => {
  const { comment_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user;

  try {
    const result = await updateCommentService(comment_id, title, content, id);
    if (!result.success) {
      if (result.message === "ForBidden") return res.status(UNAUTHORIZED).json({ message: result.message });
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json(result.comment);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  const { id } = req.user;

  try {
    const result = await deleteCommentService(comment_id, id);
    if (!result.success) {
      if (result.message === "ForBidden") return res.status(UNAUTHORIZED).json({ message: result.message });
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json({ message: result.message });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Search comments by title or content
const searchCommentsByTitleOrContent = async (req, res) => {
  try {
    const result = await searchCommentsByTitleOrContentService(req);
    if (!result.success) return res.status(BAD_REQUEST).json({ message: result.message });
    return res.status(OK).json(result.data);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { createComment, getCommentsByPostId, getCommentById, updateComment, deleteComment, searchCommentsByTitleOrContent };
