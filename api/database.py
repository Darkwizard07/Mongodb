import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Explicitly load .env from the same directory as this file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    # Failback to localhost if not provided
    MONGODB_URI = "mongodb://localhost:27017"

client = AsyncIOMotorClient(MONGODB_URI)
db = client.hackathon_db

# Export collections
evaluators_collection = db.get_collection("evaluators")
submissions_collection = db.get_collection("submissions")
