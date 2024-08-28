import {
  getUserById,
  getAllUsers as getAllUsersService,
  getCurrentUser as getCurrentUserService,
} from "../services/user.service.ts";
import { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } from "http-status-codes";

const getUser = async (req, res) => {
  const { user_id } = req.params; // Extract userId from route parameters
  const { id } = req.user;
  try {
    const result = await getUserById(user_id, id);
    if (!result.success) {
      return res.status(NOT_FOUND).json({ message: result.message });
    }
    return res.status(OK).json({ user: result.user });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await getAllUsersService();
    if (!result.success) {
      return res.status(INTERNAL_SERVER_ERROR).json({ message: "" });
    }
    return res.status(OK).json({ users: result.users });
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const getCurrentUser = async (req, res) => {
  const userId = req.user.id; // Extract user ID from req.user
  try {
    const result = await getCurrentUserService(userId); // Fetch user info
    if (!result.success) {
      return res.status(404).json({ message: result.message }); // Not found
    }
    return res.status(200).json({ user: result.user }); // Success
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" }); // Internal error
  }
};

export { getUser, getAllUsers, getCurrentUser };
