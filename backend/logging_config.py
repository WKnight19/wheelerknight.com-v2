# Logging Configuration for Wheeler Knight Portfolio
import logging
import logging.handlers
import os
from datetime import datetime
from typing import Optional

class ColoredFormatter(logging.Formatter):
    """Custom formatter with colors for different log levels"""
    
    # Color codes
    COLORS = {
        'DEBUG': '\033[36m',    # Cyan
        'INFO': '\033[32m',     # Green
        'WARNING': '\033[33m',  # Yellow
        'ERROR': '\033[31m',    # Red
        'CRITICAL': '\033[35m', # Magenta
        'RESET': '\033[0m'      # Reset
    }
    
    def format(self, record):
        # Add color to the level name
        if record.levelname in self.COLORS:
            record.levelname = (
                f"{self.COLORS[record.levelname]}"
                f"{record.levelname}"
                f"{self.COLORS['RESET']}"
            )
        return super().format(record)

def setup_logging(
    app_name: str = "wheelerknight_portfolio",
    log_level: str = "INFO",
    log_file: Optional[str] = None,
    max_file_size: int = 10 * 1024 * 1024,  # 10MB
    backup_count: int = 5
) -> logging.Logger:
    """
    Set up comprehensive logging for the application
    
    Args:
        app_name: Name of the application
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Path to log file (optional)
        max_file_size: Maximum size of log file before rotation
        backup_count: Number of backup files to keep
    
    Returns:
        Configured logger instance
    """
    
    # Create logger
    logger = logging.getLogger(app_name)
    logger.setLevel(getattr(logging, log_level.upper()))
    
    # Clear any existing handlers
    logger.handlers.clear()
    
    # Create formatters
    detailed_formatter = logging.Formatter(
        '%(asctime)s | %(levelname)-8s | %(name)s | %(funcName)s:%(lineno)d | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    simple_formatter = logging.Formatter(
        '%(asctime)s | %(levelname)-8s | %(message)s',
        datefmt='%H:%M:%S'
    )
    
    colored_formatter = ColoredFormatter(
        '%(asctime)s | %(levelname)-8s | %(message)s',
        datefmt='%H:%M:%S'
    )
    
    # Console handler with colors
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(colored_formatter)
    logger.addHandler(console_handler)
    
    # File handler (if log_file is specified)
    if log_file:
        # Ensure log directory exists
        log_dir = os.path.dirname(log_file)
        if log_dir and not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        # Rotating file handler
        file_handler = logging.handlers.RotatingFileHandler(
            log_file,
            maxBytes=max_file_size,
            backupCount=backup_count,
            encoding='utf-8'
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(detailed_formatter)
        logger.addHandler(file_handler)
    
    # Add request logging handler for Flask
    request_handler = logging.StreamHandler()
    request_handler.setLevel(logging.INFO)
    request_handler.setFormatter(simple_formatter)
    
    # Configure Flask's request logger
    flask_logger = logging.getLogger('werkzeug')
    flask_logger.setLevel(logging.WARNING)  # Reduce Flask's verbose logging
    flask_logger.addHandler(request_handler)
    
    # Configure SQLAlchemy logging
    sqlalchemy_logger = logging.getLogger('sqlalchemy.engine')
    sqlalchemy_logger.setLevel(logging.WARNING)  # Reduce SQL query logging
    
    return logger

def get_logger(name: str = "wheelerknight_portfolio") -> logging.Logger:
    """Get a logger instance"""
    return logging.getLogger(name)

# Log decorator for function calls
def log_function_call(logger: Optional[logging.Logger] = None):
    """Decorator to log function calls"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            if logger is None:
                log = get_logger()
            else:
                log = logger
            
            log.debug(f"Calling {func.__name__} with args={args}, kwargs={kwargs}")
            try:
                result = func(*args, **kwargs)
                log.debug(f"{func.__name__} completed successfully")
                return result
            except Exception as e:
                log.error(f"{func.__name__} failed with error: {str(e)}")
                raise
        return wrapper
    return decorator

# Performance logging decorator
def log_performance(logger: Optional[logging.Logger] = None):
    """Decorator to log function performance"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            if logger is None:
                log = get_logger()
            else:
                log = logger
            
            start_time = datetime.now()
            log.debug(f"Starting {func.__name__}")
            
            try:
                result = func(*args, **kwargs)
                end_time = datetime.now()
                duration = (end_time - start_time).total_seconds()
                log.info(f"{func.__name__} completed in {duration:.3f} seconds")
                return result
            except Exception as e:
                end_time = datetime.now()
                duration = (end_time - start_time).total_seconds()
                log.error(f"{func.__name__} failed after {duration:.3f} seconds: {str(e)}")
                raise
        return wrapper
    return decorator
