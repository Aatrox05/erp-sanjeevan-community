from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class User(BaseModel):
    id: int
    username: str
    email: str | None = None

# in-memory example store
_db = [
    {"id": 1, "username": "admin", "email": "admin@example.com"}
]

@router.get("/", response_model=List[User])
def list_users():
    return _db

@router.get("/{user_id}", response_model=User)
def get_user(user_id: int):
    for u in _db:
        if u["id"] == user_id:
            return u
    raise HTTPException(status_code=404, detail="User not found")

@router.post("/", response_model=User)
def create_user(user: User):
    _db.append(user.dict())
    return user

@router.put("/{user_id}", response_model=User)
def update_user(user_id: int, user: User):
    for i, u in enumerate(_db):
        if u["id"] == user_id:
            _db[i] = user.dict()
            return _db[i]
    raise HTTPException(status_code=404, detail="User not found")

@router.delete("/{user_id}")
def delete_user(user_id: int):
    for i, u in enumerate(_db):
        if u["id"] == user_id:
            _db.pop(i)
            return {"msg": "deleted"}
    raise HTTPException(status_code=404, detail="User not found")