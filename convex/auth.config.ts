import { ConvexAuth } from "convex/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

const CLERK_JWKS_URL = process.env.CLERK_JWKS_URL || "";
const jwks = CLERK_JWKS_URL ? createRemoteJWKSet(new URL(CLERK_JWKS_URL)) : null;

export default ConvexAuth({
  getUserIdentity: async (ctx) => {
    const authHeader = ctx.request?.headers?.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.slice("Bearer ".length);
    if (!token) return null;

    try {
      if (jwks) {
        const { payload } = await jwtVerify(token, jwks, {});
        return { token, ...payload } as any;
      }
    } catch (err) {
      console.error("Convex auth verify failed", err);
      return null;
    }
    return null;
  },
});
