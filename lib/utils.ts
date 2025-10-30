import { Camera, Color, Layer, LayerType, PathLayer, Point, Side, XYWH } from "@/types/canvas";
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



export function findIntersectingLayersWithRectangle(
  layersIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point,
){
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(b.x - a.x),
    height: Math.abs(b.y - a.y),
  };

  const ids = [];

  for (const layerId of layersIds) {
    const layer = layers.get(layerId);

    if (layer == null) {
      continue;
    }

    const { x,y , width, height } = layer;

    if ( 
      rect.x + rect.width > x &&
      rect.x < x + width &&
      rect.y + rect.height > y &&
      rect.y < y + height
    ) {
      ids.push(layerId);
    }
  }

  return ids;
}



export function getContrastingTextColor(color: Color){
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  return luminance > 182 ? "black" : "white";
}





export function penPointToPathLayer(
  points: number[][],
  color: Color,

): PathLayer {
  if (points.length < 2) {
    throw new Error("Cannot create PathLayer with less than 2 points");
  }

  let left = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;

    if (left > x) {
      left = x;
    }
    if (right < x) {
      right = x;
    }
    if (top > y) {
      top = y;
    }
    if (bottom < y) {
      bottom = y;
    }
  }

  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
};




export function getSvgPathFromStroke(stroke: number[][]) {
    if (!stroke.length) return "";

    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
}