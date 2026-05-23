/* eslint-disable @typescript-eslint/no-explicit-any */
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

const mediaType = v.union(v.literal("audio"), v.literal("video"), v.literal("document"), v.literal("note"));
const visibilityFilter = v.union(v.literal("public"), v.literal("private"), v.literal("all"));

const requireMigrationSecret = (provided?: string) => {
  const expected = process.env.MIGRATION_SECRET;
  if (!expected || provided !== expected) {
    throw new Error("Unauthorized import");
  }
};

const serializeMedia = async (ctx: any, item: any) => ({
  id: item._id,
  title: item.title,
  description: item.description ?? null,
  type: item.type,
  file_url: item.storageId ? await ctx.storage.getUrl(item.storageId) : item.legacyFileUrl ?? null,
  thumbnail_url: item.thumbnailStorageId
    ? await ctx.storage.getUrl(item.thumbnailStorageId)
    : item.legacyThumbnailUrl ?? null,
  content: item.content ?? null,
  file_size: item.file_size ?? null,
  duration: item.duration ?? null,
  download_count: item.download_count,
  view_count: item.view_count,
  is_published: item.is_published,
  is_private: item.is_private ?? false,
  created_at: item.created_at,
  updated_at: item.updated_at,
});

export const list = query({
  args: {
    type: v.optional(mediaType),
    visibility: v.optional(visibilityFilter),
    sessionToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const isAdmin = args.sessionToken ? !!(await requireAdmin(ctx, args.sessionToken).catch(() => null)) : false;
    const visibility = args.visibility ?? "public";

    const rows = args.type
      ? await ctx.db
          .query("media")
          .withIndex("by_type", (q) => q.eq("type", args.type!))
          .collect()
      : await ctx.db.query("media").collect();

    const visible = rows
      .filter((item) => item.is_published)
      .filter((item) => {
        const isPrivate = item.is_private ?? false;

        if (!isAdmin) return !isPrivate;
        if (visibility === "private") return isPrivate;
        if (visibility === "public") return !isPrivate;
        return true;
      })
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

    return Promise.all(visible.map((item) => serializeMedia(ctx, item)));
  },
});

export const generateUploadUrl = mutation({
  args: { secret: v.string() },
  handler: async (ctx, args) => {
    requireMigrationSecret(args.secret);
    return await ctx.storage.generateUploadUrl();
  },
});

export const importMedia = mutation({
  args: {
    secret: v.string(),
    legacyId: v.string(),
    title: v.string(),
    description: v.optional(v.union(v.string(), v.null())),
    type: mediaType,
    storageId: v.optional(v.id("_storage")),
    thumbnailStorageId: v.optional(v.id("_storage")),
    legacyFileUrl: v.optional(v.union(v.string(), v.null())),
    legacyThumbnailUrl: v.optional(v.union(v.string(), v.null())),
    content: v.optional(v.union(v.string(), v.null())),
    file_size: v.optional(v.union(v.number(), v.null())),
    duration: v.optional(v.union(v.number(), v.null())),
    download_count: v.number(),
    view_count: v.number(),
    is_published: v.boolean(),
    is_private: v.optional(v.boolean()),
    created_at: v.string(),
    updated_at: v.string(),
  },
  handler: async (ctx, args) => {
    requireMigrationSecret(args.secret);

    const existing = await ctx.db
      .query("media")
      .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.legacyId))
      .unique();

    const data = {
      legacyId: args.legacyId,
      title: args.title,
      description: args.description ?? null,
      type: args.type,
      storageId: args.storageId,
      thumbnailStorageId: args.thumbnailStorageId,
      legacyFileUrl: args.legacyFileUrl ?? null,
      legacyThumbnailUrl: args.legacyThumbnailUrl ?? null,
      content: args.content ?? null,
      file_size: args.file_size ?? null,
      duration: args.duration ?? null,
      download_count: args.download_count,
      view_count: args.view_count,
      is_published: args.is_published,
      is_private: args.is_private ?? false,
      created_at: args.created_at,
      updated_at: args.updated_at,
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }

    return await ctx.db.insert("media", data);
  },
});

export const setPrivate = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("media"),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionToken);
    await ctx.db.patch(args.id, {
      is_private: args.isPrivate,
      updated_at: new Date().toISOString(),
    });
  },
});

export const incrementViewCount = mutation({
  args: { id: v.id("media"), sessionToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || !item.is_published) return;

    const isPrivate = item.is_private ?? false;
    if (isPrivate) {
      await requireAdmin(ctx, args.sessionToken);
    }

    await ctx.db.patch(args.id, { view_count: item.view_count + 1 });
  },
});

export const incrementDownloadCount = mutation({
  args: { id: v.id("media"), sessionToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item || !item.is_published) return;

    const isPrivate = item.is_private ?? false;
    if (isPrivate) {
      await requireAdmin(ctx, args.sessionToken);
    }

    await ctx.db.patch(args.id, { download_count: item.download_count + 1 });
  },
});
