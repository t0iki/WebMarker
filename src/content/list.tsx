import { useEffect, useState } from "preact/hooks";
import { getMarksByUrl, subscribe } from "../storage/mark";
import { Mark } from "../types/mark";

export const List = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]);

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
      const marks = await getMarksByUrl(window.location.href);
      setMarks(marks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // isUpdated が true になったらデータを再取得
  useEffect(() => {
    if (shouldFetch) {
      fetchData();
      setShouldFetch(false); // 再度データを取得するのを防ぐためフラグをリセット
    }
  }, [shouldFetch]);

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
          className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg transition-transform duration-500"
          style={{
            transform: isOpen ? "translateX(0)" : "translateX(100%)", // アニメーションを直接スタイルで適用
            zIndex: 100000000,
          }}
        >
          <div className="p-4">
            <h1 className="text-xl font-bold mb-4">メモ一覧</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {marks.map((mark, idx) => (
                  <li key={idx} className="m-4 border">
                    <p className="text-sm text-gray-500">{mark.text}</p>
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
