import express from "express";
import { signUp, signIn } from "../controllers/auth.controller.ts";
import { signInValidationRules, signUpValidationRules } from "../validators/user.validator.ts";
import { validate } from "../validators/validate.ts";

const router = express.Router();

router.post("/signup", validate(signUpValidationRules), signUp);
router.post("/signin", validate(signInValidationRules), signIn);

export default router;
