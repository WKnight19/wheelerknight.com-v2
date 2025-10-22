# Wheeler Knight Portfolio API Test Script
# This script tests all functionality built up to Phase 2, Step 2.3

Write-Host "🧪 Wheeler Knight Portfolio API - Comprehensive Test Suite" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green

# Global variables
$baseUrl = "http://localhost:5000"
$token = $null
$testResults = @{
    Passed = 0
    Failed = 0
    Total = 0
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [int]$ExpectedStatus = 200
    )
    
    $testResults.Total++
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            UseBasicParsing = $true
        }
        
        if ($Headers.Count -gt 0) {
            $params.Headers = $Headers
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✅ $Name : $($response.StatusCode)" -ForegroundColor Green
            $testResults.Passed++
            return $response
        } else {
            Write-Host "❌ $Name : Expected $ExpectedStatus, got $($response.StatusCode)" -ForegroundColor Red
            $testResults.Failed++
            return $null
        }
    } catch {
        if ($_.Exception.Response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✅ $Name : $($_.Exception.Response.StatusCode) (Expected)" -ForegroundColor Green
            $testResults.Passed++
            return $null
        } else {
            Write-Host "❌ $Name : $($_.Exception.Message)" -ForegroundColor Red
            $testResults.Failed++
            return $null
        }
    }
}

# Test 1: API Health and Basic Endpoints
Write-Host "`n1. 🏥 Testing API Health and Basic Endpoints" -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

Test-Endpoint "API Info" "$baseUrl/api"
Test-Endpoint "Health Check" "$baseUrl/api/health"
Test-Endpoint "API Documentation" "$baseUrl/api/docs"

# Test 2: Public Skills Endpoints
Write-Host "`n2. 🎯 Testing Public Skills Endpoints" -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

Test-Endpoint "Get All Skills" "$baseUrl/api/skills/"
Test-Endpoint "Get Skills by Category" "$baseUrl/api/skills/?category=technical"
Test-Endpoint "Get Featured Skills" "$baseUrl/api/skills/?featured=true"
Test-Endpoint "Get Skill Categories" "$baseUrl/api/skills/categories"
Test-Endpoint "Get Specific Skill" "$baseUrl/api/skills/1"

# Test 3: Public Projects Endpoints
Write-Host "`n3. 🚀 Testing Public Projects Endpoints" -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

Test-Endpoint "Get All Projects" "$baseUrl/api/projects/"
Test-Endpoint "Get Projects by Status" "$baseUrl/api/projects/?status=completed"
Test-Endpoint "Get Featured Projects" "$baseUrl/api/projects/?featured=true"
Test-Endpoint "Get Project Statuses" "$baseUrl/api/projects/statuses"
Test-Endpoint "Get Specific Project" "$baseUrl/api/projects/1"

# Test 4: Public Blog Endpoints
Write-Host "`n4. 📝 Testing Public Blog Endpoints" -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

Test-Endpoint "Get Blog Posts" "$baseUrl/api/blog/"
Test-Endpoint "Get Blog Post by ID" "$baseUrl/api/blog/1"
Test-Endpoint "Get Blog Post by Slug" "$baseUrl/api/blog/slug/welcome-to-my-portfolio"
Test-Endpoint "Get Post Statuses" "$baseUrl/api/blog/statuses"
Test-Endpoint "Like Blog Post" "$baseUrl/api/blog/1/like" "POST"

# Test 5: Public Contact Endpoints
Write-Host "`n5. 📧 Testing Public Contact Endpoints" -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

Test-Endpoint "Get Contact Info" "$baseUrl/api/contact/info"

$contactBody = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Test Message"
    message = "This is a test message from the API test suite"
    company = "Test Company"
} | ConvertTo-Json

Test-Endpoint "Submit Contact Form" "$baseUrl/api/contact/messages" "POST" @{} $contactBody

# Test 6: Public Portfolio Endpoints
Write-Host "`n6. 🎓 Testing Public Portfolio Endpoints" -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

Test-Endpoint "Get Education" "$baseUrl/api/portfolio/education"
Test-Endpoint "Get Work Experience" "$baseUrl/api/portfolio/experience"
Test-Endpoint "Get Interests" "$baseUrl/api/portfolio/interests"
Test-Endpoint "Get Featured Interests" "$baseUrl/api/portfolio/interests/?featured=true"
Test-Endpoint "Get Interest Categories" "$baseUrl/api/portfolio/interests/categories"
Test-Endpoint "Get Portfolio Summary" "$baseUrl/api/portfolio/summary"

# Test 7: Authentication System
Write-Host "`n7. 🔐 Testing Authentication System" -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

# Test successful login
$loginBody = @{
    username = "wheeler"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Test-Endpoint "Admin Login" "$baseUrl/api/auth/login" "POST" @{} $loginBody

if ($loginResponse) {
    try {
        $loginData = $loginResponse.Content | ConvertFrom-Json
        $token = $loginData.data.tokens.access_token
        Write-Host "✅ Login Token Retrieved" -ForegroundColor Green
        
        # Test token validation
        $authHeaders = @{Authorization = "Bearer $token"}
        Test-Endpoint "Validate Token" "$baseUrl/api/auth/validate-token" "GET" $authHeaders
        Test-Endpoint "Get Current User" "$baseUrl/api/auth/me" "GET" $authHeaders
        
        # Test logout
        Test-Endpoint "Logout" "$baseUrl/api/auth/logout" "POST" $authHeaders
        
    } catch {
        Write-Host "❌ Failed to parse login response" -ForegroundColor Red
    }
}

# Test failed login
$invalidLoginBody = @{
    username = "wheeler"
    password = "wrongpassword"
} | ConvertTo-Json

Test-Endpoint "Invalid Login" "$baseUrl/api/auth/login" "POST" @{} $invalidLoginBody 401

# Test 8: Protected Admin Endpoints (Unauthorized)
Write-Host "`n8. 🛡️ Testing Protected Endpoints (Unauthorized Access)" -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

Test-Endpoint "Skills Stats (No Auth)" "$baseUrl/api/skills/stats" "GET" @{} $null 401
Test-Endpoint "Projects Stats (No Auth)" "$baseUrl/api/projects/stats" "GET" @{} $null 401
Test-Endpoint "Blog Stats (No Auth)" "$baseUrl/api/blog/stats" "GET" @{} $null 401
Test-Endpoint "Contact Stats (No Auth)" "$baseUrl/api/contact/stats" "GET" @{} $null 401
Test-Endpoint "Contact Messages (No Auth)" "$baseUrl/api/contact/messages" "GET" @{} $null 401

# Test 9: Protected Admin Endpoints (Authorized)
if ($token) {
    Write-Host "`n9. 🔓 Testing Protected Endpoints (Authorized Access)" -ForegroundColor Yellow
    Write-Host "-" * 50 -ForegroundColor Yellow
    
    $authHeaders = @{Authorization = "Bearer $token"}
    
    Test-Endpoint "Skills Stats (Auth)" "$baseUrl/api/skills/stats" "GET" $authHeaders
    Test-Endpoint "Projects Stats (Auth)" "$baseUrl/api/projects/stats" "GET" $authHeaders
    Test-Endpoint "Blog Stats (Auth)" "$baseUrl/api/blog/stats" "GET" $authHeaders
    Test-Endpoint "Contact Stats (Auth)" "$baseUrl/api/contact/stats" "GET" $authHeaders
    Test-Endpoint "Contact Messages (Auth)" "$baseUrl/api/contact/messages" "GET" $authHeaders
}

# Test 10: CRUD Operations
if ($token) {
    Write-Host "`n10. ✏️ Testing CRUD Operations" -ForegroundColor Yellow
    Write-Host "-" * 50 -ForegroundColor Yellow
    
    $authHeaders = @{Authorization = "Bearer $token"}
    
    # Create a test skill
    $skillBody = @{
        name = "API Test Skill"
        category = "technical"
        proficiency_level = 4
        description = "Test skill created by API test suite"
        is_featured = $false
    } | ConvertTo-Json
    
    $createResponse = Test-Endpoint "Create Skill" "$baseUrl/api/skills/" "POST" $authHeaders $skillBody
    
    if ($createResponse) {
        try {
            $skillData = $createResponse.Content | ConvertFrom-Json
            $skillId = $skillData.data.id
            Write-Host "✅ Created skill with ID: $skillId" -ForegroundColor Green
            
            # Update the skill
            $updateBody = @{
                name = "Updated API Test Skill"
                proficiency_level = 5
                is_featured = $true
            } | ConvertTo-Json
            
            Test-Endpoint "Update Skill" "$baseUrl/api/skills/$skillId" "PUT" $authHeaders $updateBody
            
            # Delete the skill
            Test-Endpoint "Delete Skill" "$baseUrl/api/skills/$skillId" "DELETE" $authHeaders
            
        } catch {
            Write-Host "❌ Failed to parse skill creation response" -ForegroundColor Red
        }
    }
}

# Test 11: Error Handling
Write-Host "`n11. ❌ Testing Error Handling" -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

# Test invalid data
$invalidSkillBody = @{
    name = ""
    category = "invalid_category"
} | ConvertTo-Json

Test-Endpoint "Invalid Skill Data" "$baseUrl/api/skills/" "POST" $authHeaders $invalidSkillBody 400

# Test missing required fields
$incompleteBody = @{
    name = "Test Skill"
} | ConvertTo-Json

Test-Endpoint "Missing Required Fields" "$baseUrl/api/skills/" "POST" $authHeaders $incompleteBody 400

# Test non-existent resource
Test-Endpoint "Non-existent Skill" "$baseUrl/api/skills/99999" "GET" @{} $null 404

# Test 12: Data Validation
Write-Host "`n12. ✅ Testing Data Validation" -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

# Test invalid email
$invalidEmailBody = @{
    name = "Test User"
    email = "invalid-email"
    message = "Test message"
} | ConvertTo-Json

Test-Endpoint "Invalid Email" "$baseUrl/api/contact/messages" "POST" @{} $invalidEmailBody 400

# Test invalid proficiency level
$invalidProficiencyBody = @{
    name = "Test Skill"
    category = "technical"
    proficiency_level = 10
} | ConvertTo-Json

Test-Endpoint "Invalid Proficiency Level" "$baseUrl/api/skills/" "POST" $authHeaders $invalidProficiencyBody 400

# Test Results Summary
Write-Host "`n" + "=" * 60 -ForegroundColor Green
Write-Host "🎉 TEST RESULTS SUMMARY" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green
Write-Host "Total Tests: $($testResults.Total)" -ForegroundColor White
Write-Host "Passed: $($testResults.Passed)" -ForegroundColor Green
Write-Host "Failed: $($testResults.Failed)" -ForegroundColor Red

$passRate = [math]::Round(($testResults.Passed / $testResults.Total) * 100, 2)
Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 90) { "Green" } elseif ($passRate -ge 70) { "Yellow" } else { "Red" })

if ($testResults.Failed -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED! Your API is working perfectly!" -ForegroundColor Green
    Write-Host "Ready to move to Phase 2, Step 2.4 - Frontend API Integration" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Some tests failed. Please check the errors above." -ForegroundColor Yellow
    Write-Host "Fix any issues before proceeding to the next phase." -ForegroundColor Yellow
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review any failed tests" -ForegroundColor White
Write-Host "2. Fix any issues found" -ForegroundColor White
Write-Host "3. Re-run this test script" -ForegroundColor White
Write-Host "4. Once all tests pass, proceed to Frontend Integration" -ForegroundColor White
