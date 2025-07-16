import { query, mutation, action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";

export const create = mutation({
  args: {
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
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    const orderId = await ctx.db.insert("orders", {
      userId: userId || undefined,
      sessionId: args.sessionId,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      customerAddress: args.customerAddress,
      items: args.items,
      totalAmount: args.totalAmount,
      status: "pending",
    });

    // Schedule email sending
    await ctx.scheduler.runAfter(0, internal.orders.sendOrderConfirmation, {
      orderId,
    });

    return orderId;
  },
});

export const sendOrderConfirmation = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(api.orders.get, { id: args.orderId });
    if (!order) return;

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.CONVEX_RESEND_API_KEY);

      const itemsList = order.items
        .map(item => `${item.productName} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
        .join('\n');

      const emailHtml = `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order, ${order.customerName}!</p>
        
        <h3>Order Details:</h3>
        <pre>${itemsList}</pre>
        
        <p><strong>Total: $${order.totalAmount.toFixed(2)}</strong></p>
        
        <h3>Delivery Information:</h3>
        <p>Phone: ${order.customerPhone}</p>
        <p>Address: ${order.customerAddress}</p>
        
        <p>Your order will be delivered within 3-5 business days. Payment will be collected upon delivery.</p>
        
        <p>Thank you for shopping with us!</p>
      `;

      await resend.emails.send({
        from: "T-Shirt Store <orders@tshirtstore.com>",
        to: order.customerEmail,
        subject: "Order Confirmation - T-Shirt Store",
        html: emailHtml,
      });
    } catch (error) {
      console.error("Failed to send order confirmation email:", error);
    }
  },
});

export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Admin functions
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
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});

export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      throw new Error("Unauthorized");
    }
    
    const orders = await ctx.db.query("orders").collect();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    return {
      totalOrders,
      totalRevenue,
    };
  },
});
