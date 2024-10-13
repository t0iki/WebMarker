import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { clearMarksByUrl, getAllMarks, setMark } from "../storage/mark";
import { Mark } from "../types/mark";
import { getSelectionRangeXPath } from "../utils/xpath";
import { HIGHLIGHT_CLASS } from "../constants";

type MousePos = {
  x: number;
  y: number;
};

export const Badge = () => {
  const [isShowBadge, setIsShowBadge] = useState(false);
  const isSelecting = useRef(false);
  const [draftMark, setDraftMark] = useState<Mark | null>(null);
  const [pos, setPos] = useState<MousePos>({ x: -1, y: -1 });

  const onSelectText = () => {
    console.log("mouse up");
    isSelecting.current = false;
    const selection = window.getSelection();

    if (!selection || selection.toString().length === 0) {
      setIsShowBadge(false);
      setPos({ x: -1, y: -1 });
      return;
    }
    if (selection.rangeCount > 0) {
      const text = selection.toString();
      let element = selection.anchorNode?.parentElement;
      if (element?.classList.contains(HIGHLIGHT_CLASS)) {
        element = element.parentElement;
      }
      if (!element) return;
      const textContent = element?.textContent;
      console.log(textContent);
      const startOffset = textContent ? textContent.indexOf(text) : -1;
      const endOffset = startOffset ? startOffset + text.length : -1;
      console.log(startOffset, endOffset);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const xpath = getSelectionRangeXPath();

      const mark: Mark = {
        text,
        startOffset: startOffset,
        endOffset: endOffset,
        startXPath: xpath ? xpath.startXPath : null,
        endXPath: xpath ? xpath.endXPath : null,
      };
      setDraftMark(mark);
      setIsShowBadge(true);
      setPos({ x: rect.right, y: rect.top });
    }
  };

  const style = useMemo(() => {
    return {
      position: "fixed",
      top: pos.y + 32,
      left: pos.x + 8,
      zIndex: "calc(infinity)",
    };
  }, [pos.x, pos.y]);

  const onClick = () => {
    console.log("clicked");
    if (draftMark) {
      setMark({ url: location.href, mark: draftMark });
      setDraftMark(null);
      setIsShowBadge(false);
    }
  };

  const onClickDebug = async () => {
    const marks = await getAllMarks();
    console.log(marks);
  };

  const onClear = async () => {
    await clearMarksByUrl(location.href);
  };

  useEffect(() => {
    document.addEventListener("selectstart", () => {
      console.log("selectstart");
      isSelecting.current = true;
      document.addEventListener("mouseup", onSelectText);
    });
  }, []);

  return isShowBadge ? (
    <div style={style} className={"bg-white"}>
      <button onClick={onClick} className={"m-2"}>
        Memo
      </button>
      <button onClick={onClickDebug} className={"m-2"}>
        debug
      </button>
      <button onClick={onClear} className={"m-2"}>
        clear
      </button>
    </div>
  ) : null;
};
