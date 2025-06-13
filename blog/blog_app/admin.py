from fastapi_admin.app import app as admin_app
from fastapi_admin.providers.login import UsernamePasswordProvider
from fastapi_admin.models import AbstractAdmin
from sqlmodel import Session, select
from models import BlogPost
from fastapi import Depends
from fastapi.templating import Jinja2Templates
import os

templates = Jinja2Templates(directory="templates")

class Admin(AbstractAdmin):
    async def get_context(self):
        with Session(self.engine) as session:
            return {
                "published": session.exec(select(BlogPost).where(BlogPost.is_published == True)).all(),
                "drafts": session.exec(select(BlogPost).where(BlogPost.is_published == False)).all(),
            }

async def setup_admin(app, engine):
    # Initialize admin
    await admin_app.init(
        admin_secret="your-secret-key",
        engine=engine,
        login_provider=UsernamePasswordProvider(
            admin_users=[
                {"username": "admin", "password": "password"}
            ]
        )
    )
    
    # Mount the admin app
    app.mount("/admin", admin_app)