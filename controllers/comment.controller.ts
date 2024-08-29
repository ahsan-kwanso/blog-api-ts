import {
  createComment as createCommentService,
  getCommentsByPostId as getCommentsByPostIdService,
  getCommentById as getCommentByIdService,
  updateComment as updateCommentService,
  deleteComment as deleteCommentService,
  searchCommentsByTitleOrContent as searchCommentsByTitleOrContentService,
} from "../services/comment.service.ts";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK, NOT_FOUND } from "http-status-codes";
import { Request, Response } from "express";

// Define interfaces for service results
interface CommentResult {
  success: boolean;
  message?: string;
  comment?: object; // Replace `object` with your actual Comment type
}


const createComment = async (req: Request, res: Response): Promise<Response> => {
  const { title = "reply", content, PostId, ParentId } = req.body;
  //@ts-ignore
  const { id } = req.user; // Extract UserId from authenticated user

  try {
    const result: CommentResult = await createCommentService(title, content, PostId, ParentId, id);
    if (!result.success) {
      if (result.message === "Post not Found") return res.status(NOT_FOUND).json({ message: result.message });
      return res.status(BAD_REQUEST).json({ message: result.message });
    }
    return res.status(CREATED).json(result.comment);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getCommentsByPostId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { post_id } = req.params;
    const result = await getCommentsByPostIdService(parseInt(post_id));
    if (!result.success) return res.status(NOT_FOUND).json({ message: result.message });
    return res.status(OK).json(result.data);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getCommentById = async (req: Request, res: Response): Promise<Response> => {
  const { comment_id } = req.params;

  try {
    const result: CommentResult = await getCommentByIdService(parseInt(comment_id));
    if (!result.success) return res.status(NOT_FOUND).json({ message: result.message });
    return res.status(OK).json(result.comment);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const updateComment = async (req: Request, res: Response): Promise<Response> => {
  const { comment_id } = req.params;
  const { title, content } = req.body;
  //@ts-ignore
  const { id } = req.user;

  try {
    const result: CommentResult = await updateCommentService(parseInt(comment_id), title, content, id);
    if (!result.success) {
      if (result.message === "ForBidden") return res.status(UNAUTHORIZED).json({ message: result.message });
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json(result.comment);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const deleteComment = async (req: Request, res: Response): Promise<Response> => {
  const { comment_id } = req.params;
  //@ts-ignore
  const { id } = req.user;

  try {
    const result: CommentResult = await deleteCommentService(parseInt(comment_id), id);
    if (!result.success) {
      if (result.message === "ForBidden") return res.status(UNAUTHORIZED).json({ message: result.message });
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json({ message: result.message });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const searchCommentsByTitleOrContent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result = await searchCommentsByTitleOrContentService(req);
    if (!result.success) return res.status(BAD_REQUEST).json({ message: result.message });
    return res.status(OK).json(result.data);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { createComment, getCommentsByPostId, getCommentById, updateComment, deleteComment, searchCommentsByTitleOrContent };
