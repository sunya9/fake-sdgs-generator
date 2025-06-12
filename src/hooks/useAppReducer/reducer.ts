import type { AppState, AppAction, CanvasObject } from "./types";
import {
  DEFAULT_POSITIONS,
  DEFAULT_STYLES,
  DEFAULT_APP_STATE,
} from "./constants";

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_SDG_NUMBER":
      return {
        ...state,
        sdgNumber: action.payload,
        canvasObjects: state.canvasObjects.map((obj) =>
          obj.id === "sdg-number" ? { ...obj, text: action.payload } : obj,
        ),
      };
    case "SET_SDG_TEXT":
      return {
        ...state,
        sdgText: action.payload,
        canvasObjects: state.canvasObjects.map((obj) =>
          obj.id === "sdg-text" ? { ...obj, text: action.payload } : obj,
        ),
      };
    case "SET_SELECTED_COLOR":
      return { ...state, selectedColor: action.payload };
    case "SET_TEXT_ALIGN":
      return {
        ...state,
        textAlign: action.payload,
        canvasObjects: state.canvasObjects.map((obj) =>
          obj.id === "sdg-text" ? { ...obj, align: action.payload } : obj,
        ),
      };
    case "SET_LINE_HEIGHT":
      return {
        ...state,
        lineHeight: action.payload,
        canvasObjects: state.canvasObjects.map((obj) =>
          obj.id === "sdg-text" ? { ...obj, lineHeight: action.payload } : obj,
        ),
      };
    case "ADD_ICON_TO_CANVAS": {
      const { iconInfo, imageElement } = action.payload;
      const newObject: CanvasObject = {
        id: `icon-${Date.now()}-${Math.random()}`,
        type: "icon",
        ...DEFAULT_POSITIONS.ICON_NEW,
        ...DEFAULT_STYLES.TRANSFORM,
        iconInfo,
        imageElement,
      };
      return {
        ...state,
        canvasObjects: [...state.canvasObjects, newObject],
      };
    }
    case "UPDATE_CANVAS_OBJECT":
      return {
        ...state,
        canvasObjects: state.canvasObjects.map((obj) =>
          obj.id === action.payload.id
            ? { ...obj, ...action.payload.updates }
            : obj,
        ),
      };
    case "DELETE_CANVAS_OBJECT":
      return {
        ...state,
        canvasObjects: state.canvasObjects.filter(
          (obj) => obj.id !== action.payload,
        ),
      };
    case "RESET_POSITIONS_AND_STYLES":
      return {
        ...state,
        textAlign: DEFAULT_APP_STATE.textAlign,
        lineHeight: DEFAULT_APP_STATE.lineHeight,
        canvasObjects: state.canvasObjects.map((obj) => {
          if (obj.id === "sdg-number") {
            return {
              ...obj,
              ...DEFAULT_POSITIONS.SDG_NUMBER,
              ...DEFAULT_STYLES.TRANSFORM,
              ...DEFAULT_STYLES.SDG_NUMBER,
            };
          }
          if (obj.id === "sdg-text") {
            return {
              ...obj,
              ...DEFAULT_POSITIONS.SDG_TEXT,
              ...DEFAULT_STYLES.TRANSFORM,
              ...DEFAULT_STYLES.SDG_TEXT,
              align: DEFAULT_APP_STATE.textAlign,
              lineHeight: DEFAULT_APP_STATE.lineHeight,
            };
          }
          if (obj.type === "icon") {
            return {
              ...obj,
              ...DEFAULT_POSITIONS.ICON_DEFAULT,
              ...DEFAULT_STYLES.TRANSFORM,
            };
          }
          return obj;
        }),
      };
    default:
      return state;
  }
}
