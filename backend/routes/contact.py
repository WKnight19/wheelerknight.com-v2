# Contact/Messages API Routes for Wheeler Knight Portfolio
from flask import Blueprint, request, jsonify
from models import db
from models.models import Message, Analytics
from models.message import MessageStatus
from routes import create_api_blueprint, handle_api_response, validate_required_fields, paginate_query, format_pagination_response
from auth import admin_required
from error_handling import ValidationError, NotFoundError
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Create contact blueprint
contact_bp = create_api_blueprint('contact', 'contact')

@contact_bp.route('/messages', methods=['GET'])
@handle_api_response
@admin_required
def get_messages(current_user):
    """Get all messages with optional filtering and pagination (Admin only)"""
    try:
        # Get query parameters
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Build query
        query = Message.query
        
        # Apply filters
        if status:
            try:
                status_enum = MessageStatus(status)
                query = query.filter(Message.status == status_enum)
            except ValueError:
                raise ValidationError(f"Invalid status: {status}")
        
        # Order by created_at (newest first)
        query = query.order_by(Message.created_at.desc())
        
        # Paginate results
        pagination = paginate_query(query, page, per_page)
        
        return format_pagination_response(pagination)
        
    except Exception as e:
        logger.error(f"Error getting messages: {str(e)}")
        raise

@contact_bp.route('/messages/<int:message_id>', methods=['GET'])
@handle_api_response
@admin_required
def get_message(message_id, current_user):
    """Get a specific message by ID (Admin only)"""
    message = Message.query.get_or_404(message_id)
    
    # Mark as read if it's new
    if message.is_new:
        message.mark_as_read()
        db.session.commit()
    
    return message.to_dict()

@contact_bp.route('/messages', methods=['POST'])
@handle_api_response
def create_message():
    """Create a new contact message"""
    data = request.get_json()
    
    # Validate required fields
    validate_required_fields(data, ['name', 'email', 'message'])
    
    # Basic email validation
    email = data['email']
    if '@' not in email or '.' not in email.split('@')[1]:
        raise ValidationError("Invalid email format")
    
    # Create message
    message = Message(
        name=data['name'],
        email=data['email'],
        message=data['message'],
        subject=data.get('subject'),
        phone=data.get('phone'),
        company=data.get('company')
    )
    
    db.session.add(message)
    db.session.commit()
    
    # Track analytics
    try:
        analytics = Analytics.track_contact_form(
            form_data={
                'name': data['name'],
                'email': data['email'],
                'subject': data.get('subject'),
                'company': data.get('company')
            },
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent'),
            session_id=request.headers.get('X-Session-ID')
        )
        db.session.add(analytics)
        db.session.commit()
    except Exception as e:
        logger.warning(f"Failed to track contact form analytics: {e}")
    
    logger.info(f"New contact message from: {message.name} ({message.email})")
    return message.to_dict(), 201

@contact_bp.route('/messages/<int:message_id>', methods=['PUT'])
@handle_api_response
@admin_required
def update_message(message_id, current_user):
    """Update a message status (Admin only)"""
    message = Message.query.get_or_404(message_id)
    data = request.get_json()
    
    # Update status
    if 'status' in data:
        try:
            new_status = MessageStatus(data['status'])
            
            if new_status == MessageStatus.READ:
                message.mark_as_read()
            elif new_status == MessageStatus.REPLIED:
                message.mark_as_replied()
            elif new_status == MessageStatus.ARCHIVED:
                message.archive()
            else:
                message.status = new_status
                
        except ValueError:
            raise ValidationError(f"Invalid status: {data['status']}")
    
    db.session.commit()
    
    logger.info(f"Updated message status: {message.id}")
    return message.to_dict()

@contact_bp.route('/messages/<int:message_id>', methods=['DELETE'])
@handle_api_response
@admin_required
def delete_message(message_id, current_user):
    """Delete a message (Admin only)"""
    message = Message.query.get_or_404(message_id)
    
    db.session.delete(message)
    db.session.commit()
    
    logger.info(f"Deleted message: {message.id}")
    return {'message': 'Message deleted successfully'}

@contact_bp.route('/messages/<int:message_id>/reply', methods=['POST'])
@handle_api_response
@admin_required
def reply_to_message(message_id, current_user):
    """Mark message as replied and send response (Admin only)"""
    message = Message.query.get_or_404(message_id)
    data = request.get_json()
    
    validate_required_fields(data, ['reply_content'])
    
    # Mark as replied
    message.mark_as_replied()
    
    # Here you would typically send an email
    # For now, we'll just log the reply
    logger.info(f"Reply sent to {message.email}: {data['reply_content']}")
    
    db.session.commit()
    
    return {
        'message': 'Reply sent successfully',
        'status': message.status.value
    }

@contact_bp.route('/stats', methods=['GET'])
@handle_api_response
@admin_required
def get_contact_stats(current_user):
    """Get contact form statistics (Admin only)"""
    total_messages = Message.query.count()
    new_messages = Message.query.filter(Message.status == MessageStatus.NEW).count()
    read_messages = Message.query.filter(Message.status == MessageStatus.READ).count()
    replied_messages = Message.query.filter(Message.status == MessageStatus.REPLIED).count()
    archived_messages = Message.query.filter(Message.status == MessageStatus.ARCHIVED).count()
    
    # Get recent messages
    recent_messages = Message.query.order_by(Message.created_at.desc()).limit(5).all()
    
    return {
        'total_messages': total_messages,
        'new_messages': new_messages,
        'read_messages': read_messages,
        'replied_messages': replied_messages,
        'archived_messages': archived_messages,
        'recent_messages': [msg.to_dict() for msg in recent_messages]
    }

@contact_bp.route('/info', methods=['GET'])
@handle_api_response
def get_contact_info():
    """Get Wheeler Knight's contact information"""
    return {
        'name': 'Wheeler Knight',
        'email': 'wheeler@wheelerknight.com',
        'phone': '(555) 123-4567',  # Update with real phone
        'location': 'Tuscaloosa, Alabama',
        'college_address': '401 Jefferson Ave, Room 125, Tuscaloosa Alabama 35401',
        'home_address': '11906 County Road 236, Moulton Alabama 35650',
        'social_media': {
            'linkedin': 'https://linkedin.com/in/wheelerknight',
            'github': 'https://github.com/wheelerknight',
            'twitter': 'https://twitter.com/wheelerknight'
        },
        'availability': 'Available for internships and full-time positions starting May 2026'
    }
