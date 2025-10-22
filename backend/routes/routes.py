# Routes Registry for Wheeler Knight Portfolio
# This file imports and registers all API blueprints

from flask import Flask
from routes.skills import skills_bp
from routes.projects import projects_bp
from routes.blog import blog_bp
from routes.contact import contact_bp
from routes.portfolio import portfolio_bp
from routes.auth import auth_bp
from routes.upload import upload_bp

def register_blueprints(app: Flask):
    """Register all API blueprints with the Flask app"""
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(skills_bp)
    app.register_blueprint(projects_bp)
    app.register_blueprint(blog_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(portfolio_bp)
    app.register_blueprint(upload_bp)
    
    # Add a general API info route
    @app.route('/api')
    def api_info():
        """API information and available endpoints"""
        return {
            'name': 'Wheeler Knight Portfolio API',
            'version': '2.0',
            'description': 'API for Wheeler Knight\'s personal portfolio website',
            'endpoints': {
                'auth': '/api/auth',
                'skills': '/api/skills',
                'projects': '/api/projects',
                'blog': '/api/blog',
                'contact': '/api/contact',
                'portfolio': '/api/portfolio',
                'upload': '/api/upload',
                'health': '/api/health',
                'docs': '/api/docs'
            },
            'documentation': '/api/docs'
        }

# Export blueprints for easy access
__all__ = [
    'auth_bp',
    'skills_bp',
    'projects_bp', 
    'blog_bp',
    'contact_bp',
    'portfolio_bp',
    'register_blueprints'
]
