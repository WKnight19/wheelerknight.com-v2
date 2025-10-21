# Blog API Routes for Wheeler Knight Portfolio
from flask import Blueprint, request, jsonify
from models import db
from models.models import BlogPost
from models.blog_post import PostStatus
from routes import create_api_blueprint, handle_api_response, validate_required_fields, paginate_query, format_pagination_response
from error_handling import ValidationError, NotFoundError
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Create blog blueprint
blog_bp = create_api_blueprint('blog', 'blog')

@blog_bp.route('/', methods=['GET'])
@handle_api_response
def get_blog_posts():
    """Get all blog posts with optional filtering and pagination"""
    try:
        # Get query parameters
        status = request.args.get('status', 'published')  # Default to published
        featured_only = request.args.get('featured', 'false').lower() == 'true'
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Build query
        query = BlogPost.query
        
        # Apply filters
        if status:
            try:
                status_enum = PostStatus(status)
                query = query.filter(BlogPost.status == status_enum)
            except ValueError:
                raise ValidationError(f"Invalid status: {status}")
        
        if featured_only:
            query = query.filter(BlogPost.is_featured == True)
        
        # Order by published_at (newest first) or created_at
        query = query.order_by(BlogPost.published_at.desc(), BlogPost.created_at.desc())
        
        # Paginate results
        pagination = paginate_query(query, page, per_page)
        
        return format_pagination_response(pagination)
        
    except Exception as e:
        logger.error(f"Error getting blog posts: {str(e)}")
        raise

@blog_bp.route('/<int:post_id>', methods=['GET'])
@handle_api_response
def get_blog_post(post_id):
    """Get a specific blog post by ID"""
    post = BlogPost.query.get_or_404(post_id)
    
    # Increment view count for published posts
    if post.is_published:
        post.increment_views()
        db.session.commit()
    
    return post.to_dict()

@blog_bp.route('/slug/<slug>', methods=['GET'])
@handle_api_response
def get_blog_post_by_slug(slug):
    """Get a blog post by slug"""
    post = BlogPost.query.filter_by(slug=slug).first_or_404()
    
    # Increment view count for published posts
    if post.is_published:
        post.increment_views()
        db.session.commit()
    
    return post.to_dict()

@blog_bp.route('/statuses', methods=['GET'])
@handle_api_response
def get_post_statuses():
    """Get all available post statuses"""
    statuses = [
        {
            'value': status.value,
            'label': status.value.title(),
            'count': BlogPost.query.filter(BlogPost.status == status).count()
        }
        for status in PostStatus
    ]
    return statuses

@blog_bp.route('/', methods=['POST'])
@handle_api_response
def create_blog_post():
    """Create a new blog post (Admin only)"""
    data = request.get_json()
    
    # Validate required fields
    validate_required_fields(data, ['title', 'content'])
    
    # Validate status if provided
    status = PostStatus.DRAFT  # Default
    if 'status' in data:
        try:
            status = PostStatus(data['status'])
        except ValueError:
            raise ValidationError(f"Invalid status: {data['status']}")
    
    # Create blog post
    post = BlogPost(
        title=data['title'],
        content=data['content'],
        slug=data.get('slug'),
        excerpt=data.get('excerpt'),
        featured_image=data.get('featured_image')
    )
    
    post.status = status
    
    # Set published_at if status is published
    if status == PostStatus.PUBLISHED:
        post.published_at = datetime.utcnow()
    
    db.session.add(post)
    db.session.commit()
    
    logger.info(f"Created blog post: {post.title}")
    return post.to_dict(), 201

@blog_bp.route('/<int:post_id>', methods=['PUT'])
@handle_api_response
def update_blog_post(post_id):
    """Update a blog post (Admin only)"""
    post = BlogPost.query.get_or_404(post_id)
    data = request.get_json()
    
    # Update fields
    if 'title' in data:
        post.title = data['title']
        # Regenerate slug if title changed
        if not data.get('slug'):
            post.slug = post._generate_slug(data['title'])
    
    if 'slug' in data:
        post.slug = data['slug']
    
    if 'content' in data:
        post.content = data['content']
    
    if 'excerpt' in data:
        post.excerpt = data['excerpt']
    
    if 'featured_image' in data:
        post.featured_image = data['featured_image']
    
    if 'status' in data:
        try:
            new_status = PostStatus(data['status'])
            old_status = post.status
            
            post.status = new_status
            
            # Set published_at if transitioning to published
            if old_status != PostStatus.PUBLISHED and new_status == PostStatus.PUBLISHED:
                if not post.published_at:
                    post.published_at = datetime.utcnow()
        except ValueError:
            raise ValidationError(f"Invalid status: {data['status']}")
    
    db.session.commit()
    
    logger.info(f"Updated blog post: {post.title}")
    return post.to_dict()

@blog_bp.route('/<int:post_id>', methods=['DELETE'])
@handle_api_response
def delete_blog_post(post_id):
    """Delete a blog post (Admin only)"""
    post = BlogPost.query.get_or_404(post_id)
    
    db.session.delete(post)
    db.session.commit()
    
    logger.info(f"Deleted blog post: {post.title}")
    return {'message': 'Blog post deleted successfully'}

@blog_bp.route('/<int:post_id>/like', methods=['POST'])
@handle_api_response
def like_blog_post(post_id):
    """Like a blog post"""
    post = BlogPost.query.get_or_404(post_id)
    
    if not post.is_published:
        raise ValidationError("Cannot like unpublished posts")
    
    post.increment_likes()
    db.session.commit()
    
    return {
        'likes_count': post.likes_count,
        'message': 'Post liked successfully'
    }

@blog_bp.route('/stats', methods=['GET'])
@handle_api_response
def get_blog_stats():
    """Get blog statistics"""
    total_posts = BlogPost.query.count()
    published_posts = BlogPost.query.filter(BlogPost.status == PostStatus.PUBLISHED).count()
    draft_posts = BlogPost.query.filter(BlogPost.status == PostStatus.DRAFT).count()
    
    # Get total views and likes
    total_views = db.session.query(db.func.sum(BlogPost.views_count)).scalar() or 0
    total_likes = db.session.query(db.func.sum(BlogPost.likes_count)).scalar() or 0
    
    # Get most popular posts
    popular_posts = BlogPost.query.filter(
        BlogPost.status == PostStatus.PUBLISHED
    ).order_by(BlogPost.views_count.desc()).limit(5).all()
    
    return {
        'total_posts': total_posts,
        'published_posts': published_posts,
        'draft_posts': draft_posts,
        'total_views': total_views,
        'total_likes': total_likes,
        'popular_posts': [post.to_dict() for post in popular_posts]
    }
