import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";
import { Id } from "../../_generated/dataModel";

type Identity = { subject: string };

async function requireIdentity(ctx: any): Promise<Identity> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || !identity.subject) {
    throw new Error("Unauthorized");
  }
  return { subject: identity.subject };
}

async function requireMeetingOwner(ctx: any, meetingId: Id<"meetings">) {
  const identity = await requireIdentity(ctx);
  const meeting = await ctx.db.get(meetingId);
  if (!meeting) throw new Error("Meeting not found");
  if (meeting.userId !== identity.subject) throw new Error("Forbidden");
  return { meeting, identity };
}

export const createMeeting = mutation({
  args: {
    title: v.string(),
    startedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { subject } = await requireIdentity(ctx);
    const meetingId = await ctx.db.insert("meetings", {
      title: args.title,
      userId: subject,
      startedAt: args.startedAt,
      notes: [],
      summary: "",
      speakerAliases: { me: "Me", them: "Them" },
      templateId: undefined,
      privacy: "private",
    });
    return meetingId;
  },
});

export const appendTurn = mutation({
  args: {
    meetingId: v.id("meetings"),
    channel: v.union(v.literal("mic"), v.literal("system")),
    speakerKey: v.string(),
    text: v.string(),
    ts: v.number(),
    source: v.union(v.literal("human"), v.literal("system"), v.literal("llm")),
  },
  handler: async (ctx, args) => {
    await requireMeetingOwner(ctx, args.meetingId);
    const turnId = await ctx.db.insert("turns", {
      meetingId: args.meetingId,
      channel: args.channel,
      speakerKey: args.speakerKey,
      text: args.text,
      ts: args.ts,
      source: args.source,
    });
    return turnId;
  },
});

export const renameSpeaker = mutation({
  args: {
    meetingId: v.id("meetings"),
    speakerKey: v.string(),
    alias: v.string(),
  },
  handler: async (ctx, args) => {
    const { meeting } = await requireMeetingOwner(ctx, args.meetingId);
    await ctx.db.patch(args.meetingId, { speakerAliases: { ...meeting.speakerAliases, [args.speakerKey]: args.alias } });
  },
});

export const setNotesAndSummary = mutation({
  args: {
    meetingId: v.id("meetings"),
    notes: v.array(v.string()),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    await requireMeetingOwner(ctx, args.meetingId);
    await ctx.db.patch(args.meetingId, {
      notes: args.notes,
      summary: args.summary,
    });
  },
});

export const resetMeeting = mutation({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    await requireMeetingOwner(ctx, args.meetingId);
    await ctx.db.patch(args.meetingId, { notes: [], summary: "" });
    const db: any = ctx.db;
    const turns = await db
      .query("turns")
      .withIndex("by_meeting_ts", (q: any) => q.eq("meetingId", args.meetingId))
      .collect();
    for (const t of turns) {
      await ctx.db.delete(t._id);
    }
  },
});

export const seedDemoMeeting = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { subject } = await requireIdentity(ctx);
    const meetingId = await ctx.db.insert("meetings", {
      title: "Demo Meeting",
      userId: subject,
      startedAt: Date.now(),
      notes: ["Decisions: Proceed with POC", "Actions: Send follow-up deck"],
      summary: "We agreed to move forward with a small POC and follow up with a deck.",
      speakerAliases: { me: "Me", them: "Them" },
      templateId: undefined,
      privacy: "private",
    });

    const demoTurns = [
      { speakerKey: "me", channel: "mic", text: "Hey, can you brief me on the meeting?", ts: Date.now() - 60000 },
      { speakerKey: "them", channel: "system", text: "We agreed to move forward with a small POC.", ts: Date.now() - 55000 },
      { speakerKey: "me", channel: "mic", text: "Any follow ups?", ts: Date.now() - 50000 },
      { speakerKey: "them", channel: "system", text: "Send the deck by tomorrow.", ts: Date.now() - 45000 },
    ];

    for (const turn of demoTurns) {
      await ctx.db.insert("turns", {
        meetingId,
        channel: turn.channel as "mic" | "system",
        speakerKey: turn.speakerKey,
        text: turn.text,
        ts: turn.ts,
        source: "human",
      });
    }

    return meetingId;
  },
});

export const getMeetingContext = query({
  args: {
    meetingId: v.id("meetings"),
    tail: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { meeting } = await requireMeetingOwner(ctx, args.meetingId);
    const tail = args.tail ?? 60;
    const db: any = ctx.db;
    const turns = await db
      .query("turns")
      .withIndex("by_meeting_ts", (q: any) => q.eq("meetingId", args.meetingId))
      .order("desc")
      .take(tail);
    return {
      speakerAliases: meeting.speakerAliases,
      summary: meeting.summary,
      notes: meeting.notes,
      turns: turns.map((t: any) => ({ speakerKey: t.speakerKey, text: t.text })).reverse(),
    };
  },
});
