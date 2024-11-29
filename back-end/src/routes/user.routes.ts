import { Router } from "express";
// Trick - Try to remove the login and fix with AI.
import { signup, login } from "../controllers/user.controller";

const router = Router();

// Route to handle user signup
router.post("/signup", signup);

// Route to handle user login
router.post("/login", login);

export default router;
