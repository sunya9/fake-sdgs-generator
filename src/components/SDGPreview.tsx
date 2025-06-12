import { useRef, useEffect, useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw } from "lucide-react";
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
import { DEFAULT_CANVAS_SIZE, type CanvasObject } from "@/hooks/useAppReducer";

interface SDGPreviewProps {
  sdgNumber: string;
  sdgText: string;
  selectedColor: string;
  selectedObjectId: string | null;
  setSelectedObjectId: (value: string | null) => void;
  canvasObjects: CanvasObject[];
  onObjectDragEnd: (id: string, e: Konva.KonvaEventObject<DragEvent>) => void;
  onObjectTransformEnd: (
    obj: CanvasObject,
    e: Konva.KonvaEventObject<Event>,
  ) => void;
  onObjectDoubleClick: (obj: CanvasObject) => void;
  onResetPositionsAndStyles: () => void;
}

export function SDGPreview({
  sdgNumber,
  sdgText,
  selectedColor,
  selectedObjectId,
  setSelectedObjectId,
  canvasObjects,
  onObjectDragEnd,
  onObjectTransformEnd,
  onObjectDoubleClick,
  onResetPositionsAndStyles,
}: SDGPreviewProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // Transformer selection handling
  useEffect(() => {
    if (!transformerRef.current) return;

    if (selectedObjectId) {
      const selectedNode = stageRef.current?.findOne(`#${selectedObjectId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
      }
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedObjectId]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Check if click is outside the Stage
      const stage = stageRef.current;
      if (stage && !stage.content.contains(e.target as Node)) {
        setSelectedObjectId(null);
      }
    },
    [setSelectedObjectId],
  );

  const handleStageMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      // クリックでオブジェクト選択解除
      if (e.target === e.target.getStage()) {
        setSelectedObjectId(null);
      }
    },
    [setSelectedObjectId],
  );

  const downloadImage = useCallback(async () => {
    if (stageRef.current) {
      try {
        // 選択状態を一時的に解除してダウンロード
        const currentSelection = selectedObjectId;
        setSelectedObjectId(null);
        
        // Transformerが非表示になるまで少し待つ
        setTimeout(() => {
          const dataURL = stageRef.current!.toDataURL({
            mimeType: "image/png",
            quality: 1,
            pixelRatio: 2,
          });

          const link = document.createElement("a");
          link.download = `fake-sdg-${sdgNumber}-${sdgText}.png`;
          link.href = dataURL;
          link.click();
          
          // 元の選択状態を復元
          setSelectedObjectId(currentSelection);
        }, 100);
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  }, [sdgNumber, sdgText, selectedObjectId, setSelectedObjectId]);

  const [stageSize, setStageSize] = useState({
    width: DEFAULT_CANVAS_SIZE,
    height: DEFAULT_CANVAS_SIZE,
    scale: 1,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Function to handle resize
  const updateSize = () => {
    if (!containerRef.current) return;

    // Get container width
    const containerWidth = containerRef.current.offsetWidth;

    // Calculate scale
    const scale = containerWidth / DEFAULT_CANVAS_SIZE;

    // Update state with new dimensions
    setStageSize({
      width: DEFAULT_CANVAS_SIZE * scale,
      height: DEFAULT_CANVAS_SIZE * scale,
      scale: scale,
    });
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>プレビュー</CardTitle>
      </CardHeader>
      <CardContent
        className="flex flex-1 flex-col space-y-4"
        onClick={handleCanvasClick}
      >
        <div
          className="flex aspect-square min-h-0 flex-1 items-center justify-center"
          ref={containerRef}
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            onMouseDown={handleStageMouseDown}
            scaleX={stageSize.scale}
            scaleY={stageSize.scale}
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
                  scaleX={obj.scaleX}
                  scaleY={obj.scaleY}
                  draggable
                  onClick={() => setSelectedObjectId(obj.id)}
                  onDragEnd={(e) => onObjectDragEnd(obj.id, e)}
                  onTransformEnd={(e) => onObjectTransformEnd(obj, e)}
                  onDblClick={() => onObjectDoubleClick(obj)}
                >
                  {obj.type === "icon" && (
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
                  0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195,
                  210, 225, 240, 255, 270, 285, 300, 315, 330, 345,
                ]}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize
                  const minScale = 0.1;
                  const maxScale = 10;

                  const scaleX = newBox.width / oldBox.width;
                  const scaleY = newBox.height / oldBox.height;

                  if (
                    scaleX < minScale ||
                    scaleY < minScale ||
                    scaleX > maxScale ||
                    scaleY > maxScale
                  ) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </Layer>
          </Stage>
        </div>
        <div className="text-xs text-gray-500">
          クリックで選択、ドラッグで移動、ハンドルでリサイズ・回転。アイコンはダブルクリックで削除
        </div>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        <Button
          onClick={onResetPositionsAndStyles}
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
  );
}
