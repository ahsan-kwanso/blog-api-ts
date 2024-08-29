import { Sequelize } from "sequelize";
import Post from "../sequelize/models/post.model.ts";
import { Op } from 'sequelize';
import { Request } from "express";
import { getCommentsByPostIdData as getCommentsByPostIdDataService } from "./comment.service.ts";
import { validatePagination, generateNextPageUrl } from "../utils/pagination.ts";
import paginationConfig from "../utils/pagination.config.ts";
// Utility function to get posts with nested comments
const getPostsWithNestedComments = async (posts) => {
  return await Promise.all(
    posts.map(async (post) => {
      const postId = post.id; // Adjust according to your actual post model
      const comments = await getCommentsByPostIdDataService(postId);
      return {
        ...post.toJSON(),
        comments: comments, // Adjust according to the response structure from getCommentsByPostIdData
      };
    })
  );
};

// Utility function to format pagination response
const formatPaginationResponse = (data, totalItems : number, pageNumber : number, pageSize : number, req : Request) => {
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
const getPostsWithComments = async (req : Request) => {
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
const getPostsByUserWithComments = async (req : Request) => {
  const { user_id } = req.params;
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;
  //@ts-ignore
  const { id } = req.user;
  if (parseInt(user_id) !== id) {
    return { success: false, message: "ForBidden" };
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
const searchPostsByTitleOrContent = async (req : Request) => {
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

const getPostWithCommentsById = async (postId : number) => {
  try {
    // Fetch the post by ID
    const posts = await Post.findAll();

    const postsWithComments = await getPostsWithNestedComments(posts);
    const postWithComments = postsWithComments.filter((post) => post.id == postId);
    return { success: true, data: postWithComments[0] };
  } catch (error) {
    console.error("Error fetching post with comments:", error);
    return { success: false, message: "Internal server error" };
  }
};

export { getPostsWithComments, getPostsByUserWithComments, searchPostsByTitleOrContent, getPostWithCommentsById };
