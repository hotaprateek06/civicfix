from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.comment import Comment
from fastapi import Form

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ ADD COMMENT
@router.post("/comments")
def add_comment(
    issue_id: int = Form(...),
    user_id: int = Form(...),
    text: str = Form(...),
    db: Session = Depends(get_db)
):
    new_comment = Comment(
        issue_id=issue_id,
        user_id=user_id,
        text=text
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return {"message": "Comment added"}


# ✅ GET COMMENTS FOR ISSUE
@router.get("/comments/{issue_id}")
def get_comments(issue_id: int, db: Session = Depends(get_db)):
    return db.query(Comment)\
        .filter(Comment.issue_id == issue_id)\
        .order_by(Comment.created_at.asc())\
        .all()