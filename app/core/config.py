from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Inventory & Order Management"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretkey_change_in_prod"
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    DATABASE_URL: str
    
    # We added these three to the VIP list!
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    
    class Config:
        env_file = ".env"
        extra = "ignore"  # This tells the bouncer to chill out

settings = Settings()