import express from "express";
import { signup, login, refresh, logout } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { signupSchema, loginSchema } from "../validators/authValidators.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
