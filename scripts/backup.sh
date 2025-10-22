#!/bin/bash
# Backup Script for Wheeler Knight Portfolio

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
RETENTION_DAYS=30
LOG_FILE="./backup.log"

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

# Load environment variables
if [ -f ".env.prod" ]; then
    source .env.prod
else
    error "Production environment file (.env.prod) not found"
fi

log "Starting backup process"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP"

# Database backup
log "Creating database backup..."
if docker ps | grep -q "mysql"; then
    docker exec wheelerknight_mysql_prod mysqldump \
        -u root -p$MYSQL_ROOT_PASSWORD \
        --single-transaction \
        --routines \
        --triggers \
        $MYSQL_DATABASE > ${BACKUP_FILE}_database.sql
    
    # Compress database backup
    gzip ${BACKUP_FILE}_database.sql
    log "Database backup completed: ${BACKUP_FILE}_database.sql.gz"
else
    error "MySQL container is not running"
fi

# File uploads backup
log "Creating uploads backup..."
if docker ps | grep -q "backend"; then
    docker exec wheelerknight_backend_prod tar -czf /tmp/uploads_backup.tar.gz -C /app uploads/
    docker cp wheelerknight_backend_prod:/tmp/uploads_backup.tar.gz ${BACKUP_FILE}_uploads.tar.gz
    docker exec wheelerknight_backend_prod rm /tmp/uploads_backup.tar.gz
    log "Uploads backup completed: ${BACKUP_FILE}_uploads.tar.gz"
else
    warning "Backend container is not running, skipping uploads backup"
fi

# Configuration backup
log "Creating configuration backup..."
tar -czf ${BACKUP_FILE}_config.tar.gz \
    .env.prod \
    docker-compose.prod.yml \
    nginx/ \
    scripts/ \
    2>/dev/null || warning "Some configuration files not found"
log "Configuration backup completed: ${BACKUP_FILE}_config.tar.gz"

# Create backup manifest
cat > ${BACKUP_FILE}_manifest.txt << EOF
Backup created: $(date)
Database: ${MYSQL_DATABASE}
Backup files:
- ${BACKUP_FILE}_database.sql.gz
- ${BACKUP_FILE}_uploads.tar.gz
- ${BACKUP_FILE}_config.tar.gz
- ${BACKUP_FILE}_manifest.txt

To restore:
1. Stop services: docker-compose -f docker-compose.prod.yml down
2. Restore database: gunzip -c ${BACKUP_FILE}_database.sql.gz | docker exec -i wheelerknight_mysql_prod mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE
3. Restore uploads: docker cp ${BACKUP_FILE}_uploads.tar.gz wheelerknight_backend_prod:/tmp/ && docker exec wheelerknight_backend_prod tar -xzf /tmp/uploads_backup.tar.gz -C /app
4. Start services: docker-compose -f docker-compose.prod.yml up -d
EOF

log "Backup manifest created: ${BACKUP_FILE}_manifest.txt"

# Clean up old backups
log "Cleaning up old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "backup_*" -type f -mtime +$RETENTION_DAYS -delete
log "Old backups cleaned up"

# Show backup summary
log "Backup completed successfully!"
log "Backup files:"
ls -lh ${BACKUP_FILE}_*

# Optional: Upload to cloud storage
if [ ! -z "$BACKUP_S3_BUCKET" ]; then
    log "Uploading backup to S3..."
    aws s3 cp ${BACKUP_FILE}_database.sql.gz s3://$BACKUP_S3_BUCKET/
    aws s3 cp ${BACKUP_FILE}_uploads.tar.gz s3://$BACKUP_S3_BUCKET/
    aws s3 cp ${BACKUP_FILE}_config.tar.gz s3://$BACKUP_S3_BUCKET/
    aws s3 cp ${BACKUP_FILE}_manifest.txt s3://$BACKUP_S3_BUCKET/
    log "Backup uploaded to S3"
fi

# Optional: Send notification
if [ ! -z "$NOTIFICATION_WEBHOOK" ]; then
    curl -X POST $NOTIFICATION_WEBHOOK \
        -H "Content-Type: application/json" \
        -d "{\"text\":\"Wheeler Knight Portfolio backup completed successfully!\"}"
fi

log "Backup process completed!"
