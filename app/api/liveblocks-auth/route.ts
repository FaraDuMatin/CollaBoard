import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth,currentUser } from "@clerk/nextjs/server";

import { api } from "@/convex/_generated/api";

const liveblocks = new Liveblocks({
  secret: process.env.NEXT_SECRET_LIVEBLOCKS_PRIVATE_KEY!,
});        

export async function POST(request: Request) {
  // Get the current user from your database
  const user = await currentUser();
  const authorization = await auth();

    if (!user || !authorization.userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!authorization.orgId) {
    return new Response("Forbidden", { status: 403 });
  }

  const { room } = await request.json();
  if (!room) {
    return new Response("Bad Request", { status: 400 });
  }

  // board.get requires auth, so forward the user's Convex token
  const token = await authorization.getToken({ template: "convex" });
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  convex.setAuth(token);

  let board;
  try {
    board = await convex.query(api.board.get, { id: room });
  } catch {
    return new Response("Forbidden", { status: 403 });
  }

  if (!board || board.orgId !== authorization.orgId) {
    return new Response("Forbidden", { status: 403 });
  }

  const userInfo = {
    name: user.firstName || "Teammate",
    picture: user.imageUrl!,
    };


  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user.id,
    { userInfo: userInfo } 
  );

  session.allow(room, session.FULL_ACCESS);


  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user read access on their org, and write access on their group
//   session.allow(`${user.organization}:*`, session.READ_ACCESS);
//   session.allow(`${user.organization}:${user.group}:*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}