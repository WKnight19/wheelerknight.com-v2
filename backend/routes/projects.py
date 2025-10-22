# Projects API Routes for Wheeler Knight Portfolio
from flask import Blueprint, request, jsonify
from models import db
from models.models import Project
from models.project import ProjectStatus
from routes import create_api_blueprint, handle_api_response, validate_required_fields, paginate_query, format_pagination_response
from auth import admin_required
from error_handling import ValidationError, NotFoundError
import logging
from datetime import date

logger = logging.getLogger(__name__)

# Create projects blueprint
projects_bp = create_api_blueprint('projects', 'projects')

@projects_bp.route('/', methods=['GET'])
@handle_api_response
def get_projects():
    """Get all projects with optional filtering and pagination"""
    try:
        # Get query parameters
        status = request.args.get('status')
        featured_only = request.args.get('featured', 'false').lower() == 'true'
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Build query
        query = Project.query
        
        # Apply filters
        if status:
            try:
                status_enum = ProjectStatus(status)
                query = query.filter(Project.status == status_enum)
            except ValueError:
                raise ValidationError(f"Invalid status: {status}")
        
        if featured_only:
            query = query.filter(Project.is_featured == True)
        
        # Order by display_order and created_at
        query = query.order_by(Project.display_order.asc(), Project.created_at.desc())
        
        # Paginate results
        pagination = paginate_query(query, page, per_page)
        
        return format_pagination_response(pagination)
        
    except Exception as e:
        logger.error(f"Error getting projects: {str(e)}")
        raise

@projects_bp.route('/<int:project_id>', methods=['GET'])
@handle_api_response
def get_project(project_id):
    """Get a specific project by ID"""
    project = Project.query.get_or_404(project_id)
    return project.to_dict()

@projects_bp.route('/statuses', methods=['GET'])
@handle_api_response
def get_project_statuses():
    """Get all available project statuses"""
    statuses = [
        {
            'value': status.value,
            'label': status.value.replace('_', ' ').title(),
            'count': Project.query.filter(Project.status == status).count()
        }
        for status in ProjectStatus
    ]
    return statuses

@projects_bp.route('/', methods=['POST'])
@handle_api_response
@admin_required
def create_project(current_user):
    """Create a new project (Admin only)"""
    data = request.get_json()
    
    # Validate required fields
    validate_required_fields(data, ['title', 'description'])
    
    # Validate status if provided
    status = ProjectStatus.COMPLETED  # Default
    if 'status' in data:
        try:
            status = ProjectStatus(data['status'])
        except ValueError:
            raise ValidationError(f"Invalid status: {data['status']}")
    
    # Parse dates
    start_date = None
    end_date = None
    
    if 'start_date' in data and data['start_date']:
        try:
            start_date = date.fromisoformat(data['start_date'])
        except ValueError:
            raise ValidationError("Invalid start_date format. Use YYYY-MM-DD")
    
    if 'end_date' in data and data['end_date']:
        try:
            end_date = date.fromisoformat(data['end_date'])
        except ValueError:
            raise ValidationError("Invalid end_date format. Use YYYY-MM-DD")
    
    # Create project
    project = Project(
        title=data['title'],
        description=data['description'],
        long_description=data.get('long_description'),
        technologies=data.get('technologies', []),
        github_url=data.get('github_url'),
        live_url=data.get('live_url'),
        featured_image=data.get('featured_image'),
        images=data.get('images', []),
        status=status,
        start_date=start_date,
        end_date=end_date,
        display_order=data.get('display_order', 0),
        is_featured=data.get('is_featured', False)
    )
    
    db.session.add(project)
    db.session.commit()
    
    logger.info(f"Created project: {project.title}")
    return project.to_dict(), 201

@projects_bp.route('/<int:project_id>', methods=['PUT'])
@handle_api_response
@admin_required
def update_project(project_id, current_user):
    """Update a project (Admin only)"""
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    
    # Update fields
    if 'title' in data:
        project.title = data['title']
    
    if 'description' in data:
        project.description = data['description']
    
    if 'long_description' in data:
        project.long_description = data['long_description']
    
    if 'technologies' in data:
        project.technologies_list = data['technologies']
    
    if 'github_url' in data:
        project.github_url = data['github_url']
    
    if 'live_url' in data:
        project.live_url = data['live_url']
    
    if 'featured_image' in data:
        project.featured_image = data['featured_image']
    
    if 'images' in data:
        project.images_list = data['images']
    
    if 'status' in data:
        try:
            project.status = ProjectStatus(data['status'])
        except ValueError:
            raise ValidationError(f"Invalid status: {data['status']}")
    
    if 'start_date' in data:
        if data['start_date']:
            try:
                project.start_date = date.fromisoformat(data['start_date'])
            except ValueError:
                raise ValidationError("Invalid start_date format. Use YYYY-MM-DD")
        else:
            project.start_date = None
    
    if 'end_date' in data:
        if data['end_date']:
            try:
                project.end_date = date.fromisoformat(data['end_date'])
            except ValueError:
                raise ValidationError("Invalid end_date format. Use YYYY-MM-DD")
        else:
            project.end_date = None
    
    if 'display_order' in data:
        project.display_order = data['display_order']
    
    if 'is_featured' in data:
        project.is_featured = data['is_featured']
    
    db.session.commit()
    
    logger.info(f"Updated project: {project.title}")
    return project.to_dict()

@projects_bp.route('/<int:project_id>', methods=['DELETE'])
@handle_api_response
@admin_required
def delete_project(project_id, current_user):
    """Delete a project (Admin only)"""
    project = Project.query.get_or_404(project_id)
    
    db.session.delete(project)
    db.session.commit()
    
    logger.info(f"Deleted project: {project.title}")
    return {'message': 'Project deleted successfully'}

@projects_bp.route('/stats', methods=['GET'])
@handle_api_response
@admin_required
def get_projects_stats(current_user):
    """Get projects statistics"""
    total_projects = Project.query.count()
    featured_projects = Project.query.filter(Project.is_featured == True).count()
    
    status_stats = {}
    for status in ProjectStatus:
        count = Project.query.filter(Project.status == status).count()
        status_stats[status.value] = count
    
    # Get technology usage stats
    all_projects = Project.query.all()
    technology_stats = {}
    for project in all_projects:
        for tech in project.technologies_list:
            technology_stats[tech] = technology_stats.get(tech, 0) + 1
    
    return {
        'total_projects': total_projects,
        'featured_projects': featured_projects,
        'status_stats': status_stats,
        'technology_stats': technology_stats
    }
