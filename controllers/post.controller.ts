import { Request, Response } from "express";
import {
  createPost as createPostService,
  getPosts as getPostsService,
  getPostById as getPostByIdService,
  updatePost as updatePostService,
  deletePost as deletePostService,
  searchPostsByTitle as searchPostsByTitleService,
  getMyPosts as getMyPostsService,
  searchUserPostsByTitle as searchUserPostsByTitleService,
} from "../services/post.service.ts";
import { CREATED, INTERNAL_SERVER_ERROR, OK, NOT_FOUND, FORBIDDEN } from "http-status-codes";
import { ERROR_MESSAGES } from "../utils/messages.ts";
import { PostResult, PostsResult, Post as PostModel } from "../types/post";

// Create a new post
const createPost = async (req: Request, res: Response): Promise<Response<PostModel>> => {
  const { title, content } = req.body;
  const { id } = req.user as { id: number }; // Assuming `req.user` has an `id` field

  try {
    const post : PostModel = await createPostService(title, content, id);
    return res.status(CREATED).json({ post });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

// Get all posts with optional filtering
const getPosts = async (req: Request, res: Response): Promise<Response<PostsResult>> => {
  try {
    const { filter } = req.query;
    let data: PostsResult;

    if (filter === "my-posts" && req.query.userId) {
      // If filter is "my-posts", call getMyPosts2 service
      data = await getMyPostsService(req);
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
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

// Get a single post by ID
const getPostById = async (req: Request, res: Response): Promise<Response<PostResult>> => {
  const { post_id } = req.params;

  try {
    const result: PostResult = await getPostByIdService(parseInt(post_id));
    if (!result.success) return res.status(NOT_FOUND).json({ message: result.message });
    return res.status(OK).json(result.post);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

// Update a post by ID
const updatePost = async (req: Request, res: Response): Promise<Response<PostResult>> => {
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
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

// Delete a post by ID
const deletePost = async (req: Request, res: Response): Promise<Response<PostResult>> => {
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
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

// Search posts by title with optional filtering
const getPostsByTitle = async (req: Request, res: Response): Promise<Response<PostsResult>> => {
  try {
    const { filter } = req.query; // make enum
    let data: PostsResult;

    if (filter === "my-posts" && req.query.userId) {
      data = await searchUserPostsByTitleService(req);
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
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};


export { createPost, getPosts, getPostById, updatePost, deletePost, getPostsByTitle };
