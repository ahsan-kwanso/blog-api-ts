import Post from "../sequelize/models/post.model.ts";
import User from "../sequelize/models/user.model.ts";
import db from "../sequelize/models/index.ts";
import { Op } from 'sequelize';
import { validatePagination, generateNextPageUrl } from "../utils/pagination.ts";
import paginationConfig from "../utils/pagination.config.ts";


const createPost = async (title, content, userId) => {
  const post = await Post.create({ title, content, UserId: userId });
  return post;
};

const getPosts2 = async (req) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;

  // Validate pagination parameters
  const pagination = validatePagination(page, limit);
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
  const allPosts = rows.map((post) => ({
    id: post.id,
    author: post.User.name, // Access the user's name
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

const getPosts = async (req) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit, filter } = req.query;
  // Validate pagination parameters
  const pagination = validatePagination(page, limit);
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
  const posts = rows.map((post) => ({
    id: post.id,
    author: post.User.name, // Access the user's name
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

const getMyPosts2 = async (req) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;
  const userId = req.query.userId;
  console.log(userId);
  console.log("Call Here: ", req.query);
  if (!userId) {
    return { success: true, posts: [], total: 0, nextPage: null }; // Return an empty result
  }

  // Validate pagination parameters
  const pagination = validatePagination(page, limit);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;

  // Fetch posts with pagination
  const { count, rows } = await db.Post.findAndCountAll({
    where: {
      UserId: userId, // Filter posts by the current user's ID
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
  const posts = rows.map((post) => ({
    id: post.id,
    author: post.User.name, // Access the user's name
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

const getMyPosts = async (req) => {
  // Other one created as according to requirements of blog app
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit } = req.query;
  const userId = req.user.id;
  // Validate pagination parameters
  const pagination = validatePagination(page, limit);
  if (pagination.error) {
    return { success: false, message: pagination.error };
  }
  const { pageNumber = 1, pageSize = 10 } = pagination;

  // Fetch posts with pagination
  const { count, rows } = await db.Post.findAndCountAll({
    where: {
      UserId: userId, // Filter posts by the current user's ID
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
  const posts = rows.map((post) => ({
    id: post.id,
    author: post.User.name, // Access the user's name
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

const getPostById = async (postId) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    return { success: false, message: "Post not Found" };
  }
  return { success: true, post: post };
};

const updatePost = async (postId, title, content, userId) => {
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

const deletePost = async (postId, userId) => {
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

const searchPostsByTitle = async (req) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit, title } = req.query;

  // Validate pagination parameters
  const pagination = validatePagination(page, limit);
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

  const posts = rows.map((post) => ({
    id: post.id,
    author: post.User.name, // Access the user's name
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

const searchUserPostsByTitle = async (req) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit, title } = req.query;
  const userId = req.user.id; // Extract UserId from authenticated user

  // Validate pagination parameters
  const pagination = validatePagination(page, limit);
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
  const posts = rows.map((post) => ({
    id: post.id,
    author: post.User.name, // Access the user's name
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
const searchUserPostsByTitle2 = async (req) => {
  const { page = paginationConfig.defaultPage, limit = paginationConfig.defaultLimit, title } = req.query;
  const userId = req.query.userId; // Extract UserId from query as sent from front end

  // Validate pagination parameters
  const pagination = validatePagination(page, limit);
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
  const posts = rows.map((post) => ({
    id: post.id,
    author: post.User.name, // Access the user's name
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

/**
 {
    id: 1,
    author: "Alice",
    image: "nature.jpeg",
    title: "Nature's Beauty",
    content:
      "Explore the breathtaking beauty of nature through this stunning post. Nature has always fascinated people with its tranquil beauty and diverse wildlife. In this post, we delve into various natural landscapes, from lush forests to serene lakes.",
    date: "2024-08-01",
  }

  This type of response I wanted now
 */
