import { QueryCtx } from "./_generated/server";

// Requires the Clerk "convex" JWT template to include: "org_id": "{{org.id}}"
export const getIdentityWithOrg = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }
  const orgId = identity.org_id;
  if (typeof orgId !== "string" || !orgId) {
    throw new Error("No active organization");
  }
  return { identity, orgId };
};

export const validateTitle = (raw: string) => {
  const title = raw.trim();
  if (!title) {
    throw new Error("Title cannot be empty");
  }
  if (title.length > 60) {
    throw new Error("Title cannot be longer than 60 characters");
  }
  return title;
};
