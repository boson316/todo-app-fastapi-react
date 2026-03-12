from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TodoBase(BaseModel):
    title: str
    # 內部欄位名稱為 description，但允許前端/請求用 "desc"
    description: Optional[str] = Field(default=None, alias="desc")

    class Config:
        populate_by_name = True


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = Field(default=None, alias="desc")
    completed: Optional[bool] = None

    class Config:
        populate_by_name = True


class Todo(TodoBase):
    id: int
    completed: bool
    created_at: datetime

    class Config:
        orm_mode = True

