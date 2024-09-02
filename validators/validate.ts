import { validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { BAD_REQUEST } from "http-status-codes";

export const validate = (validationRules : ValidationChain[]) : RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validationRules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  };
};
