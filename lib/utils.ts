import { Camera } from "@/types/canvas";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const COLORS = [ "#F87171", "#60A5FA", "#34D399", "#FBBF24", "#A78BFA", "#F472B6" ]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}


export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera,
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}