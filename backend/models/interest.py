# Interest Model for Wheeler Knight Portfolio
from . import BaseModel, db
from sqlalchemy import Column, Integer, String, Boolean, Text, Enum
from typing import Optional
import enum

class InterestCategory(enum.Enum):
    """Interest category enumeration"""
    MOVIE = 'movie'
    TV_SHOW = 'tv_show'
    MUSIC = 'music'
    BOOK = 'book'
    SPORT = 'sport'
    HOBBY = 'hobby'
    OTHER = 'other'

class Interest(BaseModel):
    """Interest model"""
    __tablename__ = 'interests'
    
    # Basic Information
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.Enum(InterestCategory), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Media and Links
    image_url = db.Column(db.String(500), nullable=True)
    external_url = db.Column(db.String(500), nullable=True)
    
    # Display Settings
    display_order = db.Column(db.Integer, default=0, nullable=False)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    
    def __init__(self, title: str, category: InterestCategory, description: Optional[str] = None,
                 image_url: Optional[str] = None, external_url: Optional[str] = None,
                 display_order: int = 0, is_featured: bool = False):
        self.title = title
        self.category = category
        self.description = description
        self.image_url = image_url
        self.external_url = external_url
        self.display_order = display_order
        self.is_featured = is_featured
    
    @property
    def category_display(self) -> str:
        """Get human-readable category name"""
        category_map = {
            InterestCategory.MOVIE: "Movie",
            InterestCategory.TV_SHOW: "TV Show",
            InterestCategory.MUSIC: "Music",
            InterestCategory.BOOK: "Book",
            InterestCategory.SPORT: "Sport",
            InterestCategory.HOBBY: "Hobby",
            InterestCategory.OTHER: "Other"
        }
        return category_map.get(self.category, "Unknown")
    
    def to_dict(self) -> dict:
        """Convert to dictionary with computed fields"""
        data = super().to_dict()
        data['category_display'] = self.category_display
        data['category'] = self.category.value if self.category else None
        return data
    
    def __repr__(self):
        return f'<Interest {self.title}>'
