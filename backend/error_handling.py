# Error Handling Module for Wheeler Knight Portfolio
from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException
import logging
import traceback
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class APIError(Exception):
    """Custom API error class"""
    
    def __init__(
        self, 
        message: str, 
        status_code: int = 500, 
        error_code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or f"ERROR_{status_code}"
        self.details = details or {}
        super().__init__(self.message)

class ValidationError(APIError):
    """Validation error"""
    
    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(
            message=message,
            status_code=400,
            error_code="VALIDATION_ERROR",
            details={"field": field} if field else {}
        )

class AuthenticationError(APIError):
    """Authentication error"""
    
    def __init__(self, message: str = "Authentication required"):
        super().__init__(
            message=message,
            status_code=401,
            error_code="AUTHENTICATION_ERROR"
        )

class AuthorizationError(APIError):
    """Authorization error"""
    
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(
            message=message,
            status_code=403,
            error_code="AUTHORIZATION_ERROR"
        )

class NotFoundError(APIError):
    """Not found error"""
    
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            status_code=404,
            error_code="NOT_FOUND"
        )

class DatabaseError(APIError):
    """Database error"""
    
    def __init__(self, message: str = "Database operation failed"):
        super().__init__(
            message=message,
            status_code=500,
            error_code="DATABASE_ERROR"
        )

def register_error_handlers(app: Flask):
    """Register error handlers for the Flask application"""
    
    @app.errorhandler(APIError)
    def handle_api_error(error: APIError):
        """Handle custom API errors"""
        logger.warning(f"API Error: {error.message} (Code: {error.error_code})")
        
        response = {
            "error": {
                "message": error.message,
                "code": error.error_code,
                "status_code": error.status_code,
                "details": error.details,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        return jsonify(response), error.status_code
    
    @app.errorhandler(HTTPException)
    def handle_http_exception(error: HTTPException):
        """Handle HTTP exceptions"""
        logger.warning(f"HTTP Error: {error.description} (Code: {error.code})")
        
        response = {
            "error": {
                "message": error.description,
                "code": f"HTTP_{error.code}",
                "status_code": error.code,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        return jsonify(response), error.code
    
    @app.errorhandler(ValidationError)
    def handle_validation_error(error: ValidationError):
        """Handle validation errors"""
        logger.warning(f"Validation Error: {error.message}")
        
        response = {
            "error": {
                "message": error.message,
                "code": "VALIDATION_ERROR",
                "status_code": 400,
                "details": error.details,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        return jsonify(response), 400
    
    @app.errorhandler(Exception)
    def handle_generic_exception(error: Exception):
        """Handle generic exceptions"""
        logger.error(f"Unhandled Exception: {str(error)}", exc_info=True)
        
        # Don't expose internal errors in production
        if app.config.get('FLASK_ENV') == 'production':
            message = "An internal server error occurred"
            details = {}
        else:
            message = str(error)
            details = {
                "traceback": traceback.format_exc(),
                "type": type(error).__name__
            }
        
        response = {
            "error": {
                "message": message,
                "code": "INTERNAL_SERVER_ERROR",
                "status_code": 500,
                "details": details,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        return jsonify(response), 500
    
    @app.errorhandler(404)
    def handle_not_found(error):
        """Handle 404 errors"""
        logger.info(f"404 Error: {request.url}")
        
        response = {
            "error": {
                "message": "The requested resource was not found",
                "code": "NOT_FOUND",
                "status_code": 404,
                "path": request.path,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        return jsonify(response), 404
    
    @app.errorhandler(405)
    def handle_method_not_allowed(error):
        """Handle 405 errors"""
        logger.warning(f"405 Error: {request.method} {request.url}")
        
        response = {
            "error": {
                "message": f"Method {request.method} not allowed for this resource",
                "code": "METHOD_NOT_ALLOWED",
                "status_code": 405,
                "allowed_methods": error.valid_methods if hasattr(error, 'valid_methods') else [],
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
        return jsonify(response), 405

def validate_required_fields(data: Dict[str, Any], required_fields: list) -> None:
    """Validate that required fields are present in data"""
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    
    if missing_fields:
        raise ValidationError(
            message=f"Missing required fields: {', '.join(missing_fields)}",
            field="required_fields"
        )

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Basic phone number validation"""
    import re
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    # Check if it's a valid length (7-15 digits)
    return 7 <= len(digits_only) <= 15

def sanitize_input(data: str) -> str:
    """Sanitize user input"""
    if not isinstance(data, str):
        return str(data)
    
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', '\x00']
    for char in dangerous_chars:
        data = data.replace(char, '')
    
    return data.strip()

# Context manager for error handling
class ErrorContext:
    """Context manager for handling errors in a specific scope"""
    
    def __init__(self, operation_name: str, logger: Optional[logging.Logger] = None):
        self.operation_name = operation_name
        self.logger = logger or logging.getLogger(__name__)
    
    def __enter__(self):
        self.logger.debug(f"Starting operation: {self.operation_name}")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is None:
            self.logger.debug(f"Operation completed successfully: {self.operation_name}")
        else:
            self.logger.error(f"Operation failed: {self.operation_name} - {exc_val}")
        return False  # Don't suppress exceptions
