import { useRef, useReducer, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { SketchPicker } from "react-color";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Group,
  Image,
  Transformer,
} from "react-konva";
import Konva from "konva";
import { IconSelector, type IconInfo } from "./IconSelector";
import { Label } from "./ui/label";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Slider } from "./ui/slider";

// Default positions and styles constants
const DEFAULT_CANVAS_SIZE = 384;

const DEFAULT_POSITIONS = {
  SDG_NUMBER: { x: 60, y: 90, width: 300, height: 128 },
  SDG_TEXT: { x: 140, y: 90, width: 300, height: 60 },
  ICON_DEFAULT: { x: 192, y: 300, width: 120, height: 120 },
  ICON_NEW: { x: 192, y: 288, width: 120, height: 120 },
} as const;

const DEFAULT_STYLES = {
  SDG_NUMBER: { fontSize: 128, fill: "white" },
  SDG_TEXT: {
    fontSize: 24,
    fill: "white",
    align: "left" as const,
    lineHeight: 1.2,
  },
  TRANSFORM: { rotation: 0, scaleX: 1, scaleY: 1 },
} as const;

const DEFAULT_APP_STATE = {
  sdgNumber: "1",
  sdgText: "貧困を\nなくそう",
  selectedColor: "#E5243B",
  textAlign: "left" as const,
  lineHeight: 1.2,
} as const;

type TextAlign = "left" | "center" | "right";

type CanvasObject = {
  id: string;
  type: "icon" | "text";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX?: number;
  scaleY?: number;
  iconInfo?: IconInfo;
  imageElement?: Konva.Image;
  originalWidth?: number;
  originalHeight?: number;
  text?: string;
  fontSize?: number;
  fill?: string;
  align?: "left" | "center" | "right";
  lineHeight?: number;
};

type AppState = {
  sdgNumber: string;
  sdgText: string;
  selectedColor: string;
  showColorPicker: boolean;
  textAlign: TextAlign;
  lineHeight: number;
  canvasObjects: CanvasObject[];
  selectedObjectId: string | null;
};

type AppAction =
  | { type: "SET_SDG_NUMBER"; payload: string }
  | { type: "SET_SDG_TEXT"; payload: string }
  | { type: "SET_SELECTED_COLOR"; payload: string }
  | { type: "SET_SHOW_COLOR_PICKER"; payload: boolean }
  | { type: "SET_TEXT_ALIGN"; payload: TextAlign }
  | { type: "SET_LINE_HEIGHT"; payload: number }
  | {
      type: "ADD_ICON_TO_CANVAS";
      payload: {
        iconInfo: IconInfo;
        imageElement: Konva.Image;
        width: number;
        height: number;
      };
    }
  | {
      type: "UPDATE_CANVAS_OBJECT";
      payload: { id: string; updates: Partial<CanvasObject> };
    }
  | { type: "DELETE_CANVAS_OBJECT"; payload: string }
  | { type: "SET_SELECTED_OBJECT_ID"; payload: string | null }
  | { type: "RESET_POSITIONS_AND_STYLES" };

function appReducer(state: AppState, action: AppAction): AppState {
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
    case "SET_SHOW_COLOR_PICKER":
      return { ...state, showColorPicker: action.payload };
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
      const { iconInfo, imageElement, width, height } = action.payload;
      const newObject: CanvasObject = {
        id: `icon-${Date.now()}-${Math.random()}`,
        type: "icon",
        ...DEFAULT_POSITIONS.ICON_NEW,
        ...DEFAULT_STYLES.TRANSFORM,
        iconInfo,
        imageElement,
        originalWidth: width,
        originalHeight: height,
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
        selectedObjectId:
          state.selectedObjectId === action.payload
            ? null
            : state.selectedObjectId,
      };
    case "SET_SELECTED_OBJECT_ID":
      return { ...state, selectedObjectId: action.payload };
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
        selectedObjectId: null,
      };
    default:
      return state;
  }
}

const initialState: AppState = {
  sdgNumber: DEFAULT_APP_STATE.sdgNumber,
  sdgText: DEFAULT_APP_STATE.sdgText,
  selectedColor: DEFAULT_APP_STATE.selectedColor,
  showColorPicker: false,
  textAlign: DEFAULT_APP_STATE.textAlign,
  lineHeight: DEFAULT_APP_STATE.lineHeight,
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
  selectedObjectId: null,
};

export function SDGGenerator() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const {
    sdgNumber,
    sdgText,
    selectedColor,
    showColorPicker,
    textAlign,
    lineHeight,
    canvasObjects,
    selectedObjectId,
  } = state;

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const addIconToCanvas = (iconInfo: IconInfo) => {
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
        const width = parseFloat(svgElement.getAttribute("width") || "24");
        const height = parseFloat(svgElement.getAttribute("height") || "24");

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
            payload: { iconInfo, imageElement, width, height },
          });
        });
      }
    }, 0);
  };

  const updateCanvasObject = (id: string, updates: Partial<CanvasObject>) => {
    dispatch({ type: "UPDATE_CANVAS_OBJECT", payload: { id, updates } });
  };

  const deleteCanvasObject = (id: string) => {
    dispatch({ type: "DELETE_CANVAS_OBJECT", payload: id });
  };

  // Transformer selection handling
  useEffect(() => {
    if (!transformerRef.current) return;

    if (selectedObjectId) {
      const selectedNode = stageRef.current?.findOne(`#${selectedObjectId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedObjectId]);

  const resetPositionsAndStyles = () => {
    dispatch({ type: "RESET_POSITIONS_AND_STYLES" });
  };

  const downloadImage = async () => {
    if (stageRef.current) {
      try {
        const dataURL = stageRef.current.toDataURL({
          mimeType: "image/png",
          quality: 1,
          pixelRatio: 2,
        });

        const link = document.createElement("a");
        link.download = `fake-sdg-${sdgNumber}-${sdgText}.png`;
        link.href = dataURL;
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="p-4">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Fake SDGs Generator
          </h1>
          <p className="text-secondary-foreground">
            ありもしないSDGsの標語を作成するジョークサイト
          </p>
        </div>

        <div className="grid h-full min-h-0 flex-1 gap-8 lg:grid-cols-2">
          {/* Generator Panel */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>SDGs設定</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              {/* SDG Number and Color Selection */}
              <div className="grid grid-cols-2 gap-4">
                {/* SDG Number */}
                <div className="space-y-2">
                  <Label htmlFor="sdgNumber">SDG番号</Label>
                  <Input
                    id="sdgNumber"
                    type="number"
                    placeholder="例: 18"
                    value={sdgNumber}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SDG_NUMBER",
                        payload: e.target.value,
                      })
                    }
                    min="1"
                  />
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <Label>色選択</Label>
                  <div className="relative">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() =>
                        dispatch({
                          type: "SET_SHOW_COLOR_PICKER",
                          payload: !showColorPicker,
                        })
                      }
                    >
                      <div
                        className="h-6 w-6 rounded border"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <span className="text-sm">{selectedColor}</span>
                    </Button>
                    {showColorPicker && (
                      <div className="absolute z-10 mt-2">
                        <div
                          className="fixed inset-0"
                          onClick={() =>
                            dispatch({
                              type: "SET_SHOW_COLOR_PICKER",
                              payload: false,
                            })
                          }
                        />
                        <SketchPicker
                          color={selectedColor}
                          onChange={(color) =>
                            dispatch({
                              type: "SET_SELECTED_COLOR",
                              payload: color.hex,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SDG Text */}
              <div className="space-y-2">
                <Label htmlFor="sdgText">標語テキスト</Label>
                <Textarea
                  id="sdgText"
                  value={sdgText}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_SDG_TEXT",
                      payload: e.target.value,
                    })
                  }
                  rows={3}
                />
                {/* Text Alignment */}
                <div className="grid auto-cols-min grid-flow-col items-center gap-4">
                  <Label className="sr-only">テキスト配置</Label>
                  <ToggleGroup
                    type="single"
                    value={textAlign}
                    onValueChange={(value) => {
                      if (value)
                        dispatch({
                          type: "SET_TEXT_ALIGN",
                          payload: value as TextAlign,
                        });
                    }}
                  >
                    <ToggleGroupItem value="left" aria-label="左揃え">
                      <AlignLeft />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="中央揃え">
                      <AlignCenter />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="右揃え">
                      <AlignRight />
                    </ToggleGroupItem>
                  </ToggleGroup>
                  {/* Line Height */}
                  <Label className="block whitespace-nowrap">
                    行間: {lineHeight.toFixed(1)}
                  </Label>
                  <Slider
                    value={[lineHeight]}
                    onValueChange={(values) =>
                      dispatch({
                        type: "SET_LINE_HEIGHT",
                        payload: values[0],
                      })
                    }
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="w-24"
                  />
                </div>
              </div>

              {/* Icon Selection */}

              <IconSelector onIconSelect={addIconToCanvas} />
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>プレビュー</CardTitle>
            </CardHeader>
            <CardContent
              className="flex flex-1 flex-col space-y-4"
              onClick={(e) => {
                // Check if click is outside the Stage
                const stage = stageRef.current;
                if (stage && !stage.content.contains(e.target as Node)) {
                  dispatch({
                    type: "SET_SELECTED_OBJECT_ID",
                    payload: null,
                  });
                }
              }}
            >
              <div className="flex flex-1 items-center justify-center">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <Stage
                    width={DEFAULT_CANVAS_SIZE}
                    height={DEFAULT_CANVAS_SIZE}
                    ref={stageRef}
                    onMouseDown={(e) => {
                      // クリックでオブジェクト選択解除
                      if (e.target === e.target.getStage()) {
                        dispatch({
                          type: "SET_SELECTED_OBJECT_ID",
                          payload: null,
                        });
                      }
                    }}
                  >
                    <Layer>
                      {/* Background */}
                      <Rect
                        width={DEFAULT_CANVAS_SIZE}
                        height={DEFAULT_CANVAS_SIZE}
                        fill={selectedColor}
                      />

                      {/* Canvas Objects */}
                      {canvasObjects.map((obj) => (
                        <Group
                          key={obj.id}
                          id={obj.id}
                          x={obj.x}
                          y={obj.y}
                          width={obj.width}
                          height={obj.height}
                          rotation={obj.rotation}
                          scaleX={obj.scaleX || 1}
                          scaleY={obj.scaleY || 1}
                          draggable
                          onClick={() =>
                            dispatch({
                              type: "SET_SELECTED_OBJECT_ID",
                              payload: obj.id,
                            })
                          }
                          onDragEnd={(e) => {
                            updateCanvasObject(obj.id, {
                              x: e.target.x(),
                              y: e.target.y(),
                            });
                          }}
                          onTransformEnd={(e) => {
                            const node = e.target;
                            const scaleX = node.scaleX();
                            const scaleY = node.scaleY();

                            // Update the object with new dimensions
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
                          }}
                          onDblClick={() => {
                            // Only delete icon objects, not text objects
                            if (obj.type === "icon") {
                              deleteCanvasObject(obj.id);
                            }
                          }}
                        >
                          {obj.type === "icon" && obj.imageElement && (
                            <Image
                              image={obj.imageElement.image()}
                              width={obj.width}
                              height={obj.height}
                              offsetX={obj.width / 2}
                              offsetY={obj.height / 2}
                            />
                          )}
                          {obj.type === "text" && (
                            <Text
                              id={obj.id}
                              text={obj.text}
                              fontSize={obj.fontSize}
                              fontStyle="bold"
                              fill={obj.fill}
                              // width={obj.width}
                              // height={obj.height}
                              align={obj.align}
                              verticalAlign="middle"
                              lineHeight={obj.lineHeight}
                            />
                          )}
                        </Group>
                      ))}

                      {/* Transformer for selection */}
                      <Transformer
                        ref={transformerRef}
                        keepRatio={true}
                        enabledAnchors={[
                          "top-left",
                          "top-right",
                          "bottom-left",
                          "bottom-right",
                        ]}
                        rotationSnaps={[
                          0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165,
                          180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330,
                          345,
                        ]}
                        boundBoxFunc={(oldBox, newBox) => {
                          // Limit resize
                          if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                          }
                          return newBox;
                        }}
                      />
                    </Layer>
                  </Stage>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                アイコンをクリックして追加、選択してリサイズ、ダブルクリックで削除
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={resetPositionsAndStyles}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw />
                位置とスタイルをリセット
              </Button>
              <Button
                onClick={downloadImage}
                className="flex-1"
                disabled={!sdgText.trim()}
              >
                <Download />
                ダウンロード
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
