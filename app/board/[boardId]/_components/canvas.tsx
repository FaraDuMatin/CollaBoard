"use client";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useHistory, 
  useSelf, 
  useCanRedo, 
  useCanUndo,
  useMutation
} from "@liveblocks/react/suspense";

import { useCallback, useState } from "react";
import { Camera, CanvasMode, CanvasState } from "@/types/canvas";
import { CursorPresence } from "./cursor-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";

const MAX_LAYERS = 20;

interface CanvasProps {
  boardId: string;

}


export const Canvas = ({boardId}:CanvasProps) => {
  
  const [canvasState, setCanvasState] = useState<CanvasState>({mode: CanvasMode.None });
  const info = useSelf((me) => me.info)
  
  const [camera, setCamera] = useState<Camera>({x:0, y:0});
  
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const onWheel = useCallback((e: React.WheelEvent) => {
    
    setCamera((prevCamera) => ({
      x: prevCamera.x - e.deltaX,
      y: prevCamera.y - e.deltaY,
    })); 
  }, []);

  const onPointerMove = useMutation((
    {setMyPresence},
     e:React.PointerEvent) => { 
      const current = pointerEventToCanvasPoint(e, camera);

      setMyPresence({ cursor: current });
    }, []);

    const onPointerLeave = useMutation((
      {setMyPresence},
       e:React.PointerEvent) => {
      setMyPresence({ cursor: null });
    }, []);

  return (
    <main className="h-full w-full relativ bg-neutral-100 touch-none">
      
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        undo={() => history.undo()}
        redo={() => history.redo()}
      />

      <svg
        className="h-[100vh] w-[100vw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, $(camera.y)px)`
          }}
        >
          <CursorPresence />
        </g>
      </svg>
    </main >
  )
}