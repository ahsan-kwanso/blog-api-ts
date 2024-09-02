export const ERROR_MESSAGES = {
    INTERNAL_SERVER : "Internal server error",
    FORBIDDEN : "Forbidden",
};
  
export enum AuthStatus {
    USER_EXISTS = "User already exists.",
    INVALID_CREDENTIALS = "Invalid email or password.",
    SIGN_UP_ERROR = "An error occurred during sign-up.",
    SIGN_IN_ERROR = "An error occurred during sign-in.",
    USER_NOT_FOUND = "User not found",
}

export enum CommentStatus {
    POST_NOT_FOUND = "Post not Found",
    COMMENT_NOT_FOUND = "Comment not Found",
    COMMENT_NOT_ON_POST = "This comment is not on post",
    CANNOT_REPLY_TO_NON_EXISTING_COMMENT = "You can't reply to a non-existing comment",
    COMMENT_DELETED_SUCCESSFULLY = "Comment deleted successfully",
}

export enum PostStatus {
    POST_NOT_FOUND = "Post not Found",
    POST_DELETED_SUCCESSFULLY = "Post deleted successfully",
}

export enum TokenValidation {
    ACCESS_DENIED = "Access Denied! You are not authenticated",
    INVALID_TOKEN = "Token is not valid",
}