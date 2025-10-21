# Configuration Module for Wheeler Knight Portfolio
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class with environment variable validation"""
    
    # Database Configuration
    DB_HOST: str = os.getenv('DB_HOST', 'mysql')
    DB_PORT: int = int(os.getenv('DB_PORT', '3306'))
    DB_NAME: str = os.getenv('DB_NAME', 'wheelerknight_portfolio')
    DB_USER: str = os.getenv('DB_USER', 'wheelerknight')
    DB_PASSWORD: str = os.getenv('DB_PASSWORD', 'wheelerknight123')
    
    # Flask Configuration
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY: str = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    FLASK_ENV: str = os.getenv('FLASK_ENV', 'development')
    FLASK_DEBUG: bool = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    # CORS Configuration
    CORS_ORIGINS: list = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
    # Email Configuration
    EMAIL_HOST: str = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
    EMAIL_PORT: int = int(os.getenv('EMAIL_PORT', '587'))
    EMAIL_USER: Optional[str] = os.getenv('EMAIL_USER')
    EMAIL_PASSWORD: Optional[str] = os.getenv('EMAIL_PASSWORD')
    EMAIL_USE_TLS: bool = True
    
    # EmailJS Configuration (for frontend)
    EMAILJS_SERVICE_ID: Optional[str] = os.getenv('REACT_APP_EMAILJS_SERVICE_ID')
    EMAILJS_TEMPLATE_ID: Optional[str] = os.getenv('REACT_APP_EMAILJS_TEMPLATE_ID')
    EMAILJS_PUBLIC_KEY: Optional[str] = os.getenv('REACT_APP_EMAILJS_PUBLIC_KEY')
    
    # Analytics Configuration
    GOOGLE_ANALYTICS_ID: Optional[str] = os.getenv('GOOGLE_ANALYTICS_ID')
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = int(os.getenv('MAX_FILE_SIZE', '10485760'))  # 10MB
    UPLOAD_FOLDER: str = os.getenv('UPLOAD_FOLDER', 'uploads/')
    
    # Security Configuration
    JWT_ACCESS_TOKEN_EXPIRES: int = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', '3600'))  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES: int = int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES', '2592000'))  # 30 days
    
    # Production URLs
    PRODUCTION_DOMAIN: str = os.getenv('PRODUCTION_DOMAIN', 'wheelerknight.com')
    PRODUCTION_API_URL: str = os.getenv('PRODUCTION_API_URL', 'https://wheelerknight.com/api')
    
    @classmethod
    def validate_config(cls) -> dict:
        """Validate configuration and return any issues"""
        issues = []
        warnings = []
        
        # Check required environment variables
        if cls.SECRET_KEY == 'dev-secret-key-change-in-production':
            warnings.append("SECRET_KEY is using default value - change in production")
        
        if cls.JWT_SECRET_KEY == 'jwt-secret-key-change-in-production':
            warnings.append("JWT_SECRET_KEY is using default value - change in production")
        
        # Check email configuration
        if not cls.EMAIL_USER or not cls.EMAIL_PASSWORD:
            warnings.append("Email credentials not configured - contact forms may not work")
        
        # Check production settings
        if cls.FLASK_ENV == 'production':
            if cls.FLASK_DEBUG:
                issues.append("FLASK_DEBUG should be False in production")
            if cls.SECRET_KEY == 'dev-secret-key-change-in-production':
                issues.append("SECRET_KEY must be changed in production")
        
        return {
            'issues': issues,
            'warnings': warnings,
            'valid': len(issues) == 0
        }
    
    @classmethod
    def get_database_uri(cls) -> str:
        """Get the complete database URI"""
        return (
            f"mysql+pymysql://{cls.DB_USER}:"
            f"{cls.DB_PASSWORD}@"
            f"{cls.DB_HOST}:"
            f"{cls.DB_PORT}/"
            f"{cls.DB_NAME}"
        )

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DB_NAME = 'wheelerknight_test'

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
