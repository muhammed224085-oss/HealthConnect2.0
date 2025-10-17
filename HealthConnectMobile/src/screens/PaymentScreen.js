import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paymentAPI, orderAPI } from '../services/api';

const PaymentScreen = React.memo(({ route, navigation }) => {
  const { paymentData } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      // Demo payment methods
      const methods = [
        {
          id: 'upi',
          name: 'UPI',
          icon: '📱',
          description: 'Pay using UPI apps like GPay, PhonePe',
          popular: true
        },
        {
          id: 'card',
          name: 'Credit/Debit Card',
          icon: '💳',
          description: 'Visa, Mastercard, RuPay cards',
          popular: true
        },
        {
          id: 'netbanking',
          name: 'Net Banking',
          icon: '🏦',
          description: 'Pay using your bank account'
        },
        {
          id: 'wallet',
          name: 'Wallets',
          icon: '💰',
          description: 'Paytm, PhonePe, Amazon Pay'
        }
      ];
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method.id === 'card') {
      setShowCardForm(true);
    } else if (method.id === 'upi') {
      // Show UPI form or direct payment
      processPayment(method);
    } else {
      processPayment(method);
    }
  };

  const processPayment = async (method) => {
    setLoading(true);
    try {
      // Create payment order
      const orderResponse = await paymentAPI.createOrder({
        patientId: paymentData.patientId,
        paymentType: paymentData.type,
        amount: paymentData.amount,
        description: paymentData.description,
        doctorId: paymentData.doctorId,
        medicineOrderId: paymentData.orderId,
        items: paymentData.items
      });

      // Simulate payment processing
      setTimeout(() => {
        handlePaymentSuccess(orderResponse.data, method);
      }, 2000);

    } catch (error) {
      setLoading(false);
      Alert.alert('Payment Failed', 'Unable to process payment. Please try again.');
    }
  };

  const handlePaymentSuccess = async (orderData, method) => {
    try {
      // Simulate successful payment
      const paymentResult = {
        orderId: orderData.orderId,
        paymentId: 'pay_' + Date.now(),
        signature: 'signature_' + Date.now(),
        paymentDbId: orderData.paymentDbId,
        status: 'SUCCESS'
      };

      // Verify payment
      const verifyResponse = await paymentAPI.verifyPayment(paymentResult);
      
      if (verifyResponse.data.success) {
        // For medicine orders, create the order and clear cart
        if (paymentData.type === 'MEDICINE' && paymentData.items) {
          const orderRequest = {
            patientId: paymentData.patientId,
            items: paymentData.items.map(item => ({
              medicineId: item.medicineId || 'med_' + Date.now(),
              quantity: item.quantity,
              price: item.price
            })),
            totalAmount: paymentData.amount,
            status: 'confirmed',
            paymentId: orderData.paymentDbId
          };

          await orderAPI.create(orderRequest);
          
          // Clear cart after successful order
          await AsyncStorage.removeItem('cart');
        }
        
        setLoading(false);
        Alert.alert(
          'Payment Successful!',
          `Your payment of ₹${paymentData.amount} has been processed successfully.`,
          [
            {
              text: 'View Invoice',
              onPress: () => navigation.navigate('Invoice', { 
                paymentId: orderData.paymentDbId 
              })
            },
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Payment Error', 'Payment verification failed. Please contact support.');
    }
  };

  const handleCardPayment = () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      Alert.alert('Error', 'Please fill all card details');
      return;
    }
    setShowCardForm(false);
    processPayment(selectedMethod);
  };

  const PaymentMethodCard = ({ method }) => (
    <TouchableOpacity
      style={[
        styles.methodCard,
        selectedMethod?.id === method.id && styles.selectedMethod
      ]}
      onPress={() => handlePaymentMethodSelect(method)}
    >
      <View style={styles.methodHeader}>
        <Text style={styles.methodIcon}>{method.icon}</Text>
        <View style={styles.methodInfo}>
          <Text style={styles.methodName}>{method.name}</Text>
          <Text style={styles.methodDescription}>{method.description}</Text>
        </View>
        {method.popular && <Text style={styles.popularBadge}>Popular</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount:</Text>
            <Text style={styles.summaryAmount}>₹{paymentData.amount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>For:</Text>
            <Text style={styles.summaryValue}>{paymentData.description}</Text>
          </View>
          {paymentData.items && (
            <View style={styles.itemsList}>
              {paymentData.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name} x {item.quantity}</Text>
                  <Text style={styles.itemPrice}>₹{item.total}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsSection}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.id} method={method} />
          ))}
        </View>

        {/* Security Info */}
        <View style={styles.securityCard}>
          <Text style={styles.securityTitle}>🔒 Secure Payment</Text>
          <Text style={styles.securityText}>
            Your payment is secured with 256-bit SSL encryption. 
            We never store your card details.
          </Text>
        </View>
      </ScrollView>

      {/* Card Details Modal */}
      <Modal
        visible={showCardForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCardForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Card Details</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={cardDetails.number}
              onChangeText={(text) => setCardDetails({...cardDetails, number: text})}
              keyboardType="numeric"
              maxLength={16}
            />
            
            <View style={styles.cardRow}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChangeText={(text) => setCardDetails({...cardDetails, expiry: text})}
                keyboardType="numeric"
                maxLength={5}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CVV"
                value={cardDetails.cvv}
                onChangeText={(text) => setCardDetails({...cardDetails, cvv: text})}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Cardholder Name"
              value={cardDetails.name}
              onChangeText={(text) => setCardDetails({...cardDetails, name: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCardForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.payButton}
                onPress={handleCardPayment}
              >
                <Text style={styles.payButtonText}>Pay ₹{paymentData.amount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <Modal visible={loading} transparent={true}>
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Processing Payment...</Text>
              <Text style={styles.loadingSubtext}>Please do not close the app</Text>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  itemsList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  methodsSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  methodCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMethod: {
    borderColor: '#4CAF50',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  popularBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  securityCard: {
    backgroundColor: '#f8f9fa',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  payButton: {
    flex: 1,
    padding: 16,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default PaymentScreen;