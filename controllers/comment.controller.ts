import {
  createComment as createCommentService,
  getCommentsByPostId as getCommentsByPostIdService,
  updateComment as updateCommentService,
  deleteComment as deleteCommentService,
} from "../services/comment.service.ts";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK, NOT_FOUND } from "http-status-codes";
import { Request, Response } from "express";
import { ERROR_MESSAGES, CommentStatus } from "../utils/messages.ts";
import { CommentResponse } from "../types/comment";
import { Payload } from "../types/module";

const createComment = async (req: Request, res: Response): Promise<Response<CommentResponse>> => {
  const { title = "reply", content, PostId, ParentId } = req.body;
  const { id } = req.user as Payload; // Extract UserId from authenticated user
  try {
    const result: CommentResponse = await createCommentService(title, content, PostId, ParentId, id);
    return res.status(CREATED).json(result.comment);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === CommentStatus.POST_NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: error.message });
      }
      if (
        error.message === CommentStatus.CANNOT_REPLY_TO_NON_EXISTING_COMMENT ||
        error.message.startsWith(CommentStatus.COMMENT_NOT_ON_POST)
      ) {
        return res.status(BAD_REQUEST).json({ message: error.message });
      }
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

const getCommentsByPostId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { post_id } = req.params;
    const postIdNumber = parseInt(post_id as string); // Explicitly cast post_id to string
    const result = await getCommentsByPostIdService(postIdNumber);
    return res.status(OK).json(result.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(NOT_FOUND).json({ message: error.message });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

const updateComment = async (req: Request, res: Response): Promise<Response<CommentResponse>> => {
  const { comment_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user as Payload;

  try {
    const result: CommentResponse = await updateCommentService(parseInt(comment_id), title, content, id);
    return res.status(OK).json(result.comment);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === ERROR_MESSAGES.FORBIDDEN) {
        return res.status(UNAUTHORIZED).json({ message: error.message });
      }
      if (error.message === CommentStatus.COMMENT_NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: error.message });
      }
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

const deleteComment = async (req: Request, res: Response): Promise<Response<CommentResponse>> => {
  const { comment_id } = req.params;
  const { id } = req.user as Payload;

  try {
    const result: CommentResponse = await deleteCommentService(parseInt(comment_id), id);
    return res.status(OK).json({ message: result.message });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === ERROR_MESSAGES.FORBIDDEN) {
        return res.status(UNAUTHORIZED).json({ message: error.message });
      }
      if (error.message === CommentStatus.COMMENT_NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: error.message });
      }
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

export { createComment, getCommentsByPostId, updateComment, deleteComment };
