import { useEffect, useMemo, useState } from "react";
import { deleteTodo, getTodos, updateTodo } from "../services/api.js";

const STORAGE_KEY = "todo-app-cache";

export default function TodoList({ refreshKey, onChanged }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_desc");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDesc, setEditingDesc] = useState("");

  const applyPersistence = (items) => {
    setTodos(items);
    onChanged?.(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  };

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await getTodos();
      applyPersistence(res.data);
    } catch (err) {
      console.error(err);
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          setTodos(JSON.parse(cached));
        } else {
          alert("取得 Todo 列表失敗");
        }
      } catch {
        alert("取得 Todo 列表失敗");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 載入 localStorage 快取（如果有）
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        setTodos(JSON.parse(cached));
        setLoading(false);
      }
    } catch {
      // ignore
    }
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  useEffect(() => {
    const id = setInterval(fetchTodos, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = async (todo) => {
    try {
      const res = await updateTodo(todo.id, {
        title: todo.title,
        desc: todo.desc,
        completed: !todo.completed,
      });
      applyPersistence(
        todos.map((t) => (t.id === todo.id ? res.data : t))
      );
    } catch (err) {
      console.error(err);
      alert("更新 Todo 失敗");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("確認刪除？")) return;
    try {
      await deleteTodo(id);
      applyPersistence(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("刪除 Todo 失敗");
    }
  };

  const handleEditStart = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
    setEditingDesc(todo.desc ?? "");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingDesc("");
  };

  const handleEditSave = async () => {
    if (!editingTitle.trim()) {
      handleEditCancel();
      return;
    }
    const target = todos.find((t) => t.id === editingId);
    if (!target) return;
    try {
      const res = await updateTodo(editingId, {
        title: editingTitle.trim(),
        desc: editingDesc.trim() || null,
        completed: target.completed,
      });
      applyPersistence(
        todos.map((t) => (t.id === editingId ? res.data : t))
      );
      handleEditCancel();
    } catch (err) {
      console.error(err);
      alert("更新 Todo 失敗");
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter((t) => t.completed);
    if (!completed.length) return;
    if (!confirm(`確認刪除 ${completed.length} 筆已完成項目？`)) return;

    try {
      await Promise.all(completed.map((t) => deleteTodo(t.id)));
      applyPersistence(todos.filter((t) => !t.completed));
    } catch (err) {
      console.error(err);
      alert("清除已完成項目失敗");
    }
  };

  const filteredTodos = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = todos;
    if (term) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.desc || "").toLowerCase().includes(term)
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "created_asc") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (sortBy === "completed_first") {
        if (a.completed === b.completed) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return a.completed ? -1 : 1;
      }
      if (sortBy === "active_first") {
        if (a.completed === b.completed) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return a.completed ? 1 : -1;
      }
      // created_desc
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [todos, search, sortBy]);

  if (loading && !todos.length) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1">
          <input
            className="w-full px-3 py-2 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            placeholder="搜尋標題或描述..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center mt-1 md:mt-0">
          <select
            className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_desc">最新在前</option>
            <option value="created_asc">最早在前</option>
            <option value="active_first">未完成優先</option>
            <option value="completed_first">已完成優先</option>
          </select>
          <button
            type="button"
            onClick={handleClearCompleted}
            className="text-xs px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
            disabled={!todos.some((t) => t.completed)}
          >
            清除完成
          </button>
        </div>
      </div>

      {!filteredTodos.length ? (
        <p className="text-sm text-slate-400 text-center py-6">
          目前沒有符合條件的待辦。
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {filteredTodos.map((todo) => {
            const isEditing = editingId === todo.id;
            return (
              <li
                key={todo.id}
                className={`flex items-start justify-between gap-3 px-3 py-2 rounded-lg border transition-colors bg-white dark:bg-slate-900 ${
                  todo.completed ? "border-emerald-400" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-2 flex-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                    className="mt-1 h-4 w-4 rounded border-slate-400 text-emerald-500 focus:ring-emerald-500"
                  />

                  <div
                    className="flex-1"
                    onDoubleClick={() => handleEditStart(todo)}
                  >
                    {isEditing ? (
                      <div className="space-y-1">
                        <input
                          className="w-full px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleEditSave();
                            if (e.key === "Escape") handleEditCancel();
                          }}
                          autoFocus
                        />
                        <textarea
                          className="w-full px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[60px]"
                          value={editingDesc}
                          onChange={(e) => setEditingDesc(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") handleEditCancel();
                          }}
                        />
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            onClick={handleEditCancel}
                            className="text-xs px-2 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100"
                          >
                            取消
                          </button>
                          <button
                            type="button"
                            onClick={handleEditSave}
                            className="text-xs px-2 py-1 rounded-md bg-sky-500 hover:bg-sky-400 text-white"
                          >
                            儲存
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          className={`font-medium transition-all duration-200 ${
                            todo.completed
                              ? "line-through text-emerald-500"
                              : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {todo.title}
                        </div>
                        {todo.desc && (
                          <div className="text-xs text-slate-400 mt-1">
                            {todo.desc}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-xs px-2 py-1 rounded-md bg-rose-500 hover:bg-rose-400 text-white"
                >
                  刪除
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

