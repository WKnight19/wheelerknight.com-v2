@echo off
REM Development Environment Setup Script for Windows

echo 🚀 Setting up Wheeler Knight Portfolio Development Environment
echo ==============================================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ✅ .env file created. Please update it with your actual values.
    echo.
    echo ⚠️  IMPORTANT: Update the following in your .env file:
    echo    - SECRET_KEY (generate a secure random string)
    echo    - JWT_SECRET_KEY (generate a secure random string)
    echo    - EMAIL_USER and EMAIL_PASSWORD (for contact forms)
    echo.
)

REM Validate configuration
echo 🔍 Validating configuration...
python -c "from backend.config import Config; validation = Config.validate_config(); print('✅ Configuration valid' if validation['valid'] else '❌ Configuration issues found'); [print(f'⚠️  {w}') for w in validation['warnings']]"
if %errorlevel% neq 0 (
    echo ❌ Configuration validation failed. Please check your .env file.
    pause
    exit /b 1
)

REM Start the development environment
echo 🐳 Starting Docker containers...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 15 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

REM Test API health
echo 🧪 Testing API health...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend API is responding
) else (
    echo ⚠️  Backend API may not be ready yet
)

echo.
echo 🎉 Development environment is ready!
echo.
echo 📱 Access your application:
echo    Frontend:    http://localhost:3000
echo    Backend API: http://localhost:5000
echo    API Docs:    http://localhost:5000/api/docs
echo    Database:    http://localhost:8080 (phpMyAdmin)
echo.
echo 🔧 Useful commands:
echo    Stop services:    docker-compose down
echo    View logs:        docker-compose logs -f
echo    Restart services: docker-compose restart
echo    View backend logs: docker-compose logs -f backend
echo.
echo 📚 Next steps:
echo    1. Visit http://localhost:3000 to see your React app
echo    2. Visit http://localhost:5000/api/docs for API documentation
echo    3. Check logs in backend/logs/ directory
echo    4. Start developing your portfolio features!
echo.
pause
