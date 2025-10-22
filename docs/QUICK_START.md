# Wheeler Knight Portfolio - Quick Start Guide

## 🚀 Quick Deployment (5 Minutes)

### Prerequisites
- VPS with Ubuntu 20.04+
- Domain name pointing to your server
- SSH access

### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again
```

### Step 2: Deploy Application
```bash
# Clone repository
git clone https://github.com/yourusername/wheelerknight.com-v2.git
cd wheelerknight.com-v2

# Configure environment
cp env.prod.example .env.prod
nano .env.prod  # Update passwords and domain

# Deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Step 3: SSL Certificate
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d wheelerknight.com -d www.wheelerknight.com

# Copy certificates
sudo cp /etc/letsencrypt/live/wheelerknight.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/wheelerknight.com/privkey.pem nginx/ssl/key.pem
sudo chown $USER:$USER nginx/ssl/*

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Step 4: Create Admin User
```bash
# Create admin user
docker exec wheelerknight_backend_prod python -c "
from app import app
from models import db, User
import bcrypt

app.app_context().push()
password_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
admin_user = User(username='admin', email='admin@wheelerknight.com', password_hash=password_hash.decode('utf-8'), is_active=True, is_admin=True)
db.session.add(admin_user)
db.session.commit()
print('Admin user created: admin@wheelerknight.com / admin123')
"
```

## ✅ Verification

### Check Application Status
```bash
# Check containers
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Test Endpoints
```bash
# Test frontend
curl -I https://wheelerknight.com

# Test API
curl -I https://wheelerknight.com/api/health

# Test admin login
curl -X POST https://wheelerknight.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wheelerknight.com","password":"admin123"}'
```

## 🔧 Configuration

### Environment Variables (`.env.prod`)
```bash
# Required - Update these values
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password
SECRET_KEY=your_32_character_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Domain Configuration
```bash
# Update these URLs
CORS_ORIGINS=https://wheelerknight.com,https://www.wheelerknight.com
REACT_APP_API_URL=https://wheelerknight.com/api
```

## 📊 Monitoring

### Health Checks
```bash
# Application health
curl https://wheelerknight.com/api/health

# Database health
docker exec wheelerknight_mysql_prod mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD

# Disk usage
df -h

# Memory usage
free -h
```

### Logs
```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs -f

# Nginx logs
docker logs wheelerknight_nginx_prod

# Database logs
docker logs wheelerknight_mysql_prod
```

## 🔄 Updates

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Redeploy
./scripts/deploy.sh
```

### System Updates
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose -f docker-compose.prod.yml pull
```

## 🛡️ Security

### Basic Security
```bash
# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Secure SSH
sudo nano /etc/ssh/sshd_config
# Set: Port 2222, PermitRootLogin no, PasswordAuthentication no
sudo systemctl restart ssh
```

### SSL Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Auto-renewal (add to crontab)
0 3 1 * * /usr/bin/certbot renew --quiet && docker-compose -f /opt/wheelerknight/docker-compose.prod.yml restart nginx
```

## 📋 Maintenance

### Daily Tasks
- Check application logs
- Monitor resource usage
- Verify backups

### Weekly Tasks
- Review security logs
- Update system packages
- Check SSL certificate expiry

### Monthly Tasks
- Review backup integrity
- Performance analysis
- Security audit

## 🆘 Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check resources
docker stats
```

**Database connection failed:**
```bash
# Check MySQL
docker exec wheelerknight_mysql_prod mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD

# Check logs
docker logs wheelerknight_mysql_prod
```

**SSL issues:**
```bash
# Renew certificate
sudo certbot renew

# Copy certificates
sudo cp /etc/letsencrypt/live/wheelerknight.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/wheelerknight.com/privkey.pem nginx/ssl/key.pem

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## 📞 Support

- **Email**: wheeler@wheelerknight.com
- **GitHub**: https://github.com/wheelerknight
- **Documentation**: See `docs/DEPLOYMENT.md` for detailed instructions

---

**🎉 Congratulations!** Your Wheeler Knight Portfolio is now live at https://wheelerknight.com
