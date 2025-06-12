import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import { SketchPicker } from "react-color";
import { Stage, Layer, Rect, Text, Group, Image } from "react-konva";
import { IconExtractor, type ImageInfo } from "./IconExtractor";
import { IconSelector, type IconInfo } from "./IconSelector";
import { Label } from "./ui/label";
import type Konva from "konva";

type CanvasObject = {
  id: string;
  type: "icon";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  iconInfo: IconInfo;
  imageElement?: Konva.Image;
  originalWidth?: number;
  originalHeight?: number;
};

export function SDGGenerator() {
  const [sdgNumber, setSdgNumber] = useState("1");
  const [sdgText, setSdgText] = useState("世界から貧困をなくそう");
  const [selectedColor, setSelectedColor] = useState("#E5243B");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [pendingIcon, setPendingIcon] = useState<IconInfo | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);

  const addIconToCanvas = (iconInfo: IconInfo) => {
    // アイコンのImageを抽出するために一時的に設定
    setPendingIcon(iconInfo);
  };

  const onImageExtracted = (imageInfo: ImageInfo) => {
    if (pendingIcon) {
      const newObject: CanvasObject = {
        id: `icon-${Date.now()}-${Math.random()}`,
        type: "icon",
        x: 192, // Center of 384px canvas
        y: 192,
        width: 80,
        height: 80,
        rotation: 0,
        iconInfo: pendingIcon,
        imageElement: imageInfo.imageElement,
        originalWidth: imageInfo.width,
        originalHeight: imageInfo.height,
      };
      setCanvasObjects((prev) => [...prev, newObject]);
      setPendingIcon(null);
    }
  };

  const updateCanvasObject = (id: string, updates: Partial<CanvasObject>) => {
    setCanvasObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj)),
    );
  };

  const deleteCanvasObject = (id: string) => {
    setCanvasObjects((prev) => prev.filter((obj) => obj.id !== id));
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
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
        link.download = `fake-sdg-${sdgNumber}.png`;
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
                    onChange={(e) => setSdgNumber(e.target.value)}
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
                      onClick={() => setShowColorPicker(!showColorPicker)}
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
                          onClick={() => setShowColorPicker(false)}
                        />
                        <SketchPicker
                          color={selectedColor}
                          onChange={(color) => setSelectedColor(color.hex)}
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
                  onChange={(e) => setSdgText(e.target.value)}
                  rows={3}
                />
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
            <CardContent className="flex flex-1 flex-col space-y-4">
              <div className="flex flex-1 items-center justify-center">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <Stage
                    width={384}
                    height={384}
                    ref={stageRef}
                    onMouseDown={(e) => {
                      // クリックでオブジェクト選択解除
                      if (e.target === e.target.getStage()) {
                        setSelectedObjectId(null);
                      }
                    }}
                  >
                    <Layer ref={layerRef}>
                      {/* Background */}
                      <Rect width={384} height={384} fill={selectedColor} />

                      {/* SDG Number */}
                      <Text
                        text={sdgNumber}
                        fontSize={128}
                        fontStyle="bold"
                        fill="white"
                        x={60}
                        y={30}
                        width={384}
                        align="center"
                        offsetX={192}
                      />

                      {/* SDG Text */}
                      <Text
                        text={sdgText || "テキストを入力してください"}
                        fontSize={24}
                        fontStyle="bold"
                        fill="white"
                        x={192}
                        y={64}
                        width={300}
                        align="center"
                        offsetX={150}
                        lineHeight={1.2}
                      />

                      {/* Canvas Objects */}
                      {canvasObjects.map((obj) => (
                        <Group
                          key={obj.id}
                          x={obj.x}
                          y={obj.y}
                          width={obj.width}
                          height={obj.height}
                          rotation={obj.rotation}
                          draggable
                          onClick={() => setSelectedObjectId(obj.id)}
                          onDragEnd={(e) => {
                            updateCanvasObject(obj.id, {
                              x: e.target.x(),
                              y: e.target.y(),
                            });
                          }}
                          onTransformEnd={(e) => {
                            const node = e.target;
                            updateCanvasObject(obj.id, {
                              x: node.x(),
                              y: node.y(),
                              width: node.width() * node.scaleX(),
                              height: node.height() * node.scaleY(),
                              rotation: node.rotation(),
                            });
                            node.scaleX(1);
                            node.scaleY(1);
                          }}
                          onDblClick={() => deleteCanvasObject(obj.id)}
                        >
                          <Rect
                            width={obj.width}
                            height={obj.height}
                            stroke={
                              selectedObjectId === obj.id
                                ? "#3b82f6"
                                : "transparent"
                            }
                            strokeWidth={2}
                            offsetX={obj.width / 2}
                            offsetY={obj.height / 2}
                          />
                          {obj.imageElement && (
                            <Image
                              image={obj.imageElement.image()}
                              width={obj.width}
                              height={obj.height}
                              offsetX={obj.width / 2}
                              offsetY={obj.height / 2}
                            />
                          )}
                        </Group>
                      ))}
                    </Layer>
                  </Stage>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  アイコンをクリックして追加、ダブルクリックで削除
                </div>
                <Button
                  onClick={downloadImage}
                  className="w-full"
                  disabled={!sdgText.trim()}
                >
                  <Download className="mr-2 h-4 w-4" />
                  画像をダウンロード
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image抽出用の隠しコンポーネント */}
      {pendingIcon && (
        <IconExtractor
          IconComponent={pendingIcon.component}
          onImageExtracted={onImageExtracted}
        />
      )}
    </div>
  );
}
