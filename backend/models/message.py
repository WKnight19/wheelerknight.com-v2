# Message Model for Wheeler Knight Portfolio
from . import BaseModel, db
from sqlalchemy import Column, Integer, String, Text, Enum
from typing import Optional
import enum

class MessageStatus(enum.Enum):
    """Message status enumeration"""
    NEW = 'new'
    READ = 'read'
    REPLIED = 'replied'
    ARCHIVED = 'archived'

class Message(BaseModel):
    """Message model for contact form submissions"""
    __tablename__ = 'messages'
    
    # Contact Information
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    company = db.Column(db.String(255), nullable=True)
    
    # Message Content
    subject = db.Column(db.String(255), nullable=True)
    message = db.Column(db.Text, nullable=False)
    
    # Status
    status = db.Column(db.Enum(MessageStatus), default=MessageStatus.NEW, nullable=False)
    
    def __init__(self, name: str, email: str, message: str, subject: Optional[str] = None,
                 phone: Optional[str] = None, company: Optional[str] = None):
        self.name = name
        self.email = email
        self.message = message
        self.subject = subject
        self.phone = phone
        self.company = company
    
    def mark_as_read(self) -> None:
        """Mark message as read"""
        self.status = MessageStatus.READ
    
    def mark_as_replied(self) -> None:
        """Mark message as replied"""
        self.status = MessageStatus.REPLIED
    
    def archive(self) -> None:
        """Archive the message"""
        self.status = MessageStatus.ARCHIVED
    
    @property
    def is_new(self) -> bool:
        """Check if message is new"""
        return self.status == MessageStatus.NEW
    
    @property
    def is_read(self) -> bool:
        """Check if message has been read"""
        return self.status in [MessageStatus.READ, MessageStatus.REPLIED]
    
    @property
    def is_replied(self) -> bool:
        """Check if message has been replied to"""
        return self.status == MessageStatus.REPLIED
    
    def to_dict(self) -> dict:
        """Convert to dictionary with computed fields"""
        data = super().to_dict()
        data['is_new'] = self.is_new
        data['is_read'] = self.is_read
        data['is_replied'] = self.is_replied
        data['status'] = self.status.value if self.status else None
        return data
    
    def __repr__(self):
        return f'<Message from {self.name} ({self.email})>'
