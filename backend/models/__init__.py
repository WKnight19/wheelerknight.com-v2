# Base Model for Wheeler Knight Portfolio
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from typing import Dict, Any
import json

# Create SQLAlchemy instance
db = SQLAlchemy()

class BaseModel(db.Model):
    """Base model with common fields and methods"""
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert model instance to dictionary"""
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, datetime):
                result[column.name] = value.isoformat()
            elif isinstance(value, (dict, list)):
                result[column.name] = json.dumps(value) if isinstance(value, (dict, list)) else value
            else:
                result[column.name] = value
        return result
    
    def update_from_dict(self, data: Dict[str, Any]) -> None:
        """Update model instance from dictionary"""
        for key, value in data.items():
            if hasattr(self, key) and key not in ['id', 'created_at', 'updated_at']:
                setattr(self, key, value)
    
    @classmethod
    def create_from_dict(cls, data: Dict[str, Any]):
        """Create model instance from dictionary"""
        instance = cls()
        instance.update_from_dict(data)
        return instance
    
    def __repr__(self):
        return f'<{self.__class__.__name__} {self.id}>'
