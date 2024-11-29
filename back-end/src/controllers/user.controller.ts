import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateUserInput } from "../models/user.model";
import argon2 from "argon2";
import { generateToken } from "../utils/auth";
import logger from "../utils/logger";

export async function signup(req: Request, res: Response) {
  try {
    logger.info("Starting user signup process", { email: req.body.email });

    const userData: CreateUserInput = req.body;

    // Trick - Check the userData with incorrect keys.
    // console.log(userData);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email || !emailRegex.test(userData.email.trim())) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }

    // Trick - Show validation debugging.

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Validate password
    if (!userData.password || userData.password.trim().length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Validate username
    if (!userData.username || !userData.username.trim()) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Trim all input fields
    userData.email = userData.email.trim();
    userData.username = userData.username.trim();
    userData.password = userData.password.trim();

    const hashedPassword = await argon2.hash(userData.password);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const { password, ...userWithoutPassword } = user;
    logger.info("User signup successful", { userId: user.id });
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    logger.error("Error in signup process", { error, email: req.body.email });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validate email and password are provided and not just whitespace
    if (!email?.trim() || !password?.trim()) {
      logger.warn("Login attempt with missing credentials", { email });
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn("Login attempt with non-existent email", { email });
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      logger.warn("Login attempt with invalid password", { userId: user.id });
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken(user.id, user.email);

    const { password: _, ...userWithoutPassword } = user;
    logger.info("User login successful", { userId: user.id });
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    logger.error("Error in login process", { error, email: req.body.email });
    res.status(500).json({ error: "Error during login" });
  }
}
