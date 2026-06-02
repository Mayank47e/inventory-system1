from sqlalchemy.exc import IntegrityError
from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db, engine, Base
from app.models.domain import Product, Customer, Order
from app.services.order_service import OrderService

# We updated this import line to include ProductCreate
from app.schemas.schemas import OrderCreate, ProductCreate, CustomerCreate
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=400,
        content={"success": False, "message": str(exc)}
    )

@app.get("/health")
def health_check():
    return {"success": True, "data": {"status": "ok"}}

@app.get(f"{settings.API_V1_STR}/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    products_count = db.query(Product).count()
    customers_count = db.query(Customer).count()
    orders_count = db.query(Order).count()
    low_stock = db.query(Product).filter(Product.quantity_in_stock < 10).all()
    
    return {
        "success": True,
        "data": {
            "total_products": products_count,
            "total_customers": customers_count,
            "total_orders": orders_count,
            "low_stock_products": [{"id": p.id, "name": p.name, "stock": p.quantity_in_stock} for p in low_stock]
        }
    }
# WE ADDED THIS: The mail slot to retrieve all products for our table
@app.get(f"{settings.API_V1_STR}/products")
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(Product).order_by(Product.name).all()
    return {
        "success": True,
        "data": [
            {
                "id": str(p.id),
                "name": p.name,
                "sku": p.sku,
                "price": float(p.price),
                "quantity_in_stock": p.quantity_in_stock
            } for p in products
        ]
    }
# WE ADDED THIS: The mail slot to receive new products
@app.post(f"{settings.API_V1_STR}/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    try:
        new_product = Product(**product.model_dump())
        db.add(new_product)
        db.commit()
        return {"success": True, "message": "Product added successfully!"}
    
    except IntegrityError:
        # If the DB panics (like a duplicate SKU), we tell it to rollback and unfreeze!
        db.rollback()
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": f"Wait! A product with SKU '{product.sku}' already exists."}
        )
    except Exception as e:
        db.rollback()
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": str(e)}
        )
# --- CUSTOMER ROUTES ---

@app.get(f"{settings.API_V1_STR}/customers")
def get_all_customers(db: Session = Depends(get_db)):
    customers = db.query(Customer).order_by(Customer.name).all()
    return {
        "success": True,
        "data": [
            {
                "id": str(c.id),
                "name": c.name,
                "email": c.email,
                "phone": c.phone
            } for c in customers
        ]
    }

@app.post(f"{settings.API_V1_STR}/customers")
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    try:
        new_customer = Customer(**customer.model_dump())
        db.add(new_customer)
        db.commit()
        return {"success": True, "message": "Customer added successfully!"}
    
    except IntegrityError:
        db.rollback()
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": f"Wait! A customer with email '{customer.email}' already exists."}
        )
    except Exception as e:
        db.rollback()
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": str(e)}
        )
@app.post(f"{settings.API_V1_STR}/orders")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    result = OrderService.create_order(db, order)
    return {"success": True, "data": {"order_id": str(result.id), "total": result.total_amount}}