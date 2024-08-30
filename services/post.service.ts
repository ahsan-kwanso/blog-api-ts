import Post from "../sequelize/models/post.model.ts";
import User from "../sequelize/models/user.model.ts";
import db from "../sequelize/models/index.ts";
import { Request } from "express";
import { Op } from 'sequelize';
import { validatePagination, generateNextPageUrl } from "../utils/pagination.ts";
import paginationConfig from "../utils/pagination.config.ts";
import { CustomRequest, User as UserInterface } from "../types/CustomRequest.ts";


interface Post {
  id: number;
  author? : typeof User;
  title: string;
  content: string;
  updatedAt: Date; // Formatted as YYYY-MM-DD
}

const createPost = async (title : string, content : string, userId : number) => {
  const post = await Post.create({ title, content, UserId: userId });
  return post;
};

const getPosts2 = async (req : Request) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;

  // Validate pagination parameters
  const pagination = validatePagination(page as string, limit as string);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;

  // Fetch all posts with author information
  const { count, rows } = await db.Post.findAndCountAll({
    include: [
      {
        model: User,
        attributes: ["name"], // Fetch only the name attribute from the User model
      },
    ],
  });

  // Transform the fetched posts with author information
  const allPosts  = rows.map((post : Post) => ({
    id: post.id,
    //@ts-ignore
    author: post.User ? post.User.name : undefined,
    title: post.title,
    content: post.content,
    date: post.updatedAt.toISOString().split("T")[0], // Format date as YYYY-MM-DD
  }));

  // Apply pagination to the transformed posts
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  // Calculate pagination details
  const totalPages = Math.ceil(count / pageSize);
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;

  return {
    posts: paginatedPosts,
    total: count,
    page: pageNumber,
    pageSize: pageSize,
    nextPage: generateNextPageUrl(nextPage, pageSize, req),
  };
};

const getPosts = async (req : Request) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit, filter } = req.query;
  // Validate pagination parameters
  const pagination = validatePagination(page as string, limit as string);
  const { pageNumber = 1, pageSize = 10 } = pagination;
  // Fetch posts with pagination
  const { count, rows } = await db.Post.findAndCountAll({
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    include: [
      {
        model: User,
        attributes: ["name"], // Fetch only the name attribute from the User model
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  const posts = rows.map((post : Post) => ({
    id: post.id,
    //@ts-ignore
    author: post?.User?.name, // Access the user's name
    title: post.title,
    content: post.content,
    date: post.updatedAt.toISOString().split("T")[0], // Format date as YYYY-MM-DD
  }));

  // Calculate pagination details
  const totalPages = Math.ceil(count / pageSize);
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;

  return {
    posts,
    total: count,
    page: pageNumber,
    pageSize: pageSize,
    nextPage: generateNextPageUrl(nextPage, pageSize, req),
  };
};

const getMyPosts2 = async (req : Request) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;
  const userId = req.query.userId;
  if (!userId) {
    return { success: true, posts: [], total: 0, nextPage: null }; // Return an empty result
  }
  const numericUserId = Number(userId);

  // Validate pagination parameters
  const pagination = validatePagination(page as string, limit as string);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;

  // Fetch posts with pagination
  const { count, rows } = await db.Post.findAndCountAll({
    where: {
      UserId: numericUserId, // Filter posts by the current user's ID
    },
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    include: [
      {
        model: User,
        attributes: ["name"], // Fetch only the name attribute from the User model
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  const posts = rows.map((post : Post) => ({
    id: post.id,
    //@ts-ignore
    author: post?.User?.name, // Access the user's name
    title: post.title,
    content: post.content,
    date: post.updatedAt.toISOString().split("T")[0], // Format date as YYYY-MM-DD
  }));

  // Calculate pagination details
  const totalPages = Math.ceil(count / pageSize);
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;

  return {
    posts,
    total: count,
    page: pageNumber,
    pageSize: pageSize,
    nextPage: generateNextPageUrl(nextPage, pageSize, req),
  };
};

const getMyPosts = async (req : CustomRequest) => {
  // Other one created as according to requirements of blog app
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;
  const { id } = req.user as UserInterface;
  // Validate pagination parameters
  const pagination = validatePagination(page as string, limit as string);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;

  // Fetch posts with pagination
  const { count, rows } = await db.Post.findAndCountAll({
    where: {
      UserId: id, // Filter posts by the current user's ID
    },
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    include: [
      {
        model: User,
        attributes: ["name"], // Fetch only the name attribute from the User model
      },
    ],
  });
  const posts = rows.map((post : Post) => ({
    id: post.id,
    //@ts-ignore
    author: post?.User?.name, // Access the user's name
    title: post.title,
    content: post.content,
    date: post.updatedAt.toISOString().split("T")[0], // Format date as YYYY-MM-DD
  }));

  // Calculate pagination details
  const totalPages = Math.ceil(count / pageSize);
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;

  return {
    posts,
    total: count,
    page: pageNumber,
    pageSize: pageSize,
    nextPage: generateNextPageUrl(nextPage, pageSize, req),
  };
};

const getPostById = async (postId : number) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    return { success: false, message: "Post not Found" };
  }
  return { success: true, post: post };
};

const updatePost = async (postId : number, title : string, content : string, userId : number) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    return { success: false, message: "Post not Found" };
  }
  if (post.UserId !== userId) {
    return { success: false, message: "ForBidden" };
  }

  post.title = title || post.title;
  post.content = content || post.content;
  await post.save();

  return { success: true, post: post };
};

const deletePost = async (postId : number, userId : number) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    return { success: false, message: "Post not Found" };
  }
  if (post.UserId !== userId) {
    return { success: false, message: "ForBidden" };
  }

  await post.destroy();
  return { success: true, message: "Post deleted successfully" };
};

const searchPostsByTitle = async (req : Request) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit, title } = req.query;

  // Validate pagination parameters
  const pagination = validatePagination(page as string, limit as string);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;
  // Fetch posts with pagination and search by title
  const { count, rows } = await db.Post.findAndCountAll({
    where: {
      title: {
        [Op.iLike]: `%${title}%`, // Case-insensitive search
      },
    },
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    include: [
      {
        model: db.User,
        attributes: ["name"], // Fetch only the name attribute from the User model
      },
    ],
  });

  const posts = rows.map((post : Post) => ({
    id: post.id,
    //@ts-ignore
    author: post?.User?.name, // Access the user's name
    title: post.title,
    content: post.content,
    date: post.updatedAt.toISOString().split("T")[0], // Format date as YYYY-MM-DD
  }));

  // Calculate pagination details
  const totalPages = Math.ceil(count / pageSize);
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;

  return {
    posts,
    total: count,
    page: pageNumber,
    pageSize: pageSize,
    nextPage: generateNextPageUrl(nextPage, pageSize, req),
  };
};

const searchUserPostsByTitle = async (req : Request) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit, title } = req.query;
  //@ts-ignore
  const userId = req.user.id;
  // Validate pagination parameters
  const pagination = validatePagination(page as string, limit as string);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;

  // Fetch posts with pagination and search by title for the authenticated user
  const { count, rows } = await db.Post.findAndCountAll({
    where: {
      title: {
        [Op.iLike]: `%${title}%`, // Case-insensitive search
      },
      UserId: userId, // Filter by UserId
    },
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    include: [
      {
        model: db.User,
        attributes: ["name"], // Fetch only the name attribute from the User model
      },
    ],
  });
  const posts = rows.map((post : Post) => ({
    id: post.id,
    //@ts-ignore
    author: post?.User?.name, // Access the user's name
    title: post.title,
    content: post.content,
    date: post.updatedAt.toISOString().split("T")[0], // Format date as YYYY-MM-DD
  }));

  // Calculate pagination details
  const totalPages = Math.ceil(count / pageSize);
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;

  return {
    posts,
    total: count,
    page: pageNumber,
    pageSize: pageSize,
    nextPage: generateNextPageUrl(nextPage, pageSize, req),
  };
};

//these second services are added later as we want custom auth not jwt changes are made according to frontend req
const searchUserPostsByTitle2 = async (req : Request) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit, title } = req.query;
  const userId = req.query.userId; // Extract UserId from query as sent from front end
  const numericUserId = Number(userId);
  // Validate pagination parameters
  const pagination = validatePagination(page as string, limit as string);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;


  // Fetch posts with pagination and search by title for the authenticated user
  const { count, rows } = await db.Post.findAndCountAll({
    where: {
      title: {
        [Op.iLike]: `%${title}%`, // Case-insensitive search
      },
      UserId: numericUserId, // Filter by UserId
    },
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    include: [
      {
        model: db.User,
        attributes: ["name"], // Fetch only the name attribute from the User model
      },
    ],
  });
  const posts = rows.map((post : Post) => ({
    id: post.id,
    //@ts-ignore
    author: post?.User?.name, // Access the user's name
    title: post.title,
    content: post.content,
    date: post.updatedAt.toISOString().split("T")[0], // Format date as YYYY-MM-DD
  }));

  // Calculate pagination details
  const totalPages = Math.ceil(count / pageSize);
  const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;

  return {
    posts,
    total: count,
    page: pageNumber,
    pageSize: pageSize,
    nextPage: generateNextPageUrl(nextPage, pageSize, req),
  };
};

export {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  searchPostsByTitle,
  searchUserPostsByTitle,
  getMyPosts2,
  searchUserPostsByTitle2,
};

