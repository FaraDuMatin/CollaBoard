import { Camera, Color, Point, Side, XYWH } from "@/types/canvas";
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


export function colorToCss(color: Color): string {
  return `#${color.r.toString(16).padStart(2,"0")}${color.g.toString(16).padStart(2,"0")}${color.b.toString(16).padStart(2,"0")}`;
}





export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
    const result = { ...bounds };

    // Single sides
    if (corner === Side.Left) {
        result.x = Math.min(bounds.x + bounds.width, point.x);
        result.width = Math.abs(bounds.x + bounds.width - point.x);
    }
    else if (corner === Side.Right) {
        result.width = Math.abs(point.x - bounds.x);
    }
    else if (corner === Side.Top) {
        result.y = Math.min(bounds.y + bounds.height, point.y);
        result.height = Math.abs(bounds.y + bounds.height - point.y);
    }
    else if (corner === Side.Bottom) {
        result.height = Math.abs(point.y - bounds.y);
    }
    // Corner combinations
    else if (corner === (Side.Top | Side.Left)) {
        // Top-Left corner
        result.x = Math.min(bounds.x + bounds.width, point.x);
        result.width = Math.abs(bounds.x + bounds.width - point.x);
        result.y = Math.min(bounds.y + bounds.height, point.y);
        result.height = Math.abs(bounds.y + bounds.height - point.y);
    }
    else if (corner === (Side.Top | Side.Right)) {
        // Top-Right corner
        result.width = Math.abs(point.x - bounds.x);
        result.y = Math.min(bounds.y + bounds.height, point.y);
        result.height = Math.abs(bounds.y + bounds.height - point.y);
    }
    else if (corner === (Side.Bottom | Side.Left)) {
        // Bottom-Left corner
        result.x = Math.min(bounds.x + bounds.width, point.x);
        result.width = Math.abs(bounds.x + bounds.width - point.x);
        result.height = Math.abs(point.y - bounds.y);
    }
    else if (corner === (Side.Bottom | Side.Right)) {
        // Bottom-Right corner
        result.width = Math.abs(point.x - bounds.x);
        result.height = Math.abs(point.y - bounds.y);
    }

    return result;
}


