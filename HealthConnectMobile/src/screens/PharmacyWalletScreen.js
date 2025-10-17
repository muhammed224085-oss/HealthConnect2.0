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
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { walletAPI } from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';

const PharmacyWalletScreen = React.memo(({ navigation }) => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [pharmacyInfo, setPharmacyInfo] = useState(null);

  useEffect(() => {
    loadPharmacyData();
    loadWalletData();
  }, []);

  const loadPharmacyData = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setPharmacyInfo(user);
      }
    } catch (error) {
      console.error('Error loading pharmacy data:', error);
    }
  }, []);

  const loadWalletData = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const response = await walletAPI.getWallet('PHARMACY', user.id);
        setWalletData(response.data);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
      // Create wallet if it doesn't exist
      if (error.response?.status === 404) {
        await createWallet();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const createWallet = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const response = await walletAPI.createWallet('PHARMACY', user.id);
        setWalletData(response.data);
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWalletData();
  }, [loadWalletData]);

  const formatCurrency = useMemo(() => {
    return (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };
  }, []);

  const handleWithdraw = useCallback(async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid withdrawal amount');
      return;
    }
    
    if (amount > walletData.balance) {
      Alert.alert('Insufficient Balance', 'Withdrawal amount cannot exceed available balance');
      return;
    }
    
    if (amount < 100) {
      Alert.alert('Minimum Amount', 'Minimum withdrawal amount is ₹100');
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        await walletAPI.withdraw('PHARMACY', user.id, amount);
        
        Alert.alert(
          'Withdrawal Initiated',
          `₹${amount} withdrawal request has been submitted. Amount will be credited to your registered account within 2-3 business days.`,
          [{ text: 'OK', onPress: () => {
            setShowWithdrawModal(false);
            setWithdrawAmount('');
            loadWalletData();
          }}]
        );
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      Alert.alert('Error', 'Failed to process withdrawal request');
    }
  }, [walletData, loadWalletData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pharmacy Wallet</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <MaterialIcons name="account-balance-wallet" size={32} color="#4CAF50" />
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>
            {formatCurrency(walletData?.balance || 0)}
          </Text>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => setShowWithdrawModal(true)}
            disabled={!walletData?.balance || walletData.balance < 100}
          >
            <MaterialIcons name="money" size={20} color="#fff" />
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Text style={styles.cardTitle}>Medicine Sales Summary</Text>
          
          <View style={styles.earningsRow}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsValue}>
                {formatCurrency(walletData?.totalEarnings || 0)}
              </Text>
              <Text style={styles.earningsLabel}>Total Earnings</Text>
            </View>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsValue}>
                {formatCurrency(walletData?.totalWithdrawn || 0)}
              </Text>
              <Text style={styles.earningsLabel}>Total Withdrawn</Text>
            </View>
          </View>

          <View style={styles.earningsRow}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsValue}>
                {walletData?.transactions?.filter(t => t.type === 'CREDIT').length || 0}
              </Text>
              <Text style={styles.earningsLabel}>Medicine Orders</Text>
            </View>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsValue}>90%</Text>
              <Text style={styles.earningsLabel}>Your Share</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsCard}>
          <Text style={styles.cardTitle}>Recent Transactions</Text>
          {walletData?.transactions && walletData.transactions.length > 0 ? (
            walletData.transactions.slice(0, 5).map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <MaterialIcons
                    name={transaction.type === 'CREDIT' ? 'add-circle' : 'remove-circle'}
                    size={24}
                    color={transaction.type === 'CREDIT' ? '#4CAF50' : '#f44336'}
                  />
                  <View>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'CREDIT' ? '#4CAF50' : '#f44336' }
                ]}>
                  {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noTransactions}>No transactions yet</Text>
          )}
        </View>

        {/* Commission Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Commission Structure</Text>
          <Text style={styles.infoText}>
            • You earn 90% of medicine order value
          </Text>
          <Text style={styles.infoText}>
            • Platform fee: 10% per order
          </Text>
          <Text style={styles.infoText}>
            • Minimum withdrawal: ₹100
          </Text>
          <Text style={styles.infoText}>
            • Settlements: 2-3 business days
          </Text>
        </View>
      </ScrollView>

      {/* Withdrawal Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw Earnings</Text>
            
            <Text style={styles.balanceInfo}>
              Available Balance: {formatCurrency(walletData?.balance || 0)}
            </Text>
            
            <TextInput
              style={styles.withdrawInput}
              placeholder="Enter withdrawal amount"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleWithdraw}
              >
                <Text style={styles.confirmButtonText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
    alignItems: 'center',
  },
  balanceHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
  },
  withdrawButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  earningsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  earningsLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  transactionsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noTransactions: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  balanceInfo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
  },
  withdrawInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  confirmButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default PharmacyWalletScreen;