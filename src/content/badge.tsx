import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { clearMemosByUrl, getAllMemos, setMemo } from "../storage/memo";
import { Memo } from "../types/memo";

type MousePos = {
  x: number;
  y: number;
};

export const Badge = () => {
  const [isShowBadge, setIsShowBadge] = useState(false);
  const isSelecting = useRef(false);
  const [draftMemo, setDraftMemo] = useState<Memo | null>(null);
  const [pos, setPos] = useState<MousePos>({ x: -1, y: -1 });

  const onSelectText = () => {
    isSelecting.current = false;
    const selection = window.getSelection();

    if (!selection || selection.toString().length === 0) {
      setIsShowBadge(false);
      setPos({ x: -1, y: -1 });
      return;
    }
    if (selection.rangeCount > 0) {
      const text = selection.toString();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const memo: Memo = {
        text,
      };
      setDraftMemo(memo);
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
    if (draftMemo) {
      setMemo({ url: location.href, memo: draftMemo });
      setDraftMemo(null);
      setIsShowBadge(false);
    }
  };

  const onClickDebug = async () => {
    const memos = await getAllMemos();
    console.log(memos);
  };

  const onClear = async () => {
    await clearMemosByUrl(location.href);
  };

  useEffect(() => {
    document.addEventListener("selectstart", () => {
      isSelecting.current = true;
      document.addEventListener("mouseup", onSelectText);
    });
  }, []);

  return isShowBadge ? (
    <div style={style} className={"bg-white border text-black"}>
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
