import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Minimal Clerk JWT validation stub: expects Bearer <token> with a public key env.
// Replace with Clerk SDK verification when available. This keeps the route contract enforced.
const CLERK_JWT_PUBLIC_KEY = process.env.CLERK_JWT_PUBLIC_KEY || "";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"];
  if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = header.slice("Bearer ".length);

  // Allow bypass in dev if no key is configured
  if (!CLERK_JWT_PUBLIC_KEY) {
    (req as any).auth = { bypass: true };
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
  if (!token) return false;
  // Token is generated server-side per session; session-manager validates equality.
  return true;
}
