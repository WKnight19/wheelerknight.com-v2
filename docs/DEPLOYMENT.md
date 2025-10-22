# Wheeler Knight Portfolio - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Wheeler Knight Portfolio website to Hostinger or any VPS hosting provider.

## Prerequisites

- VPS with Ubuntu 20.04+ or CentOS 8+
- Domain name (wheelerknight.com)
- SSH access to the server
- Basic knowledge of Linux command line

## Server Requirements

### Minimum Requirements

- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Bandwidth**: 1TB/month

### Recommended Requirements

- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **Bandwidth**: 2TB/month

## Step 1: Server Setup

### 1.1 Update System Packages

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 1.2 Install Required Software

```bash
# Ubuntu/Debian
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y curl wget git nginx certbot python3-certbot-nginx
```

### 1.3 Install Docker

```bash
# Remove old Docker versions
sudo apt remove docker docker-engine docker.io containerd runc

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again to apply group changes
```

### 1.4 Configure Firewall

```bash
# Ubuntu/Debian
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Step 2: Domain Configuration

### 2.1 DNS Setup

Configure your domain's DNS records:

```
Type: A
Name: @
Value: YOUR_SERVER_IP

Type: A
Name: www
Value: YOUR_SERVER_IP
```

### 2.2 SSL Certificate

```bash
# Install SSL certificate using Let's Encrypt
sudo certbot --nginx -d wheelerknight.com -d www.wheelerknight.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## Step 3: Application Deployment

### 3.1 Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/wheelerknight
sudo chown $USER:$USER /opt/wheelerknight
cd /opt/wheelerknight

# Clone repository
git clone https://github.com/yourusername/wheelerknight.com-v2.git .
```

### 3.2 Configure Environment

```bash
# Copy environment template
cp env.prod.example .env.prod

# Edit environment variables
nano .env.prod
```

**Important Environment Variables to Update:**

```bash
# Database passwords (generate secure passwords)
MYSQL_ROOT_PASSWORD=your_secure_root_password_here
MYSQL_PASSWORD=your_secure_db_password_here

# Secret keys (generate using: openssl rand -hex 32)
SECRET_KEY=your_very_long_and_secure_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here

# Email configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Domain configuration
CORS_ORIGINS=https://wheelerknight.com,https://www.wheelerknight.com
REACT_APP_API_URL=https://wheelerknight.com/api
```

### 3.3 Create SSL Directory

```bash
# Create SSL directory
sudo mkdir -p /opt/wheelerknight/nginx/ssl
sudo chown $USER:$USER /opt/wheelerknight/nginx/ssl

# Copy SSL certificates
sudo cp /etc/letsencrypt/live/wheelerknight.com/fullchain.pem /opt/wheelerknight/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/wheelerknight.com/privkey.pem /opt/wheelerknight/nginx/ssl/key.pem
sudo chown $USER:$USER /opt/wheelerknight/nginx/ssl/*
```

### 3.4 Deploy Application

```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

## Step 4: Database Setup

### 4.1 Initialize Database

```bash
# Wait for MySQL to be ready
sleep 30

# Run database migrations
docker exec wheelerknight_backend_prod python -c "
from app import app
from models import db
app.app_context().push()
db.create_all()
print('Database initialized successfully')
"
```

### 4.2 Create Admin User

```bash
# Create admin user
docker exec wheelerknight_backend_prod python -c "
from app import app
from models import db, User
from auth import auth_manager
import bcrypt

app.app_context().push()

# Create admin user
password_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
admin_user = User(
    username='admin',
    email='admin@wheelerknight.com',
    password_hash=password_hash.decode('utf-8'),
    is_active=True,
    is_admin=True
)

db.session.add(admin_user)
db.session.commit()
print('Admin user created: admin@wheelerknight.com / admin123')
"
```

## Step 5: Monitoring and Maintenance

### 5.1 Set Up Log Rotation

```bash
# Create logrotate configuration
sudo tee /etc/logrotate.d/wheelerknight << EOF
/opt/wheelerknight/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF
```

### 5.2 Set Up Automated Backups

```bash
# Add backup to crontab
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * /opt/wheelerknight/scripts/backup.sh
```

### 5.3 Set Up SSL Certificate Renewal

```bash
# Add SSL renewal to crontab
crontab -e

# Add this line for monthly SSL renewal check
0 3 1 * * /usr/bin/certbot renew --quiet && docker-compose -f /opt/wheelerknight/docker-compose.prod.yml restart nginx
```

### 5.4 Monitor Application Health

```bash
# Check application status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check resource usage
docker stats
```

## Step 6: Security Hardening

### 6.1 Secure SSH

```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Set these values:
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# Restart SSH service
sudo systemctl restart ssh
```

### 6.2 Configure Fail2Ban

```bash
# Install fail2ban
sudo apt install fail2ban

# Configure fail2ban
sudo tee /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = 2222

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
EOF

# Start fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 6.3 Set Up Firewall Rules

```bash
# Additional firewall rules
sudo ufw deny 3306  # Block MySQL from external access
sudo ufw deny 5000  # Block Flask from external access
sudo ufw deny 6379  # Block Redis from external access
```

## Step 7: Performance Optimization

### 7.1 Configure Nginx Caching

```bash
# Add caching configuration to nginx.conf
sudo nano /opt/wheelerknight/nginx/nginx.conf

# Add these lines in the http block:
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;
```

### 7.2 Enable Gzip Compression

```bash
# Gzip is already configured in nginx.conf
# Verify it's working:
curl -H "Accept-Encoding: gzip" -I https://wheelerknight.com
```

### 7.3 Set Up CDN (Optional)

```bash
# Configure CloudFlare or similar CDN
# Update CORS_ORIGINS in .env.prod to include CDN domain
```

## Step 8: Troubleshooting

### 8.1 Common Issues

**Issue: Application not starting**

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check container status
docker-compose -f docker-compose.prod.yml ps
```

**Issue: Database connection failed**

```bash
# Check MySQL container
docker exec wheelerknight_mysql_prod mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD

# Check database logs
docker logs wheelerknight_mysql_prod
```

**Issue: SSL certificate problems**

```bash
# Renew SSL certificate
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/wheelerknight.com/fullchain.pem /opt/wheelerknight/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/wheelerknight.com/privkey.pem /opt/wheelerknight/nginx/ssl/key.pem

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### 8.2 Performance Monitoring

```bash
# Monitor resource usage
htop

# Monitor disk usage
df -h

# Monitor network usage
iftop

# Monitor application logs
tail -f /opt/wheelerknight/logs/app.log
```

## Step 9: Backup and Recovery

### 9.1 Manual Backup

```bash
# Run backup script
./scripts/backup.sh
```

### 9.2 Restore from Backup

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore database
gunzip -c backups/backup_YYYYMMDD_HHMMSS_database.sql.gz | docker exec -i wheelerknight_mysql_prod mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE

# Restore uploads
docker cp backups/backup_YYYYMMDD_HHMMSS_uploads.tar.gz wheelerknight_backend_prod:/tmp/
docker exec wheelerknight_backend_prod tar -xzf /tmp/uploads_backup.tar.gz -C /app

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## Step 10: Updates and Maintenance

### 10.1 Application Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and deploy
./scripts/deploy.sh
```

### 10.2 System Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose -f docker-compose.prod.yml pull
```

### 10.3 Database Maintenance

```bash
# Optimize database
docker exec wheelerknight_mysql_prod mysql -u root -p$MYSQL_ROOT_PASSWORD -e "OPTIMIZE TABLE wheelerknight_portfolio_prod.*;"

# Check database size
docker exec wheelerknight_mysql_prod mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables GROUP BY table_schema;"
```

## Support and Maintenance

### Contact Information

- **Email**: wheeler@wheelerknight.com
- **GitHub**: https://github.com/wheelerknight
- **LinkedIn**: https://linkedin.com/in/wheelerknight

### Regular Maintenance Tasks

1. **Daily**: Check application logs and health
2. **Weekly**: Review security logs and update packages
3. **Monthly**: Review backup integrity and performance metrics
4. **Quarterly**: Security audit and dependency updates

### Emergency Procedures

1. **Application Down**: Check logs, restart services, check resources
2. **Database Issues**: Restore from backup, check disk space
3. **Security Breach**: Isolate server, review logs, update passwords
4. **SSL Issues**: Renew certificates, update nginx configuration

---

**Note**: This deployment guide assumes you have root access to a VPS. For shared hosting providers like Hostinger, some steps may need to be adapted based on their specific requirements and limitations.
