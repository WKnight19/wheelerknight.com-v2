# Wheeler Knight Portfolio Website v2

A modern, full-stack portfolio website showcasing Wheeler Knight's professional journey, skills, and projects.

## 🚀 Technology Stack

- **Frontend**: React.js with TypeScript + Mantine UI
- **Backend**: Python Flask + SQLAlchemy
- **Database**: MySQL 8.0
- **Deployment**: Hostinger
- **Development**: Docker Compose

## 📁 Project Structure

```
wheelerknight.com-v2/
├── frontend/          # React TypeScript application
├── backend/           # Python Flask API
├── database/          # MySQL schema and migrations
├── docs/              # Documentation
├── docker/            # Docker configuration files
├── docker-compose.yml # Development environment
├── env.example        # Environment variables template
└── README.md          # This file
```

## 🛠️ Development Setup

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)
- Git

### Quick Start

1. **Clone and setup**:

   ```bash
   git clone <repository-url>
   cd wheelerknight.com-v2
   cp env.example .env
   ```

2. **Start development environment**:

   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database Admin: http://localhost:8080 (phpMyAdmin)

### Local Development (without Docker)

1. **Backend setup**:

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

2. **Frontend setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🎨 Design System

- **Color Scheme**: Crimson (#DC143C), Black (#000000), Grey (#808080)
- **UI Library**: Mantine UI Components
- **Typography**: System fonts with fallbacks
- **Responsive**: Mobile-first design approach

## 📋 Features

### Public Features

- [ ] Landing page with hero section
- [ ] About page with personal details
- [ ] Resume/CV page
- [ ] Portfolio projects showcase
- [ ] Blog system
- [ ] Contact form
- [ ] Skills and qualifications
- [ ] Interests and hobbies

### Admin Features (Wheeler Suite)

- [ ] Dashboard with analytics
- [ ] Content management system
- [ ] Blog post editor
- [ ] User management
- [ ] Analytics and insights
- [ ] Settings and configuration

### Technical Features

- [ ] Dark/Light mode toggle
- [ ] Spanish language support
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Accessibility compliance
- [ ] Cookie consent management

## 🔧 Environment Variables

Copy `env.example` to `.env` and configure:

- Database connection settings
- Flask configuration
- Email service credentials
- Analytics tracking IDs
- Social media API keys

## 📚 Documentation

- [Development Plan](DEVELOPMENT_PLAN.md) - Complete development roadmap
- [API Documentation](docs/api.md) - Backend API reference
- [Deployment Guide](docs/deployment.md) - Production deployment steps
- [Contributing](docs/contributing.md) - Development guidelines

## 🚀 Deployment

### Production Deployment to Hostinger

1. **Prepare production build**:

   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy to Hostinger**:
   - Upload built files to hosting directory
   - Configure MySQL database
   - Set up SSL certificates
   - Configure domain and DNS

## 📊 Analytics & Monitoring

- Google Analytics integration
- Custom analytics dashboard
- Performance monitoring
- Error tracking and logging

## 🔒 Security

- JWT-based authentication
- Input validation and sanitization
- CORS configuration
- SQL injection prevention
- XSS protection

## 📞 Contact

- **Email**: wheeler@wheelerknight.com
- **LinkedIn**: [Wheeler Knight](https://linkedin.com/in/wheelerknight)
- **GitHub**: [wheelerknight](https://github.com/wheelerknight)

## 📄 License

This project is private and proprietary to Wheeler Knight.

---

**Built with ❤️ by Wheeler Knight**
