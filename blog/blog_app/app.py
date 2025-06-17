from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, Request, Form, UploadFile, File, HTTPException, Depends, BackgroundTasks
from fastapi.encoders import jsonable_encoder
from sqlmodel import SQLModel, create_engine, Session, select
from models import BlogPost, create_db_and_tables
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles  # Add this import at the top
import os
import secrets
import shutil

# Database configuration
DATABASE_URL = "sqlite:///blog.db"
engine = create_engine(DATABASE_URL, echo=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_db_and_tables()
    yield

app = FastAPI(title="Blog Platform", lifespan=lifespan)

# Security
security = HTTPBasic()
def get_current_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, "admin")
    correct_password = secrets.compare_digest(credentials.password, "password")
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# SQLite setup
SQLModel.metadata.create_all(engine)

# Jinja2 templates
templates = Jinja2Templates(directory="templates")

# Mount static directory - add this before other routes
app.mount("/static", StaticFiles(directory="static"), name="static")

# Image upload route
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    file_path = os.path.join("static/uploads", file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    url = f"/static/uploads/{file.filename}"
    return {"url": url}

# Save blog post
@app.post("/save")
async def save_post(request: Request, title: str = Form(...), content: str = Form(...), image_path: str = Form(default=None)):
    with Session(engine) as session:
        post = BlogPost(title=title, content=content, image_path=image_path, is_published=False)
        session.add(post)
        session.commit()
        return {"status": "success"}

# Main route with HTMX
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    with Session(engine) as session:
        statement = select(BlogPost)  # Create select statement
        posts = session.exec(statement).all()  # Execute the statement
    return templates.TemplateResponse("index.html", {"request": request, "posts": posts})

# Chart data route (simplified example)
@app.get("/chart-data", response_class=HTMLResponse)
async def chart_data(request: Request):  # Add request parameter
    with Session(engine) as session:
        statement = select(BlogPost)
        posts = session.exec(statement).all()
        published = sum(1 for p in posts if p.is_published)
        drafts = sum(1 for p in posts if not p.is_published)
    
    return templates.TemplateResponse(
        "partials/chart.html",
        {
            "request": request,  # Pass the request object
            "labels": ["Published", "Drafts"],
            "values": [published, drafts]
        }
    )

# Admin dashboard route
@app.get("/admin/dashboard", response_class=HTMLResponse)
async def admin_dashboard(request: Request, admin: str = Depends(get_current_admin)):
    with Session(engine) as session:
        statement = select(BlogPost)  # Use select() instead of BlogPost.select()
        posts = session.exec(statement).all()
    return templates.TemplateResponse(
        "admin/dashboard.html",
        {"request": request, "posts": posts, "admin": admin}
    )

# Admin post management routes
@app.post("/admin/posts/{post_id}/publish")
async def publish_post(post_id: int, admin: str = Depends(get_current_admin)):
    with Session(engine) as session:
        post = session.get(BlogPost, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        post.is_published = True
        session.add(post)
        session.commit()
        return {"status": "success"}

@app.post("/admin/posts/{post_id}/unpublish")
async def unpublish_post(post_id: int, admin: str = Depends(get_current_admin)):
    with Session(engine) as session:
        post = session.get(BlogPost, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        post.is_published = False
        session.add(post)
        session.commit()
        return {"status": "success"}

@app.delete("/admin/posts/{post_id}")
async def delete_post(post_id: int, admin: str = Depends(get_current_admin)):
    with Session(engine) as session:
        post = session.get(BlogPost, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        session.delete(post)
        session.commit()
        return {"status": "success"}

# Add this route for creating posts
@app.post("/admin/posts")
async def create_post(
    request: Request,
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    content: str = Form(...),
    image: Optional[UploadFile] = File(None),
    admin: str = Depends(get_current_admin)
):
    try:
        with Session(engine) as session:
            # Create uploads directory if it doesn't exist
            os.makedirs("static/uploads", exist_ok=True)
            
            post = BlogPost(
                title=title,
                content=content,
                is_published=False
            )
            
            if image and image.filename:
                # Save file with a unique name to prevent overwriting
                file_ext = os.path.splitext(image.filename)[1]
                unique_filename = f"{secrets.token_hex(8)}{file_ext}"
                file_path = os.path.join("static/uploads", unique_filename)
                
                async def save_upload():
                    with open(file_path, "wb") as buffer:
                        shutil.copyfileobj(image.file, buffer)
                
                await save_upload()
                post.image_path = f"/static/uploads/{unique_filename}"
            
            session.add(post)
            session.commit()
            session.refresh(post)
            
            return templates.TemplateResponse(
                "partials/post_row.html",
                {"request": request, "post": post}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add route for getting a post
@app.get("/admin/posts/{post_id}")
async def get_post(post_id: int, admin: str = Depends(get_current_admin)):
    with Session(engine) as session:
        post = session.get(BlogPost, post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "is_published": post.is_published,
            "image_path": post.image_path
        }

# Add route for updating posts
@app.put("/admin/posts/{post_id}")
async def update_post(
    post_id: int,
    request: Request,
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    content: str = Form(...),
    image: Optional[UploadFile] = File(None),
    admin: str = Depends(get_current_admin)
):
    try:
        with Session(engine) as session:
            post = session.get(BlogPost, post_id)
            if not post:
                raise HTTPException(status_code=404, detail="Post not found")
            
            post.title = title
            post.content = content
            
            if image and image.filename:
                # Save file with a unique name
                file_ext = os.path.splitext(image.filename)[1]
                unique_filename = f"{secrets.token_hex(8)}{file_ext}"
                file_path = os.path.join("static/uploads", unique_filename)
                
                async def save_upload():
                    with open(file_path, "wb") as buffer:
                        shutil.copyfileobj(image.file, buffer)
                
                await save_upload()
                
                # Delete old image if exists
                if post.image_path:
                    old_file = os.path.join("static", post.image_path.lstrip("/"))
                    if os.path.exists(old_file):
                        os.remove(old_file)
                
                post.image_path = f"/static/uploads/{unique_filename}"
            
            session.add(post)
            session.commit()
            session.refresh(post)
            
            return templates.TemplateResponse(
                "partials/post_row.html",
                {"request": request, "post": post}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )