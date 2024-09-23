export const getXPathForElement = (element: Node): string | null => {
  const segments: string[] = [];

  let currentElement = element.nodeType === Node.TEXT_NODE ? element.parentElement : (element as Element | null);

  while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
    let sibling = currentElement;
    let i = 1;

    while (sibling.previousElementSibling) {
      sibling = sibling.previousElementSibling;
      i++;
    }
    const segment = `${currentElement.tagName}[${i}]`;
    segments.unshift(segment);
    currentElement = currentElement.parentElement;
  }

  return segments.length ? "/" + segments.join("/") : null;
};

export const getElementByXPath = (path: string, offset?: number): Node | null => {
  const result = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const node = result.singleNodeValue;

  if (node && offset !== undefined) {
    const textNode = node.childNodes[0];
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      return textNode;
    }
  }

  return node;
};
