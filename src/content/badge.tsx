import { useEffect, useMemo, useState } from "preact/hooks";
import { getAllMarks, setMark } from "../storage/mark";
import { getXPathForElement } from "../utils/xpath";
import { Mark } from "../types/mark";

type MousePos = {
  x: number;
  y: number;
};

export const Badge = () => {
  const [isShowBadge, setIsShowBadge] = useState(false);
  const [draftMark, setDraftMark] = useState<Mark | null>(null);
  const [pos, setPos] = useState<MousePos>({ x: -1, y: -1 });

  const onSelectText = () => {
    const selection = window.getSelection();
    if (!selection) return;
    if (selection.rangeCount > 0) {
      const text = selection.toString();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const startContainerXPath = getXPathForElement(range.startContainer);
      const startOffset = range.startOffset;
      const endContainerXPath = getXPathForElement(range.endContainer);
      const endOffset = range.endOffset;

      const mark: Mark = {
        text,
        startOffset,
        endOffset,
        startContainerXPath,
        endContainerXPath,
      };
      setDraftMark(mark);
      setIsShowBadge(true);
      setPos({ x: rect.right, y: rect.top });
    }
  };

  const onDeselectText = () => {
    setIsShowBadge(false);
    setPos({ x: -1, y: -1 });
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

  useEffect(() => {
    document.addEventListener("selectstart", () => {
      document.addEventListener("mouseup", onSelectText);
      document.addEventListener("selectionchange", onDeselectText);
    });
  }, []);

  return isShowBadge ? (
    <div style={style} className={"bg-white"}>
      <button onClick={onClick} className={"m-2"}>
        Add
      </button>
      <button onClick={onClickDebug} className={"m-2"}>
        debug
      </button>
    </div>
  ) : null;
};
