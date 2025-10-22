# Authentication Routes for Wheeler Knight Portfolio
from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db
from models.models import AdminUser
from models.admin_user import AdminRole
from routes import create_api_blueprint, handle_api_response, validate_required_fields
from auth import create_tokens, get_current_user, validate_password_strength, log_auth_event
from error_handling import ValidationError, AuthenticationError, AuthorizationError
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Create auth blueprint
auth_bp = create_api_blueprint('auth', 'auth')

@auth_bp.route('/login', methods=['POST'])
@handle_api_response
def login():
    """Admin login endpoint"""
    data = request.get_json()
    
    # Validate required fields
    validate_required_fields(data, ['username', 'password'])
    
    username = data['username']
    password = data['password']
    
    # Find user
    user = AdminUser.query.filter_by(username=username).first()
    
    if not user:
        log_auth_event('login_failed', None, request.remote_addr, 
                      request.headers.get('User-Agent'), {'username': username, 'reason': 'user_not_found'})
        raise AuthenticationError("Invalid username or password")
    
    if not user.is_active:
        log_auth_event('login_failed', user.id, request.remote_addr,
                      request.headers.get('User-Agent'), {'username': username, 'reason': 'account_inactive'})
        raise AuthenticationError("Account is inactive")
    
    # Check password
    if not user.check_password(password):
        log_auth_event('login_failed', user.id, request.remote_addr,
                      request.headers.get('User-Agent'), {'username': username, 'reason': 'invalid_password'})
        raise AuthenticationError("Invalid username or password")
    
    # Update last login
    user.update_last_login()
    db.session.commit()
    
    # Create tokens
    tokens = create_tokens(user.id, user.username, user.role.value)
    
    # Log successful login
    log_auth_event('login_success', user.id, request.remote_addr,
                  request.headers.get('User-Agent'), {'username': username, 'role': user.role.value})
    
    logger.info(f"Admin login successful: {username}")
    
    return {
        'user': user.to_dict(),
        'tokens': tokens,
        'message': 'Login successful'
    }

@auth_bp.route('/logout', methods=['POST'])
@handle_api_response
@jwt_required()
def logout():
    """Admin logout endpoint"""
    current_user = get_current_user()
    
    if current_user:
        log_auth_event('logout', current_user['id'], request.remote_addr,
                      request.headers.get('User-Agent'), {'username': current_user['username']})
        logger.info(f"Admin logout: {current_user['username']}")
    
    return {'message': 'Logout successful'}

@auth_bp.route('/refresh', methods=['POST'])
@handle_api_response
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    current_user = get_current_user()
    
    if not current_user:
        raise AuthenticationError("Invalid refresh token")
    
    # Get user from database to ensure they still exist and are active
    user = AdminUser.query.get(current_user['id'])
    if not user or not user.is_active:
        raise AuthenticationError("User not found or inactive")
    
    # Create new access token
    tokens = create_tokens(user.id, user.username, user.role.value)
    
    log_auth_event('token_refresh', user.id, request.remote_addr,
                  request.headers.get('User-Agent'), {'username': user.username})
    
    return {
        'access_token': tokens['access_token'],
        'token_type': tokens['token_type'],
        'expires_in': tokens['expires_in']
    }

@auth_bp.route('/me', methods=['GET'])
@handle_api_response
@jwt_required()
def get_current_user_info():
    """Get current authenticated user information"""
    current_user = get_current_user()
    
    if not current_user:
        raise AuthenticationError("User not found")
    
    # Get full user data from database
    user = AdminUser.query.get(current_user['id'])
    if not user:
        raise AuthenticationError("User not found")
    
    return user.to_dict()

@auth_bp.route('/change-password', methods=['POST'])
@handle_api_response
@jwt_required()
def change_password():
    """Change user password"""
    current_user = get_current_user()
    
    if not current_user:
        raise AuthenticationError("User not found")
    
    data = request.get_json()
    validate_required_fields(data, ['current_password', 'new_password'])
    
    # Get user from database
    user = AdminUser.query.get(current_user['id'])
    if not user:
        raise AuthenticationError("User not found")
    
    # Verify current password
    if not user.check_password(data['current_password']):
        log_auth_event('password_change_failed', user.id, request.remote_addr,
                      request.headers.get('User-Agent'), {'reason': 'invalid_current_password'})
        raise AuthenticationError("Current password is incorrect")
    
    # Validate new password strength
    password_validation = validate_password_strength(data['new_password'])
    if not password_validation['is_valid']:
        raise ValidationError(f"Password does not meet requirements: {', '.join(password_validation['errors'])}")
    
    # Set new password
    user.set_password(data['new_password'])
    db.session.commit()
    
    log_auth_event('password_change_success', user.id, request.remote_addr,
                  request.headers.get('User-Agent'), {'username': user.username})
    
    logger.info(f"Password changed for user: {user.username}")
    
    return {'message': 'Password changed successfully'}

@auth_bp.route('/users', methods=['GET'])
@handle_api_response
@jwt_required()
def get_users():
    """Get all admin users (Super Admin only)"""
    current_user = get_current_user()
    
    if not current_user or current_user['role'] != 'super_admin':
        raise AuthorizationError("Super admin access required")
    
    users = AdminUser.query.all()
    return [user.to_dict() for user in users]

@auth_bp.route('/users', methods=['POST'])
@handle_api_response
@jwt_required()
def create_user():
    """Create new admin user (Super Admin only)"""
    current_user = get_current_user()
    
    if not current_user or current_user['role'] != 'super_admin':
        raise AuthorizationError("Super admin access required")
    
    data = request.get_json()
    validate_required_fields(data, ['username', 'email', 'password', 'role'])
    
    # Check if username or email already exists
    if AdminUser.query.filter_by(username=data['username']).first():
        raise ValidationError("Username already exists")
    
    if AdminUser.query.filter_by(email=data['email']).first():
        raise ValidationError("Email already exists")
    
    # Validate role
    try:
        role = AdminRole(data['role'])
    except ValueError:
        raise ValidationError(f"Invalid role: {data['role']}")
    
    # Validate password strength
    password_validation = validate_password_strength(data['password'])
    if not password_validation['is_valid']:
        raise ValidationError(f"Password does not meet requirements: {', '.join(password_validation['errors'])}")
    
    # Create user
    user = AdminUser(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        role=role
    )
    
    db.session.add(user)
    db.session.commit()
    
    log_auth_event('user_created', current_user['id'], request.remote_addr,
                  request.headers.get('User-Agent'), {
                      'created_user': user.username,
                      'role': user.role.value
                  })
    
    logger.info(f"Admin user created: {user.username} by {current_user['username']}")
    
    return user.to_dict(), 201

@auth_bp.route('/users/<int:user_id>', methods=['PUT'])
@handle_api_response
@jwt_required()
def update_user(user_id):
    """Update admin user (Super Admin only)"""
    current_user = get_current_user()
    
    if not current_user or current_user['role'] != 'super_admin':
        raise AuthorizationError("Super admin access required")
    
    user = AdminUser.query.get_or_404(user_id)
    data = request.get_json()
    
    # Update fields
    if 'username' in data:
        # Check if username is already taken by another user
        existing_user = AdminUser.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != user.id:
            raise ValidationError("Username already exists")
        user.username = data['username']
    
    if 'email' in data:
        # Check if email is already taken by another user
        existing_user = AdminUser.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user.id:
            raise ValidationError("Email already exists")
        user.email = data['email']
    
    if 'first_name' in data:
        user.first_name = data['first_name']
    
    if 'last_name' in data:
        user.last_name = data['last_name']
    
    if 'role' in data:
        try:
            user.role = AdminRole(data['role'])
        except ValueError:
            raise ValidationError(f"Invalid role: {data['role']}")
    
    if 'is_active' in data:
        user.is_active = data['is_active']
    
    db.session.commit()
    
    log_auth_event('user_updated', current_user['id'], request.remote_addr,
                  request.headers.get('User-Agent'), {
                      'updated_user': user.username,
                      'role': user.role.value
                  })
    
    logger.info(f"Admin user updated: {user.username} by {current_user['username']}")
    
    return user.to_dict()

@auth_bp.route('/users/<int:user_id>', methods=['DELETE'])
@handle_api_response
@jwt_required()
def delete_user(user_id):
    """Delete admin user (Super Admin only)"""
    current_user = get_current_user()
    
    if not current_user or current_user['role'] != 'super_admin':
        raise AuthorizationError("Super admin access required")
    
    # Prevent self-deletion
    if current_user['id'] == user_id:
        raise ValidationError("Cannot delete your own account")
    
    user = AdminUser.query.get_or_404(user_id)
    
    log_auth_event('user_deleted', current_user['id'], request.remote_addr,
                  request.headers.get('User-Agent'), {
                      'deleted_user': user.username,
                      'role': user.role.value
                  })
    
    db.session.delete(user)
    db.session.commit()
    
    logger.info(f"Admin user deleted: {user.username} by {current_user['username']}")
    
    return {'message': 'User deleted successfully'}

@auth_bp.route('/validate-token', methods=['GET'])
@handle_api_response
@jwt_required()
def validate_token():
    """Validate current token"""
    current_user = get_current_user()
    
    if not current_user:
        raise AuthenticationError("Invalid token")
    
    return {
        'valid': True,
        'user': current_user,
        'message': 'Token is valid'
    }
