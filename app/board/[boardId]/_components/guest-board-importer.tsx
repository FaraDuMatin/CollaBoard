"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LiveObject } from "@liveblocks/client";

import { useMutation } from "@/lib/board-hooks";
import { clearGuestBoard, GuestBoardData, readGuestBoard } from "@/lib/local-board";

// Copies the guest board into this board when opened with ?import=guest
export const GuestBoardImporter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const importLayers = useMutation(({ storage }, data: GuestBoardData) => {
    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");

    // Only import into an empty board, so a reload can't duplicate layers
    if (liveLayerIds.length > 0) return;

    for (const id of data.layerIds) {
      const layer = data.layers[id];
      if (!layer) continue;
      liveLayers.set(id, new LiveObject(layer));
      liveLayerIds.push(id);
    }
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("import") !== "guest") return;

    const data = readGuestBoard();
    if (data) {
      importLayers(data);
      clearGuestBoard();
    }
    router.replace(pathname);
  }, [importLayers, pathname, router]);

  return null;
};
