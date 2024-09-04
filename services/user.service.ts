import User from "../sequelize/models/user.model.ts";
import { ERROR_MESSAGES, AuthStatus } from "../utils/messages.ts";
import { UserResult, UsersResult } from "../types/user";

// Function to get a user by ID
const getUserById = async (userId: number, id: number): Promise<UserResult> => {
  // Fetch user information by ID
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error(AuthStatus.USER_NOT_FOUND);
  }
  if (userId !== id) {
    throw new Error(ERROR_MESSAGES.FORBIDDEN);
  }
  return { success: true, user };
};

// Function to get the current user by ID
const getCurrentUser = async (userId: number): Promise<UserResult> => {
  // Fetch user information by ID
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error(AuthStatus.USER_NOT_FOUND);
  }
  return { success: true, user };
};

// Function to get all users
const getAllUsers = async (): Promise<UsersResult> => {
  // Fetch all users
  const users = await User.findAll();
  return { success: true, users };
};

export { getUserById, getAllUsers, getCurrentUser };
