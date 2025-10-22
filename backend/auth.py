# Authentication Module for Wheeler Knight Portfolio
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from flask import current_app
from functools import wraps
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class AuthManager:
    """Authentication manager for handling JWT tokens and user sessions"""
    
    def __init__(self, app=None):
        self.jwt_manager = None
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize JWT manager with Flask app"""
        self.jwt_manager = JWTManager(app)
        
        # Configure JWT settings
        app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
        app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
        app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
        app.config['JWT_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
        app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Set to True for CSRF protection
        
        # JWT error handlers
        @self.jwt_manager.expired_token_loader
        def expired_token_callback(jwt_header, jwt_payload):
            return {
                'success': False,
                'error': 'Token has expired',
                'message': 'Please log in again'
            }, 401
        
        @self.jwt_manager.invalid_token_loader
        def invalid_token_callback(error):
            return {
                'success': False,
                'error': 'Invalid token',
                'message': 'Please log in again'
            }, 401
        
        @self.jwt_manager.unauthorized_loader
        def missing_token_callback(error):
            return {
                'success': False,
                'error': 'Authorization required',
                'message': 'Please provide a valid token'
            }, 401
        
        @self.jwt_manager.needs_fresh_token_loader
        def token_not_fresh_callback(jwt_header, jwt_payload):
            return {
                'success': False,
                'error': 'Fresh token required',
                'message': 'Please log in again'
            }, 401

def create_tokens(user_id: int, username: str, role: str) -> Dict[str, str]:
    """Create access and refresh tokens for a user"""
    try:
        # Create token payload
        additional_claims = {
            'username': username,
            'role': role,
            'user_id': user_id
        }
        
        # Create tokens
        access_token = create_access_token(
            identity=str(user_id),  # Convert to string
            additional_claims=additional_claims
        )
        
        refresh_token = create_refresh_token(
            identity=str(user_id),  # Convert to string
            additional_claims=additional_claims
        )
        
        logger.info(f"Created tokens for user: {username} (ID: {user_id})")
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer',
            'expires_in': current_app.config['JWT_ACCESS_TOKEN_EXPIRES'].total_seconds()
        }
        
    except Exception as e:
        logger.error(f"Error creating tokens for user {user_id}: {str(e)}")
        raise

def get_current_user() -> Optional[Dict[str, Any]]:
    """Get current authenticated user information"""
    try:
        user_id = get_jwt_identity()
        if not user_id:
            return None
        
        claims = get_jwt()
        return {
            'id': int(user_id),  # Convert back to int
            'username': claims.get('username'),
            'role': claims.get('role')
        }
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        return None

def admin_required(f):
    """Decorator to require admin authentication"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user = get_current_user()
        if not current_user:
            return {
                'success': False,
                'error': 'Authentication required',
                'message': 'Please log in to access this resource'
            }, 401
        
        # Check if user has admin role
        if current_user.get('role') not in ['admin', 'super_admin']:
            return {
                'success': False,
                'error': 'Insufficient permissions',
                'message': 'Admin access required'
            }, 403
        
        # Add current user to kwargs for use in the function
        kwargs['current_user'] = current_user
        return f(*args, **kwargs)
    
    return decorated_function

def super_admin_required(f):
    """Decorator to require super admin authentication"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user = get_current_user()
        if not current_user:
            return {
                'success': False,
                'error': 'Authentication required',
                'message': 'Please log in to access this resource'
            }, 401
        
        # Check if user has super admin role
        if current_user.get('role') != 'super_admin':
            return {
                'success': False,
                'error': 'Insufficient permissions',
                'message': 'Super admin access required'
            }, 403
        
        # Add current user to kwargs for use in the function
        kwargs['current_user'] = current_user
        return f(*args, **kwargs)
    
    return decorated_function

def optional_auth(f):
    """Decorator for optional authentication (public endpoints that can benefit from user context)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            current_user = get_current_user()
            kwargs['current_user'] = current_user
        except:
            kwargs['current_user'] = None
        
        return f(*args, **kwargs)
    
    return decorated_function

def validate_password_strength(password: str) -> Dict[str, Any]:
    """Validate password strength"""
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if not any(c.isupper() for c in password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not any(c.islower() for c in password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not any(c.isdigit() for c in password):
        errors.append("Password must contain at least one number")
    
    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        errors.append("Password must contain at least one special character")
    
    return {
        'is_valid': len(errors) == 0,
        'errors': errors,
        'strength': 'strong' if len(errors) == 0 else 'weak'
    }

def log_auth_event(event_type: str, user_id: Optional[int], ip_address: Optional[str], 
                   user_agent: Optional[str], details: Optional[Dict[str, Any]] = None):
    """Log authentication events for security monitoring"""
    try:
        from models import db
        from models.models import Analytics
        
        event_data = {
            'event_type': event_type,
            'details': details or {}
        }
        
        analytics = Analytics(
            event_type=f'auth_{event_type}',
            event_data=event_data,
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        db.session.add(analytics)
        db.session.commit()
        
        logger.info(f"Auth event logged: {event_type} for user {user_id}")
        
    except Exception as e:
        logger.error(f"Failed to log auth event: {str(e)}")

# Initialize auth manager
auth_manager = AuthManager()
