import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const JWT_SECRET = process.env.SESSION_SECRET || "super-secret-fallback";
const COOKIE_NAME = "admin_token";

export interface AuthRequest extends Request {
  user?: { username: string };
}

// 1. Login Handler
export const adminLogin = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username: ADMIN_USERNAME }, JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour in milliseconds
      signed: true,
    });

    return res.json({ message: "Login successful" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};

// 2. Logout Handler
export const adminLogout = (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({ message: "Logout successful" });
};

// 3. Authentication Middleware
export const authenticateAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const signedToken = req.signedCookies[COOKIE_NAME];

  if (!signedToken) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(signedToken, JWT_SECRET) as { username: string };
    req.user = decoded;
    next();
  } catch (ex) {
    res.clearCookie(COOKIE_NAME); // Clear invalid token
    return res.status(401).json({ message: "Invalid token." });
  }
};

// 4. Check Auth Status
// This is called after authenticateAdmin, so if it reaches here, the user is authenticated.
export const checkAuthStatus = (req: AuthRequest, res: Response) => {
  return res.json({ isAuthenticated: true, username: req.user?.username });
};
