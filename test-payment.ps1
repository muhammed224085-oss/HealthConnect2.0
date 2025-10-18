#!/usr/bin/env pwsh
# HealthConnect - Payment Feature Test Script
# Tests the Google Pay QR Code payment integration

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   💳 Payment Feature Test Suite" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080"
$testsPassed = 0
$testsFailed = 0

# Test 1: Check QR Code Image
Write-Host "Test 1: Checking QR Code Image..." -ForegroundColor Yellow
$qrPath = "client\public\gpay-qr.jpg"
if (Test-Path $qrPath) {
    Write-Host "✅ QR code image exists at $qrPath" -ForegroundColor Green
    $testsPassed++
    
    # Check file size
    $fileSize = (Get-Item $qrPath).Length
    Write-Host "   File size: $($fileSize / 1KB) KB" -ForegroundColor Gray
} else {
    Write-Host "❌ QR code image NOT found!" -ForegroundColor Red
    Write-Host "   Please copy your QR code to: $qrPath" -ForegroundColor Yellow
    $testsFailed++
}

# Test 2: Check Backend Running
Write-Host "`nTest 2: Checking Backend Server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/payments/demo-methods" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running on port 8080" -ForegroundColor Green
        $testsPassed++
    }
} catch {
    Write-Host "❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host "   Start backend with: cd server; mvn spring-boot:run" -ForegroundColor Yellow
    $testsFailed++
}

# Test 3: Check Frontend Files
Write-Host "`nTest 3: Checking Frontend Files..." -ForegroundColor Yellow
$requiredFiles = @(
    "client\src\pages\PaymentPage.jsx",
    "client\src\pages\PaymentPage.css",
    "client\src\App.js"
)

$filesOk = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ $file is missing!" -ForegroundColor Red
        $filesOk = $false
    }
}

if ($filesOk) {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 4: Test Payment Confirmation API
Write-Host "`nTest 4: Testing Payment Confirmation API..." -ForegroundColor Yellow
try {
    $testOrder = @{
        orderId = "TEST-$(Get-Date -Format 'yyyyMMddHHmmss')"
        patientId = "test-patient-123"
        patientName = "Test User"
        amount = 100
        paymentMethod = "GooglePay"
        paymentStatus = "COMPLETED"
        items = @(
            @{
                name = "Test Medicine"
                description = "Test payment"
                price = 100
                quantity = 1
            }
        )
        timestamp = (Get-Date).ToUniversalTime().ToString("o")
    }
    
    $jsonBody = $testOrder | ConvertTo-Json -Depth 5
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/payments/confirm" `
        -Method Post `
        -Body $jsonBody `
        -ContentType "application/json" `
        -TimeoutSec 10
    
    if ($response.success -eq $true) {
        Write-Host "✅ Payment API works correctly!" -ForegroundColor Green
        Write-Host "   Order ID: $($response.orderId)" -ForegroundColor Gray
        Write-Host "   Invoice: $($response.payment.invoiceNumber)" -ForegroundColor Gray
        $testsPassed++
    } else {
        Write-Host "❌ Payment API returned error: $($response.error)" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "❌ Payment API test failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}

# Test 5: Check Frontend Server
Write-Host "`nTest 5: Checking Frontend Server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running on port 3000" -ForegroundColor Green
        $testsPassed++
    }
} catch {
    Write-Host "⚠️  Frontend is NOT running" -ForegroundColor Yellow
    Write-Host "   Start frontend with: cd client; npm start" -ForegroundColor Yellow
    Write-Host "   (This is optional for API testing)" -ForegroundColor Gray
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   📊 Test Summary" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$totalTests = $testsPassed + $testsFailed
$passRate = [math]::Round(($testsPassed / $totalTests) * 100, 2)

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $testsPassed" -ForegroundColor Green
Write-Host "Failed: $testsFailed" -ForegroundColor Red
Write-Host "Success Rate: $passRate%`n" -ForegroundColor Cyan

if ($testsFailed -eq 0) {
    Write-Host "🎉 All tests passed! Payment feature is ready!" -ForegroundColor Green
    Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Navigate to: http://localhost:3000/payment" -ForegroundColor White
    Write-Host "   2. Click 'Pay with Google Pay'" -ForegroundColor White
    Write-Host "   3. Scan QR code with any UPI app" -ForegroundColor White
    Write-Host "   4. Complete payment externally" -ForegroundColor White
    Write-Host "   5. Click 'Payment Done' button" -ForegroundColor White
    Write-Host "   6. Verify payment confirmation`n" -ForegroundColor White
} else {
    Write-Host "⚠️  Some tests failed. Please fix the issues above.`n" -ForegroundColor Yellow
}

Write-Host "========================================`n" -ForegroundColor Cyan

# Manual Testing Guide
Write-Host "📱 Manual Testing Guide:" -ForegroundColor Cyan
Write-Host "   • Visit: http://localhost:3000/payment" -ForegroundColor White
Write-Host "   • Test on mobile devices (responsive design)" -ForegroundColor White
Write-Host "   • Verify QR code is scannable" -ForegroundColor White
Write-Host "   • Check payment confirmation flow" -ForegroundColor White
Write-Host "   • Test error handling (cancel, back button)`n" -ForegroundColor White

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   • See PAYMENT_INTEGRATION_GUIDE.md for complete guide" -ForegroundColor White
Write-Host "   • API docs, code examples, troubleshooting included`n" -ForegroundColor White

# Pause at end
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
