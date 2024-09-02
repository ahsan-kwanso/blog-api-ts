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