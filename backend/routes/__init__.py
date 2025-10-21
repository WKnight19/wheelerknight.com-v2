# Base Routes Module for Wheeler Knight Portfolio
from flask import Blueprint, jsonify, request
from functools import wraps
from typing import Dict, Any, Optional, List
import logging

logger = logging.getLogger(__name__)

def create_api_blueprint(name: str, url_prefix: str) -> Blueprint:
    """Create a standardized API blueprint"""
    return Blueprint(name, __name__, url_prefix=f'/api/{url_prefix}')

def handle_api_response(func):
    """Decorator to handle API responses consistently"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            result = func(*args, **kwargs)
            if isinstance(result, tuple):
                data, status_code = result
                return jsonify({
                    'success': True,
                    'data': data,
                    'message': 'Operation completed successfully'
                }), status_code
            else:
                return jsonify({
                    'success': True,
                    'data': result,
                    'message': 'Operation completed successfully'
                })
        except Exception as e:
            logger.error(f"API Error in {func.__name__}: {str(e)}")
            return jsonify({
                'success': False,
                'error': str(e),
                'message': 'An error occurred while processing your request'
            }), 500
    return wrapper

def validate_required_fields(data: Dict[str, Any], required_fields: List[str]) -> None:
    """Validate that required fields are present"""
    missing_fields = [field for field in required_fields if field not in data or data[field] is None]
    if missing_fields:
        from error_handling import ValidationError
        raise ValidationError(f"Missing required fields: {', '.join(missing_fields)}")

def paginate_query(query, page: int = 1, per_page: int = 10):
    """Paginate a SQLAlchemy query"""
    return query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

def format_pagination_response(pagination):
    """Format pagination response"""
    return {
        'items': [item.to_dict() for item in pagination.items],
        'pagination': {
            'page': pagination.page,
            'pages': pagination.pages,
            'per_page': pagination.per_page,
            'total': pagination.total,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev,
            'next_num': pagination.next_num,
            'prev_num': pagination.prev_num
        }
    }
