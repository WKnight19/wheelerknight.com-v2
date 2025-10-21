# Analytics Model for Wheeler Knight Portfolio
from . import BaseModel, db
from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from typing import Optional, Dict, Any
import json

class Analytics(BaseModel):
    """Analytics model for tracking user behavior"""
    __tablename__ = 'analytics'
    
    # Event Information
    event_type = db.Column(db.String(100), nullable=False, index=True)
    event_data = db.Column(db.JSON, nullable=True)
    
    # User Information
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    
    # Technical Information
    ip_address = db.Column(db.String(45), nullable=True)  # IPv6 support
    user_agent = db.Column(db.Text, nullable=True)
    page_url = db.Column(db.String(500), nullable=True)
    referrer = db.Column(db.String(500), nullable=True)
    session_id = db.Column(db.String(255), nullable=True)
    
    def __init__(self, event_type: str, event_data: Optional[Dict[str, Any]] = None,
                 user_id: Optional[int] = None, ip_address: Optional[str] = None,
                 user_agent: Optional[str] = None, page_url: Optional[str] = None,
                 referrer: Optional[str] = None, session_id: Optional[str] = None):
        self.event_type = event_type
        self.event_data = event_data
        self.user_id = user_id
        self.ip_address = ip_address
        self.user_agent = user_agent
        self.page_url = page_url
        self.referrer = referrer
        self.session_id = session_id
    
    @classmethod
    def track_page_view(cls, page_url: str, user_id: Optional[int] = None,
                       ip_address: Optional[str] = None, user_agent: Optional[str] = None,
                       referrer: Optional[str] = None, session_id: Optional[str] = None):
        """Track a page view event"""
        return cls(
            event_type='page_view',
            event_data={'page': page_url},
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            page_url=page_url,
            referrer=referrer,
            session_id=session_id
        )
    
    @classmethod
    def track_contact_form(cls, form_data: Dict[str, Any], user_id: Optional[int] = None,
                          ip_address: Optional[str] = None, user_agent: Optional[str] = None,
                          session_id: Optional[str] = None):
        """Track a contact form submission"""
        return cls(
            event_type='contact_form',
            event_data=form_data,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            session_id=session_id
        )
    
    @classmethod
    def track_download(cls, file_name: str, file_type: str, user_id: Optional[int] = None,
                      ip_address: Optional[str] = None, user_agent: Optional[str] = None,
                      session_id: Optional[str] = None):
        """Track a file download"""
        return cls(
            event_type='download',
            event_data={'file_name': file_name, 'file_type': file_type},
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            session_id=session_id
        )
    
    def to_dict(self) -> dict:
        """Convert to dictionary"""
        data = super().to_dict()
        # Convert JSON fields properly
        if self.event_data:
            data['event_data'] = self.event_data
        return data
    
    def __repr__(self):
        return f'<Analytics {self.event_type}>'
