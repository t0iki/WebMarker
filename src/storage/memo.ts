import { getBucket } from "@extend-chrome/storage";
import { Memos, Memo } from "../types/memo";

const bucket = getBucket<Memos>("memos");

export const setMemo = async ({ url, memo }: { url: string; memo: Memo }) => {
  const memos = await getAllMemos();
  await bucket.set({
    memos: {
      ...memos,
      [url]: [...(memos?.[url] || []), memo],
    },
  });
};

export const getAllMemos = async () => {
  return (await bucket.get()).memos;
};

export const overwriteMemosByUrl = async (newMemos: Memo[], url: string) => {
  const memos = await getAllMemos();
  await bucket.set({
    memos: {
      ...memos,
      [url]: newMemos,
    },
  });
};

export const getMemosByUrl = async (url: string) => {
  return (await bucket.get()).memos[url] || [];
};

export const clearMemosByUrl = async (url: string) => {
  const memos = await getAllMemos();
  await bucket.set({
    memos: {
      ...memos,
      [url]: [],
    },
  });
};

export const subscribe = (callback: () => void) => {
  bucket.changeStream.subscribe(callback);
};
