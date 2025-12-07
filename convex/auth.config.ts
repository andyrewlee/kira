import { ConvexAuth } from "convex/server";

export default ConvexAuth({
  getUserIdentity: async (ctx) => {
    const authHeader = ctx.request?.headers?.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.slice("Bearer ".length);
    if (!token) return null;
    return { token } as any;
  },
});
