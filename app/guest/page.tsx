"use client";

import { Canvas } from "@/app/board/[boardId]/_components/canvas";
import { Loading } from "@/app/board/[boardId]/_components/loading";
import { LocalRoom } from "@/lib/local-board";

// Board that works without an account: stored in this browser only
const GuestPage = () => {
  return (
    <LocalRoom fallback={<Loading />}>
      <Canvas boardId="guest" isGuest />
    </LocalRoom>
  );
};

export default GuestPage;
