
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Load MongoDB URI securely from environment variables
uri = os.getenv("MONGODB_URI")

if not uri:
    raise EnvironmentError("MONGODB_URI environment variable is not set.")

# Create a new MongoDB client
client = MongoClient(uri, server_api=ServerApi('1'))

# Confirm the connection
try:
    client.admin.command('ping')
    print("Connection to MongoDB successful!")
except Exception as e:
    print(f"Connection failed: {e}")
