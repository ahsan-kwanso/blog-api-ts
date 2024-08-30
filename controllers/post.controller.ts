import { Request, Response } from "express";
import {
  createPost as createPostService,
  getPosts as getPostsService,
  getMyPosts as getMyPostsService,
  getPostById as getPostByIdService,
  updatePost as updatePostService,
  deletePost as deletePostService,
  searchPostsByTitle as searchPostsByTitleService,
  searchUserPostsByTitle as searchUserPostsByTitleService,
  getMyPosts2 as getMyPosts2Service,
  searchUserPostsByTitle2 as searchUserPostsByTitle2Service,
} from "../services/post.service.ts";
import { CREATED, INTERNAL_SERVER_ERROR, OK, NOT_FOUND, FORBIDDEN } from "http-status-codes";
import { CustomRequest } from "../types/CustomRequest.ts";

// Define interfaces for service results
interface PostResult {
  success: boolean;
  message?: string;
  post?: object; // Replace `object` with your actual Post type
}

interface PostsResult {
  success?: boolean; // Made optional
  message?: string; // Made optional
  total?: number;
  page?: number;
  pageSize?: number;
  nextPage?: string | null;
  posts?: object[]; // Replace `object` with your actual Post type
}

// Create a new post
const createPost = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { title, content } = req.body;
  const { id } = req.user as { id: number }; // Assuming `req.user` has an `id` field

  try {
    const post = await createPostService(title, content, id);
    return res.status(CREATED).json({ post });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Get all posts with optional filtering
const getPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filter } = req.query;
    let data: PostsResult;

    if (filter === "my-posts" && req.query.userId) {
      // If filter is "my-posts", call getMyPosts2 service
      data = await getMyPosts2Service(req);
    } else {
      // Otherwise, call the regular getPostsService
      data = await getPostsService(req);
    }

    return res.status(OK).json({
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      nextPage: data.nextPage,
      posts: data.posts,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Get posts of the current user
const getMyPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data: PostsResult = await getMyPostsService(req);
    return res.status(OK).json({
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      nextPage: data.nextPage,
      posts: data.posts,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Get a single post by ID
const getPostById = async (req: Request, res: Response): Promise<Response> => {
  const { post_id } = req.params;

  try {
    const result: PostResult = await getPostByIdService(parseInt(post_id));
    if (!result.success) return res.status(NOT_FOUND).json({ message: result.message });
    return res.status(OK).json(result.post);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Update a post by ID
const updatePost = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { post_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user as { id: number };

  try {
    const result: PostResult = await updatePostService(parseInt(post_id), title, content, id);
    if (!result.success) {
      if (result.message === "Forbidden") return res.status(FORBIDDEN).json({ message: result.message });
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json(result.post);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Delete a post by ID
const deletePost = async (req: CustomRequest, res: Response): Promise<Response> => {
  const { post_id } = req.params;
  const { id } = req.user as { id: number };

  try {
    const result: PostResult = await deletePostService(parseInt(post_id), id);
    if (!result.success) {
      if (result.message === "Forbidden") return res.status(FORBIDDEN).json({ message: result.message });
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json({ message: result.message });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Search posts by title with optional filtering
const getPostsByTitle = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { filter } = req.query;
    let data: PostsResult;

    if (filter === "my-posts" && req.query.userId) {
      data = await searchUserPostsByTitle2Service(req);
    } else {
      data = await searchPostsByTitleService(req);
    }

    return res.status(OK).json({
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      nextPage: data.nextPage,
      posts: data.posts,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Search posts by title for the current user
const searchUserPostsByTitle = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data: PostsResult = await searchUserPostsByTitleService(req);
    return res.status(OK).json({
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      nextPage: data.nextPage,
      posts: data.posts,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { createPost, getPosts, getPostById, updatePost, deletePost, getMyPosts, getPostsByTitle, searchUserPostsByTitle };
