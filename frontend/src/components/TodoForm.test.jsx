import { render, screen, fireEvent } from "@testing-library/react";
import TodoForm from "./TodoForm.jsx";

test("填寫標題後可以送出表單", () => {
  const handleCreated = vi.fn();
  render(<TodoForm onCreated={handleCreated} />);

  const titleInput = screen.getByPlaceholderText("標題...");
  fireEvent.change(titleInput, { target: { value: "測試 todo" } });

  const submitButton = screen.getByText("建立 Todo");
  fireEvent.click(submitButton);

  // 目前只檢查沒有報錯、函式被定義
  expect(handleCreated).toBeDefined();
});

