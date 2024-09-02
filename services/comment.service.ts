import Comment from "../sequelize/models/comment.model.ts";
import Post from "../sequelize/models/post.model.ts";
import { ERROR_MESSAGES, CommentStatus } from "../utils/messages.ts";
import { CommentData, CommentsResult, CommentResponse, Comment as CommentModel } from "../types/comment";

// Function to get the depth of a comment thread
const getCommentDepth = async (commentId: number): Promise<number> => {
  let depth = 0;
  let currentCommentId = commentId;

  while (currentCommentId) {
    const comment = await Comment.findByPk(currentCommentId);
    if (!comment || !comment.ParentId) {
      break;
    }
    currentCommentId = comment.ParentId;
    depth += 1;
  }

  return depth;
};

// Create a new comment
const createComment = async (
  title: string,
  content: string,
  PostId: number,
  ParentId: number | null | undefined,
  UserId: number
) : Promise<CommentResponse> => {
  const post = await Post.findByPk(PostId);
  if (!post) {
    return { success: false, message: CommentStatus.POST_NOT_FOUND };
  }

  if (ParentId) {
    const parentComment = await Comment.findByPk(ParentId);
    if (parentComment && parentComment.PostId !== PostId) {
      return {
        success: false,
        message: `${CommentStatus.COMMENT_NOT_ON_POST} ${PostId}`,
      };
    }
    if (!parentComment) {
      return {
        success: false,
        message: CommentStatus.CANNOT_REPLY_TO_NON_EXISTING_COMMENT,
      };
    }
    // Calculate the depth of the comment thread
    const depth = await getCommentDepth(ParentId);
    if (depth >= 2) {
      ParentId = parentComment.ParentId; // Set ParentId to the upper parent comment if depth is 3 or more
    }
  }

  const comment = await Comment.create({
    title,
    content,
    UserId,
    PostId,
    ParentId,
  });
  return { success: true, comment: comment };
};

// Build a comment tree for nested comments
const buildCommentTree = (comments: CommentModel[]): CommentData[] => {
  const commentMap: { [key: number]: CommentData } = {};
  const rootComments: CommentData[] = [];

  // Create a map for all comments
  comments.forEach((comment) => {
    //@ts-ignore
    commentMap[comment.id] = { ...comment.dataValues, subComments: [] };
  });

  // Link child comments to their parent comments
  comments.forEach((comment) => {
    if (comment.ParentId) {
      const parentComment = commentMap[comment.ParentId];
      if (parentComment) {
        parentComment.subComments.push(commentMap[comment.id]);
      }
    } else {
      // Add root comments (comments without ParentId) to rootComments array
      rootComments.push(commentMap[comment.id]);
    }
  });

  return rootComments;
};

// Get comments by post ID with optional pagination
const getCommentsByPostId = async (post_id: number) : Promise<CommentsResult> => {
  const post = await Post.findByPk(post_id);
  if (!post) {
    return { success: false, message: CommentStatus.POST_NOT_FOUND };
  }

  const comments = await Comment.findAll({
    where: { PostId: post_id },
  });
  const commentsWithSubComments = buildCommentTree(comments);
  return { success: true, data: { comments: commentsWithSubComments } };
};

// Update a comment
const updateComment = async (
  comment_id: number,
  title: string,
  content: string,
  UserId: number
) : Promise<CommentResponse> => {
  const comment = await Comment.findByPk(comment_id);
  if (!comment) {
    return { success: false, message: CommentStatus.COMMENT_NOT_FOUND };
  }

  if (comment.UserId !== UserId) {
    return { success: false, message: ERROR_MESSAGES.FORBIDDEN };
  }

  comment.title = title || comment.title;
  comment.content = content || comment.content;
  await comment.save();

  return { success: true, comment: comment };
};

// Delete a comment
const deleteComment = async (comment_id: number, UserId: number) : Promise<CommentResponse> => {
  const comment = await Comment.findByPk(comment_id);
  if (!comment) {
    return { success: false, message: CommentStatus.COMMENT_NOT_FOUND };
  }

  if (comment.UserId !== UserId) {
    return { success: false, message: ERROR_MESSAGES.FORBIDDEN };
  }

  await comment.destroy();
  return { success: true, message: CommentStatus.COMMENT_DELETED_SUCCESSFULLY };
};

// Get comments by post ID data (no pagination)
const getCommentsByPostIdData = async (PostId: number) => {
  try {
    const comments = await Comment.findAll({ where: { PostId } });
    const rootComments = buildCommentTree(comments);
    return rootComments;
  } catch (error) {
    throw new Error(ERROR_MESSAGES.INTERNAL_SERVER);
  }
};

export {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
  getCommentsByPostIdData,
};
