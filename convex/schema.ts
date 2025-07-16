import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageUrl: v.string(),
    category: v.string(),
    isActive: v.boolean(),
  }).index("by_category", ["category"]),

  cartItems: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    productId: v.id("products"),
    quantity: v.number(),
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),

  orders: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    customerAddress: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    totalAmount: v.number(),
    status: v.string(), // "pending", "confirmed", "shipped", "delivered"
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_status", ["status"]),

  newsletterSubscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
  }).index("by_email", ["email"]),

  adminUsers: defineTable({
    userId: v.id("users"),
    isAdmin: v.boolean(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
