# Admin User Model for Wheeler Knight Portfolio
from . import BaseModel, db
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from datetime import datetime
from typing import Optional
import enum
import bcrypt

class AdminRole(enum.Enum):
    """Admin role enumeration"""
    SUPER_ADMIN = 'super_admin'
    ADMIN = 'admin'
    EDITOR = 'editor'

class AdminUser(BaseModel):
    """Admin user model for Wheeler Suite access"""
    __tablename__ = 'admin_users'
    
    # Authentication
    username = db.Column(db.String(100), unique=True, nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Personal Information
    first_name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100), nullable=True)
    
    # Role and Status
    role = db.Column(db.Enum(AdminRole), default=AdminRole.ADMIN, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Activity Tracking
    last_login = db.Column(db.DateTime, nullable=True)
    
    def __init__(self, username: str, email: str, password: str, first_name: Optional[str] = None,
                 last_name: Optional[str] = None, role: AdminRole = AdminRole.ADMIN):
        self.username = username
        self.email = email
        self.set_password(password)
        self.first_name = first_name
        self.last_name = last_name
        self.role = role
    
    def set_password(self, password: str) -> None:
        """Hash and set password"""
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def check_password(self, password: str) -> bool:
        """Check if provided password matches hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def update_last_login(self) -> None:
        """Update last login timestamp"""
        self.last_login = datetime.utcnow()
    
    @property
    def full_name(self) -> str:
        """Get full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        return self.username
    
    @property
    def is_super_admin(self) -> bool:
        """Check if user is super admin"""
        return self.role == AdminRole.SUPER_ADMIN
    
    @property
    def can_manage_users(self) -> bool:
        """Check if user can manage other users"""
        return self.role in [AdminRole.SUPER_ADMIN, AdminRole.ADMIN]
    
    @property
    def can_manage_content(self) -> bool:
        """Check if user can manage content"""
        return self.role in [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.EDITOR]
    
    def to_dict(self) -> dict:
        """Convert to dictionary with computed fields"""
        data = super().to_dict()
        data['full_name'] = self.full_name
        data['is_super_admin'] = self.is_super_admin
        data['can_manage_users'] = self.can_manage_users
        data['can_manage_content'] = self.can_manage_content
        data['role'] = self.role.value if self.role else None
        # Don't include password hash in dict
        data.pop('password_hash', None)
        return data
    
    def __repr__(self):
        return f'<AdminUser {self.username}>'
