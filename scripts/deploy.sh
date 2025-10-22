#!/bin/bash
# Deployment Script for Wheeler Knight Portfolio

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="wheelerknight-portfolio"
BACKUP_DIR="./backups"
LOG_FILE="./deployment.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please install Docker first."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose is not installed. Please install Docker Compose first."
fi

# Check if environment file exists
if [ ! -f ".env.prod" ]; then
    error "Production environment file (.env.prod) not found. Please create it from env.prod.example"
fi

# Load environment variables
source .env.prod

log "Starting deployment of $PROJECT_NAME"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup current database if it exists
if docker ps | grep -q "mysql"; then
    log "Creating database backup..."
    docker exec wheelerknight_mysql_prod mysqldump -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE > $BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql
    log "Database backup completed"
fi

# Pull latest images
log "Pulling latest Docker images..."
docker-compose -f docker-compose.prod.yml pull

# Build images
log "Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Stop existing containers
log "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Start services
log "Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
log "Waiting for services to be ready..."
sleep 30

# Health check
log "Performing health checks..."

# Check backend health
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    log "Backend health check passed"
else
    error "Backend health check failed"
fi

# Check frontend health
if curl -f http://localhost:80 > /dev/null 2>&1; then
    log "Frontend health check passed"
else
    error "Frontend health check failed"
fi

# Check database connection
if docker exec wheelerknight_mysql_prod mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD > /dev/null 2>&1; then
    log "Database health check passed"
else
    error "Database health check failed"
fi

# Run database migrations
log "Running database migrations..."
docker exec wheelerknight_backend_prod python -c "from app import app; from models import db; app.app_context().push(); db.create_all()"

# Set up SSL certificates (if not already done)
if [ ! -f "./nginx/ssl/cert.pem" ] || [ ! -f "./nginx/ssl/key.pem" ]; then
    warning "SSL certificates not found. Please add them to ./nginx/ssl/ directory"
    warning "You can use Let's Encrypt: certbot certonly --standalone -d wheelerknight.com -d www.wheelerknight.com"
fi

# Clean up old images
log "Cleaning up old Docker images..."
docker image prune -f

# Show running containers
log "Deployment completed successfully!"
log "Running containers:"
docker-compose -f docker-compose.prod.yml ps

# Show logs
log "Recent logs:"
docker-compose -f docker-compose.prod.yml logs --tail=20

log "Deployment completed successfully!"
log "Your application is now running at:"
log "  - Frontend: https://wheelerknight.com"
log "  - API: https://wheelerknight.com/api"
log "  - Admin: https://wheelerknight.com/login"

# Optional: Send notification
if [ ! -z "$NOTIFICATION_WEBHOOK" ]; then
    curl -X POST $NOTIFICATION_WEBHOOK \
        -H "Content-Type: application/json" \
        -d '{"text":"Wheeler Knight Portfolio deployed successfully!"}'
fi
