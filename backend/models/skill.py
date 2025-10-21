# Skill Model for Wheeler Knight Portfolio
from . import BaseModel, db
from sqlalchemy import Column, Integer, String, Boolean, Text, Enum, CheckConstraint
from typing import Optional
import enum

class SkillCategory(enum.Enum):
    """Skill category enumeration"""
    TECHNICAL = 'technical'
    SOFT = 'soft'
    LANGUAGE = 'language'
    CERTIFICATION = 'certification'

class Skill(BaseModel):
    """Skill model"""
    __tablename__ = 'skills'
    
    # Basic Information
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.Enum(SkillCategory), nullable=False)
    proficiency_level = db.Column(db.Integer, nullable=True)
    description = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(100), nullable=True)
    
    # Display Settings
    display_order = db.Column(db.Integer, default=0, nullable=False)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    
    # Add check constraint for proficiency level
    __table_args__ = (
        CheckConstraint('proficiency_level >= 1 AND proficiency_level <= 5', name='check_proficiency_level'),
    )
    
    def __init__(self, name: str, category: SkillCategory, proficiency_level: Optional[int] = None,
                 description: Optional[str] = None, icon: Optional[str] = None, 
                 display_order: int = 0, is_featured: bool = False):
        self.name = name
        self.category = category
        self.proficiency_level = proficiency_level
        self.description = description
        self.icon = icon
        self.display_order = display_order
        self.is_featured = is_featured
    
    @property
    def proficiency_percentage(self) -> int:
        """Get proficiency as percentage"""
        if self.proficiency_level:
            return (self.proficiency_level / 5) * 100
        return 0
    
    @property
    def proficiency_label(self) -> str:
        """Get human-readable proficiency level"""
        if not self.proficiency_level:
            return "Not specified"
        
        levels = {
            1: "Beginner",
            2: "Novice", 
            3: "Intermediate",
            4: "Advanced",
            5: "Expert"
        }
        return levels.get(self.proficiency_level, "Unknown")
    
    def to_dict(self) -> dict:
        """Convert to dictionary with computed fields"""
        data = super().to_dict()
        data['proficiency_percentage'] = self.proficiency_percentage
        data['proficiency_label'] = self.proficiency_label
        data['category'] = self.category.value if self.category else None
        return data
    
    def __repr__(self):
        return f'<Skill {self.name}>'
