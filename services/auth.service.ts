import bcrypt from "bcryptjs";
import User from "../sequelize/models/user.model.ts";
import { generateToken } from "../utils/jwt.ts";

// Function to handle user signup
const signUpUser = async (name : string, email : string, password : string) => {
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return { success: false, message: "User already exists." };
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
  } catch (error) {
    console.error("Error signing up user:", error);
    return { success: false, message: "Error signing up user." };
  }
};

// Function to handle user sign-in
const signInUser = async (email : string, password : string) => {
  try {
    // Fetch the user with the password field included
    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user) {
      return { success: false, message: "Invalid email or password." };
    }

    // Compare provided password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password." };
    }

    // Generate a token for the user
    const token = generateToken(user);
    return { success: true, token };
  } catch (error) {
    console.error("Error signing in user:", error);
    return { success: false, message: "Error signing in user." };
  }
};

export { signInUser, signUpUser };
