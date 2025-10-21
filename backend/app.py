# Flask Application Entry Point
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
import os
import time
from config import config, Config
from logging_config import setup_logging, get_logger
from error_handling import register_error_handlers, APIError

# Set up logging
logger = setup_logging(
    app_name="wheelerknight_portfolio",
    log_level=os.getenv('LOG_LEVEL', 'INFO'),
    log_file=os.getenv('LOG_FILE', 'logs/app.log')
)

# Get configuration
config_name = os.getenv('FLASK_ENV', 'development')
app_config = config.get(config_name, config['default'])

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(app_config)

# Validate configuration
config_validation = app_config.validate_config()
if config_validation['issues']:
    logger.error(f"Configuration issues: {config_validation['issues']}")
    raise APIError("Configuration validation failed", details=config_validation['issues'])

if config_validation['warnings']:
    logger.warning(f"Configuration warnings: {config_validation['warnings']}")

logger.info(f"Starting Wheeler Knight Portfolio API in {config_name} mode")

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = app_config.get_database_uri()
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Mail configuration
app.config['MAIL_SERVER'] = app_config.EMAIL_HOST
app.config['MAIL_PORT'] = app_config.EMAIL_PORT
app.config['MAIL_USE_TLS'] = app_config.EMAIL_USE_TLS
app.config['MAIL_USERNAME'] = app_config.EMAIL_USER
app.config['MAIL_PASSWORD'] = app_config.EMAIL_PASSWORD

# Initialize extensions
from models import db
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
mail = Mail(app)

# Configure CORS
CORS(app, origins=app_config.CORS_ORIGINS)

# Register error handlers
register_error_handlers(app)

# Import models
from models.models import *

# Import and register routes
from routes.routes import register_blueprints
register_blueprints(app)

# Basic health check route
@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    logger.debug("Health check requested")
    return {
        'status': 'healthy', 
        'message': 'Wheeler Knight Portfolio API is running',
        'version': '2.0',
        'environment': config_name,
        'timestamp': time.time()
    }

# Basic root route
@app.route('/')
def root():
    """Root endpoint"""
    logger.debug("Root endpoint accessed")
    return {
        'message': 'Welcome to Wheeler Knight Portfolio API', 
        'version': '2.0',
        'environment': config_name,
        'docs': '/api/docs',
        'health': '/api/health'
    }

# API documentation route
@app.route('/api/docs')
def api_docs():
    """API documentation endpoint"""
    logger.debug("API docs requested")
    return {
        'title': 'Wheeler Knight Portfolio API',
        'version': '2.0',
        'description': 'API for Wheeler Knight\'s personal portfolio website',
        'endpoints': {
            'health': '/api/health',
            'docs': '/api/docs',
            'auth': '/api/auth/*',
            'blog': '/api/blog/*',
            'skills': '/api/skills/*',
            'projects': '/api/projects/*',
            'contact': '/api/contact/*',
            'admin': '/api/admin/*'
        },
        'environment': config_name
    }

if __name__ == '__main__':
    # Create database tables (with retry logic)
    max_retries = 5
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            with app.app_context():
                db.create_all()
            logger.info("✅ Database tables created successfully!")
            break
        except Exception as e:
            retry_count += 1
            logger.warning(f"❌ Database connection attempt {retry_count}/{max_retries} failed: {e}")
            if retry_count < max_retries:
                time.sleep(5)  # Wait 5 seconds before retry
            else:
                logger.error("⚠️  Could not connect to database. Starting app without database initialization.")
    
    # Run the application
    logger.info(f"Starting Flask application on {app_config.DB_HOST}:5000")
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app_config.FLASK_DEBUG
    )
