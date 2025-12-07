import { Request, Response, NextFunction } from "express";

// Minimal placeholder auth: require Authorization header. Integrate Clerk/JWT later (Phase 3).
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"];
  if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // TODO: validate token with Clerk/JWT template.
  next();
}

// WS token validation helper (Phase 3 design)
export function validateWsToken(token: string | undefined): boolean {
  if (!token) return false;
  // TODO: replace with signed token verification tied to sessionId.
  return token.length > 10;
}
