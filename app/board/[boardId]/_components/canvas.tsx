"use client";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useSelf } from "@liveblocks/react/suspense";

interface CanvasProps {
  boardId: string;

}

export const Canvas = ({boardId}:CanvasProps) => {
  const info = useSelf((me) => me.info)
   

  return (
    <main className="h-full w-full relativ bg-neutral-100 touch-none">
      
      <Info />
      <Participants />
      <Toolbar />
    </main >
  )
}