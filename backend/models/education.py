# Education Model for Wheeler Knight Portfolio
from . import BaseModel, db
from sqlalchemy import Column, Integer, String, Boolean, Text, Date, Numeric
from datetime import date
from typing import Optional

class Education(BaseModel):
    """Education model"""
    __tablename__ = 'education'
    
    # Institution Information
    institution = db.Column(db.String(255), nullable=False)
    degree = db.Column(db.String(255), nullable=False)
    field_of_study = db.Column(db.String(255), nullable=True)
    
    # Academic Performance
    gpa = db.Column(db.Numeric(3, 2), nullable=True)
    
    # Dates
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    is_current = db.Column(db.Boolean, default=False, nullable=False)
    
    # Additional Information
    description = db.Column(db.Text, nullable=True)
    achievements = db.Column(db.Text, nullable=True)
    
    # Display Settings
    display_order = db.Column(db.Integer, default=0, nullable=False)
    
    def __init__(self, institution: str, degree: str, field_of_study: Optional[str] = None,
                 gpa: Optional[float] = None, start_date: Optional[date] = None,
                 end_date: Optional[date] = None, is_current: bool = False,
                 description: Optional[str] = None, achievements: Optional[str] = None,
                 display_order: int = 0):
        self.institution = institution
        self.degree = degree
        self.field_of_study = field_of_study
        self.gpa = gpa
        self.start_date = start_date
        self.end_date = end_date
        self.is_current = is_current
        self.description = description
        self.achievements = achievements
        self.display_order = display_order
    
    @property
    def duration(self) -> Optional[str]:
        """Get education duration as string"""
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            years = delta.days // 365
            months = (delta.days % 365) // 30
            if years >= 1:
                return f"{years} year{'s' if years > 1 else ''}"
            return f"{months} month{'s' if months > 1 else ''}"
        return None
    
    @property
    def gpa_display(self) -> Optional[str]:
        """Get GPA as formatted string"""
        if self.gpa:
            return f"{float(self.gpa):.2f}"
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
        data['duration'] = self.duration
        data['gpa_display'] = self.gpa_display
        data['status'] = self.status
        return data
    
    def __repr__(self):
        return f'<Education {self.degree} at {self.institution}>'
