export type Mark = {
  text: string;
  startOffset: number;
  endOffset: number;
  startContainerXPath: string | null;
  endContainerXPath: string | null;
};

export type WebMarks = {
  marks: Record<string, Mark[]>;
};
