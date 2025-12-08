import { ConvexAuth } from "convex/server";
import { createRemoteJWKSet, importSPKI, jwtVerify, type JWTPayload, type KeyLike } from "jose";

const CLERK_JWKS_URL = process.env.CLERK_JWKS_URL || "";
const CLERK_JWT_PUBLIC_KEY = process.env.CLERK_JWT_PUBLIC_KEY || "";
const DEV_MODE = process.env.DEV_MODE === "1";
const DEV_BEARER = process.env.DEV_BEARER || "dev-token";
const TOKEN_TEMPLATE = process.env.CLERK_JWT_TEMPLATE;

const jwks = CLERK_JWKS_URL ? createRemoteJWKSet(new URL(CLERK_JWKS_URL)) : null;
const staticKeyPromise: Promise<KeyLike> | null = CLERK_JWT_PUBLIC_KEY
  ? importSPKI(CLERK_JWT_PUBLIC_KEY, "RS256").catch((err) => {
      console.error("Convex auth: failed to import CLERK_JWT_PUBLIC_KEY", err);
      return null as any;
    })
  : null;

function toIdentity(payload: JWTPayload, token: string) {
  const subject = (payload as any).sub || (payload as any).user_id || (payload as any).sid;
  if (!subject) throw new Error("Invalid token payload: missing sub");
  return {
    tokenIdentifier: (payload as any).jti || `${subject}:${TOKEN_TEMPLATE || "default"}`,
    subject,
    ...payload,
    token,
  } as any;
}

export default ConvexAuth({
  getUserIdentity: async (ctx) => {
    const authHeader = ctx.request?.headers?.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.slice("Bearer ".length);
    if (!token) return null;

    // Allow an explicit dev bypass only when DEV_MODE is enabled and token matches
    if (DEV_MODE && token === DEV_BEARER) {
      return {
        tokenIdentifier: `dev:${DEV_BEARER}`,
        subject: "dev-user",
        dev: true,
      } as any;
    }

    try {
      if (jwks) {
        const { payload } = await jwtVerify(token, jwks, {});
        return toIdentity(payload, token);
      }

      if (staticKeyPromise) {
        const key = await staticKeyPromise;
        if (key) {
          const { payload } = await jwtVerify(token, key, {});
          return toIdentity(payload, token);
        }
      }
    } catch (err) {
      console.error("Convex auth verify failed", err);
      return null;
    }

    return null;
  },
});
