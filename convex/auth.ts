/* eslint-disable @typescript-eslint/no-explicit-any */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

const toHex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const hashToken = async (token: string) => {
  const encoded = new TextEncoder().encode(token);
  return toHex(await crypto.subtle.digest("SHA-256", encoded));
};

const createToken = () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
};

const getAdminConfig = () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Admin auth is not configured");
  }

  return { email, password };
};

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, password } = getAdminConfig();

    if (args.email.trim().toLowerCase() !== email.trim().toLowerCase() || args.password !== password) {
      throw new Error("Invalid email or password");
    }

    const token = createToken();
    const now = Date.now();
    const expiresAt = now + SESSION_TTL_MS;

    await ctx.db.insert("adminSessions", {
      tokenHash: await hashToken(token),
      email,
      createdAt: now,
      expiresAt,
      lastSeenAt: now,
    });

    return { token, email, expiresAt };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const tokenHash = await hashToken(args.token);
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
      .unique();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const getSession = query({
  args: { token: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const tokenHash = await hashToken(args.token);
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
      .unique();

    if (!session || session.expiresAt <= Date.now()) return null;

    return {
      email: session.email,
      isAdmin: true,
      expiresAt: session.expiresAt,
    };
  },
});

export const refreshSession = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const tokenHash = await hashToken(args.token);
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", tokenHash))
      .unique();

    if (!session || session.expiresAt <= Date.now()) return null;

    const now = Date.now();
    const expiresAt = now + SESSION_TTL_MS;
    await ctx.db.patch(session._id, { lastSeenAt: now, expiresAt });

    return {
      email: session.email,
      isAdmin: true,
      expiresAt,
    };
  },
});

export const requireAdmin = async (ctx: { db: any }, token?: string) => {
  if (!token) throw new Error("Unauthorized");

  const tokenHash = await hashToken(token);
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token_hash", (q: any) => q.eq("tokenHash", tokenHash))
    .unique();

  if (!session || session.expiresAt <= Date.now()) {
    throw new Error("Unauthorized");
  }

  return session;
};
