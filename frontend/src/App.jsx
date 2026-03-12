import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";

const THEME_KEY = "todo-theme";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handleCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors">
      <div className="w-full max-w-3xl py-10">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Todo App</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              FastAPI + React，支援即時更新與內聯編輯。
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === "dark" ? "☀ 切換為淺色" : "🌙 切換為深色"}
          </button>
        </header>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="order-2 md:order-1">
            <h2 className="text-lg font-semibold mb-2">待辦列表</h2>
            <div className="rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-4 shadow-sm dark:shadow-none">
              <TodoList refreshKey={refreshKey} />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <TodoForm onCreated={handleCreated} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

