from sqlalchemy import Column, Integer, String
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    # roles: user / organization / admin
    role = Column(String, nullable=False)

    # ✅ for smart routing
    type = Column(String, nullable=True)   # electricity / water / road
    city = Column(String, nullable=True)   # sambalpur / bbsr