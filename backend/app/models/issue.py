from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)
    description = Column(String)

    user_id = Column(Integer)
    organization_id = Column(Integer)

    # 🔹 Routing
    location = Column(String)
    category = Column(String)

    # 🔹 Priority
    priority = Column(String)

    # 🔹 Image
    image = Column(String)

    # 🔹 Status
    status = Column(String)

    # ✅ NEW (for Google Maps exact location)
    latitude = Column(String, nullable=True)
    longitude = Column(String, nullable=True)