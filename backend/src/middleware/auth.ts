import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { URL } from "url";

// Minimal auth: verify RS256 JWT when public key is provided; otherwise allow dev.
const CLERK_JWT_PUBLIC_KEY = process.env.CLERK_JWT_PUBLIC_KEY || "";
const DEV_BEARER = process.env.DEV_BEARER || "dev-token";
const CLERK_JWKS_URL = process.env.CLERK_JWKS_URL || "";
const DEV_MODE = process.env.DEV_MODE === "1";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
if (CLERK_JWKS_URL) {
  try {
    jwks = createRemoteJWKSet(new URL(CLERK_JWKS_URL));
  } catch {
    jwks = null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"];
  if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = header.slice("Bearer ".length);

  if (!CLERK_JWT_PUBLIC_KEY && !jwks) {
    // Allow dev bypass only if matches configured dev bearer AND dev mode is enabled
    if (DEV_MODE && token === DEV_BEARER) {
      (req as any).auth = { bypass: true, token };
      return next();
    }
    return res.status(401).json({ error: "Unauthorized (missing Clerk keys)" });
  }

  try {
    if (CLERK_JWT_PUBLIC_KEY) {
      const decoded = jwt.verify(token, CLERK_JWT_PUBLIC_KEY, { algorithms: ["RS256"] }) as JwtPayload;
      (req as any).auth = decoded;
    } else if (jwks) {
      const { payload } = await jwtVerify(token, jwks, {});
      (req as any).auth = payload;
    }
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function validateWsToken(token: string | undefined): boolean {
  return Boolean(token);
}
