# Blog Post Model for Wheeler Knight Portfolio
from . import BaseModel, db
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum
from datetime import datetime
from typing import Optional, List
import enum

class PostStatus(enum.Enum):
    """Blog post status enumeration"""
    DRAFT = 'draft'
    PUBLISHED = 'published'
    ARCHIVED = 'archived'

class BlogPost(BaseModel):
    """Blog post model"""
    __tablename__ = 'blog_posts'
    
    # Content
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.Text, nullable=True)
    
    # Media
    featured_image = db.Column(db.String(500), nullable=True)
    
    # Status and Publishing
    status = db.Column(db.Enum(PostStatus), default=PostStatus.DRAFT, nullable=False)
    published_at = db.Column(db.DateTime, nullable=True)
    
    # Analytics
    views_count = db.Column(db.Integer, default=0, nullable=False)
    likes_count = db.Column(db.Integer, default=0, nullable=False)
    
    def __init__(self, title: str, content: str, slug: Optional[str] = None, 
                 excerpt: Optional[str] = None, featured_image: Optional[str] = None):
        self.title = title
        self.content = content
        self.slug = slug or self._generate_slug(title)
        self.excerpt = excerpt
        self.featured_image = featured_image
    
    def _generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug from title"""
        import re
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        slug = re.sub(r'[-\s]+', '-', slug)
        return slug.strip('-')
    
    def publish(self) -> None:
        """Publish the blog post"""
        self.status = PostStatus.PUBLISHED
        if not self.published_at:
            self.published_at = datetime.utcnow()
    
    def archive(self) -> None:
        """Archive the blog post"""
        self.status = PostStatus.ARCHIVED
    
    def increment_views(self) -> None:
        """Increment view count"""
        self.views_count += 1
    
    def increment_likes(self) -> None:
        """Increment like count"""
        self.likes_count += 1
    
    @property
    def is_published(self) -> bool:
        """Check if post is published"""
        return self.status == PostStatus.PUBLISHED
    
    @property
    def reading_time(self) -> int:
        """Estimate reading time in minutes"""
        words_per_minute = 200
        word_count = len(self.content.split())
        return max(1, word_count // words_per_minute)
    
    def to_dict(self) -> dict:
        """Convert to dictionary with computed fields"""
        data = super().to_dict()
        data['is_published'] = self.is_published
        data['reading_time'] = self.reading_time
        data['status'] = self.status.value if self.status else None
        return data
    
    def __repr__(self):
        return f'<BlogPost {self.title}>'
