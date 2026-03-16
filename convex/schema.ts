import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // High scores table
  highScores: defineTable({
    userId: v.id("users"),
    playerName: v.string(),
    score: v.number(),
    wave: v.number(),
    createdAt: v.number(),
  })
    .index("by_score", ["score"])
    .index("by_user", ["userId"]),

  // Game sessions for tracking active games
  gameSessions: defineTable({
    userId: v.id("users"),
    score: v.number(),
    wave: v.number(),
    isActive: v.boolean(),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_active", ["isActive"]),

  // Player profiles
  playerProfiles: defineTable({
    userId: v.id("users"),
    displayName: v.string(),
    totalGamesPlayed: v.number(),
    highestScore: v.number(),
    highestWave: v.number(),
    totalAliensDestroyed: v.number(),
  }).index("by_user", ["userId"]),
});
