"use client"

import { useStorage } from "@liveblocks/react/suspense";
import { memo } from "react";
import { LayerType } from "@/types/canvas";
import { Rectangle } from "./rectangle";



interface LayerPreviewProps {
    id: string;
    onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
    selectionColor: string | null;
};



export const LayerPreview = memo(({ 
    id, 
    onLayerPointerDown, 
    selectionColor 
}: LayerPreviewProps) => {
    
   

    const layer = useStorage((root) => root.layers.get(id)!);
    

    if (!layer) {
        return null;
    }

    switch (layer.type) {
        case LayerType.Rectangle:
            return (
                <Rectangle
                    id={id}
                    layer={layer}
                    onPointerDown={onLayerPointerDown}
                    selectionColor={selectionColor}
                />
            )
        default:
            console.log("Unknown layer type in LayerPreview:", layer.type);
            return null;
    }

    return <div>Layer Preview</div>;

});


LayerPreview.displayName = "LayerPreview";