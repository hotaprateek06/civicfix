from pydantic import BaseModel, Field

class IssueCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=100)
    description: str = Field(..., min_length=10, max_length=500)
    user_id: int
    organization_id: int

class IssueUpdate(BaseModel):
    status: str