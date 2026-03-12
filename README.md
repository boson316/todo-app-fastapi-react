# Todo App – FastAPI + React

[![Deploy to GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-222222?logo=githubpages)](https://<user>.github.io/todo-app-fastapi-react/)
[![Backend on Railway](https://img.shields.io/badge/backend-Railway-0B0D0E?logo=railway)](https://fastapi-todo.up.railway.app/docs)
[![GitHub stars](https://img.shields.io/github/stars/<user>/todo-app-fastapi-react?style=social)](https://github.com/<user>/todo-app-fastapi-react)

簡單但完整的全端待辦清單專案，後端使用 **FastAPI + SQLite**，前端使用 **React + Vite + TailwindCSS**，支援深色模式、內聯編輯、搜尋 / 排序與自動重新整理。

> 建議先在本機完成開發，再將前端部署到 Vercel，後端部署到 Render。

---

## Demo

- 前端（Vercel）：`https://your-todo-frontend.vercel.app`
- 後端（Render / Railway）：`https://your-todo-backend.onrender.com`

請將上面的網址替換成你實際部署後的網址。

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

## 部署 – 後端 (Render 範例)

1. 將 `backend/` push 到 GitHub。
2. 前往 Render，建立 **New Web Service**，連結 GitHub repo。
3. 設定：
   - Build command: `pip install -r backend/requirements.txt`
   - Start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port 10000`
   - Python version 選擇支援的 3.12（避免 3.13 的相容性問題）。
4. 在 Render 的「環境變數」中加入：
   - `DB_URL=sqlite:///./todos.db`（或你自己的雲端 DB）
5. 部署完成後，記下後端網址，例如：`https://your-todo-backend.onrender.com`

---

## 部署 – 前端 (Vercel 範例)

1. 將 `frontend/` push 到 GitHub（可與 backend 在同一 repo）。
2. 前往 Vercel，**New Project** → 選擇你的 repo。
3. Framework 選擇 **Vite**。
4. 設定：
   - Build Command: `npm run build`
   - Output Directory: `frontend/dist`
5. 在 Vercel 設定環境變數：
   - `VITE_API_BASE_URL=https://your-todo-backend.onrender.com`
6. 部署完成後，前端會用 `VITE_API_BASE_URL` 作為 axios baseURL。

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

你可以在本機跑起前後端後，使用瀏覽器截圖（Swagger 頁面 + 前端 Todo 畫面），放進這個 README，方便之後 demo 或履歷使用。

