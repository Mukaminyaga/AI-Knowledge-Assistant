from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .database import engine
from .routes import user, upload
from dotenv import load_dotenv

load_dotenv()  # Load .env variables for auth.py

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Knowledge Management Assistant can now Begin!"}

@app.on_event("startup")
def startup():
    database.Base.metadata.create_all(bind=database.engine)
    from . import auth
    db = database.SessionLocal()
    admin_email = "admin@example.com"
    existing_admin = db.query(models.User).filter(models.User.email == admin_email).first()
    if not existing_admin:
        admin_user = models.User(
            first_name="Super",
            last_name="Admin",
            email=admin_email,
            hashed_password=auth.hash_password("AdminPassword123"),
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created:", admin_email)
    db.close()

# Create tables
models.Base.metadata.create_all(bind=engine)

# Routes
app.include_router(user.router, prefix="/auth", tags=["auth"])
app.include_router(upload.router, prefix="/documents", tags=["documents"])
