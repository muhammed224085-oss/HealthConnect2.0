#!/bin/bash

# Test Payment Distribution System
# This script tests the automatic money distribution to doctor and pharmacy wallets

echo "=== HealthConnect Payment Distribution Test ==="
echo ""

BASE_URL="http://localhost:8080/api"

# Test 1: Create a consultation payment (should go to doctor wallet)
echo "Test 1: Creating consultation payment..."
curl -X POST "$BASE_URL/payments/create" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient123",
    "amount": 500,
    "currency": "INR",
    "description": "Consultation with Dr. Smith",
    "orderId": "consult_' $(date +%s) '",
    "paymentMethod": "UPI",
    "items": [{
      "name": "General Consultation",
      "description": "30 minute consultation",
      "price": 500,
      "quantity": 1,
      "total": 500,
      "doctorId": "doctor123"
    }]
  }'

echo ""
echo ""

# Test 2: Create a medicine payment (should go to pharmacy wallet)
echo "Test 2: Creating medicine payment..."
curl -X POST "$BASE_URL/payments/create" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient123",
    "amount": 350,
    "currency": "INR",
    "description": "Medicine order - 3 items",
    "orderId": "med_' $(date +%s) '",
    "paymentMethod": "CARD",
    "items": [{
      "name": "Paracetamol 500mg",
      "description": "Pain reliever",
      "price": 120,
      "quantity": 2,
      "total": 240,
      "pharmacyId": "pharmacy123"
    }, {
      "name": "Cough Syrup",
      "description": "100ml bottle",
      "price": 110,
      "quantity": 1,
      "total": 110,
      "pharmacyId": "pharmacy123"
    }]
  }'

echo ""
echo ""

# Test 3: Verify payment and distribution
echo "Test 3: Verifying payment (this will trigger distribution)..."
curl -X POST "$BASE_URL/payments/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_test_123",
    "status": "success",
    "transactionId": "txn_' $(date +%s) '"
  }'

echo ""
echo ""

# Test 4: Check doctor wallet balance
echo "Test 4: Checking doctor wallet..."
curl -X GET "$BASE_URL/wallets/DOCTOR/doctor123"

echo ""
echo ""

# Test 5: Check pharmacy wallet balance
echo "Test 5: Checking pharmacy wallet..."
curl -X GET "$BASE_URL/wallets/PHARMACY/pharmacy123"

echo ""
echo ""
echo "=== Test Complete ==="
echo ""
echo "Expected Results:"
echo "- Doctor should receive ₹400 (80% of ₹500 consultation)"
echo "- Pharmacy should receive ₹315 (90% of ₹350 medicine order)"
echo "- Platform commission: ₹100 consultation + ₹35 medicine = ₹135 total"