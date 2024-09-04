import bcrypt from "bcryptjs";
import User from "../sequelize/models/user.model.ts";
import { generateToken } from "../utils/jwt.ts";
import { AuthStatus } from "../utils/messages.ts";
import { AuthResult } from "../types/user";

// Function to handle user signup
const signUpUser = async (name: string, email: string, password: string): Promise<AuthResult> => {
  // Check if the user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error(AuthStatus.USER_EXISTS);
  }

  // Create a new user with hashed password
  //const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate a token for the user
  const token = generateToken(user);
  return { success: true, token };
};

// Function to handle user sign-in
const signInUser = async (email: string, password: string): Promise<AuthResult> => {
  // Fetch the user with the password field included
  const user = await User.scope("withPassword").findOne({ where: { email } });
  if (!user) {
    throw new Error(AuthStatus.INVALID_CREDENTIALS);
  }

  // Compare provided password with stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error(AuthStatus.INVALID_CREDENTIALS);
  }

  // Generate a token for the user
  const token = generateToken(user);
  return { success: true, token };
};

//error should be thrown in services as well make instance

export { signInUser, signUpUser };
