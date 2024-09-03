import bcrypt from "bcryptjs";
import User from "../sequelize/models/user.model.ts";
import { generateToken } from "../utils/jwt.ts";
import { AuthStatus } from "../utils/messages.ts";
import { AuthResult } from "../types/user";

// Function to handle user signup
const signUpUser = async (name : string, email : string, password : string) : Promise<AuthResult> => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return { success: false, message: AuthStatus.USER_EXISTS };
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
  } catch (error : unknown) {
    return { success: false, message: AuthStatus.SIGN_UP_ERROR };
  }
};

// Function to handle user sign-in
const signInUser = async (email : string, password : string) : Promise<AuthResult> => {
  try {
    // Fetch the user with the password field included
    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user) {
      return { success: false, message: AuthStatus.INVALID_CREDENTIALS };
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: AuthStatus.INVALID_CREDENTIALS };
    }

    // Generate a token for the user
    const token = generateToken(user);
    return { success: true, token };
  } catch (error : unknown) {
    return { success: false, message: AuthStatus.SIGN_IN_ERROR };
  }
};

//error should be thrown in services as well make instance

export { signInUser, signUpUser };
