import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load database credentials
load_dotenv(Path(__file__).resolve().parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found")

# Create database connection engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# Test database connection
def test_db_connection():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return result.scalar()