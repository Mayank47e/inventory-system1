from pydantic import BaseModel, ConfigDict, Field, EmailStr
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class StandardResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None

class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(gt=0)

class OrderCreate(BaseModel):
    customer_id: UUID
    items: List[OrderItemCreate]

class DashboardStats(BaseModel):
    total_products: int
    total_customers: int
    total_orders: int
    low_stock_products: List[dict]

# WE ADDED THIS: It tells the backend what to expect when adding a product!
class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    quantity_in_stock: int
# WE ADDED THIS: Tells the backend what to expect when adding a customer
class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None