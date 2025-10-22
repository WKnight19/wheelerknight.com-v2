# Portfolio API Routes for Wheeler Knight Portfolio
from flask import Blueprint, request, jsonify
from models import db
from models.models import Education, WorkExperience, Interest
from models.interest import InterestCategory
from routes import create_api_blueprint, handle_api_response, validate_required_fields, paginate_query, format_pagination_response
from auth import admin_required
from error_handling import ValidationError, NotFoundError
import logging
from datetime import date

logger = logging.getLogger(__name__)

# Create portfolio blueprint
portfolio_bp = create_api_blueprint('portfolio', 'portfolio')

# Education routes
@portfolio_bp.route('/education', methods=['GET'])
@handle_api_response
def get_education():
    """Get all education records"""
    education_records = Education.query.order_by(Education.display_order.asc(), Education.start_date.desc()).all()
    return [edu.to_dict() for edu in education_records]

@portfolio_bp.route('/education/<int:edu_id>', methods=['GET'])
@handle_api_response
def get_education_record(edu_id):
    """Get a specific education record"""
    education = Education.query.get_or_404(edu_id)
    return education.to_dict()

@portfolio_bp.route('/education', methods=['POST'])
@handle_api_response
@admin_required
def create_education(current_user):
    """Create a new education record (Admin only)"""
    data = request.get_json()
    
    validate_required_fields(data, ['institution', 'degree', 'start_date'])
    
    # Parse dates
    try:
        start_date = date.fromisoformat(data['start_date'])
    except ValueError:
        raise ValidationError("Invalid start_date format. Use YYYY-MM-DD")
    
    end_date = None
    if 'end_date' in data and data['end_date']:
        try:
            end_date = date.fromisoformat(data['end_date'])
        except ValueError:
            raise ValidationError("Invalid end_date format. Use YYYY-MM-DD")
    
    education = Education(
        institution=data['institution'],
        degree=data['degree'],
        field_of_study=data.get('field_of_study'),
        gpa=data.get('gpa'),
        start_date=start_date,
        end_date=end_date,
        is_current=data.get('is_current', False),
        description=data.get('description'),
        achievements=data.get('achievements'),
        display_order=data.get('display_order', 0)
    )
    
    db.session.add(education)
    db.session.commit()
    
    logger.info(f"Created education record: {education.degree} at {education.institution}")
    return education.to_dict(), 201

@portfolio_bp.route('/education/<int:edu_id>', methods=['PUT'])
@handle_api_response
@admin_required
def update_education(edu_id, current_user):
    """Update an education record (Admin only)"""
    education = Education.query.get_or_404(edu_id)
    data = request.get_json()
    
    if 'institution' in data:
        education.institution = data['institution']
    
    if 'degree' in data:
        education.degree = data['degree']
    
    if 'field_of_study' in data:
        education.field_of_study = data['field_of_study']
    
    if 'gpa' in data:
        education.gpa = data['gpa']
    
    if 'start_date' in data:
        try:
            education.start_date = date.fromisoformat(data['start_date'])
        except ValueError:
            raise ValidationError("Invalid start_date format. Use YYYY-MM-DD")
    
    if 'end_date' in data:
        if data['end_date']:
            try:
                education.end_date = date.fromisoformat(data['end_date'])
            except ValueError:
                raise ValidationError("Invalid end_date format. Use YYYY-MM-DD")
        else:
            education.end_date = None
    
    if 'is_current' in data:
        education.is_current = data['is_current']
    
    if 'description' in data:
        education.description = data['description']
    
    if 'achievements' in data:
        education.achievements = data['achievements']
    
    if 'display_order' in data:
        education.display_order = data['display_order']
    
    db.session.commit()
    
    logger.info(f"Updated education record: {education.degree} at {education.institution}")
    return education.to_dict()

# Work Experience routes
@portfolio_bp.route('/experience', methods=['GET'])
@handle_api_response
def get_work_experience():
    """Get all work experience records"""
    experience_records = WorkExperience.query.order_by(WorkExperience.display_order.asc(), WorkExperience.start_date.desc()).all()
    return [exp.to_dict() for exp in experience_records]

@portfolio_bp.route('/experience/<int:exp_id>', methods=['GET'])
@handle_api_response
def get_work_experience_record(exp_id):
    """Get a specific work experience record"""
    experience = WorkExperience.query.get_or_404(exp_id)
    return experience.to_dict()

@portfolio_bp.route('/experience', methods=['POST'])
@handle_api_response
@admin_required
def create_work_experience(current_user):
    """Create a new work experience record (Admin only)"""
    data = request.get_json()
    
    validate_required_fields(data, ['company', 'position', 'start_date'])
    
    # Parse dates
    try:
        start_date = date.fromisoformat(data['start_date'])
    except ValueError:
        raise ValidationError("Invalid start_date format. Use YYYY-MM-DD")
    
    end_date = None
    if 'end_date' in data and data['end_date']:
        try:
            end_date = date.fromisoformat(data['end_date'])
        except ValueError:
            raise ValidationError("Invalid end_date format. Use YYYY-MM-DD")
    
    experience = WorkExperience(
        company=data['company'],
        position=data['position'],
        location=data.get('location'),
        start_date=start_date,
        end_date=end_date,
        is_current=data.get('is_current', False),
        description=data.get('description'),
        achievements=data.get('achievements'),
        technologies=data.get('technologies', []),
        display_order=data.get('display_order', 0)
    )
    
    db.session.add(experience)
    db.session.commit()
    
    logger.info(f"Created work experience: {experience.position} at {experience.company}")
    return experience.to_dict(), 201

@portfolio_bp.route('/experience/<int:exp_id>', methods=['PUT'])
@handle_api_response
@admin_required
def update_work_experience(exp_id, current_user):
    """Update a work experience record (Admin only)"""
    experience = WorkExperience.query.get_or_404(exp_id)
    data = request.get_json()
    
    if 'company' in data:
        experience.company = data['company']
    
    if 'position' in data:
        experience.position = data['position']
    
    if 'location' in data:
        experience.location = data['location']
    
    if 'start_date' in data:
        try:
            experience.start_date = date.fromisoformat(data['start_date'])
        except ValueError:
            raise ValidationError("Invalid start_date format. Use YYYY-MM-DD")
    
    if 'end_date' in data:
        if data['end_date']:
            try:
                experience.end_date = date.fromisoformat(data['end_date'])
            except ValueError:
                raise ValidationError("Invalid end_date format. Use YYYY-MM-DD")
        else:
            experience.end_date = None
    
    if 'is_current' in data:
        experience.is_current = data['is_current']
    
    if 'description' in data:
        experience.description = data['description']
    
    if 'achievements' in data:
        experience.achievements = data['achievements']
    
    if 'technologies' in data:
        experience.technologies_list = data['technologies']
    
    if 'display_order' in data:
        experience.display_order = data['display_order']
    
    db.session.commit()
    
    logger.info(f"Updated work experience: {experience.position} at {experience.company}")
    return experience.to_dict()

# Interests routes
@portfolio_bp.route('/interests', methods=['GET'])
@handle_api_response
def get_interests():
    """Get all interests with optional filtering"""
    category = request.args.get('category')
    featured_only = request.args.get('featured', 'false').lower() == 'true'
    
    query = Interest.query
    
    if category:
        try:
            category_enum = InterestCategory(category)
            query = query.filter(Interest.category == category_enum)
        except ValueError:
            raise ValidationError(f"Invalid category: {category}")
    
    if featured_only:
        query = query.filter(Interest.is_featured == True)
    
    interests = query.order_by(Interest.display_order.asc(), Interest.title.asc()).all()
    return [interest.to_dict() for interest in interests]

@portfolio_bp.route('/interests/<int:interest_id>', methods=['GET'])
@handle_api_response
def get_interest(interest_id):
    """Get a specific interest"""
    interest = Interest.query.get_or_404(interest_id)
    return interest.to_dict()

@portfolio_bp.route('/interests', methods=['POST'])
@handle_api_response
@admin_required
def create_interest(current_user):
    """Create a new interest (Admin only)"""
    data = request.get_json()
    
    validate_required_fields(data, ['title', 'category'])
    
    try:
        category = InterestCategory(data['category'])
    except ValueError:
        raise ValidationError(f"Invalid category: {data['category']}")
    
    interest = Interest(
        title=data['title'],
        category=category,
        description=data.get('description'),
        image_url=data.get('image_url'),
        external_url=data.get('external_url'),
        display_order=data.get('display_order', 0),
        is_featured=data.get('is_featured', False)
    )
    
    db.session.add(interest)
    db.session.commit()
    
    logger.info(f"Created interest: {interest.title}")
    return interest.to_dict(), 201

@portfolio_bp.route('/interests/<int:interest_id>', methods=['PUT'])
@handle_api_response
@admin_required
def update_interest(interest_id, current_user):
    """Update an interest (Admin only)"""
    interest = Interest.query.get_or_404(interest_id)
    data = request.get_json()
    
    if 'title' in data:
        interest.title = data['title']
    
    if 'category' in data:
        try:
            interest.category = InterestCategory(data['category'])
        except ValueError:
            raise ValidationError(f"Invalid category: {data['category']}")
    
    if 'description' in data:
        interest.description = data['description']
    
    if 'image_url' in data:
        interest.image_url = data['image_url']
    
    if 'external_url' in data:
        interest.external_url = data['external_url']
    
    if 'display_order' in data:
        interest.display_order = data['display_order']
    
    if 'is_featured' in data:
        interest.is_featured = data['is_featured']
    
    db.session.commit()
    
    logger.info(f"Updated interest: {interest.title}")
    return interest.to_dict()

@portfolio_bp.route('/interests/categories', methods=['GET'])
@handle_api_response
def get_interest_categories():
    """Get all available interest categories"""
    categories = [
        {
            'value': category.value,
            'label': category.value.replace('_', ' ').title(),
            'count': Interest.query.filter(Interest.category == category).count()
        }
        for category in InterestCategory
    ]
    return categories

@portfolio_bp.route('/summary', methods=['GET'])
@handle_api_response
def get_portfolio_summary():
    """Get a summary of Wheeler Knight's portfolio"""
    education_count = Education.query.count()
    experience_count = WorkExperience.query.count()
    interests_count = Interest.query.count()
    
    # Get current education
    current_education = Education.query.filter(Education.is_current == True).first()
    
    # Get current work experience
    current_experience = WorkExperience.query.filter(WorkExperience.is_current == True).first()
    
    # Get featured interests
    featured_interests = Interest.query.filter(Interest.is_featured == True).limit(5).all()
    
    return {
        'education_count': education_count,
        'experience_count': experience_count,
        'interests_count': interests_count,
        'current_education': current_education.to_dict() if current_education else None,
        'current_experience': current_experience.to_dict() if current_experience else None,
        'featured_interests': [interest.to_dict() for interest in featured_interests]
    }
