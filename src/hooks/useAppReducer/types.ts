import type { IconInfo } from "@/components/IconSelector";
import type Konva from "konva";

export type TextAlign = "left" | "center" | "right";

export type CanvasObject = {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  width?: number;
  height?: number;
} & (IconObject | TextObject);

export type TextObject = {
  type: "text";
  fontSize: number;
  fill: string;
  align: "left" | "center" | "right";
  lineHeight: number;
  text: string;
};

export type IconObject = {
  type: "icon";
  width: number;
  height: number;
  iconInfo: IconInfo;
  imageElement: Konva.Image;
};

export type AppState = {
  sdgNumber: string;
  sdgText: string;
  selectedColor: string;
  textAlign: TextAlign;
  lineHeight: number;
  selectedObjectId: string | null;
  canvasObjects: CanvasObject[];
};

export type AppAction =
  | { type: "SET_SDG_NUMBER"; payload: string }
  | { type: "SET_SDG_TEXT"; payload: string }
  | { type: "SET_SELECTED_COLOR"; payload: string }
  | { type: "SET_TEXT_ALIGN"; payload: TextAlign }
  | { type: "SET_LINE_HEIGHT"; payload: number }
  | { type: "SET_SELECTED_OBJECT_ID"; payload: string | null }
  | {
      type: "ADD_ICON_TO_CANVAS";
      payload: {
        iconInfo: IconInfo;
        imageElement: Konva.Image;
      };
    }
  | {
      type: "UPDATE_CANVAS_OBJECT";
      payload: { id: string; updates: Partial<CanvasObject> };
    }
  | { type: "DELETE_CANVAS_OBJECT"; payload: string }
  | { type: "RESET_POSITIONS_AND_STYLES" };
