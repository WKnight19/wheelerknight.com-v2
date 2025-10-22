# Skills API Routes for Wheeler Knight Portfolio
from flask import Blueprint, request, jsonify
from models import db
from models.models import Skill
from models.skill import SkillCategory
from routes import create_api_blueprint, handle_api_response, validate_required_fields, paginate_query, format_pagination_response
from auth import admin_required
from error_handling import ValidationError, NotFoundError
import logging

logger = logging.getLogger(__name__)

# Create skills blueprint
skills_bp = create_api_blueprint('skills', 'skills')

@skills_bp.route('/', methods=['GET'])
@handle_api_response
def get_skills():
    """Get all skills with optional filtering and pagination"""
    try:
        # Get query parameters
        category = request.args.get('category')
        featured_only = request.args.get('featured', 'false').lower() == 'true'
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Build query
        query = Skill.query
        
        # Apply filters
        if category:
            try:
                category_enum = SkillCategory(category)
                query = query.filter(Skill.category == category_enum)
            except ValueError:
                raise ValidationError(f"Invalid category: {category}")
        
        if featured_only:
            query = query.filter(Skill.is_featured == True)
        
        # Order by display_order and name
        query = query.order_by(Skill.display_order.asc(), Skill.name.asc())
        
        # Paginate results
        pagination = paginate_query(query, page, per_page)
        
        return format_pagination_response(pagination)
        
    except Exception as e:
        logger.error(f"Error getting skills: {str(e)}")
        raise

@skills_bp.route('/<int:skill_id>', methods=['GET'])
@handle_api_response
def get_skill(skill_id):
    """Get a specific skill by ID"""
    skill = Skill.query.get_or_404(skill_id)
    return skill.to_dict()

@skills_bp.route('/categories', methods=['GET'])
@handle_api_response
def get_skill_categories():
    """Get all available skill categories"""
    categories = [
        {
            'value': category.value,
            'label': category.value.replace('_', ' ').title(),
            'count': Skill.query.filter(Skill.category == category).count()
        }
        for category in SkillCategory
    ]
    return categories

@skills_bp.route('/', methods=['POST'])
@handle_api_response
@admin_required
def create_skill(current_user):
    """Create a new skill (Admin only)"""
    data = request.get_json()
    
    # Validate required fields
    validate_required_fields(data, ['name', 'category'])
    
    # Validate category
    try:
        category = SkillCategory(data['category'])
    except ValueError:
        raise ValidationError(f"Invalid category: {data['category']}")
    
    # Validate proficiency level if provided
    proficiency_level = data.get('proficiency_level')
    if proficiency_level is not None:
        if not isinstance(proficiency_level, int) or not (1 <= proficiency_level <= 5):
            raise ValidationError("Proficiency level must be between 1 and 5")
    
    # Create skill
    skill = Skill(
        name=data['name'],
        category=category,
        proficiency_level=proficiency_level,
        description=data.get('description'),
        icon=data.get('icon'),
        display_order=data.get('display_order', 0),
        is_featured=data.get('is_featured', False)
    )
    
    db.session.add(skill)
    db.session.commit()
    
    logger.info(f"Created skill: {skill.name}")
    return skill.to_dict(), 201

@skills_bp.route('/<int:skill_id>', methods=['PUT'])
@handle_api_response
@admin_required
def update_skill(skill_id, current_user):
    """Update a skill (Admin only)"""
    skill = Skill.query.get_or_404(skill_id)
    data = request.get_json()
    
    # Update fields
    if 'name' in data:
        skill.name = data['name']
    
    if 'category' in data:
        try:
            skill.category = SkillCategory(data['category'])
        except ValueError:
            raise ValidationError(f"Invalid category: {data['category']}")
    
    if 'proficiency_level' in data:
        proficiency_level = data['proficiency_level']
        if proficiency_level is not None and not (1 <= proficiency_level <= 5):
            raise ValidationError("Proficiency level must be between 1 and 5")
        skill.proficiency_level = proficiency_level
    
    if 'description' in data:
        skill.description = data['description']
    
    if 'icon' in data:
        skill.icon = data['icon']
    
    if 'display_order' in data:
        skill.display_order = data['display_order']
    
    if 'is_featured' in data:
        skill.is_featured = data['is_featured']
    
    db.session.commit()
    
    logger.info(f"Updated skill: {skill.name}")
    return skill.to_dict()

@skills_bp.route('/<int:skill_id>', methods=['DELETE'])
@handle_api_response
@admin_required
def delete_skill(skill_id, current_user):
    """Delete a skill (Admin only)"""
    skill = Skill.query.get_or_404(skill_id)
    
    db.session.delete(skill)
    db.session.commit()
    
    logger.info(f"Deleted skill: {skill.name}")
    return {'message': 'Skill deleted successfully'}

@skills_bp.route('/stats', methods=['GET'])
@handle_api_response
@admin_required
def get_skills_stats(current_user):
    """Get skills statistics"""
    total_skills = Skill.query.count()
    featured_skills = Skill.query.filter(Skill.is_featured == True).count()
    
    category_stats = {}
    for category in SkillCategory:
        count = Skill.query.filter(Skill.category == category).count()
        category_stats[category.value] = count
    
    proficiency_stats = {}
    for level in range(1, 6):
        count = Skill.query.filter(Skill.proficiency_level == level).count()
        proficiency_stats[f'level_{level}'] = count
    
    return {
        'total_skills': total_skills,
        'featured_skills': featured_skills,
        'category_stats': category_stats,
        'proficiency_stats': proficiency_stats
    }
