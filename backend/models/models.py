# Models Registry for Wheeler Knight Portfolio
# This file imports all models to ensure they are registered with SQLAlchemy

from . import BaseModel, db
from .user import User
from .blog_post import BlogPost
from .skill import Skill
from .project import Project
from .education import Education
from .work_experience import WorkExperience
from .interest import Interest
from .analytics import Analytics
from .message import Message
from .admin_user import AdminUser

# Export all models
__all__ = [
    'BaseModel',
    'db',
    'User',
    'BlogPost', 
    'Skill',
    'Project',
    'Education',
    'WorkExperience',
    'Interest',
    'Analytics',
    'Message',
    'AdminUser'
]
