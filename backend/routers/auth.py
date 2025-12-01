from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter()

class LoginIn(BaseModel):
    username: str
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn):
    # TODO: replace with real auth (DB check + JWT)
    if payload.username == "admin" and payload.password == "password":
        return {"access_token": "fake-jwt-token"}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

@router.post("/register")
def register(payload: LoginIn):
    # TODO: create user in DB
    return {"msg": "user registered", "username": payload.username}
