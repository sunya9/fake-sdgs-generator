import { useRef, useEffect } from "react";
import type { IconType } from "react-icons";
import Konva from "konva";

export interface ImageInfo {
  imageElement: Konva.Image;
  width: number;
  height: number;
}

interface IconExtractorProps {
  IconComponent: IconType;
  onImageExtracted: (imageInfo: ImageInfo) => void;
}

export function IconExtractor({
  IconComponent,
  onImageExtracted,
}: IconExtractorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const svgElement = containerRef.current?.querySelector("svg");
      if (svgElement) {
        const width = parseFloat(svgElement.getAttribute("width") || "24");
        const height = parseFloat(svgElement.getAttribute("height") || "24");

        // SVGをBlob化
        const svgString = svgElement.outerHTML;
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        // Konva.Image.fromURLでSVGを読み込み
        Konva.Image.fromURL(url, (imageElement) => {
          URL.revokeObjectURL(url); // メモリリークを防ぐ

          const imageInfo: ImageInfo = {
            imageElement,
            width,
            height,
          };

          onImageExtracted(imageInfo);
        });
      }
    }
  }, [onImageExtracted, IconComponent]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: -9999,
        left: -9999,
        visibility: "hidden",
      }}
    >
      <IconComponent fill="white" />
    </div>
  );
}
