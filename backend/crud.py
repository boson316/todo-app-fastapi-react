from typing import List, Optional

from sqlalchemy.orm import Session

import models
import schemas


def get_todos(db: Session) -> List[models.Todo]:
    return db.query(models.Todo).order_by(models.Todo.created_at.desc()).all()


def get_todo(db: Session, todo_id: int) -> Optional[models.Todo]:
    return db.query(models.Todo).filter(models.Todo.id == todo_id).first()


def create_todo(db: Session, todo_in: schemas.TodoCreate) -> models.Todo:
    db_todo = models.Todo(
        title=todo_in.title,
        description=todo_in.description,
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


def update_todo(db: Session, todo_id: int, todo_in: schemas.TodoUpdate) -> Optional[models.Todo]:
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return None

    update_data = todo_in.dict(exclude_unset=True, by_alias=False)

    for field, value in update_data.items():
        setattr(db_todo, field, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo


def delete_todo(db: Session, todo_id: int) -> bool:
    db_todo = get_todo(db, todo_id)
    if not db_todo:
        return False
    db.delete(db_todo)
    db.commit()
    return True

