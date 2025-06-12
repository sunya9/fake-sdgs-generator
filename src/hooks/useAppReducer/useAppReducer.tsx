import type { IconInfo } from "@/components/IconSelector";
import Konva from "konva";
import { useReducer, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { initialState } from "./constants";
import { appReducer } from "./reducer";
import type { TextAlign, CanvasObject } from "./types";

export function useAppReducer() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setSdgNumber = useCallback((value: string) => {
    dispatch({ type: "SET_SDG_NUMBER", payload: value });
  }, []);

  const setSdgText = useCallback((value: string) => {
    dispatch({ type: "SET_SDG_TEXT", payload: value });
  }, []);

  const setSelectedColor = useCallback((value: string) => {
    dispatch({ type: "SET_SELECTED_COLOR", payload: value });
  }, []);

  const setTextAlign = useCallback((value: TextAlign) => {
    dispatch({ type: "SET_TEXT_ALIGN", payload: value });
  }, []);

  const setLineHeight = useCallback((value: number) => {
    dispatch({ type: "SET_LINE_HEIGHT", payload: value });
  }, []);

  const addIconToCanvas = useCallback((iconInfo: IconInfo) => {
    // Create a temporary container to render the SVG
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.top = "-9999px";
    tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);

    // Render the icon
    const root = ReactDOM.createRoot(tempContainer);
    const IconComponent = iconInfo.component;
    root.render(<IconComponent fill="white" />);

    // Wait for render and extract SVG
    setTimeout(() => {
      const svgElement = tempContainer.querySelector("svg");
      if (svgElement) {
        // Convert SVG to blob
        const svgString = svgElement.outerHTML;
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        // Create Konva Image
        Konva.Image.fromURL(url, (imageElement) => {
          URL.revokeObjectURL(url);
          root.unmount();
          document.body.removeChild(tempContainer);

          dispatch({
            type: "ADD_ICON_TO_CANVAS",
            payload: { iconInfo, imageElement },
          });
        });
      }
    }, 0);
  }, []);

  const updateCanvasObject = useCallback(
    (id: string, updates: Partial<CanvasObject>) => {
      dispatch({ type: "UPDATE_CANVAS_OBJECT", payload: { id, updates } });
    },
    [],
  );

  const deleteCanvasObject = useCallback((id: string) => {
    dispatch({ type: "DELETE_CANVAS_OBJECT", payload: id });
  }, []);

  const resetPositionsAndStyles = useCallback(() => {
    dispatch({ type: "RESET_POSITIONS_AND_STYLES" });
  }, []);

  // Event handlers for form inputs
  const handleSdgNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSdgNumber(e.target.value);
    },
    [setSdgNumber],
  );

  const handleSdgTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setSdgText(e.target.value);
    },
    [setSdgText],
  );

  const handleColorChange = useCallback(
    (color: { hex: string }) => {
      setSelectedColor(color.hex);
    },
    [setSelectedColor],
  );

  const handleTextAlignChange = useCallback(
    (value: string) => {
      setTextAlign(value as TextAlign);
    },
    [setTextAlign],
  );

  const handleLineHeightChange = useCallback(
    (values: number[]) => {
      setLineHeight(values[0]);
    },
    [setLineHeight],
  );

  // Canvas event handlers
  const handleObjectDragEnd = useCallback(
    (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
      updateCanvasObject(id, {
        x: e.target.x(),
        y: e.target.y(),
      });
    },
    [updateCanvasObject],
  );

  const handleObjectTransformEnd = useCallback(
    (obj: CanvasObject, e: Konva.KonvaEventObject<Event>) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      updateCanvasObject(obj.id, {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        width: obj.width * scaleX,
        height: obj.height * scaleY,
        scaleX: 1,
        scaleY: 1,
      });

      // Reset scale to 1 after capturing the values
      node.scaleX(1);
      node.scaleY(1);
    },
    [updateCanvasObject],
  );

  const handleObjectDoubleClick = useCallback(
    (obj: CanvasObject) => {
      // Only delete icon objects, not text objects
      if (obj.type === "icon") {
        deleteCanvasObject(obj.id);
      }
    },
    [deleteCanvasObject],
  );

  return {
    state,
    actions: {
      setSdgNumber,
      setSdgText,
      setSelectedColor,
      setTextAlign,
      setLineHeight,
      addIconToCanvas,
      updateCanvasObject,
      deleteCanvasObject,
      resetPositionsAndStyles,
    },
    handlers: {
      handleSdgNumberChange,
      handleSdgTextChange,
      handleColorChange,
      handleTextAlignChange,
      handleLineHeightChange,
      handleObjectDragEnd,
      handleObjectTransformEnd,
      handleObjectDoubleClick,
    },
  };
}
