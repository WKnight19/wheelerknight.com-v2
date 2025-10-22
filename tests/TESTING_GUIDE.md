# Comprehensive Testing Guide for Wheeler Knight Portfolio API

## 🧪 **Testing Overview**

This guide covers testing all functionality built up to Phase 2, Step 2.3:
- ✅ Database Schema & Models
- ✅ API Routes & Blueprints  
- ✅ Authentication & Authorization
- ✅ CRUD Operations
- ✅ Error Handling
- ✅ Data Validation

## 🎯 **Testing Categories**

### 1. **Database & Models Testing**
### 2. **Public API Endpoints Testing**
### 3. **Authentication System Testing**
### 4. **Protected Admin Endpoints Testing**
### 5. **Error Handling Testing**
### 6. **Data Validation Testing**

---

## 📊 **1. Database & Models Testing**

### Test Database Connection
```bash
# Check if database is running
docker-compose ps

# Connect to MySQL and verify tables
docker exec wheelerknight_mysql mysql -u wheelerknight -pwheelerknight123 wheelerknight_portfolio -e "SHOW TABLES;"

# Check sample data
docker exec wheelerknight_mysql mysql -u wheelerknight -pwheelerknight123 wheelerknight_portfolio -e "SELECT COUNT(*) as total_skills FROM skills;"
docker exec wheelerknight_mysql mysql -u wheelerknight -pwheelerknight123 wheelerknight_portfolio -e "SELECT COUNT(*) as total_projects FROM projects;"
docker exec wheelerknight_mysql mysql -u wheelerknight -pwheelerknight123 wheelerknight_portfolio -e "SELECT COUNT(*) as total_blog_posts FROM blog_posts;"
```

### Expected Results:
- ✅ All tables exist
- ✅ Sample data populated
- ✅ Foreign key relationships working

---

## 🌐 **2. Public API Endpoints Testing**

### Test API Health
```bash
# Basic API info
curl http://localhost:5000/api

# Health check
curl http://localhost:5000/api/health

# API documentation
curl http://localhost:5000/api/docs
```

### Test Public Skills Endpoints
```bash
# Get all skills
curl http://localhost:5000/api/skills/

# Get skills with filtering
curl "http://localhost:5000/api/skills/?category=technical"
curl "http://localhost:5000/api/skills/?featured=true"

# Get specific skill
curl http://localhost:5000/api/skills/1

# Get skill categories
curl http://localhost:5000/api/skills/categories
```

### Test Public Projects Endpoints
```bash
# Get all projects
curl http://localhost:5000/api/projects/

# Get projects with filtering
curl "http://localhost:5000/api/projects/?status=completed"
curl "http://localhost:5000/api/projects/?featured=true"

# Get specific project
curl http://localhost:5000/api/projects/1

# Get project statuses
curl http://localhost:5000/api/projects/statuses
```

### Test Public Blog Endpoints
```bash
# Get published blog posts
curl http://localhost:5000/api/blog/

# Get specific blog post
curl http://localhost:5000/api/blog/1

# Get blog post by slug
curl http://localhost:5000/api/blog/slug/welcome-to-my-portfolio

# Get post statuses
curl http://localhost:5000/api/blog/statuses

# Like a blog post
curl -X POST http://localhost:5000/api/blog/1/like
```

### Test Public Contact Endpoints
```bash
# Get Wheeler's contact info
curl http://localhost:5000/api/contact/info

# Submit contact form
curl -X POST http://localhost:5000/api/contact/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message",
    "company": "Test Company"
  }'
```

### Test Public Portfolio Endpoints
```bash
# Get education records
curl http://localhost:5000/api/portfolio/education

# Get specific education
curl http://localhost:5000/api/portfolio/education/1

# Get work experience
curl http://localhost:5000/api/portfolio/experience

# Get specific experience
curl http://localhost:5000/api/portfolio/experience/1

# Get interests
curl http://localhost:5000/api/portfolio/interests

# Get interests with filtering
curl "http://localhost:5000/api/portfolio/interests/?category=sport"
curl "http://localhost:5000/api/portfolio/interests/?featured=true"

# Get specific interest
curl http://localhost:5000/api/portfolio/interests/1

# Get interest categories
curl http://localhost:5000/api/portfolio/interests/categories

# Get portfolio summary
curl http://localhost:5000/api/portfolio/summary
```

### Expected Results:
- ✅ All public endpoints return 200 OK
- ✅ Data returned in proper JSON format
- ✅ Pagination working for list endpoints
- ✅ Filtering working correctly
- ✅ Contact form submission successful

---

## 🔐 **3. Authentication System Testing**

### Test Login System
```bash
# Test login with correct credentials
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "wheeler",
    "password": "admin123"
  }'

# Test login with incorrect credentials
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "wheeler",
    "password": "wrongpassword"
  }'

# Test login with non-existent user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nonexistent",
    "password": "admin123"
  }'
```

### Test Token Validation
```bash
# First, get a token from successful login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "wheeler", "password": "admin123"}' | \
  jq -r '.data.tokens.access_token')

# Test token validation
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/validate-token

# Test getting current user info
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/me

# Test logout
curl -X POST -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/auth/logout
```

### Test Token Refresh
```bash
# Get refresh token
REFRESH_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "wheeler", "password": "admin123"}' | \
  jq -r '.data.tokens.refresh_token')

# Test token refresh
curl -X POST -H "Authorization: Bearer $REFRESH_TOKEN" \
  http://localhost:5000/api/auth/refresh
```

### Expected Results:
- ✅ Successful login returns tokens
- ✅ Invalid credentials return 401
- ✅ Token validation works
- ✅ User info retrieved correctly
- ✅ Logout successful
- ✅ Token refresh works

---

## 🛡️ **4. Protected Admin Endpoints Testing**

### Test Unauthorized Access
```bash
# Test accessing protected endpoints without token
curl http://localhost:5000/api/skills/stats
curl http://localhost:5000/api/projects/stats
curl http://localhost:5000/api/blog/stats
curl http://localhost:5000/api/contact/stats
curl http://localhost:5000/api/contact/messages
```

### Test Authorized Access
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "wheeler", "password": "admin123"}' | \
  jq -r '.data.tokens.access_token')

# Test protected stats endpoints
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/skills/stats

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/projects/stats

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/blog/stats

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/contact/stats
```

### Test CRUD Operations
```bash
# Create a new skill
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Skill",
    "category": "technical",
    "proficiency_level": 4,
    "description": "Test skill for API testing",
    "is_featured": false
  }' \
  http://localhost:5000/api/skills/

# Update the skill (replace SKILL_ID with actual ID)
curl -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test Skill",
    "proficiency_level": 5,
    "is_featured": true
  }' \
  http://localhost:5000/api/skills/SKILL_ID

# Delete the skill (replace SKILL_ID with actual ID)
curl -X DELETE -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/skills/SKILL_ID
```

### Test Contact Message Management
```bash
# Get all messages
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/contact/messages

# Get specific message (replace MESSAGE_ID with actual ID)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/contact/messages/MESSAGE_ID

# Update message status
curl -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "read"}' \
  http://localhost:5000/api/contact/messages/MESSAGE_ID

# Reply to message
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reply_content": "Thank you for your message!"}' \
  http://localhost:5000/api/contact/messages/MESSAGE_ID/reply
```

### Expected Results:
- ✅ Unauthorized access returns 401
- ✅ Authorized access returns data
- ✅ CRUD operations work correctly
- ✅ Message management functions properly

---

## ❌ **5. Error Handling Testing**

### Test Invalid Data
```bash
# Test invalid skill creation
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "category": "invalid_category"
  }' \
  http://localhost:5000/api/skills/

# Test invalid project creation
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "status": "invalid_status"
  }' \
  http://localhost:5000/api/projects/

# Test invalid blog post creation
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "content": "",
    "status": "invalid_status"
  }' \
  http://localhost:5000/api/blog/
```

### Test Missing Required Fields
```bash
# Test contact form with missing fields
curl -X POST http://localhost:5000/api/contact/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User"
  }'

# Test skill creation with missing fields
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Skill"
  }' \
  http://localhost:5000/api/skills/
```

### Test Non-existent Resources
```bash
# Test getting non-existent skill
curl http://localhost:5000/api/skills/99999

# Test getting non-existent project
curl http://localhost:5000/api/projects/99999

# Test getting non-existent blog post
curl http://localhost:5000/api/blog/99999
```

### Expected Results:
- ✅ Invalid data returns 400 Bad Request
- ✅ Missing fields return validation errors
- ✅ Non-existent resources return 404 Not Found
- ✅ Error messages are clear and helpful

---

## ✅ **6. Data Validation Testing**

### Test Date Validation
```bash
# Test invalid date format
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "institution": "Test University",
    "degree": "Bachelor",
    "start_date": "invalid-date",
    "end_date": "2023-13-45"
  }' \
  http://localhost:5000/api/portfolio/education
```

### Test Email Validation
```bash
# Test invalid email format
curl -X POST http://localhost:5000/api/contact/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "message": "Test message"
  }'
```

### Test Enum Validation
```bash
# Test invalid skill category
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Skill",
    "category": "invalid_category"
  }' \
  http://localhost:5000/api/skills/

# Test invalid project status
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "Test description",
    "status": "invalid_status"
  }' \
  http://localhost:5000/api/projects/
```

### Test Proficiency Level Validation
```bash
# Test invalid proficiency level
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Skill",
    "category": "technical",
    "proficiency_level": 10
  }' \
  http://localhost:5000/api/skills/
```

### Expected Results:
- ✅ Invalid dates return validation errors
- ✅ Invalid emails return validation errors
- ✅ Invalid enums return validation errors
- ✅ Invalid proficiency levels return validation errors

---

## 🚀 **Quick Test Script**

Here's a PowerShell script to run all tests quickly:

```powershell
# Quick API Test Script
Write-Host "🧪 Testing Wheeler Knight Portfolio API" -ForegroundColor Green

# Test 1: API Health
Write-Host "`n1. Testing API Health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
    Write-Host "✅ API Health: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ API Health Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Public Endpoints
Write-Host "`n2. Testing Public Endpoints..." -ForegroundColor Yellow
$endpoints = @(
    "http://localhost:5000/api/skills/",
    "http://localhost:5000/api/projects/",
    "http://localhost:5000/api/blog/",
    "http://localhost:5000/api/contact/info",
    "http://localhost:5000/api/portfolio/summary"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint -UseBasicParsing
        Write-Host "✅ $endpoint : $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ $endpoint : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Authentication
Write-Host "`n3. Testing Authentication..." -ForegroundColor Yellow
try {
    $loginBody = @{username='wheeler'; password='admin123'} | ConvertTo-Json
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
    $token = ($loginResponse.Content | ConvertFrom-Json).data.tokens.access_token
    Write-Host "✅ Login Successful" -ForegroundColor Green
    
    # Test protected endpoint
    $headers = @{Authorization="Bearer $token"}
    $statsResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/skills/stats" -Headers $headers -UseBasicParsing
    Write-Host "✅ Protected Endpoint Access: $($statsResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Authentication Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Unauthorized Access
Write-Host "`n4. Testing Unauthorized Access..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/skills/stats" -UseBasicParsing
    Write-Host "❌ Unauthorized Access Allowed (This should fail!)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Unauthorized Access Properly Blocked" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Testing Complete!" -ForegroundColor Green
```

---

## 📋 **Testing Checklist**

### ✅ **Database & Models**
- [ ] Database connection working
- [ ] All tables exist
- [ ] Sample data populated
- [ ] Foreign key relationships working

### ✅ **Public API Endpoints**
- [ ] API health check working
- [ ] All public endpoints accessible
- [ ] Data returned in correct format
- [ ] Pagination working
- [ ] Filtering working
- [ ] Contact form submission working

### ✅ **Authentication System**
- [ ] Login with correct credentials works
- [ ] Login with incorrect credentials fails
- [ ] Token validation works
- [ ] User info retrieval works
- [ ] Logout works
- [ ] Token refresh works

### ✅ **Protected Admin Endpoints**
- [ ] Unauthorized access blocked (401)
- [ ] Authorized access allowed
- [ ] CRUD operations work
- [ ] Statistics endpoints accessible
- [ ] Message management works

### ✅ **Error Handling**
- [ ] Invalid data returns 400
- [ ] Missing fields return validation errors
- [ ] Non-existent resources return 404
- [ ] Clear error messages

### ✅ **Data Validation**
- [ ] Date validation working
- [ ] Email validation working
- [ ] Enum validation working
- [ ] Proficiency level validation working

---

## 🎯 **Expected Test Results**

If everything is working correctly, you should see:
- ✅ **All public endpoints return 200 OK**
- ✅ **Authentication system working properly**
- ✅ **Protected endpoints require authentication**
- ✅ **CRUD operations work with proper authorization**
- ✅ **Error handling provides clear feedback**
- ✅ **Data validation prevents invalid inputs**

## 🚀 **Next Steps**

Once all tests pass, you'll be ready to move to **Phase 2, Step 2.4 - Frontend API Integration** where we'll:
1. Connect React frontend to the API
2. Implement authentication in the frontend
3. Create admin dashboard components
4. Build user interface for all CRUD operations

**Ready to test?** Run through these tests and let me know the results!
