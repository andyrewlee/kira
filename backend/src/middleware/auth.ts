import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Minimal auth: verify RS256 JWT when public key is provided; otherwise allow dev.
const CLERK_JWT_PUBLIC_KEY = process.env.CLERK_JWT_PUBLIC_KEY || "";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"];
  if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = header.slice("Bearer ".length);

  if (!CLERK_JWT_PUBLIC_KEY) {
    (req as any).auth = { bypass: true, token };
    return next();
  }

  try {
    const decoded = jwt.verify(token, CLERK_JWT_PUBLIC_KEY, { algorithms: ["RS256"] }) as JwtPayload;
    (req as any).auth = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function validateWsToken(token: string | undefined): boolean {
  return Boolean(token);
}
