import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { walletAPI } from '../services/api';

const DoctorWalletScreen = ({ navigation }) => {
  const [doctor, setDoctor] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [earnings, setEarnings] = useState({
    currentBalance: 0,
    totalEarnings: 0,
    totalTransactions: 0,
    currency: 'INR'
  });
  const [loading, setLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState('');

  useEffect(() => {
    loadDoctorData();
  }, []);

  const loadDoctorData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const doctorData = JSON.parse(userData);
        setDoctor(doctorData);
        loadWalletData(doctorData.id || 'doctor_001');
      }
    } catch (error) {
      console.error('Error loading doctor data:', error);
    }
  };

  const loadWalletData = async (doctorId) => {
    setLoading(true);
    try {
      // Load wallet and earnings data
      const [walletResponse, earningsResponse] = await Promise.all([
        walletAPI.getWallet('doctor', doctorId),
        walletAPI.getDoctorEarnings(doctorId)
      ]);

      setWalletData(walletResponse.data);
      setEarnings(earningsResponse.data);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      // Set demo data if API fails
      setEarnings({
        doctorId: doctorId,
        currentBalance: 12450.00,
        totalEarnings: 25680.00,
        totalTransactions: 47,
        currency: 'INR',
        walletStatus: 'ACTIVE'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!bankDetails.trim()) {
      Alert.alert('Error', 'Please enter bank details');
      return;
    }

    if (parseFloat(withdrawAmount) > earnings.currentBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    try {
      const response = await walletAPI.processWithdrawal('doctor', doctor.id || 'doctor_001', {
        amount: parseFloat(withdrawAmount),
        bankDetails: bankDetails.trim()
      });

      if (response.data.success) {
        Alert.alert('Success', 'Withdrawal request submitted successfully');
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setBankDetails('');
        // Reload wallet data
        loadWalletData(doctor.id || 'doctor_001');
      } else {
        Alert.alert('Error', response.data.message || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      Alert.alert('Error', 'Failed to process withdrawal request');
    }
  };

  const onRefresh = () => {
    if (doctor) {
      loadWalletData(doctor.id || 'doctor_001');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>
            ₹{earnings.currentBalance?.toLocaleString() || '0'}
          </Text>
          <Text style={styles.balanceSubtext}>
            {earnings.currency || 'INR'} • Status: {earnings.walletStatus || 'Active'}
          </Text>
        </View>

        {/* Earnings Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Earnings Summary</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                ₹{earnings.totalEarnings?.toLocaleString() || '0'}
              </Text>
              <Text style={styles.summaryLabel}>Total Earnings</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {earnings.totalTransactions || 0}
              </Text>
              <Text style={styles.summaryLabel}>Consultations</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                ₹{((earnings.totalEarnings || 0) / (earnings.totalTransactions || 1)).toFixed(0)}
              </Text>
              <Text style={styles.summaryLabel}>Avg. Per Visit</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>80%</Text>
              <Text style={styles.summaryLabel}>Your Share</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.withdrawButton}
            onPress={() => setShowWithdrawModal(true)}
            disabled={!earnings.currentBalance || earnings.currentBalance <= 0}>
            <Text style={styles.withdrawButtonText}>💰 Withdraw Money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={() => navigation.navigate('TransactionHistory', { 
              ownerId: doctor?.id || 'doctor_001',
              ownerType: 'doctor'
            })}>
            <Text style={styles.historyButtonText}>📄 Transaction History</Text>
          </TouchableOpacity>
        </View>

        {/* How It Works */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💳</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Consultation Fees</Text>
              <Text style={styles.infoText}>
                You receive 80% of each consultation fee directly to your wallet
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>⚡</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Instant Credits</Text>
              <Text style={styles.infoText}>
                Money is credited immediately after patient payment completion
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🏦</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Easy Withdrawals</Text>
              <Text style={styles.infoText}>
                Withdraw to your bank account anytime with instant processing
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Withdrawal Modal */}
      <Modal
        visible={showWithdrawModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWithdrawModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw Money</Text>
            
            <Text style={styles.modalSubtitle}>
              Available Balance: ₹{earnings.currentBalance?.toLocaleString() || '0'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter amount to withdraw"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter bank account details (Account number, IFSC code, etc.)"
              value={bankDetails}
              onChangeText={setBankDetails}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowWithdrawModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleWithdraw}>
                <Text style={styles.confirmButtonText}>
                  Withdraw ₹{withdrawAmount || '0'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 50,
  },
  balanceCard: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginBottom: 10,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  summarySection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  historyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 35,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
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
    padding: 25,
    borderRadius: 20,
    width: '90%',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DoctorWalletScreen;