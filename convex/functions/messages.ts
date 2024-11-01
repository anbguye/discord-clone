

import { ConvexError, v } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { internal } from "../_generated/api";

export const list = authenticatedQuery({
  args: {
    directMessage: v.id("directMessages"),
  },
  handler: async (ctx, { directMessage }) => {

    const member = await userMessageAuthorization(ctx, directMessage);
    if (!member) throw new Error("You are not a member of this DM");

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_direct_message", (q) =>
        q.eq("directMessage", directMessage)
      )
      .collect();
    return await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.sender);
        return {
          ...msg,
          sender,
        };
      })
    );
  },
});

export const create = authenticatedMutation({
  args: {
    content: v.string(),
    directMessage: v.id("directMessages"),
  },
  handler: async (ctx, { content, directMessage }) => {
    const welcome = await userMessageAuthorization(ctx, directMessage);
    if (!welcome) throw new Error("You are not a member of this DM");
    await ctx.db.insert("messages", {
      sender: ctx.user._id,
      content: content,
      directMessage: directMessage,
    });
    await ctx.scheduler.runAfter(0, internal.functions.typing.remove, {
      directMessage,
      user: ctx.user._id,
    });
  },
});

const userMessageAuthorization = async (
  ctx: QueryCtx & { user: Doc<"users"> },
  directMessage: Id<"directMessages">
) => {
  const member = await ctx.db
    .query("directMessageMembers")
    .withIndex("by_direct_message_user", (q) =>
      q.eq("directMessage", directMessage).eq("user", ctx.user._id)
    )
    .first();
  if (!member) throw new ConvexError("You are not a member of this DM");
  else return true;
};

export const remove = authenticatedMutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, { id }) => {
    const message = await ctx.db.get(id);
    if (!message) throw new Error("Message not found");
    if (message.sender !== ctx.user._id)
      throw new Error("You are not the sender of this message");

    await ctx.db.delete(id);
  },
});
