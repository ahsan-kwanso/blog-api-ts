import { Request, Response } from "express";
import { signUpUser, signInUser } from "../services/auth.service.ts";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK } from "http-status-codes";

interface AuthResult {
  success: boolean;
  message?: string;
  token?: string;
}

const signUp = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;

  try {
    const result: AuthResult = await signUpUser(name, email, password);

    if (!result.success) {
      return res.status(BAD_REQUEST).json({ message: result.message });
    }

    return res.status(CREATED).json({ token: result.token });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const signIn = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const result: AuthResult = await signInUser(email, password);

    if (!result.success) {
      return res.status(UNAUTHORIZED).json({ message: result.message });
    }

    return res.status(OK).json({ token: result.token });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export { signIn, signUp };
