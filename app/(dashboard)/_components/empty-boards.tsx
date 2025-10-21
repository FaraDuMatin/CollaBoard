"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMutation } from "convex/react";
import {api} from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";

export const EmptyBoards = () => {
  const createBoard = useMutation(api.board.create);
  const {organization} = useOrganization();

  const onClick = () => {
    if (!organization) return;
    createBoard({ orgId: organization.id, title: "Untitled" })
      .then((id) => {
        toast.success("Board created ");
      })
      .catch((error) => {
        toast.error("Failed to create board");
      });
  };


  return (
    <div className="h-full flex flex-col items-center justify-center ">
      <Image
        src="/logo.png"
        alt="No boards found"
        width={110}
        height={110}
      />
      <h2 className="mt-4 text-2xl font-semibold">Create your first board</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a new board for your organization.
      </p>
      <div className="mt-6">
        <Button onClick={onClick} size="lg">
            Create Board
        </Button>
      </div>
    </div>
  );
};
