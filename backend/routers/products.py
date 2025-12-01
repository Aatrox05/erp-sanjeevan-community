from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Product(BaseModel):
    id: int
    name: str
    price: float

_db = [
    {"id": 1, "name": "Sample Product", "price": 10.0}
]

@router.get("/", response_model=List[Product])
def list_products():
    return _db

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int):
    for p in _db:
        if p["id"] == product_id:
            return p
    raise HTTPException(status_code=404, detail="Product not found")

@router.post("/", response_model=Product)
def create_product(product: Product):
    _db.append(product.dict())
    return product

@router.put("/{product_id}", response_model=Product)
def update_product(product_id: int, product: Product):
    for i, p in enumerate(_db):
        if p["id"] == product_id:
            _db[i] = product.dict()
            return _db[i]
    raise HTTPException(status_code=404, detail="Product not found")

@router.delete("/{product_id}")
def delete_product(product_id: int):
    for i, p in enumerate(_db):
        if p["id"] == product_id:
            _db.pop(i)
            return {"msg": "deleted"}
    raise HTTPException(status_code=404, detail="Product not found")
