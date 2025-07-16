import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCart = query({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    let cartItems;
    if (userId) {
      cartItems = await ctx.db
        .query("cartItems")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    } else if (args.sessionId) {
      cartItems = await ctx.db
        .query("cartItems")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
    } else {
      return [];
    }

    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return cartWithProducts.filter(item => item.product);
  },
});

export const addToCart = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    // Check if item already exists in cart
    let existingItem;
    if (userId) {
      existingItem = await ctx.db
        .query("cartItems")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .filter((q) => q.eq(q.field("productId"), args.productId))
        .first();
    } else if (args.sessionId) {
      existingItem = await ctx.db
        .query("cartItems")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .filter((q) => q.eq(q.field("productId"), args.productId))
        .first();
    }

    if (existingItem) {
      // Update quantity
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
      });
    } else {
      // Add new item
      await ctx.db.insert("cartItems", {
        userId: userId || undefined,
        sessionId: args.sessionId,
        productId: args.productId,
        quantity: args.quantity,
      });
    }
  },
});

export const updateQuantity = mutation({
  args: {
    itemId: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.quantity <= 0) {
      await ctx.db.delete(args.itemId);
    } else {
      await ctx.db.patch(args.itemId, { quantity: args.quantity });
    }
  },
});

export const removeFromCart = mutation({
  args: { itemId: v.id("cartItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.itemId);
  },
});

export const clearCart = mutation({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    let cartItems;
    if (userId) {
      cartItems = await ctx.db
        .query("cartItems")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
    } else if (args.sessionId) {
      cartItems = await ctx.db
        .query("cartItems")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
    } else {
      return;
    }

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }
  },
});
