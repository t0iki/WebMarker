const getXPath = (element: Node): string => {
  if (element.nodeType === Node.DOCUMENT_NODE) {
    return "";
  }

  if (element.nodeType === Node.TEXT_NODE) {
    return getXPath(element.parentNode as Element);
  }

  const elem = element as Element;
  let xpath = "";

  if (elem.id) {
    xpath = `//*[@id="${elem.id}"]`;
  } else {
    let siblingIndex = 1; // 兄弟要素のインデックスを取得
    let sibling = elem.previousSibling;

    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === elem.nodeName) {
        siblingIndex++;
      }
      sibling = sibling.previousSibling;
    }

    const parentXPath = getXPath(elem.parentNode as Element);
    xpath = `${parentXPath}/${elem.nodeName.toLowerCase()}[${siblingIndex}]`;
  }

  return xpath;
};

export const getSelectionRangeXPath = (): { startXPath: string; endXPath: string; startOffset: number; endOffset: number } | null => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const startNode = range.startContainer;
  const endNode = range.endContainer;

  const startXPath = getXPath(startNode);
  const endXPath = getXPath(endNode);

  const startOffset = range.startOffset;
  const endOffset = range.endOffset;

  return {
    startXPath,
    endXPath,
    startOffset,
    endOffset,
  };
};
