"use client";
import { cn } from "@/lib/utils";
import { useOrganization } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {api} from "@/convex/_generated/api";

interface NewBoardButtonProps {
  orgId: string;
  disabled?: boolean;
}
export const NewBoardButton = ({
  orgId,
  disabled = false,
}: NewBoardButtonProps) => {

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
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
        disabled && "opacity-75 hover:bg-blue-600 cursor-not-allowed"
    )}
    >
    <div/>
    <Plus className="text-white h-12 w-12 stroke-1" />
    <p className="text-sm text-white font-light">
        New Board
    </p>
    </button>
  );
};
