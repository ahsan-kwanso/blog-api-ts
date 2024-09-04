import { Request, Response } from "express";
import {
  getUserById,
  getAllUsers as getAllUsersService,
  getCurrentUser as getCurrentUserService,
} from "../services/user.service.ts";
import { INTERNAL_SERVER_ERROR, OK, NOT_FOUND, FORBIDDEN } from "http-status-codes";
import { AuthStatus, ERROR_MESSAGES } from "../utils/messages.ts";
import { UserResult, UsersResult } from "../types/user";

// Controller function to get a single user by ID
const getUser = async (req: Request, res: Response): Promise<Response<UserResult>> => {
  const { user_id } = req.params; // Extract userId from route parameters
  const { id } = req.user as { id: number }; // Assuming `req.user` has an `id` field

  try {
    const result: UserResult = await getUserById(parseInt(user_id), id);
    if (!result.success) {
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json({ user: result.user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === AuthStatus.USER_NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: error.message });
      }
      if (error.message === ERROR_MESSAGES.FORBIDDEN) {
        return res.status(FORBIDDEN).json({ message: error.message });
      }
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

// Controller function to get all users
const getAllUsers = async (req: Request, res: Response): Promise<Response<UsersResult>> => {
  try {
    const result: UsersResult = await getAllUsersService();
    return res.status(OK).json({ users: result.users });
  } catch (error: unknown) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

// Controller function to get the current user
const getCurrentUser = async (req: Request, res: Response): Promise<Response<UserResult>> => {
  const userId = (req.user as { id: number }).id; // Extract user ID from req.user
  try {
    const result: UserResult = await getCurrentUserService(userId); // Fetch user info
    if (!result.success) {
      return res.status(NOT_FOUND).json({ message: result.message }); // Not found
    }
    return res.status(OK).json({ user: result.user }); // Success
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === AuthStatus.USER_NOT_FOUND) {
        return res.status(NOT_FOUND).json({ message: error.message });
      }
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

export { getUser, getAllUsers, getCurrentUser };
