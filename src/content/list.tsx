import { useEffect, useState } from "preact/hooks";
import { getAllMemos, getMemosByUrl, subscribe } from "../storage/memo";
import { Memo, Memos } from "../types/memo";

export const List = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [memosByUrl, setMemosByUrl] = useState<Memo[]>([]);
  const [memosAll, setMemosAll] = useState<Record<string, Memo[]>>({});

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  // マークの変更をサブスクライブして、更新フラグをセット
  useEffect(() => {
    subscribe(() => {
      setShouldFetch(true);
    });
  }, []);

  // マークを取得する非同期関数
  const fetchData = async () => {
    try {
      setLoading(true);
      if (isAll) {
        const memos = await getAllMemos();
        setMemosAll(memos);
      } else {
        const memos = await getMemosByUrl(location.href);
        setMemosByUrl(memos);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false);
    }
  }, [shouldFetch]);

  const onClickAll = async () => {
    setIsAll(!isAll);
    setShouldFetch(true);
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`fixed top-2 px-2 py-2 bg-blue-500 text-white rounded hover:right-0 transition-all duration-300`}
        style={{
          right: isOpen ? "50%" : "-4px",
          zIndex: 100000000,
        }}
      >
        {isOpen ? ">" : "<"}
      </button>
      {isOpen && (
        <div
          className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg transition-transform duration-500 overflow-auto"
          style={{
            transform: isOpen ? "translateX(0)" : "translateX(100%)", // アニメーションを直接スタイルで適用
            zIndex: 100000000,
          }}
        >
          <div className="p-4">
            <div className="flex gap-2 align items-center mb-4">
              <h1 className="text-xl font-bold text-black">メモ一覧</h1>
              <button onClick={onClickAll} className="px-2 bg-blue-500 text-white rounded">
                {isAll ? "すべて" : "このページ"}
              </button>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {isAll
                  ? Object.entries(memosAll).map(([url, memos]) => (
                      <li key={url} className="m-2 p-4 border">
                        <a className="block text-lg font-bold text-black truncate text-ellipsis" href={url}>
                          {url}
                        </a>
                        {memos.map((memo, idx) => (
                          <p key={idx} className="m-2 p-2 border text-sm text-gray-500">
                            {memo.text}
                          </p>
                        ))}
                      </li>
                    ))
                  : memosByUrl.map((memo, idx) => (
                      <li key={idx} className="m-2 p-4 border">
                        <p className="text-sm text-gray-500">{memo.text}</p>
                      </li>
                    ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};
