import { Request, Response } from "express";
import { signUpUser, signInUser } from "../services/auth.service.ts";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK } from "http-status-codes";
import { ERROR_MESSAGES } from "../utils/messages.ts";
import { SignUpRequest, AuthResult, SignInRequest } from "../types/user";

type RequestBody<T> = Request<{}, {}, T>;
//modify request make a generic for request pass body and param
//declare type for response e.g message token status
const signUp = async (req: RequestBody<SignUpRequest>, res: Response): Promise<Response<AuthResult>> => {
  const { name, email, password } = req.body;

  try {
    const result: AuthResult = await signUpUser(name, email, password);
    return res.status(CREATED).json({ token: result.token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const statusCode = error.message === ERROR_MESSAGES.INTERNAL_SERVER ? INTERNAL_SERVER_ERROR : BAD_REQUEST;
      return res.status(statusCode).json({ message: error.message });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

const signIn = async (req: RequestBody<SignInRequest>, res: Response): Promise<Response<AuthResult>> => {
  const { email, password } = req.body;

  try {
    const result: AuthResult = await signInUser(email, password);

    if (!result.success) {
      return res.status(UNAUTHORIZED).json({ message: result.message });
    }

    return res.status(OK).json({ token: result.token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const statusCode = error.message === ERROR_MESSAGES.INTERNAL_SERVER ? INTERNAL_SERVER_ERROR : UNAUTHORIZED;
      return res.status(statusCode).json({ message: error.message });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.INTERNAL_SERVER });
  }
};

export { signIn, signUp };
