from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str   # user / organization / admin

    # ✅ NEW FIELDS
    city: Optional[str] = None
    type: Optional[str] = None   # electricity / water / road


class UserLogin(BaseModel):
    email: EmailStr
    password: str