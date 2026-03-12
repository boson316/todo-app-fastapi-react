import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
});

export const getTodos = () => api.get("/todos");

export const createTodo = (data) => api.post("/todos", data);

export const updateTodo = (id, data) => api.put(`/todos/${id}`, data);

export const deleteTodo = (id) => api.delete(`/todos/${id}`);

export default api;

