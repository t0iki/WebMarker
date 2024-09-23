import { getMarksByUrl } from "../storage/mark";
import { getElementByXPath } from "../utils/xpath";

export const restoreMarks = async () => {
  const marks = await getMarksByUrl(location.href);
  console.log(marks, location.href);
  marks.forEach((mark) => {
    const range = document.createRange();

    // 開始点と終了点のXPathからDOM要素を取得
    const startContainer = getElementByXPath(mark.startContainerXPath ?? "", mark.startOffset);
    const endContainer = getElementByXPath(mark.endContainerXPath ?? "", mark.endOffset);

    if (startContainer && endContainer) {
      if (startContainer.nodeType === Node.TEXT_NODE) {
        range.setStart(startContainer, mark.startOffset);
      } else {
        range.setStart(startContainer, 0); // デフォルトの0番目の子を設定
      }

      if (endContainer.nodeType === Node.TEXT_NODE) {
        range.setEnd(endContainer, mark.endOffset);
      } else {
        range.setEnd(endContainer, endContainer.childNodes.length); // ノード全体を選択
      }

      // 範囲を選択
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // マーカーを表示する（例: 背景色を変更）
      highlightRange(range);
    }
  });
};

export const highlightRange = (range: Range): void => {
  const newNode = document.createElement("span");
  newNode.className = "webmarker-highlight";
  newNode.style.backgroundColor = "yellow";
  range.surroundContents(newNode);
};
