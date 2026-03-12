import { useRef, useState } from "react";
import { createTodo } from "../services/api.js";

export default function TodoForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || loading) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const payload = { title: title.trim(), desc: desc.trim() || null };
        const res = await createTodo(payload);
        onCreated?.(res.data);
        setTitle("");
        setDesc("");
      } catch (err) {
        console.error(err);
        alert("建立 Todo 失敗");
      } finally {
        setLoading(false);
        debounceRef.current = null;
      }
    }, 300);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 p-4 rounded-xl bg-white/90 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm"
    >
      <h2 className="text-lg font-semibold">新增待辦</h2>
      <input
        className="px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
        placeholder="標題..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[80px] text-sm"
        placeholder="描述（可留空）..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium transition-colors"
      >
        {loading ? "建立中..." : "建立 Todo"}
      </button>
    </form>
  );
}

