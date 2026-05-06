from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID


class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=20, 
                      description='user name')

class UserCreate(UserBase):
    pass

class User(BaseModel):
    id: UUID 
    name: str = Field(..., min_length=1, max_length=20, 
                      description='user name')
    model_config = ConfigDict(from_attributes=True)
    