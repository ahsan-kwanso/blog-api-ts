import {
  getPostsWithComments as getPostsWithCommentsService,
  getPostsByUserWithComments as getPostsByUserWithCommentsService,
  searchPostsByTitleOrContent as searchPostsByTitleOrContentService,
  getPostWithCommentsById as getPostWithCommentsByIdService,
} from "../services/post.comment.service.ts";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK } from "http-status-codes";

// Get posts with nested comments
const getPostsWithComments = async (req, res) => {
  try {
    const result = await getPostsWithCommentsService(req);
    if (!result.success) return res.status(BAD_REQUEST).json({ message: result.message });
    return res.status(OK).json(result.data);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Get posts by user with nested comments
const getPostsByUserWithComments = async (req, res) => {
  try {
    const result = await getPostsByUserWithCommentsService(req);
    if (!result.success) res.status(UNAUTHORIZED).json({ message: result.message });
    return res.status(OK).json(result.data);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Search posts by title or content
const searchPostsByTitleOrContent = async (req, res) => {
  try {
    const result = await searchPostsByTitleOrContentService(req);
    if (!result.success) res.status(BAD_REQUEST).json({ message: result.message });
    return res.status(OK).json(result.data);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getPostWithCommentsById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await getPostWithCommentsByIdService(id);
    if (!result.success) {
      return res.status(BAD_REQUEST).json({ message: result.message });
    }
    return res.status(OK).json(result.data);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { getPostsWithComments, getPostsByUserWithComments, searchPostsByTitleOrContent, getPostWithCommentsById };
