import { getBucket } from "@extend-chrome/storage";
import { WebMarks, Mark } from "../types/mark";

const bucket = getBucket<WebMarks>("marks");

export const setMark = async ({ url, mark }: { url: string; mark: Mark }) => {
  const marks = await getAllMarks();
  await bucket.set({
    marks: {
      ...marks,
      [url]: [...(marks?.[url] || []), mark],
    },
  });
};

export const getAllMarks = async () => {
  return (await bucket.get()).marks;
};

export const overwriteMarksByUrl = async (newMarks: Mark[], url: string) => {
  const marks = await getAllMarks();
  await bucket.set({
    marks: {
      ...marks,
      [url]: newMarks,
    },
  });
};

export const getMarksByUrl = async (url: string) => {
  return (await bucket.get()).marks[url] || [];
};

export const clearMarksByUrl = async (url: string) => {
  const marks = await getAllMarks();
  await bucket.set({
    marks: {
      ...marks,
      [url]: [],
    },
  });
};

export const subscribe = (callback: () => void) => {
  bucket.changeStream.subscribe(callback);
};
