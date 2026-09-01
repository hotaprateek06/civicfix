from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.db.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String)

    is_read = Column(Integer, default=0)  # 0 = unread, 1 = read

    created_at = Column(DateTime, default=datetime.utcnow)