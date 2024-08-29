import { Request, Response } from "express";
import {
  getUserById,
  getAllUsers as getAllUsersService,
  getCurrentUser as getCurrentUserService,
} from "../services/user.service.ts";
import { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } from "http-status-codes";

// Define interface for service results
interface UserResult {
  success: boolean;
  message?: string;
  user?: object; // Replace `object` with a specific user type if available
}

interface UsersResult {
  success: boolean;
  message?: string;
  users?: object[]; // Replace `object` with a specific user type if available
}

// Controller function to get a single user by ID
const getUser = async (req: Request, res: Response): Promise<Response> => {
  const { user_id } = req.params; // Extract userId from route parameters
  //@ts-ignore
  const { id } = req.user as { id: number }; // Assuming `req.user` has an `id` field

  try {
    const result: UserResult = await getUserById(parseInt(user_id), id);
    if (!result.success) {
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json({ user: result.user });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Controller function to get all users
const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result: UsersResult = await getAllUsersService();
    if (!result.success) {
      return res.status(INTERNAL_SERVER_ERROR).json({ message: "" });
    }
    return res.status(OK).json({ users: result.users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

// Controller function to get the current user
const getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
  //@ts-ignore
  const userId = (req.user as { id: number }).id; // Extract user ID from req.user
  try {
    const result: UserResult = await getCurrentUserService(userId); // Fetch user info
    if (!result.success) {
      return res.status(NOT_FOUND).json({ message: result.message }); // Not found
    }
    return res.status(OK).json({ user: result.user }); // Success
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" }); // Internal error
  }
};

export { getUser, getAllUsers, getCurrentUser };
