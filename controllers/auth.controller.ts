import { Request, Response } from "express";
import { signUpUser, signInUser } from "../services/auth.service.ts";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK } from "http-status-codes";
import { ERROR_MESSAGES } from "../utils/messages.ts";
import { SignUpRequest, AuthResult, SignInRequest } from "../types/user";

const signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;

  try {
    const result: AuthResult = await signUpUser(name, email, password);

    if (!result.success) {
      return res.status(BAD_REQUEST).json({ message: result.message });
    }

    return res.status(CREATED).json({ token: result.token });
  } catch (error : unknown) {
    if (error instanceof Error) {
      return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

const signIn = async (req: Request<{}, {}, SignInRequest>, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const result: AuthResult = await signInUser(email, password);

    if (!result.success) {
      return res.status(UNAUTHORIZED).json({ message: result.message });
    }

    return res.status(OK).json({ token: result.token });
  } catch (error : unknown) {
    if (error instanceof Error) {
      return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

export { signIn, signUp };
