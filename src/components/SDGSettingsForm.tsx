import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { SketchPicker } from "react-color";
import { Label } from "./ui/label";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Slider } from "./ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { IconSelector } from "./IconSelector";
import type { IconInfo } from "./IconSelector";

type TextAlign = "left" | "center" | "right";

interface SDGSettingsFormProps {
  sdgNumber: string;
  sdgText: string;
  selectedColor: string;
  textAlign: TextAlign;
  lineHeight: number;
  onSdgNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSdgTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onColorChange: (color: { hex: string }) => void;
  onTextAlignChange: (value: string) => void;
  onLineHeightChange: (values: number[]) => void;
  onIconSelect: (iconInfo: IconInfo) => void;
}

export function SDGSettingsForm({
  sdgNumber,
  sdgText,
  selectedColor,
  textAlign,
  lineHeight,
  onSdgNumberChange,
  onSdgTextChange,
  onColorChange,
  onTextAlignChange,
  onLineHeightChange,
  onIconSelect,
}: SDGSettingsFormProps) {
  return (
    <Card className="min-w-0">
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
              onChange={onSdgNumberChange}
              min="1"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>色選択</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <div
                    className="h-6 w-6 rounded border"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="text-sm">{selectedColor}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="border-none p-0 shadow-none"
                align="start"
              >
                <SketchPicker
                  color={selectedColor}
                  onChange={onColorChange}
                  className="w-auto!"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* SDG Text */}
        <div className="space-y-2">
          <Label htmlFor="sdgText">標語テキスト</Label>
          <Textarea
            id="sdgText"
            value={sdgText}
            onChange={onSdgTextChange}
            rows={3}
          />
          {/* Text Alignment */}
          <div className="grid auto-cols-min grid-flow-col items-center gap-4">
            <Label className="sr-only">テキスト配置</Label>
            <ToggleGroup
              type="single"
              value={textAlign}
              onValueChange={onTextAlignChange}
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
              onValueChange={onLineHeightChange}
              min={0.5}
              max={3}
              step={0.1}
              className="w-24"
            />
          </div>
        </div>

        {/* Icon Selection */}
        <IconSelector onIconSelect={onIconSelect} />
      </CardContent>
    </Card>
  );
}
