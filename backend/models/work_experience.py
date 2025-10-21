# Work Experience Model for Wheeler Knight Portfolio
from . import BaseModel, db
from sqlalchemy import Column, Integer, String, Boolean, Text, Date
from datetime import date
from typing import Optional, List
import json

class WorkExperience(BaseModel):
    """Work experience model"""
    __tablename__ = 'work_experience'
    
    # Company Information
    company = db.Column(db.String(255), nullable=False)
    position = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=True)
    
    # Dates
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    is_current = db.Column(db.Boolean, default=False, nullable=False)
    
    # Job Details
    description = db.Column(db.Text, nullable=True)
    achievements = db.Column(db.Text, nullable=True)
    technologies = db.Column(db.Text, nullable=True)  # JSON array
    
    # Display Settings
    display_order = db.Column(db.Integer, default=0, nullable=False)
    
    def __init__(self, company: str, position: str, location: Optional[str] = None,
                 start_date: Optional[date] = None, end_date: Optional[date] = None,
                 is_current: bool = False, description: Optional[str] = None,
                 achievements: Optional[str] = None, technologies: Optional[List[str]] = None,
                 display_order: int = 0):
        self.company = company
        self.position = position
        self.location = location
        self.start_date = start_date
        self.end_date = end_date
        self.is_current = is_current
        self.description = description
        self.achievements = achievements
        self.technologies = json.dumps(technologies) if technologies else None
        self.display_order = display_order
    
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
    def duration(self) -> Optional[str]:
        """Get work duration as string"""
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            years = delta.days // 365
            months = (delta.days % 365) // 30
            if years >= 1:
                remaining_months = months
                if remaining_months > 0:
                    return f"{years} year{'s' if years > 1 else ''} {remaining_months} month{'s' if remaining_months > 1 else ''}"
                return f"{years} year{'s' if years > 1 else ''}"
            return f"{months} month{'s' if months > 1 else ''}"
        return None
    
    @property
    def status(self) -> str:
        """Get current status"""
        if self.is_current:
            return "Current"
        elif self.end_date:
            return "Completed"
        return "In Progress"
    
    def to_dict(self) -> dict:
        """Convert to dictionary with computed fields"""
        data = super().to_dict()
        data['technologies_list'] = self.technologies_list
        data['duration'] = self.duration
        data['status'] = self.status
        return data
    
    def __repr__(self):
        return f'<WorkExperience {self.position} at {self.company}>'
