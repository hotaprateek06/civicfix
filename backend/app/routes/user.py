from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password
from app.schemas.user import UserLogin
from app.core.security import verify_password
from app.auth import create_access_token
router = APIRouter()

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Register API
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    # ✅ VALIDATION FOR ORGANIZATION
    if user.role == "organization":
        if not user.city or not user.type:
            return {"error": "Organization must provide city and type"}

    # ✅ CREATE USER
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        city=user.city if user.role == "organization" else None,
        type=user.type if user.role == "organization" else None
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}
from app.auth import create_access_token

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    # ❌ user not found
    if not db_user:
        return {"error": "Invalid credentials"}

    # ✅ VERIFY HASHED PASSWORD
    if not verify_password(user.password, db_user.password):
        return {"error": "Invalid credentials"}

    # ✅ CREATE JWT TOKEN
    token = create_access_token({
        "user_id": db_user.id,
        "role": db_user.role
    })

    return {
        "access_token": token,
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "role": db_user.role
        }
    }

@router.get("/organizations")
def get_organizations(db: Session = Depends(get_db)):
    orgs = db.query(User).filter(User.role == "organization").all()

    return [
        {
            "id": org.id,
            "name": org.name
        }
        for org in orgs
    ]

