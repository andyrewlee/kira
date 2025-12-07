import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  meetings: defineTable({
    userId: v.string(),
    title: v.string(),
    startedAt: v.number(),
    notes: v.array(v.string()),
    summary: v.string(),
    speakerAliases: v.record(v.string(), v.string()),
    templateId: v.optional(v.string()),
    privacy: v.optional(v.union(v.literal("private"), v.literal("shared"))),
  }).index("by_user", ["userId"]),

  turns: defineTable({
    meetingId: v.id("meetings"),
    channel: v.union(v.literal("mic"), v.literal("system")),
    speakerKey: v.string(),
    text: v.string(),
    ts: v.number(),
    source: v.union(v.literal("human"), v.literal("system"), v.literal("llm")),
  }).index("by_meeting_ts", ["meetingId", "ts"]),
}, { strictTableNameTypes: true });
