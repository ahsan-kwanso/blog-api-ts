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
import { CREATED, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK, NOT_FOUND, FORBIDDEN } from "http-status-codes";

const createPost = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.user; // Extract user_id from authenticated user

  try {
    const post = await createPostService(title, content, id);
    return res.status(CREATED).json({ post });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const { filter } = req.query;
    //console.log(req.query);
    let data;
    if (filter === "my-posts" && req.query.userId) {
      // If filter is "my-posts", call getMyPosts service
      data = await getMyPosts2Service(req);
    } else {
      // Otherwise, call the regular getPostsService
      data = await getPostsService(req);
    }
    res.status(OK).json({
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

const getMyPosts = async (req, res) => {
  try {
    const data = await getMyPostsService(req);
    res.status(OK).json({
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

const getPostById = async (req, res) => {
  const { post_id } = req.params;

  try {
    const result = await getPostByIdService(post_id);
    if (!result.success) return res.status(NOT_FOUND).json({ message: result.message });
    return res.status(OK).json(result.post);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  const { post_id } = req.params;
  const { title, content } = req.body;
  const { id } = req.user;
  try {
    const result = await updatePostService(post_id, title, content, id);
    if (!result.success) {
      if (result.message === "ForBidden") return res.status(FORBIDDEN).json({ message: result.message });
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json(result.post);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  const { post_id } = req.params;
  const { id } = req.user;

  try {
    const result = await deletePostService(post_id, id);
    if (!result.success) {
      if (result.message === "ForBidden") return res.status(FORBIDDEN).json({ message: result.message });
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json({ message: result.message });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getPostsByTitle = async (req, res) => {
  try {
    const { filter } = req.query;
    //console.log(req.query);
    let data;
    if (filter === "my-posts" && req.query.userId) {
      data = await searchUserPostsByTitle2Service(req);
    } else {
      data = await searchPostsByTitleService(req);
    }
    res.status(OK).json({
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

const searchUserPostsByTitle = async (req, res) => {
  try {
    const data = await searchUserPostsByTitleService(req);
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
