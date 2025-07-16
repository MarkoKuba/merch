import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const makeFirstUserAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Check if any admin exists
    const existingAdmin = await ctx.db.query("adminUsers").first();
    if (existingAdmin) {
      throw new Error("Admin already exists");
    }

    // Make this user admin
    await ctx.db.insert("adminUsers", {
      userId,
      isAdmin: true,
    });
  },
});

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    
    const adminRecord = await ctx.db
      .query("adminUsers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    return adminRecord?.isAdmin || false;
  },
});

export const hasAdmin = query({
  args: {},
  handler: async (ctx) => {
    const admin = await ctx.db.query("adminUsers").first();
    return !!admin;
  },
});
