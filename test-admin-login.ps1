# Test Admin Login Script
Write-Host "Testing Admin Login..." -ForegroundColor Yellow

# Wait for server to start
Start-Sleep -Seconds 5

# Test getting all admins
Write-Host "`nGetting all admins from database..." -ForegroundColor Cyan
try {
    $admins = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/test-admins" -Method GET
    Write-Host "Admins in database:" -ForegroundColor Green
    $admins | ForEach-Object {
        Write-Host "  Email: $($_.email)" -ForegroundColor White
        Write-Host "  Password: $($_.password)" -ForegroundColor White
        Write-Host "  Active: $($_.isActive)" -ForegroundColor White
        Write-Host "  ---"
    }
} catch {
    Write-Host "Error getting admins: $_" -ForegroundColor Red
}

# Test login with first admin
Write-Host "`nTesting login with admin@healthconnect.com..." -ForegroundColor Cyan
try {
    $body = @{
        email = "admin@healthconnect.com"
        password = "admin123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "Login SUCCESS!" -ForegroundColor Green
    Write-Host "Logged in as: $($response.name)" -ForegroundColor White
} catch {
    Write-Host "Login FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test login with second admin
Write-Host "`nTesting login with mevinbenty507@gmail.com..." -ForegroundColor Cyan
try {
    $body = @{
        email = "mevinbenty507@gmail.com"
        password = "mevinbenty12+"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "Login SUCCESS!" -ForegroundColor Green
    Write-Host "Logged in as: $($response.name)" -ForegroundColor White
} catch {
    Write-Host "Login FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest complete!" -ForegroundColor Yellow
