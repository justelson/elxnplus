import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  media: defineTable({
    legacyId: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.union(v.string(), v.null())),
    type: v.union(v.literal("audio"), v.literal("video"), v.literal("document"), v.literal("note")),
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
  })
    .index("by_type", ["type"])
    .index("by_published", ["is_published"])
    .index("by_legacy_id", ["legacyId"]),
  adminSessions: defineTable({
    tokenHash: v.string(),
    email: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    lastSeenAt: v.number(),
  }).index("by_token_hash", ["tokenHash"]),
});
