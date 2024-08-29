import User from "../sequelize/models/user.model.ts";

const getUserById = async (userId : number, id : number) => {
  // Fetch user information by ID
  const user = await User.findByPk(userId);
  if (!user) {
    return { success: false, message: "User not found." };
  }
  if (userId != id) {
    return { success: false, message: "ForBidden" };
  }

  return { success: true, user };
};

const getCurrentUser = async (userId : number) => {
  // Fetch user information by ID
  const user = await User.findByPk(userId);
  if (!user) {
    return { success: false, message: "User not found." };
  }
  return { success: true, user };
};

const getAllUsers = async () => {
  // Fetch all users
  const users = await User.findAll();

  return { success: true, users };
};

export { getUserById, getAllUsers, getCurrentUser };
