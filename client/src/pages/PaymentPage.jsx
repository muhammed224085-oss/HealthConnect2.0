import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PaymentPage.css';

const API_BASE_URL = 'http://localhost:8080/api';

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Get order details from navigation state
  const orderDetails = location.state?.orderDetails || {
    orderId: 'ORD' + Date.now(),
    amount: 0,
    items: [],
    patientName: 'Guest'
  };

  const handlePayWithGPay = () => {
    setShowQR(true);
  };

  const handlePaymentDone = async () => {
    setIsProcessing(true);
    
    try {
      // Get patient info from localStorage
      const patient = JSON.parse(localStorage.getItem('patient') || '{}');
      
      // Update order status via backend
      const response = await axios.post(`${API_BASE_URL}/payments/confirm`, {
        orderId: orderDetails.orderId,
        patientId: patient.id || null,
        patientName: orderDetails.patientName,
        amount: orderDetails.amount,
        paymentMethod: 'GooglePay',
        paymentStatus: 'COMPLETED',
        items: orderDetails.items,
        timestamp: new Date().toISOString()
      });

      console.log('✅ Payment confirmed:', response.data);
      
      setPaymentSuccess(true);
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate('/orders', { 
          state: { 
            message: 'Payment completed successfully!',
            orderId: orderDetails.orderId
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('❌ Payment confirmation error:', error);
      alert('Payment confirmation failed. Please contact support with Order ID: ' + orderDetails.orderId);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (showQR) {
      setShowQR(false);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <button className="back-button" onClick={handleCancel}>
            ← Back
          </button>
          <h2>💳 Payment</h2>
        </div>

        {paymentSuccess ? (
          // Success Message
          <div className="payment-success">
            <div className="success-icon">✅</div>
            <h3>Payment Successful!</h3>
            <p>Your order has been confirmed.</p>
            <p className="order-id">Order ID: {orderDetails.orderId}</p>
            <p className="redirect-text">Redirecting to orders page...</p>
          </div>
        ) : !showQR ? (
          // Order Summary & Payment Options
          <div className="payment-content">
            <div className="order-summary">
              <h3>📋 Order Summary</h3>
              <div className="summary-details">
                <div className="detail-row">
                  <span>Order ID:</span>
                  <strong>{orderDetails.orderId}</strong>
                </div>
                <div className="detail-row">
                  <span>Patient:</span>
                  <strong>{orderDetails.patientName}</strong>
                </div>
                {orderDetails.items && orderDetails.items.length > 0 && (
                  <div className="items-list">
                    <span>Items:</span>
                    <ul>
                      {orderDetails.items.map((item, index) => (
                        <li key={index}>
                          {item.name} × {item.quantity} - ₹{item.price * item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="detail-row total-row">
                  <span>Total Amount:</span>
                  <strong className="amount">₹{orderDetails.amount}</strong>
                </div>
              </div>
            </div>

            <div className="payment-methods">
              <h3>💰 Select Payment Method</h3>
              
              <button className="payment-method-btn gpay-btn" onClick={handlePayWithGPay}>
                <div className="btn-content">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" 
                    alt="Google Pay" 
                    className="gpay-logo"
                  />
                  <div className="btn-text">
                    <span className="method-name">Pay with Google Pay</span>
                    <span className="method-desc">Scan QR code to pay</span>
                  </div>
                </div>
              </button>

              <div className="other-methods">
                <p className="info-text">
                  <span className="icon">ℹ️</span>
                  More payment methods coming soon!
                </p>
              </div>
            </div>
          </div>
        ) : (
          // QR Code Display
          <div className="qr-payment-section">
            <div className="qr-header">
              <h3>📱 Scan QR Code to Pay</h3>
              <p className="qr-instructions">
                Open any UPI app (Google Pay, PhonePe, Paytm, etc.) and scan this QR code
              </p>
            </div>

            <div className="qr-code-container">
              <div className="qr-code-wrapper">
                <img 
                  src="/gpay-qr.jpg" 
                  alt="Google Pay QR Code" 
                  className="qr-code-image"
                />
                <div className="qr-overlay">
                  <span className="upi-badge">UPI Payment</span>
                </div>
              </div>
              
              <div className="payment-details">
                <p className="upi-id">
                  <strong>UPI ID:</strong> hadhimon.vs-1@okicici
                </p>
                <p className="amount-display">
                  <strong>Amount:</strong> ₹{orderDetails.amount}
                </p>
              </div>
            </div>

            <div className="payment-instructions">
              <h4>📖 How to Pay:</h4>
              <ol>
                <li>Open your UPI app (Google Pay, PhonePe, Paytm, etc.)</li>
                <li>Tap on "Scan QR Code" option</li>
                <li>Scan the QR code displayed above</li>
                <li>Verify the amount: ₹{orderDetails.amount}</li>
                <li>Complete the payment</li>
                <li>Click "Payment Done" button below after successful payment</li>
              </ol>
            </div>

            <div className="payment-actions">
              <button 
                className="confirm-payment-btn" 
                onClick={handlePaymentDone}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="icon">✅</span>
                    Payment Done
                  </>
                )}
              </button>
              
              <button 
                className="cancel-btn" 
                onClick={handleCancel}
                disabled={isProcessing}
              >
                ❌ Cancel
              </button>
            </div>

            <div className="security-note">
              <p>
                <span className="icon">🔒</span>
                <strong>Secure Payment:</strong> Your payment is processed through UPI, 
                India's most secure payment system. We do not store your payment information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
