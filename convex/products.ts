import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Public queries
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product || !product.isActive) {
      return null;
    }
    return product;
  },
});

// Admin queries and mutations
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
    return await ctx.db.query("products").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageUrl: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized");
    }
    
    return await ctx.db.insert("products", {
      ...args,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageUrl: v.string(),
    category: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized");
    }
    
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.delete(args.id);
  },
});

// Initialize sample products
export const initializeSampleProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existingProducts = await ctx.db.query("products").first();
    if (existingProducts) return;

    const sampleProducts = [
      {
        name: "Classic White Tee",
        description: "A timeless classic white t-shirt made from 100% cotton. Perfect for everyday wear.",
        price: 15.00,
        imageUrl: "https://placehold.co/400x400/E0E0E0/000000?text=White+Tee",
        category: "Basic",
        isActive: true,
      },
      {
        name: "Graphic Print Tee",
        description: "Express yourself with this stylish graphic print t-shirt. Comfortable and trendy.",
        price: 22.50,
        imageUrl: "https://placehold.co/400x400/333333/FFFFFF?text=Graphic+Tee",
        category: "Graphic",
        isActive: true,
      },
      {
        name: "V-Neck Basic Tee",
        description: "A versatile v-neck t-shirt that pairs well with any outfit. Soft and comfortable.",
        price: 18.00,
        imageUrl: "https://placehold.co/400x400/C0C0C0/000000?text=V-Neck+Tee",
        category: "Basic",
        isActive: true,
      },
    ];

    for (const product of sampleProducts) {
      await ctx.db.insert("products", product);
    }
  },
});
