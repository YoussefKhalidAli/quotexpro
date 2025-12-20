import { Request, Response } from "express";
import type { NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";

interface JwtPayload {
  companyId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
