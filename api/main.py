from fastapi import FastAPI, Body, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from bson import ObjectId

from database import submissions_collection, evaluators_collection
from models import Submission, Evaluator, Evaluation

app = FastAPI(title="Hackathon Management API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://mongodb-six-fawn.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/ping")
async def ping():
    return {"message": "pong"}

@app.post("/api/submissions", response_model=Submission, status_code=status.HTTP_201_CREATED)
async def create_submission(submission: Submission = Body(...)):
    submission_dict = submission.model_dump(exclude={"id"})
    new_submission = await submissions_collection.insert_one(submission_dict)
    created_submission = await submissions_collection.find_one({"_id": new_submission.inserted_id})
    created_submission["_id"] = str(created_submission["_id"])
    return created_submission

@app.get("/api/submissions", response_model=List[Submission])
async def list_submissions():
    submissions = await submissions_collection.find().to_list(1000)
    for sub in submissions:
        sub["_id"] = str(sub["_id"])
    return submissions

@app.put("/api/submissions/{id}/evaluate", response_model=Submission)
async def evaluate_submission(id: str, evaluation: Evaluation = Body(...)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID")
        
    update_result = await submissions_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": "evaluated", "evaluation": evaluation.model_dump()}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")

    updated_submission = await submissions_collection.find_one({"_id": ObjectId(id)})
    updated_submission["_id"] = str(updated_submission["_id"])
    return updated_submission

@app.post("/api/evaluators", response_model=Evaluator, status_code=status.HTTP_201_CREATED)
async def create_evaluator(evaluator: Evaluator = Body(...)):
    evaluator_dict = evaluator.model_dump(exclude={"id"})
    new_evaluator = await evaluators_collection.insert_one(evaluator_dict)
    created_evaluator = await evaluators_collection.find_one({"_id": new_evaluator.inserted_id})
    created_evaluator["_id"] = str(created_evaluator["_id"])
    return created_evaluator

@app.get("/api/evaluators", response_model=List[Evaluator])
async def list_evaluators():
    evaluators = await evaluators_collection.find().to_list(1000)
    for e in evaluators:
        e["_id"] = str(e["_id"])
    return evaluators
