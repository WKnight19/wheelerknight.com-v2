# User Model for Wheeler Knight Portfolio
from . import BaseModel, db
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime
from typing import Optional

class User(BaseModel):
    """User model for visitor accounts"""
    __tablename__ = 'users'
    
    # Basic Information
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    first_name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100), nullable=True)
    
    # Professional Information
    company = db.Column(db.String(255), nullable=True)
    job_title = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    
    # Account Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    newsletter_subscribed = db.Column(db.Boolean, default=False, nullable=False)
    
    # Relationships
    analytics = db.relationship('Analytics', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, email: str, first_name: Optional[str] = None, last_name: Optional[str] = None, 
                 company: Optional[str] = None, job_title: Optional[str] = None, phone: Optional[str] = None):
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.company = company
        self.job_title = job_title
        self.phone = phone
    
    @property
    def full_name(self) -> str:
        """Get full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        return self.email.split('@')[0]
    
    def to_dict(self) -> dict:
        """Convert to dictionary with computed fields"""
        data = super().to_dict()
        data['full_name'] = self.full_name
        return data
    
    def __repr__(self):
        return f'<User {self.email}>'
