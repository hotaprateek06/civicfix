from fastapi import APIRouter, Depends, File, UploadFile, Form, Query
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.issue import Issue
from app.models.notification import Notification
from app.models.user import User
from app.dependencies import get_current_user
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ------------------------
# DB DEPENDENCY
# ------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------
# ✅ CREATE ISSUE (UPDATED WITH LAT/LNG)
# ------------------------
@router.post("/issues")
def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    user_id: int = Form(...),
    location: str = Form(...),
    category: str = Form(...),
    priority: str = Form(...),

    # ✅ NEW
    latitude: str = Form(None),
    longitude: str = Form(None),

    file: UploadFile = File(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 🔒 AUTH CHECK
    if current_user["user_id"] != user_id:
        return {"error": "Unauthorized"}

    # 🔥 FIND ORGANIZATION
    org = db.query(User).filter(
        User.role == "organization",
        User.city == location,
        User.type == category
    ).first()

    if not org:
        return {"error": "No organization found"}

    if priority not in ["low", "medium", "high"]:
        return {"error": "Invalid priority"}

    # 📁 SAVE IMAGE
    file_path = None
    if file:
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    # 🧾 CREATE ISSUE
    new_issue = Issue(
        title=title,
        description=description,
        user_id=user_id,
        organization_id=org.id,
        location=location,
        category=category,
        priority=priority,
        image=file_path,
        status="pending",

        # ✅ STORE LAT/LNG
        latitude=latitude,
        longitude=longitude
    )

    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)

    # 🔔 NOTIFY ORG
    notification = Notification(
        user_id=org.id,
        message=f"New issue: {title} ({category} - {location})"
    )
    db.add(notification)
    db.commit()

    return {"message": "Issue sent successfully"}


# ------------------------
# ✅ GET ALL ISSUES
# ------------------------
@router.get("/issues")
def get_issues(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Issue).all()


# ------------------------
# ✅ USER ISSUES
# ------------------------
@router.get("/issues/user/{user_id}")
def get_user_issues(
    user_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Issue).filter(Issue.user_id == user_id).all()


# ------------------------
# ✅ ORG ISSUES
# ------------------------
@router.get("/issues/org/{org_id}")
def get_org_issues(
    org_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Issue).filter(Issue.organization_id == org_id).all()


# ------------------------
# ✅ GET SINGLE ISSUE
# ------------------------
@router.get("/issues/{issue_id}")
def get_issue(
    issue_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()

    if not issue:
        return {"error": "Issue not found"}

    return issue


# ------------------------
# ✅ UPDATE STATUS
# ------------------------
@router.put("/issues/{issue_id}/status")
def update_issue_status(
    issue_id: int,
    status: str = Query(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()

    if not issue:
        return {"error": "Issue not found"}

    if status not in ["pending", "in_progress", "resolved"]:
        return {"error": "Invalid status"}

    issue.status = status

    # 🔔 NOTIFY USER
    notification = Notification(
        user_id=issue.user_id,
        message=f"Your issue '{issue.title}' is now {status}"
    )

    db.add(notification)
    db.commit()

    return {"message": f"Issue marked as {status}"}