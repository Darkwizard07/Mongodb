from pydantic import BaseModel, Field
from typing import List, Optional

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        from pydantic_core import core_schema
        return core_schema.str_schema()

class Evaluator(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: str

class ScoreItem(BaseModel):
    criteria: str
    score: int
    comments: Optional[str] = ""

class Evaluation(BaseModel):
    evaluatorId: str
    evaluatorName: str
    scores: List[ScoreItem]
    totalScore: int

class Submission(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    studentName: str
    projectTitle: str
    description: str
    status: str = "pending"
    evaluation: Optional[Evaluation] = None
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "studentName": "John Doe",
                "projectTitle": "Smart Hack",
                "description": "An AI platform...",
                "status": "pending"
            }
        }
