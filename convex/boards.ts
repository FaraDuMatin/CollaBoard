import {v} from "convex/values";
import {getAll} from "convex-helpers/server/relationships";
import { query } from "./_generated/server";
import { getIdentityWithOrg } from "./utils";


export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string())
  },
    handler: async (ctx, args) => {
    const { identity, orgId } = await getIdentityWithOrg(ctx);
    // Token may lag behind the client's active org right after a switch
    if (args.orgId !== orgId) {
      return [];
    }

    if (args.favorites) {
      const favoritedBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .order("desc")
        .collect();
       
      const ids = favoritedBoards.map((fav) => fav.boardId);
      const boards = await getAll(ctx.db, ids);

      // Skip favorites pointing to deleted boards
      return boards.filter((board) => board !== null).map((board) => ({
        ...board,
        isFavorite: true,
      }));
    }
    const title = args.search as string;
    let boards: any[] = [];

    if(title) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q
            .search("title", title)
            .eq("orgId", args.orgId)
        )
        .collect();
    }
    else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    

    const boardsWithFavoritesRelation = boards.map((board) => {
      return ctx.db
      .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q
            .eq("userId", identity.subject)
            .eq("boardId", board._id)
        )
        .unique()
      .then((favorite) => {
        return {
          ...board,
          isFavorite: !!favorite,
        };
      });
    });
    const boardsWithFavoriteBoolean = Promise.all(boardsWithFavoritesRelation);
    return boardsWithFavoriteBoolean;
  },
});