import type { AppState } from "./types";

export const DEFAULT_CANVAS_SIZE = 384;

export const DEFAULT_POSITIONS = {
  SDG_NUMBER: { x: 60, y: 90, width: 300, height: 128 },
  SDG_TEXT: { x: 140, y: 90, width: 300, height: 60 },
  ICON_DEFAULT: { x: 192, y: 300, width: 120, height: 120 },
  ICON_NEW: { x: 192, y: 288, width: 120, height: 120 },
} as const;

export const DEFAULT_STYLES = {
  SDG_NUMBER: { fontSize: 128, fill: "white" },
  SDG_TEXT: {
    fontSize: 24,
    fill: "white",
    align: "left" as const,
    lineHeight: 1.2,
  },
  TRANSFORM: { rotation: 0, scaleX: 1, scaleY: 1 },
} as const;

export const DEFAULT_APP_STATE = {
  sdgNumber: "1",
  sdgText: "貧困を\nなくそう",
  selectedColor: "#E5243B",
  textAlign: "left" as const,
  lineHeight: 1.2,
} as const;

export const initialState: AppState = {
  sdgNumber: DEFAULT_APP_STATE.sdgNumber,
  sdgText: DEFAULT_APP_STATE.sdgText,
  selectedColor: DEFAULT_APP_STATE.selectedColor,
  textAlign: DEFAULT_APP_STATE.textAlign,
  lineHeight: DEFAULT_APP_STATE.lineHeight,
  selectedObjectId: null,
  canvasObjects: [
    {
      id: "sdg-number",
      type: "text",
      ...DEFAULT_POSITIONS.SDG_NUMBER,
      ...DEFAULT_STYLES.TRANSFORM,
      text: DEFAULT_APP_STATE.sdgNumber,
      ...DEFAULT_STYLES.SDG_NUMBER,
    },
    {
      id: "sdg-text",
      type: "text",
      ...DEFAULT_POSITIONS.SDG_TEXT,
      ...DEFAULT_STYLES.TRANSFORM,
      text: DEFAULT_APP_STATE.sdgText,
      ...DEFAULT_STYLES.SDG_TEXT,
      align: DEFAULT_APP_STATE.textAlign,
      lineHeight: DEFAULT_APP_STATE.lineHeight,
    },
  ],
};
