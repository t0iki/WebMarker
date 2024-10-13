import { HIGHLIGHT_CLASS } from "../constants";
import { getMarksByUrl } from "../storage/mark";
import { Mark } from "../types/mark";

// Helper function to get the text node and offset for a given XPath
function getTextNodeByXPath(xPath: string): Node | null {
  const result = document.evaluate(xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const node = result.singleNodeValue;

  // Nodeがテキストノードではない場合、その中のテキストノードを探す
  if (node && node.nodeType !== Node.TEXT_NODE) {
    // 子要素をループして最初のテキストノードを探す
    for (let child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        return child;
      }
    }
  }

  // 直接テキストノードが見つかる場合
  return node;
}

function wrapTextInSpan(textNode: Text, startOffset: number, endOffset: number): void {
  const range = document.createRange();
  console.log(textNode, startOffset, endOffset);
  range.setStart(textNode, startOffset);
  range.setEnd(textNode, endOffset);

  const span = document.createElement("span");
  span.className = HIGHLIGHT_CLASS;
  span.style.backgroundColor = "yellow";
  range.surroundContents(span);
}

// Function to apply marks
export const applyMarks = async () => {
  const marks = await getMarksByUrl(location.href);
  const mergedRanges: Record<string, number[][]> = {};

  // Marksを同じXPathごとにグループ化する
  const groupedMarks: { [key: string]: Mark[] } = marks.reduce((groups, mark) => {
    const key = `${mark.startXPath}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(mark);
    return groups;
  }, {} as { [key: string]: Mark[] });

  Object.entries(groupedMarks).forEach(([key, group]) => {
    group.sort((a, b) => a.startOffset - b.startOffset);
    let cur = group.map((mark) => [mark.startOffset, mark.endOffset]);
    let prev = null;
    while (cur !== prev) {
      let next = [];
      let min = cur[0][0];
      let max = cur[0][1];
      cur.forEach((mark) => {
        if (mark[0] <= max) {
          max = Math.max(max, mark[1]);
        } else {
          next.push([min, max]);
          min = mark[0];
          max = mark[1];
        }
      });
      next.push([min, max]);
      prev = cur;
    }
    mergedRanges[key] = cur;
  });

  console.log("mergedRanges", mergedRanges);
  Object.entries(mergedRanges).forEach(([xPath, ranges]) => {
    const textNode = getTextNodeByXPath(xPath);
    if (textNode instanceof Text) {
      ranges.forEach(([startOffset, endOffset]) => {
        wrapTextInSpan(textNode, startOffset, endOffset);
      });
    }
  });
};
