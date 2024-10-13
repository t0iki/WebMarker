export type Mark = {
  text: string;
  startOffset: number;
  endOffset: number;
  startXPath: string | null;
  endXPath: string | null;
};

export type WebMarks = {
  marks: Record<string, Mark[]>;
};
