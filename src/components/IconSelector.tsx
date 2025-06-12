import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import type { IconType } from "react-icons";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as BsIcons from "react-icons/bs";
import * as CgIcons from "react-icons/cg";
import * as DiIcons from "react-icons/di";
import * as FiIcons from "react-icons/fi";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
import * as HiIcons from "react-icons/hi";
import * as ImIcons from "react-icons/im";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";
import * as TiIcons from "react-icons/ti";
import * as VscIcons from "react-icons/vsc";
import * as WiIcons from "react-icons/wi";
import { Input } from "./ui/input";
export type IconInfo = {
  name: string;
  component: IconType;
  pack: string;
};

export type IconPack = {
  name: string;
  prefix: string;
  icons: Record<string, IconType>;
};

const ICON_PACKS: IconPack[] = [
  { name: "Font Awesome", prefix: "Fa", icons: FaIcons },
  { name: "Ant Design", prefix: "Ai", icons: AiIcons },
  { name: "Bootstrap", prefix: "Bs", icons: BsIcons },
  { name: "Boxicons", prefix: "Bi", icons: BiIcons },
  { name: "css.gg", prefix: "Cg", icons: CgIcons },
  { name: "Devicons", prefix: "Di", icons: DiIcons },
  { name: "Feather", prefix: "Fi", icons: FiIcons },
  { name: "Github Octicons", prefix: "Go", icons: GoIcons },
  { name: "Grommet", prefix: "Gr", icons: GrIcons },
  { name: "Heroicons", prefix: "Hi", icons: HiIcons },
  { name: "IcoMoon", prefix: "Im", icons: ImIcons },
  { name: "Ionicons 4", prefix: "Io", icons: IoIcons },
  { name: "Ionicons 5", prefix: "Io5", icons: Io5Icons },
  { name: "Material Design", prefix: "Md", icons: MdIcons },
  { name: "Remix Icon", prefix: "Ri", icons: RiIcons },
  { name: "Simple Icons", prefix: "Si", icons: SiIcons },
  { name: "Typicons", prefix: "Ti", icons: TiIcons },
  { name: "VS Code Icons", prefix: "Vsc", icons: VscIcons },
  { name: "Weather Icons", prefix: "Wi", icons: WiIcons },
];

// Generate all icons from all packs
function getAllIcons(): IconInfo[] {
  return ICON_PACKS.flatMap((pack) =>
    Object.entries(pack.icons).map(([name, component]) => ({
      name,
      component,
      pack: pack.name,
    })),
  );
}

interface IconSelectorProps {
  onIconSelect: (iconInfo: IconInfo) => void;
}

export const IconSelector = memo(function IconSelector({
  onIconSelect,
}: IconSelectorProps) {
  const [iconFilter, setIconFilter] = useState("");

  const [selectedPacks, setSelectedPacks] = useState<Set<string>>(
    new Set(ICON_PACKS.map((p) => p.name)),
  );
  const onPackToggle = useCallback(
    (packName: string) => {
      const newSelectedPacks = new Set(selectedPacks);
      if (newSelectedPacks.has(packName)) {
        newSelectedPacks.delete(packName);
      } else {
        newSelectedPacks.add(packName);
      }
      setSelectedPacks(newSelectedPacks);
    },
    [selectedPacks],
  );

  const onMasterCheckboxChange = useCallback(() => {
    if (selectedPacks.size === 0) {
      // 全て未選択の場合は全選択
      setSelectedPacks(new Set(ICON_PACKS.map((p) => p.name)));
    } else if (selectedPacks.size === ICON_PACKS.length) {
      // 全て選択済みの場合は全解除
      setSelectedPacks(new Set());
    } else {
      // 一部選択の場合は全選択
      setSelectedPacks(new Set(ICON_PACKS.map((p) => p.name)));
    }
  }, [selectedPacks.size]);

  const getMasterCheckboxState = useCallback(() => {
    if (selectedPacks.size === 0) return false;
    if (selectedPacks.size === ICON_PACKS.length) return true;
    return "indeterminate";
  }, [selectedPacks.size]);
  const allIcons = useMemo(() => getAllIcons(), []);

  const filteredIcons = useMemo(() => {
    return allIcons.filter((icon) => {
      const matchesFilter = icon.name
        .toLowerCase()
        .includes(iconFilter.toLowerCase());
      const matchesPack = selectedPacks.has(icon.pack);
      return matchesFilter && matchesPack;
    });
  }, [allIcons, iconFilter, selectedPacks]);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: Math.ceil(filteredIcons.length / 5),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90,
    overscan: 5,
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="iconFilter">アイコン選択</Label>

      {/* Search Bar */}
      <Input
        id="iconFilter"
        placeholder="アイコンを検索..."
        value={iconFilter}
        onChange={(e) => setIconFilter(e.target.value)}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[auto_1fr]">
        {/* Icon Pack Filter */}
        <div className="space-y-4">
          <div>
            <Label>
              アイコンパック
              <Checkbox
                checked={getMasterCheckboxState()}
                onCheckedChange={onMasterCheckboxChange}
              />
              <span className="text-xs text-muted-foreground">全て</span>
            </Label>
          </div>
          <ul className="space-y-2">
            {ICON_PACKS.map((pack) => (
              <li key={pack.name}>
                <Label>
                  <Checkbox
                    checked={selectedPacks.has(pack.name)}
                    onCheckedChange={() => onPackToggle(pack.name)}
                  />
                  <span>{pack.name}</span>
                </Label>
              </li>
            ))}
          </ul>
        </div>

        {/* Icon Grid */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            {filteredIcons.length} のアイコンが利用可能
          </div>

          <div ref={parentRef} className="max-h-96 overflow-auto border">
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const startIndex = virtualItem.index * 5;
                const iconsInRow = filteredIcons.slice(
                  startIndex,
                  startIndex + 5,
                );

                return (
                  <div
                    key={virtualItem.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="grid grid-cols-5 gap-4 p-2"
                  >
                    {iconsInRow.map((iconInfo) => {
                      const IconComponent = iconInfo.component;
                      return (
                        <div
                          className="flex flex-col items-center gap-2"
                          key={`${iconInfo.pack}-${iconInfo.name}`}
                        >
                          <button
                            onClick={() => onIconSelect(iconInfo)}
                            className="flex aspect-square flex-1 items-center justify-center border p-1"
                            title={`${iconInfo.name} (${iconInfo.pack}) をcanvasに追加`}
                          >
                            <IconComponent size={28} />
                          </button>
                          <span className="w-full truncate text-center text-xs text-muted-foreground">
                            {iconInfo.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
