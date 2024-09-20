import { useMemo, useState } from "preact/hooks";

type MousePos = {
  x: number;
  y: number;
};

export const Badge = () => {
  const [isShowBadge, setIsShowBadge] = useState(false);
  const [pos, setPos] = useState<MousePos>({ x: -1, y: -1 });

  const onSelectText = (e: MouseEvent) => {
    console.log("selected", e.clientX, e.clientY);
    const text = window.getSelection()?.toString();
    const rect = window.getSelection()?.getRangeAt(0).getBoundingClientRect();
    document.removeEventListener("mouseup", onSelectText);
    if (!text || !rect) return;
    setIsShowBadge(true);
    setPos({ x: rect.right - 16, y: rect.top + 16 });
  };

  const onDeselectText = () => {
    console.log("deselected");
    document.removeEventListener("selectionchange", onDeselectText);
    setIsShowBadge(false);
    setPos({ x: -1, y: -1 });
  };

  const style = useMemo(() => {
    return {
      position: "fixed",
      top: pos.y + 10,
      left: pos.x + 10,
      zIndex: "calc(infinity)",
    };
  }, [pos.x, pos.y]);

  document.addEventListener("selectstart", () => {
    document.addEventListener("mouseup", onSelectText);
    document.addEventListener("selectionchange", onDeselectText);
  });

  return isShowBadge ? <div style={style}> Badge</div> : null;
};
