import {
  getPostsWithComments as getPostsWithCommentsService,
  getPostsByUserWithComments as getPostsByUserWithCommentsService,
  searchPostsByTitleOrContent as searchPostsByTitleOrContentService,
  getPostWithCommentsById as getPostWithCommentsByIdService,
} from "../services/post.comment.service.ts";
import { Request, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK } from "http-status-codes";

// Define TypeScript interfaces for service results
interface PostData {
  id: number;        // Assuming id is an integer
  title: string;     // Title of the post
  content: string;   // Content of the post
  UserId: number;
}

interface PostsWithCommentsResult {
  success: boolean;
  message?: string;
  data?: {
    posts: PostData[];
  };
}

interface PostWithCommentsByIdResult {
  success: boolean;
  message?: string;
  data?: PostData;
}

interface SearchPostsResult {
  success: boolean;
  message?: string;
  data?: {
    posts: PostData[];
  };
}

// Get posts with nested comments
const getPostsWithComments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result: PostsWithCommentsResult = await getPostsWithCommentsService(req);
    if (!result.success) return res.status(BAD_REQUEST).json({ message: result.message });
    return res.status(OK).json(result.data || { posts: [] });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Get posts by user with nested comments
const getPostsByUserWithComments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result: PostsWithCommentsResult = await getPostsByUserWithCommentsService(req);
    if (!result.success) return res.status(UNAUTHORIZED).json({ message: result.message });
    return res.status(OK).json(result.data || { posts: [] });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Search posts by title or content
const searchPostsByTitleOrContent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result: SearchPostsResult = await searchPostsByTitleOrContentService(req);
    if (!result.success) return res.status(BAD_REQUEST).json({ message: result.message });
    return res.status(OK).json(result.data || { posts: [] });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Get post with nested comments by ID
const getPostWithCommentsById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const result: PostWithCommentsByIdResult = await getPostWithCommentsByIdService(parseInt(id));
    if (!result.success) return res.status(BAD_REQUEST).json({ message: result.message });
    return res.status(OK).json(result.data || {});
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { getPostsWithComments, getPostsByUserWithComments, searchPostsByTitleOrContent, getPostWithCommentsById };
