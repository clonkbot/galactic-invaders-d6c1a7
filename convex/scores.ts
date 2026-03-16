import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get top 10 high scores
export const getTopScores = query({
  args: {},
  handler: async (ctx) => {
    const scores = await ctx.db
      .query("highScores")
      .withIndex("by_score")
      .order("desc")
      .take(10);
    return scores;
  },
});

// Get user's personal best scores
export const getUserScores = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const scores = await ctx.db
      .query("highScores")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(5);
    return scores;
  },
});

// Submit a new high score
export const submitScore = mutation({
  args: {
    score: v.number(),
    wave: v.number(),
    playerName: v.string(),
    aliensDestroyed: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Add to high scores
    await ctx.db.insert("highScores", {
      userId,
      playerName: args.playerName,
      score: args.score,
      wave: args.wave,
      createdAt: Date.now(),
    });

    // Update or create player profile
    const existingProfile = await ctx.db
      .query("playerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        totalGamesPlayed: existingProfile.totalGamesPlayed + 1,
        highestScore: Math.max(existingProfile.highestScore, args.score),
        highestWave: Math.max(existingProfile.highestWave, args.wave),
        totalAliensDestroyed: existingProfile.totalAliensDestroyed + args.aliensDestroyed,
      });
    } else {
      await ctx.db.insert("playerProfiles", {
        userId,
        displayName: args.playerName,
        totalGamesPlayed: 1,
        highestScore: args.score,
        highestWave: args.wave,
        totalAliensDestroyed: args.aliensDestroyed,
      });
    }

    return { success: true };
  },
});

// Get player profile
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("playerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

// Get current active players count (users with active sessions)
export const getActivePlayers = query({
  args: {},
  handler: async (ctx) => {
    const activeSessions = await ctx.db
      .query("gameSessions")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    return activeSessions.length;
  },
});

// Start a game session
export const startGame = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // End any existing active sessions
    const activeSessions = await ctx.db
      .query("gameSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const session of activeSessions) {
      await ctx.db.patch(session._id, {
        isActive: false,
        endedAt: Date.now(),
      });
    }

    // Create new session
    const sessionId = await ctx.db.insert("gameSessions", {
      userId,
      score: 0,
      wave: 1,
      isActive: true,
      startedAt: Date.now(),
    });

    return sessionId;
  },
});

// End a game session
export const endGame = mutation({
  args: { sessionId: v.id("gameSessions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found");
    }

    await ctx.db.patch(args.sessionId, {
      isActive: false,
      endedAt: Date.now(),
    });

    return { success: true };
  },
});
