import {mutation, query} from "./_generated/server";
import {v} from "convex/values";
import {getIdentityWithOrg, validateTitle} from "./utils";

const images = [
    "/placeholders/1.svg",
    "/placeholders/2.svg",
    "/placeholders/3.svg",
    "/placeholders/4.svg",
    "/placeholders/5.svg",
    "/placeholders/6.svg",
    "/placeholders/7.svg",
    "/placeholders/8.svg",
    "/placeholders/9.svg",
];
export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
},
  handler: async (ctx, args) => {
    const { identity, orgId } = await getIdentityWithOrg(ctx);
    if (args.orgId !== orgId) {
      throw new Error("Unauthorized");
    }
    const title = validateTitle(args.title);
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const board = await ctx.db.insert("boards", {
      title,
      orgId,
      authorId: identity.subject,
      authorName: identity.name ?? "Teammate",
      imageUrl: randomImage,
    });
    return board;
  },
});

export const remove = mutation({
  args: {id: v.id("boards")},
  handler: async (ctx, args) => {
    const { orgId } = await getIdentityWithOrg(ctx);
    const board = await ctx.db.get(args.id);
    if (!board || board.orgId !== orgId) {
      throw new Error("Board not found");
    }

    // Delete every user's favorite of this board
    const favorites = await ctx.db.query("userFavorites")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .collect();
    for (const favorite of favorites) {
      await ctx.db.delete(favorite._id);
    }
    await ctx.db.delete(args.id);
  },

});


export const update = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId } = await getIdentityWithOrg(ctx);
    const title = validateTitle(args.title);

    const existing = await ctx.db.get(args.id);
    if (!existing || existing.orgId !== orgId) {
      throw new Error("Board not found");
    }

    await ctx.db.patch(args.id, { title });
    return args.id;
  }
});


export const favorite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (ctx, args) => {
    const { identity, orgId } = await getIdentityWithOrg(ctx);
    const board = await ctx.db.get(args.id);

    if (!board || board.orgId !== orgId || args.orgId !== orgId) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db.query("userFavorites")
      .withIndex("by_user_board_org", (q) =>
        q
        .eq("userId", userId)
        .eq("boardId", board._id)
        .eq("orgId", orgId)
      )
      .unique();
    if (existingFavorite) {
      throw new Error("Board already favorited");
    }
    await ctx.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId,
    });
    return board;
  }
});



export const unfavorite = mutation({
  args: { id: v.id("boards")},
  handler: async (ctx, args) => {
    const { identity, orgId } = await getIdentityWithOrg(ctx);
    const board = await ctx.db.get(args.id);

    if (!board || board.orgId !== orgId) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db.query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q
        .eq("userId", userId)
        .eq("boardId", board._id)
      )
      .unique();
    if (!existingFavorite) {
      throw new Error("Favorited board not found");
    }
    await ctx.db.delete(existingFavorite._id);
    return board;
  }
});

export const get = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const { orgId } = await getIdentityWithOrg(ctx);
    const board = await ctx.db.get(args.id);
    if (!board || board.orgId !== orgId) {
      return null;
    }
    return board;
  },
});
