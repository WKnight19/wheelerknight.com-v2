# Project Model for Wheeler Knight Portfolio
from . import BaseModel, db
from sqlalchemy import Column, Integer, String, Boolean, Text, Date, Enum
from datetime import date
from typing import Optional, List
import json
import enum

class ProjectStatus(enum.Enum):
    """Project status enumeration"""
    COMPLETED = 'completed'
    IN_PROGRESS = 'in_progress'
    PLANNED = 'planned'

class Project(BaseModel):
    """Project model"""
    __tablename__ = 'projects'
    
    # Basic Information
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    long_description = db.Column(db.Text, nullable=True)
    
    # Technologies (stored as JSON)
    technologies = db.Column(db.Text, nullable=True)  # JSON array
    
    # URLs
    github_url = db.Column(db.String(500), nullable=True)
    live_url = db.Column(db.String(500), nullable=True)
    
    # Media
    featured_image = db.Column(db.String(500), nullable=True)
    images = db.Column(db.Text, nullable=True)  # JSON array of image URLs
    
    # Status and Dates
    status = db.Column(db.Enum(ProjectStatus), default=ProjectStatus.COMPLETED, nullable=False)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)
    
    # Display Settings
    display_order = db.Column(db.Integer, default=0, nullable=False)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    
    def __init__(self, title: str, description: str, long_description: Optional[str] = None,
                 technologies: Optional[List[str]] = None, github_url: Optional[str] = None,
                 live_url: Optional[str] = None, featured_image: Optional[str] = None,
                 images: Optional[List[str]] = None, status: ProjectStatus = ProjectStatus.COMPLETED,
                 start_date: Optional[date] = None, end_date: Optional[date] = None,
                 display_order: int = 0, is_featured: bool = False):
        self.title = title
        self.description = description
        self.long_description = long_description
        self.technologies = json.dumps(technologies) if technologies else None
        self.github_url = github_url
        self.live_url = live_url
        self.featured_image = featured_image
        self.images = json.dumps(images) if images else None
        self.status = status
        self.start_date = start_date
        self.end_date = end_date
        self.display_order = display_order
        self.is_featured = is_featured
    
    @property
    def technologies_list(self) -> List[str]:
        """Get technologies as list"""
        if self.technologies:
            try:
                return json.loads(self.technologies)
            except (json.JSONDecodeError, TypeError):
                return []
        return []
    
    @technologies_list.setter
    def technologies_list(self, value: List[str]):
        """Set technologies from list"""
        self.technologies = json.dumps(value) if value else None
    
    @property
    def images_list(self) -> List[str]:
        """Get images as list"""
        if self.images:
            try:
                return json.loads(self.images)
            except (json.JSONDecodeError, TypeError):
                return []
        return []
    
    @images_list.setter
    def images_list(self, value: List[str]):
        """Set images from list"""
        self.images = json.dumps(value) if value else None
    
    @property
    def duration(self) -> Optional[str]:
        """Get project duration as string"""
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            months = delta.days // 30
            if months >= 12:
                years = months // 12
                remaining_months = months % 12
                if remaining_months > 0:
                    return f"{years} year{'s' if years > 1 else ''} {remaining_months} month{'s' if remaining_months > 1 else ''}"
                return f"{years} year{'s' if years > 1 else ''}"
            return f"{months} month{'s' if months > 1 else ''}"
        return None
    
    @property
    def is_current(self) -> bool:
        """Check if project is currently active"""
        return self.status == ProjectStatus.IN_PROGRESS
    
    def to_dict(self) -> dict:
        """Convert to dictionary with computed fields"""
        data = super().to_dict()
        data['technologies_list'] = self.technologies_list
        data['images_list'] = self.images_list
        data['duration'] = self.duration
        data['is_current'] = self.is_current
        data['status'] = self.status.value if self.status else None
        return data
    
    def __repr__(self):
        return f'<Project {self.title}>'
