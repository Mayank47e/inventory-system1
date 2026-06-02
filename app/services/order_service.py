from sqlalchemy.orm import Session
from app.models.domain import Product, Order
from app.schemas.schemas import OrderCreate

class OrderService:
    @staticmethod
    def create_order(db: Session, order_data: OrderCreate):
        total_amount = 0
        
        # 1. VERIFY STOCK & CALCULATE MATH
        for item in order_data.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            
            if not product:
                raise Exception("Product not found in the database.")
                
            # THE CORE REQUIREMENT: Prevent order if stock is too low!
            if product.quantity_in_stock < item.quantity:
                raise Exception(f"Insufficient stock for '{product.name}'. You only have {product.quantity_in_stock} left!")
                
            total_amount += (float(product.price) * item.quantity)
            
            # THE CORE REQUIREMENT: Automatic stock reduction!
            product.quantity_in_stock -= item.quantity
            
        # 2. CREATE THE FINAL ORDER
        new_order = Order(
            customer_id=order_data.customer_id,
            total_amount=total_amount
        )
        
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        return new_order