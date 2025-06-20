from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth as auth_routes
from app.routes import user as user_routes
from app.routes import upload
from app import database
from app.models import users
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
      allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "http://192.168.1.249:3000" 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Knowledge Management Assistant can now Begin!"}

@app.on_event("startup")
def startup():
    database.Base.metadata.create_all(bind=database.engine)
    from app import auth
    db = database.SessionLocal()
    admin_email = "admin@example.com"
    existing_admin = db.query(users.User).filter(users.User.email == admin_email).first()
    if not existing_admin:
        admin_user = users.User(
            first_name="Super",
            last_name="Admin",
            email=admin_email,
            hashed_password=auth.hash_password("AdminPassword123"),
            role="admin",
            is_approved=True
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created:", admin_email)
    db.close()

# Include Routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
# app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(upload.router, prefix="/documents", tags=["Documents"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])

