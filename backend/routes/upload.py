# File Upload Routes for Wheeler Knight Portfolio
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
import os
import uuid
from datetime import datetime
from functools import wraps
from routes import handle_api_response
from auth import admin_required
from error_handling import APIError, ValidationError
import logging

logger = logging.getLogger(__name__)

# Create upload blueprint
upload_bp = Blueprint('upload', __name__, url_prefix='/api/upload')

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf', 'doc', 'docx'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_category(filename):
    """Determine file category based on extension"""
    ext = filename.rsplit('.', 1)[1].lower()
    if ext in {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}:
        return 'image'
    elif ext in {'pdf'}:
        return 'document'
    elif ext in {'doc', 'docx'}:
        return 'document'
    else:
        return 'other'

@upload_bp.route('/image', methods=['POST'])
@handle_api_response
@admin_required
def upload_image(current_user):
    """Upload an image file (Admin only)"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            raise ValidationError("No file provided")
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            raise ValidationError("No file selected")
        
        # Check if file is allowed
        if not allowed_file(file.filename):
            raise ValidationError(f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}")
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        max_size = current_app.config.get('MAX_FILE_SIZE', 10 * 1024 * 1024)  # 10MB default
        if file_size > max_size:
            raise ValidationError(f"File too large. Maximum size: {max_size // (1024*1024)}MB")
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        unique_filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
        
        # Create upload directory if it doesn't exist
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        
        # Create subdirectory for images
        image_folder = os.path.join(upload_folder, 'images')
        if not os.path.exists(image_folder):
            os.makedirs(image_folder)
        
        # Save file
        file_path = os.path.join(image_folder, unique_filename)
        file.save(file_path)
        
        # Generate URL
        file_url = f"/uploads/images/{unique_filename}"
        
        logger.info(f"Image uploaded: {unique_filename} by user {current_user.id}")
        
        return {
            'filename': unique_filename,
            'original_filename': filename,
            'file_path': file_path,
            'file_url': file_url,
            'file_size': file_size,
            'file_category': get_file_category(filename),
            'uploaded_at': datetime.utcnow().isoformat(),
            'uploaded_by': current_user.id
        }, 201
        
    except RequestEntityTooLarge:
        raise APIError("File too large", status_code=413)
    except Exception as e:
        logger.error(f"Error uploading image: {str(e)}")
        raise APIError(f"Upload failed: {str(e)}")

@upload_bp.route('/document', methods=['POST'])
@handle_api_response
@admin_required
def upload_document(current_user):
    """Upload a document file (Admin only)"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            raise ValidationError("No file provided")
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            raise ValidationError("No file selected")
        
        # Check if file is allowed
        if not allowed_file(file.filename):
            raise ValidationError(f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}")
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        max_size = current_app.config.get('MAX_FILE_SIZE', 10 * 1024 * 1024)  # 10MB default
        if file_size > max_size:
            raise ValidationError(f"File too large. Maximum size: {max_size // (1024*1024)}MB")
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        unique_filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
        
        # Create upload directory if it doesn't exist
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        
        # Create subdirectory for documents
        doc_folder = os.path.join(upload_folder, 'documents')
        if not os.path.exists(doc_folder):
            os.makedirs(doc_folder)
        
        # Save file
        file_path = os.path.join(doc_folder, unique_filename)
        file.save(file_path)
        
        # Generate URL
        file_url = f"/uploads/documents/{unique_filename}"
        
        logger.info(f"Document uploaded: {unique_filename} by user {current_user.id}")
        
        return {
            'filename': unique_filename,
            'original_filename': filename,
            'file_path': file_path,
            'file_url': file_url,
            'file_size': file_size,
            'file_category': get_file_category(filename),
            'uploaded_at': datetime.utcnow().isoformat(),
            'uploaded_by': current_user.id
        }, 201
        
    except RequestEntityTooLarge:
        raise APIError("File too large", status_code=413)
    except Exception as e:
        logger.error(f"Error uploading document: {str(e)}")
        raise APIError(f"Upload failed: {str(e)}")

@upload_bp.route('/files', methods=['GET'])
@handle_api_response
@admin_required
def list_uploaded_files(current_user):
    """List all uploaded files (Admin only)"""
    try:
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        files = []
        
        if os.path.exists(upload_folder):
            for root, dirs, filenames in os.walk(upload_folder):
                for filename in filenames:
                    file_path = os.path.join(root, filename)
                    file_size = os.path.getsize(file_path)
                    relative_path = os.path.relpath(file_path, upload_folder)
                    file_url = f"/uploads/{relative_path.replace(os.sep, '/')}"
                    
                    files.append({
                        'filename': filename,
                        'file_path': file_path,
                        'file_url': file_url,
                        'file_size': file_size,
                        'file_category': get_file_category(filename),
                        'uploaded_at': datetime.fromtimestamp(os.path.getctime(file_path)).isoformat()
                    })
        
        return {'files': files}
        
    except Exception as e:
        logger.error(f"Error listing files: {str(e)}")
        raise APIError(f"Failed to list files: {str(e)}")

@upload_bp.route('/<path:filename>', methods=['DELETE'])
@handle_api_response
@admin_required
def delete_file(filename, current_user):
    """Delete an uploaded file (Admin only)"""
    try:
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
        file_path = os.path.join(upload_folder, filename)
        
        if not os.path.exists(file_path):
            raise APIError("File not found", status_code=404)
        
        # Remove file
        os.remove(file_path)
        
        logger.info(f"File deleted: {filename} by user {current_user.id}")
        
        return {'message': 'File deleted successfully'}
        
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        raise APIError(f"Failed to delete file: {str(e)}")

# Error handlers for upload blueprint
@upload_bp.errorhandler(RequestEntityTooLarge)
def handle_file_too_large(e):
    return jsonify({'error': 'File too large'}), 413

@upload_bp.errorhandler(413)
def handle_request_entity_too_large(e):
    return jsonify({'error': 'File too large'}), 413
