import { Sequelize } from "sequelize";
import Post from "../sequelize/models/post.model.ts";
import { Op } from 'sequelize';
import { Request } from "express";
import { getCommentsByPostIdData as getCommentsByPostIdDataService } from "./comment.service.ts";
import { validatePagination, generateNextPageUrl } from "../utils/pagination.ts";
import paginationConfig from "../utils/pagination.config.ts";
import { CustomRequest, User } from "../types/CustomRequest.ts";

// Define interfaces for your data
interface Comment {
  id: number;
  title: string;
  content: string;
  UserId: number;
  PostId: number;
  ParentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  subComments: Comment[];
}

interface Post {
  id: number;
  title: string;
  content: string;
  UserId: number;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

interface PaginationResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  nextPage: string | null;
  posts: T[];
}

// Utility function to get posts with nested comments
const getPostsWithNestedComments = async (posts: Post[]): Promise<Post[]> => {
  return await Promise.all(
    posts.map(async (post) => {
      const postId = post.id;
      const comments = await getCommentsByPostIdDataService(postId);
      return {
        //@ts-ignore
        ...post.dataValues,
        comments: comments as Comment[], // Adjust according to your actual response structure
      };
    })
  );
};

// Utility function to format pagination response
const formatPaginationResponse = (
  data: Post[],
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  req: Request
): PaginationResponse<Post> => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
  const nextPageUrl = generateNextPageUrl(nextPage, pageSize, req);
  return {
    total: totalItems,
    page: pageNumber,
    pageSize: pageSize,
    nextPage: nextPageUrl,
    posts: data,
  };
};

// Get posts with nested comments
const getPostsWithComments = async (req: Request): Promise<{ success: boolean; data?: PaginationResponse<Post>; message?: string }> => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;

  const pagination = validatePagination(page as string, limit as string);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;

  const posts = await Post.findAll({
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
  });

  const postsWithComments = await getPostsWithNestedComments(posts);
  const totalPosts = await Post.count();

  const data = formatPaginationResponse(postsWithComments, totalPosts, pageNumber, pageSize, req);
  return { success: true, data: data };
};

// Get posts by user with nested comments
const getPostsByUserWithComments = async (req: CustomRequest): Promise<{ success: boolean; data?: PaginationResponse<Post>; message?: string }> => {
  const { user_id } = req.params;
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;
  const { id } = req.user as User;
  if (parseInt(user_id) !== id) {
    return { success: false, message: "Forbidden" };
  }

  const pagination = validatePagination(page as string, limit as string);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;

  const posts = await Post.findAll({
    where: { UserId: user_id },
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
  });

  const postsWithComments = await getPostsWithNestedComments(posts);
  const totalPosts = await Post.count({ where: { UserId: user_id } });

  const data = formatPaginationResponse(postsWithComments, totalPosts, pageNumber, pageSize, req);
  return { success: true, data: data };
};

// Search posts by title or content
const searchPostsByTitleOrContent = async (req: Request): Promise<{ success: boolean; data?: PaginationResponse<Post>; message?: string }> => {
  const { title = "", content = "", page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;
  if (!title && !content) {
    return {
      success: false,
      message: "Title or content query parameter is required",
    };
  }

  const pagination = validatePagination(page as string, limit as string);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;

  const posts = await Post.findAndCountAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${title}%` } },
        { content: { [Op.iLike]: `%${content}%` } },
      ],
    },
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
  });

  const postsWithComments = await getPostsWithNestedComments(posts.rows);
  const data = formatPaginationResponse(postsWithComments, posts.count, pageNumber, pageSize, req);
  return { success: true, data: data };
};

const getPostWithCommentsById = async (postId: number): Promise<{ success: boolean; data?: Post; message?: string }> => {
  try {
    const posts = await Post.findAll();

    const postsWithComments = await getPostsWithNestedComments(posts);
    const postWithComments = postsWithComments.find((post) => post.id === postId);
    if (!postWithComments) {
      return { success: false, message: "Post not found" };
    }
    return { success: true, data: postWithComments };
  } catch (error) {
    console.error("Error fetching post with comments:", error);
    return { success: false, message: "Internal server error" };
  }
};

export { getPostsWithComments, getPostsByUserWithComments, searchPostsByTitleOrContent, getPostWithCommentsById };
