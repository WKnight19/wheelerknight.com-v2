# Quick Manual Testing Guide

## 🚀 **Quick Start Testing**

### 1. **Check Services Are Running**

```bash
# Check Docker containers
docker-compose ps

# Should show:
# - wheelerknight_mysql (Running)
# - wheelerknight_backend (Running)
# - wheelerknight_frontend (Running)
```

### 2. **Test Basic API Health**

```bash
# Open browser or use curl
curl http://localhost:5000/api/health

# Should return:
# {"status": "healthy", "message": "Wheeler Knight Portfolio API is running", ...}
```

### 3. **Test Public Endpoints**

```bash
# Test skills
curl http://localhost:5000/api/skills/

# Test projects
curl http://localhost:5000/api/projects/

# Test blog
curl http://localhost:5000/api/blog/

# Test contact info
curl http://localhost:5000/api/contact/info

# Test portfolio summary
curl http://localhost:5000/api/portfolio/summary
```

### 4. **Test Authentication**

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wheeler","password":"admin123"}'

# Should return tokens and user info
```

### 5. **Test Protected Endpoints**

```bash
# Get token from login response, then:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/skills/stats

# Should return skills statistics
```

### 6. **Test Frontend**

```bash
# Open browser
http://localhost:3000

# Should show Wheeler Knight Portfolio welcome page
```

## 🎯 **Expected Results**

- ✅ **All public endpoints return data**
- ✅ **Authentication works with wheeler/admin123**
- ✅ **Protected endpoints require tokens**
- ✅ **Frontend loads without errors**
- ✅ **No console errors in browser**

## 🚨 **Common Issues & Solutions**

### Issue: "Connection refused"

**Solution:** Check if Docker containers are running

```bash
docker-compose up -d
```

### Issue: "401 Unauthorized" on protected endpoints

**Solution:** Make sure you're including the Bearer token

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/skills/stats
```

### Issue: "404 Not Found" on endpoints

**Solution:** Check if backend is running and accessible

```bash
curl http://localhost:5000/api/health
```

### Issue: Frontend not loading

**Solution:** Check if frontend container is running

```bash
docker-compose logs frontend
```

## ✅ **Quick Verification Checklist**

- [ ] Docker containers running
- [ ] API health check passes
- [ ] Public endpoints return data
- [ ] Login works with wheeler/admin123
- [ ] Protected endpoints require authentication
- [ ] Frontend loads at localhost:3000
- [ ] No major errors in logs

## 🎉 **Ready for Next Phase?**

If all checks pass, you're ready to move to **Phase 2, Step 2.4 - Frontend API Integration**!

**Next Steps:**

1. Connect React frontend to API
2. Implement authentication in frontend
3. Create admin dashboard
4. Build CRUD interfaces
