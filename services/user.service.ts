import User from "../sequelize/models/user.model.ts";
import { ERROR_MESSAGES, AuthStatus } from "../utils/messages.ts";
// // Define the User interface (extend this based on your User model's attributes)
// interface UserAtt {
//   id: number;
//   name: string;
//   email: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// Define interfaces for service results
interface UserResult {
  success: boolean;
  message?: string;
  user?: typeof User;
}

interface UsersResult {
  success: boolean;
  users?: typeof User[];
}

// Function to get a user by ID
const getUserById = async (userId: number, id: number): Promise<UserResult> => {
  // Fetch user information by ID
  const user = await User.findByPk(userId);
  if (!user) {
    return { success: false, message: AuthStatus.USER_NOT_FOUND };
  }
  if (userId !== id) {
    return { success: false, message: ERROR_MESSAGES.FORBIDDEN };
  }
  return { success: true, user };
};

// Function to get the current user by ID
const getCurrentUser = async (userId: number): Promise<UserResult> => {
  // Fetch user information by ID
  const user = await User.findByPk(userId);
  if (!user) {
    return { success: false, message: AuthStatus.USER_NOT_FOUND };
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
