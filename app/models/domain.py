from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.session import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    sku = Column(String(100), unique=True, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    quantity_in_stock = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint('price > 0', name='check_price_positive'),
        CheckConstraint('quantity_in_stock >= 0', name='check_stock_non_negative'),
    )

class Customer(Base):
    __tablename__ = "customers"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone_number = Column(String(30))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    orders = relationship("Order", back_populates="customer")

class Order(Base):
    __tablename__ = "orders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"))
    total_amount = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

    __table_args__ = (
        CheckConstraint('quantity > 0', name='check_qty_positive'),
        CheckConstraint('unit_price > 0', name='check_unit_price_positive'),
    )