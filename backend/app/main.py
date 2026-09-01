from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.db.database import engine, Base
from app.models import user, issue

from app.routes import user as user_routes
from app.routes import issue as issue_routes
from app.routes import notification_routes
from app.routes import comment
from app.routes import admin

app = FastAPI()

# ✅ CORS FIX (PUT THIS AT TOP BEFORE ROUTES)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",  # local dev
    "https://frontend-lovat-eight-25.vercel.app",],  # 👈 IMPORTANT (NOT "*")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# DB
Base.metadata.create_all(bind=engine)

# Static
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(user_routes.router)
app.include_router(issue_routes.router)
app.include_router(notification_routes.router)
app.include_router(comment.router)
app.include_router(admin.router)

@app.get("/")
def home():
    return {"message": "CivicFix Running 🚀"}