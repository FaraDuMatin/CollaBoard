"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/confirm-modal";
import { clearGuestBoard, readGuestBoard } from "@/lib/local-board";

interface SaveGuestBoardProps {
  orgId: string;
}

// Offers to keep the board drawn before signing up
export const SaveGuestBoard = ({ orgId }: SaveGuestBoardProps) => {
  const router = useRouter();
  const createBoard = useMutation(api.board.create);
  const [hasGuestBoard, setHasGuestBoard] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setHasGuestBoard((readGuestBoard()?.layerIds.length ?? 0) > 0);
  }, []);

  if (!hasGuestBoard) return null;

  const onSave = () => {
    setPending(true);
    createBoard({ orgId, title: "Guest board" })
      .then((id) => {
        router.push(`/board/${id}?import=guest`);
      })
      .catch(() => {
        toast.error("Failed to save guest board");
        setPending(false);
      });
  };

  const onDiscard = () => {
    clearGuestBoard();
    setHasGuestBoard(false);
  };

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-md border border-blue-200 bg-blue-50 p-4">
      <p className="text-sm text-blue-900">
        You have a board from your guest session. Save it to this team?
      </p>
      <div className="flex gap-2">
        <ConfirmModal
          header="Discard guest board?"
          description="This permanently deletes the board you drew as a guest."
          onConfirm={onDiscard}
          disabled={pending}
        >
          <Button variant="ghost" size="sm" disabled={pending}>
            Discard
          </Button>
        </ConfirmModal>
        <Button size="sm" onClick={onSave} disabled={pending}>
          Save board
        </Button>
      </div>
    </div>
  );
};
