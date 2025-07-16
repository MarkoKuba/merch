import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("Email already subscribed");
    }
    
    await ctx.db.insert("newsletterSubscribers", {
      email: args.email,
      subscribedAt: Date.now(),
    });
  },
});

// Admin function
async function isAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return false;
  
  const adminRecord = await ctx.db
    .query("adminUsers")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();
  
  return adminRecord?.isAdmin || false;
}

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized");
    }
    return await ctx.db.query("newsletterSubscribers").order("desc").collect();
  },
});
