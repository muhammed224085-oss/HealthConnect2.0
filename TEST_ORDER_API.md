# Order Placement API - Testing Guide

## ✅ Fixed Order Placement Issue

### Problem
- Frontend was showing "Failed to place order" when placing orders from shopping cart
- Backend didn't have proper error handling or the correct endpoint structure

### Solution Implemented
1. ✅ Updated `OrderItem.java` - Changed `medicineId` from `Long` to `String` for MongoDB compatibility
2. ✅ Created new `/api/orders/place` endpoint in `OrderController.java` with comprehensive error handling
3. ✅ Added automatic date generation and default status ("PLACED")
4. ✅ CORS is already enabled for `http://localhost:3000`
5. ✅ Returns proper success/error JSON responses

---

## API Endpoint Details

### POST `/api/orders/place`

**URL:** `http://localhost:8080/api/orders/place`

**Headers:**
```
Content-Type: application/json
```

**Request Body (Minimum):**
```json
{
  "patientId": "12345",
  "medicines": [
    {
      "name": "Paracetamol",
      "quantity": 2,
      "price": 40
    }
  ],
  "totalPrice": 80
}
```

**Request Body (Full):**
```json
{
  "patientId": "12345",
  "patientName": "John Doe",
  "patientAddress": "123 Main St, City",
  "patientPhone": "9876543210",
  "medicines": [
    {
      "medicineId": "med1",
      "name": "Paracetamol",
      "quantity": 2,
      "price": 40
    },
    {
      "medicineId": "med2",
      "name": "Ibuprofen",
      "quantity": 1,
      "price": 60
    }
  ],
  "totalPrice": 140
}
```

**Success Response (201 Created):**
```json
{
  "message": "Order placed successfully",
  "orderId": "671f8a2b3c4d5e6f7a8b9c0d"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Patient ID is required"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to place order",
  "details": "Detailed error message here"
}
```

---

## Testing with cURL

### Test 1: Place Simple Order
```bash
curl -X POST http://localhost:8080/api/orders/place \
  -H "Content-Type: application/json" \
  -d "{\"patientId\":\"123\",\"medicines\":[{\"name\":\"Paracetamol\",\"quantity\":2,\"price\":40}],\"totalPrice\":80}"
```

### Test 2: Place Full Order
```bash
curl -X POST http://localhost:8080/api/orders/place \
  -H "Content-Type: application/json" \
  -d "{\"patientId\":\"123\",\"patientName\":\"John Doe\",\"patientAddress\":\"123 Main St\",\"patientPhone\":\"9876543210\",\"medicines\":[{\"medicineId\":\"med1\",\"name\":\"Paracetamol\",\"quantity\":2,\"price\":40},{\"medicineId\":\"med2\",\"name\":\"Ibuprofen\",\"quantity\":1,\"price\":60}],\"totalPrice\":140}"
```

### Test 3: Missing Patient ID (Should Fail)
```bash
curl -X POST http://localhost:8080/api/orders/place \
  -H "Content-Type: application/json" \
  -d "{\"medicines\":[{\"name\":\"Paracetamol\",\"quantity\":2,\"price\":40}],\"totalPrice\":80}"
```

---

## Testing with PowerShell

### PowerShell Test Script
```powershell
# Test Order Placement
$body = @{
    patientId = "123"
    patientName = "John Doe"
    medicines = @(
        @{
            name = "Paracetamol"
            quantity = 2
            price = 40
        }
    )
    totalPrice = 80
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/orders/place" -Method Post -Body $body -ContentType "application/json"

Write-Host "Response: $($response | ConvertTo-Json -Depth 5)"
```

---

## Frontend Integration (React/Axios)

### Example Frontend Code
```javascript
// In your React component
import axios from 'axios';

const placeOrder = async (orderData) => {
  try {
    const response = await axios.post(
      'http://localhost:8080/api/orders/place',
      {
        patientId: orderData.patientId,
        patientName: orderData.patientName,
        patientAddress: orderData.address,
        patientPhone: orderData.phone,
        medicines: orderData.cartItems.map(item => ({
          medicineId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: orderData.totalAmount
      }
    );
    
    console.log('Order placed:', response.data);
    alert(response.data.message + '\nOrder ID: ' + response.data.orderId);
    
  } catch (error) {
    console.error('Order failed:', error.response?.data || error.message);
    alert('Failed to place order: ' + (error.response?.data?.error || 'Unknown error'));
  }
};
```

---

## Order Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Auto-generated | MongoDB ObjectId |
| `patientId` | String | ✅ Yes | Patient's unique ID |
| `patientName` | String | Optional | Patient's name |
| `patientAddress` | String | Optional | Delivery address |
| `patientPhone` | String | Optional | Contact number |
| `items` (medicines) | List<OrderItem> | Yes | List of ordered medicines |
| `totalAmount` (totalPrice) | Double | Yes | Total order amount in ₹ |
| `status` | String | Auto: "PLACED" | Order status |
| `orderDate` | String | Auto-generated | Format: "yyyy-MM-dd HH:mm:ss" |
| `deliveryDate` | String | Optional | Expected delivery date |

### OrderItem Fields

| Field | Type | Description |
|-------|------|-------------|
| `medicineId` | String | Medicine's unique ID (optional) |
| `medicineName` | String | Medicine name (optional) |
| `name` | String | Alternative medicine name field |
| `quantity` | Integer | Quantity ordered |
| `price` | Double | Price per unit in ₹ |

---

## Additional Endpoints

### GET All Orders
```
GET http://localhost:8080/api/orders
```

### GET Order by ID
```
GET http://localhost:8080/api/orders/{orderId}
```

### GET Orders by Patient ID
```
GET http://localhost:8080/api/orders/patient/{patientId}
```

### UPDATE Order Status
```
PATCH http://localhost:8080/api/orders/{orderId}/status
Body: { "status": "SHIPPED" }
```

### DELETE Order
```
DELETE http://localhost:8080/api/orders/{orderId}
```

---

## Status Values
- `PLACED` - Order just placed (default)
- `PROCESSING` - Order is being processed
- `SHIPPED` - Order has been shipped
- `DELIVERED` - Order has been delivered

---

## ✅ Verification Checklist

- [x] Backend server running on port 8080
- [x] MongoDB connected successfully
- [x] CORS enabled for localhost:3000
- [x] `/api/orders/place` endpoint created
- [x] Proper error handling implemented
- [x] Success response returns orderId
- [x] Automatic date generation
- [x] Default status set to "PLACED"
- [x] OrderItem model updated for MongoDB compatibility

---

## Notes

1. **Automatic Fields:**
   - `orderDate` is automatically set to current date-time
   - `status` defaults to "PLACED" if not provided
   - `id` is auto-generated by MongoDB

2. **Flexible Field Names:**
   - Accepts both `totalPrice` and `totalAmount`
   - Accepts both `name` and `medicineName` in medicines array
   - All patient details (name, address, phone) are optional

3. **Error Handling:**
   - Returns 400 if patientId is missing
   - Returns 500 with details if database operation fails
   - All errors are logged to console for debugging

4. **Currency:**
   - All prices are in Indian Rupees (₹)
