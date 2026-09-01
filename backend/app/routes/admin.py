from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.issue import Issue

router = APIRouter(prefix="/admin", tags=["Admin"])


# ------------------------
# DB
# ------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------
# ✅ ADMIN STATS
# ------------------------
@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    issues = db.query(Issue).all()

    total = len(issues)
    pending = len([i for i in issues if i.status == "pending"])
    in_progress = len([i for i in issues if i.status == "in_progress"])
    resolved = len([i for i in issues if i.status == "resolved"])

    resolved_percent = (resolved / total * 100) if total > 0 else 0

    # 📊 CATEGORY COUNT
    categories = {}
    for i in issues:
        cat = i.category or "unknown"
        categories[cat] = categories.get(cat, 0) + 1

    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "resolved_percent": round(resolved_percent, 2),
        "categories": categories
    }

@router.get("/admin/analytics")
def get_analytics(db: Session = Depends(get_db)):
    issues = db.query(Issue).all()

    result = {}

    for issue in issues:
        org_id = issue.organization_id

        if org_id not in result:
            result[org_id] = 0

        result[org_id] += 1

    return result