from sqlmodel import SQLModel, Field, create_engine
from datetime import datetime
from typing import Optional

# Define the database URL - SQLite database named 'blog.db'
DATABASE_URL = "sqlite:///blog.db"
engine = create_engine(DATABASE_URL, echo=True)

class BlogPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    image_path: Optional[str] = None
    is_published: bool = Field(default=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)