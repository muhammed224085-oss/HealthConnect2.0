# Test Payment Distribution System
# This script tests the automatic money distribution to doctor and pharmacy wallets

Write-Host "=== HealthConnect Payment Distribution Test ===" -ForegroundColor Green
Write-Host ""

$BASE_URL = "http://localhost:8080/api"

# Test 1: Create a consultation payment (should go to doctor wallet)
Write-Host "Test 1: Creating consultation payment..." -ForegroundColor Yellow
$consultationPayment = @{
    patientId = "patient123"
    amount = 500
    currency = "INR"
    description = "Consultation with Dr. Smith"
    orderId = "consult_$(Get-Date -UFormat %s)"
    paymentMethod = "UPI"
    items = @(
        @{
            name = "General Consultation"
            description = "30 minute consultation"
            price = 500
            quantity = 1
            total = 500
            doctorId = "doctor123"
        }
    )
} | ConvertTo-Json -Depth 3

try {
    $response1 = Invoke-RestMethod -Uri "$BASE_URL/payments/create" -Method POST -Body $consultationPayment -ContentType "application/json"
    Write-Host "Consultation payment created: $($response1.id)" -ForegroundColor Green
} catch {
    Write-Host "Error creating consultation payment: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Create a medicine payment (should go to pharmacy wallet)
Write-Host "Test 2: Creating medicine payment..." -ForegroundColor Yellow
$medicinePayment = @{
    patientId = "patient123"
    amount = 350
    currency = "INR"
    description = "Medicine order - 3 items"
    orderId = "med_$(Get-Date -UFormat %s)"
    paymentMethod = "CARD"
    items = @(
        @{
            name = "Paracetamol 500mg"
            description = "Pain reliever"
            price = 120
            quantity = 2
            total = 240
            pharmacyId = "pharmacy123"
        },
        @{
            name = "Cough Syrup"
            description = "100ml bottle"
            price = 110
            quantity = 1
            total = 110
            pharmacyId = "pharmacy123"
        }
    )
} | ConvertTo-Json -Depth 3

try {
    $response2 = Invoke-RestMethod -Uri "$BASE_URL/payments/create" -Method POST -Body $medicinePayment -ContentType "application/json"
    Write-Host "Medicine payment created: $($response2.id)" -ForegroundColor Green
} catch {
    Write-Host "Error creating medicine payment: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Verify payment and distribution
Write-Host "Test 3: Verifying payment (this will trigger distribution)..." -ForegroundColor Yellow
$verificationData = @{
    paymentId = "pay_test_123"
    status = "success"
    transactionId = "txn_$(Get-Date -UFormat %s)"
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Uri "$BASE_URL/payments/verify" -Method POST -Body $verificationData -ContentType "application/json"
    Write-Host "Payment verified successfully" -ForegroundColor Green
} catch {
    Write-Host "Error verifying payment: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Check doctor wallet balance
Write-Host "Test 4: Checking doctor wallet..." -ForegroundColor Yellow
try {
    $doctorWallet = Invoke-RestMethod -Uri "$BASE_URL/wallets/DOCTOR/doctor123" -Method GET
    Write-Host "Doctor Wallet Balance: ₹$($doctorWallet.balance)" -ForegroundColor Green
    Write-Host "Total Earnings: ₹$($doctorWallet.totalEarnings)" -ForegroundColor Green
} catch {
    Write-Host "Error checking doctor wallet: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Check pharmacy wallet balance
Write-Host "Test 5: Checking pharmacy wallet..." -ForegroundColor Yellow
try {
    $pharmacyWallet = Invoke-RestMethod -Uri "$BASE_URL/wallets/PHARMACY/pharmacy123" -Method GET
    Write-Host "Pharmacy Wallet Balance: ₹$($pharmacyWallet.balance)" -ForegroundColor Green
    Write-Host "Total Earnings: ₹$($pharmacyWallet.totalEarnings)" -ForegroundColor Green
} catch {
    Write-Host "Error checking pharmacy wallet: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Expected Results:" -ForegroundColor Cyan
Write-Host "- Doctor should receive ₹400 (80% of ₹500 consultation)" -ForegroundColor White
Write-Host "- Pharmacy should receive ₹315 (90% of ₹350 medicine order)" -ForegroundColor White
Write-Host "- Platform commission: ₹100 consultation + ₹35 medicine = ₹135 total" -ForegroundColor White