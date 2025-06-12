import { SDGSettingsForm } from "./components/SDGSettingsForm";
import { SDGPreview } from "./components/SDGPreview";
import { useAppReducer } from "@/hooks/useAppReducer/useAppReducer";
import { Button } from "./components/ui/button";

export function App() {
  const {
    state: {
      sdgNumber,
      sdgText,
      selectedColor,
      textAlign,
      lineHeight,
      canvasObjects,
      selectedObjectId,
    },
    actions: { addIconToCanvas, resetPositionsAndStyles, setSelectedObjectId },
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
  } = useAppReducer();

  return (
    <div className="container">
      <header className="my-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">
          Fake SDGs Generator
        </h1>
        <p className="text-secondary-foreground">
          ありもしないSDGsの標語を作成する
        </p>
      </header>

      <main className="grid h-full min-h-0 flex-1 gap-8 lg:grid-cols-2">
        {/* Settings Panel */}
        <SDGSettingsForm
          sdgNumber={sdgNumber}
          sdgText={sdgText}
          selectedColor={selectedColor}
          textAlign={textAlign}
          lineHeight={lineHeight}
          onSdgNumberChange={handleSdgNumberChange}
          onSdgTextChange={handleSdgTextChange}
          onColorChange={handleColorChange}
          onTextAlignChange={handleTextAlignChange}
          onLineHeightChange={handleLineHeightChange}
          onIconSelect={addIconToCanvas}
        />

        {/* Preview Panel */}
        <SDGPreview
          sdgNumber={sdgNumber}
          sdgText={sdgText}
          selectedColor={selectedColor}
          canvasObjects={canvasObjects}
          selectedObjectId={selectedObjectId}
          setSelectedObjectId={setSelectedObjectId}
          onObjectDragEnd={handleObjectDragEnd}
          onObjectTransformEnd={handleObjectTransformEnd}
          onObjectDoubleClick={handleObjectDoubleClick}
          onResetPositionsAndStyles={resetPositionsAndStyles}
        />
      </main>
      <footer className="mt-8 border-t pt-8">
        <p className="text-sm text-muted-foreground">
          当サイトを利用して作成したものについて、管理者は一切の責任を負いません。
        </p>
        <ul className="list-disc gap-4 md:grid md:list-none md:auto-cols-min md:grid-flow-col">
          <li>
            <Button asChild variant="link" className="p-0">
              <a href="https://github.com/sunya9/fake-sdgs-generator">
                GitHubリポジトリ
              </a>
            </Button>
          </li>
          <li>
            <Button asChild variant="link" className="p-0">
              <a href="https://x.com/ephemerealMocha">@ephemerealMocha</a>
            </Button>
          </li>
        </ul>
      </footer>
    </div>
  );
}
