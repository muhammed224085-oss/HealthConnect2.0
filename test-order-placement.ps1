# Test Order Placement API
Write-Host "Testing Order Placement API..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Simple Order
Write-Host "Test 1: Placing a simple order..." -ForegroundColor Yellow
$body1 = @{
    patientId = "test-patient-123"
    medicines = @(
        @{
            name = "Paracetamol"
            quantity = 2
            price = 40
        }
    )
    totalPrice = 80
} | ConvertTo-Json -Depth 5

try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:8080/api/orders/place" -Method Post -Body $body1 -ContentType "application/json"
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Message: $($response1.message)" -ForegroundColor Green
    Write-Host "Order ID: $($response1.orderId)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 2: Full Order with Patient Details
Write-Host "Test 2: Placing a full order with patient details..." -ForegroundColor Yellow
$body2 = @{
    patientId = "test-patient-456"
    patientName = "John Doe"
    patientAddress = "123 Main Street, Mumbai"
    patientPhone = "9876543210"
    medicines = @(
        @{
            medicineId = "med-1"
            name = "Paracetamol"
            quantity = 2
            price = 40
        },
        @{
            medicineId = "med-2"
            name = "Ibuprofen"
            quantity = 1
            price = 60
        }
    )
    totalPrice = 140
} | ConvertTo-Json -Depth 5

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:8080/api/orders/place" -Method Post -Body $body2 -ContentType "application/json"
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Message: $($response2.message)" -ForegroundColor Green
    Write-Host "Order ID: $($response2.orderId)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Test 3: Missing Patient ID (Should Fail)
Write-Host "Test 3: Testing validation - missing patientId (should fail)..." -ForegroundColor Yellow
$body3 = @{
    medicines = @(
        @{
            name = "Paracetamol"
            quantity = 2
            price = 40
        }
    )
    totalPrice = 80
} | ConvertTo-Json -Depth 5

try {
    $response3 = Invoke-RestMethod -Uri "http://localhost:8080/api/orders/place" -Method Post -Body $body3 -ContentType "application/json"
    Write-Host "❌ This should have failed!" -ForegroundColor Red
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "✅ Validation working correctly!" -ForegroundColor Green
    Write-Host "Error: $($errorDetails.error)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "All tests completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now test from the frontend at http://localhost:3000" -ForegroundColor Magenta
