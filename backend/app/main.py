from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth as auth_routes
from app.routes import user as user_routes
from app.routes import upload
from app.routes import search
from app.routes import reset
from app.routes import contact
from app.routes import user_profile
from app.routes import payment 
from app.routes import analytics
from app import database
from app.models import users
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
import os
from app.routes import tenant



load_dotenv()
app = FastAPI() 


# BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
# UPLOADS_PATH = os.path.join(BASE_DIR, "uploads")


app.add_middleware(
    CORSMiddleware,
      allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "http://192.168.1.249:3000",
        "http://192.168.1.152:3000", 
        "http://165.22.78.252" 
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

    # Super Admin
    super_admin_email = "superadmin@example.com"
    existing_super = db.query(users.User).filter(users.User.email == super_admin_email).first()
    if not existing_super:
        super_admin_user = users.User(
            first_name="Super",
            last_name="Admin",
            email=super_admin_email,
            hashed_password=auth.hash_password("StrongPassword123!"),
            role="super_admin",
            is_approved=True,
            tenant_id=2
        )
        db.add(super_admin_user)
        print("Super admin user created:", super_admin_email)

    # Regular Admin
    admin_email = "admin@example.com"
    existing_admin = db.query(users.User).filter(users.User.email == admin_email).first()
    if not existing_admin:
        admin_user = users.User(
            first_name="Admin",
            last_name="User",
            email=admin_email,
            hashed_password=auth.hash_password("AdminPassword123"),
            role="admin",
            is_approved=True
        )
        db.add(admin_user)
        print("Admin user created:", admin_email)

    db.commit()
    db.close()


# Include Routers
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/documents", tags=["Documents"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(search.router, prefix="/search", tags=["Search"])
app.include_router(reset.router, prefix="/reset", tags=["Reset"])
app.include_router(contact.router, prefix="/contact", tags=["Contact"])
app.include_router(user_profile.router)
app.include_router(payment.router)
app.include_router(analytics.router)
# app.mount("/uploads", StaticFiles(directory=UPLOADS_PATH), name="uploads")
app.include_router(tenant.router, prefix="/tenants", tags=["Tenants"])


