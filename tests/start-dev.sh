#!/bin/bash
# Development Environment Setup Script

echo "🚀 Setting up Wheeler Knight Portfolio Development Environment"
echo "=============================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your actual values."
fi

# Start the development environment
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📱 Access your application:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Database:    http://localhost:8080 (phpMyAdmin)"
echo ""
echo "🔧 Useful commands:"
echo "   Stop services:    docker-compose down"
echo "   View logs:        docker-compose logs -f"
echo "   Restart services: docker-compose restart"
echo ""
echo "📚 Next steps:"
echo "   1. Update .env file with your actual values"
echo "   2. Visit http://localhost:3000 to see your React app"
echo "   3. Visit http://localhost:5000/api/health to test the API"
echo ""
