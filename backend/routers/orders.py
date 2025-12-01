from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class OrderItem(BaseModel):
    product_id: int
    qty: int

class Order(BaseModel):
    id: int
    user_id: int
    items: List[OrderItem]

_db = []

@router.get("/", response_model=List[Order])
def list_orders():
    return _db

@router.post("/", response_model=Order)
def create_order(order: Order):
    _db.append(order.dict())
    return order

@router.get("/{order_id}", response_model=Order)
def get_order(order_id: int):
    for o in _db:
        if o["id"] == order_id:
            return o
    raise HTTPException(status_code=404, detail="Order not found")
