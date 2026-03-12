# Todo App – FastAPI + React

[![Deploy to GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-222222?logo=githubpages)](https://boson316.github.io/todo-app-fastapi-react/)
[![Backend on Railway](https://img.shields.io/badge/backend-Railway-0B0D0E?logo=railway)](https://todo-app-fastapi-react-production.up.railway.app/docs)
[![GitHub stars](https://img.shields.io/github/stars/boson316/todo-app-fastapi-react?style=social)](https://github.com/boson316/todo-app-fastapi-react)

簡單但完整的全端待辦清單專案，後端使用 **FastAPI + SQLite**，前端使用 **React + Vite + TailwindCSS**，支援深色模式、內聯編輯、搜尋 / 排序與自動重新整理。

> 建議先在本機完成開發，再將前端部署到 Vercel，後端部署到 Render。

---

## Demo

- 前端（GitHub Pages）：`https://boson316.github.io/todo-app-fastapi-react/`
- 後端（Railway）：`https://todo-app-fastapi-react-production.up.railway.app/docs`

---

## 專案結構

```text
todo-app/
├── backend/          # FastAPI API
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── database.py
│   ├── .env          # DB_URL=sqlite:///./todos.db
│   └── requirements.txt
├── frontend/         # React + Vite App
│   ├── index.html
│   ├── vite.config.mts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── TodoList.jsx
│       │   └── TodoForm.jsx
│       └── services/api.js
└── README.md
```

---

## 技術棧 (Tech Stack)

- **後端**
  - FastAPI
  - SQLAlchemy + SQLite
  - Uvicorn
  - Pydantic v2

- **前端**
  - React 18
  - Vite 5
  - TailwindCSS 3
  - Axios
  - React Router DOM 6

- **測試**
  - 後端：pytest + httpx TestClient
  - 前端：Vitest + React Testing Library（可再擴充）

---

## 後端啟動 (本機)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# .env 裡預設
# DB_URL=sqlite:///./todos.db

uvicorn main:app --reload
```

打開瀏覽器：`http://127.0.0.1:8000/docs` 可以看到自動產生的 Swagger API 文件。

---

## 前端啟動 (本機)

```bash
cd frontend
npm install
npm run dev
```

開啟：`http://localhost:5173`

> 開發模式下，前端預設呼叫 `http://localhost:8000` 的 FastAPI API。

---

## API 說明

Base URL：`/`

- `GET /todos` – 取得所有 todos（依 `created_at` 排序）
- `POST /todos` – 建立新 todo
  - Request body：
    ```json
    {
      "title": "string",
      "desc": "string | null"
    }
    ```
- `GET /todos/{id}` – 取得單筆 todo
- `PUT /todos/{id}` – 更新 todo（title / desc / completed）
  - Request body 範例：
    ```json
    {
      "title": "updated title",
      "desc": "updated desc",
      "completed": true
    }
    ```
- `DELETE /todos/{id}` – 刪除 todo

詳細 schema 可在 `http://127.0.0.1:8000/docs` 查看。

---

## UI 功能簡介

- 深色 / 淺色主題切換（Tailwind dark mode，記錄在 localStorage）
- RWD：在手機 / 平板 / 桌機皆有良好排版
- 紅綠色區分完成狀態：
  - 未完成：紅色重點（文字 / 邊框）
  - 已完成：綠色重點 + 刪除線
- Todo 列表
  - 勾選完成 / 取消完成
  - 雙擊文字區塊可「內聯編輯」標題與描述
  - 搜尋框（標題 + 描述）
  - 排序（最新 / 最舊 / 未完成優先 / 已完成優先）
  - 清除所有已完成項目按鈕
  - 每 5 秒自動重新抓一次清單
  - localStorage 快取：離線時仍能看到最後一次清單

---

## 部署 – 後端 (Railway)

1. 將 `backend/` push 到 GitHub。
2. 前往 Railway，建立 **New Project**，連結此 repo。
3. 建立 service，Root directory 設為 `backend`，並設定：
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - Python version 建議使用 3.12（避免部分套件尚未完全支援 3.13）。
4. 在 Railway 的「環境變數」中加入：
   - `DB_URL=sqlite:///./todos.db`（或你自己的雲端 DB）
5. 部署完成後，記下後端網址，例如：`https://todo-app-fastapi-react-production.up.railway.app`

> 注意：Railway 免費方案使用 SQLite，重新部署或服務休眠後資料可能清空，適合作為 Demo 或 Side Project 使用。若要長期穩定可考慮換 PostgreSQL 並更新 `DB_URL`。

---

## 部署 – 前端 (GitHub Pages)

1. 將整個 `todo-app` push 到 GitHub。
2. 使用 `.github/workflows/gh-pages.yml`（本 repo 已提供），在 push 到 `main` 時：
   - 進入 `frontend/` 安裝依賴並 build
   - 將 `frontend/dist` 自動部署到 GitHub Pages
3. 在 GitHub repo 的 `Settings` → `Pages` 中，確認 Source 選擇 GitHub Actions。

> 目前 `services/api.js` 已改成讀取 `import.meta.env.VITE_API_BASE_URL`，本機開發可在 `frontend/.env.local` 設定，GitHub Pages / Vercel 則在環境變數中設定。

---

## 測試

### 後端 – pytest

在 `backend/` 建議新增：

```bash
pip install pytest
pytest
```

你可以建立 `backend/tests/test_todos.py`，使用 FastAPI 的 `TestClient` 寫一些簡單的 CRUD 測試。

### 前端 – Vitest

1. 安裝測試相關套件：

```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

2. 在 `package.json` 加上：

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest"
}
```

3. 建立 `vitest.config.mts` 並設定 `test.environment = "jsdom"`，再於 `src/` 下新增簡單的 render 測試即可。

---

## 截圖

（以下為示意，你可以用實際部署畫面更新這些截圖）

前端畫面（淺色版）：

![Todo App UI](./docs/screenshot-frontend.png)

後端 Swagger：

![FastAPI Swagger](./docs/screenshot-swagger.png)

