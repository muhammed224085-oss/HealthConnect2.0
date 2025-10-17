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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { orderAPI } from '../services/api';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  const filters = ['All', 'Pending', 'Processing', 'Delivered', 'Cancelled'];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const response = await orderAPI.getByPatient(user.id);
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('Error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    loadOrders();
  };

  const cancelOrder = async (orderId) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await orderAPI.update(orderId, { status: 'cancelled' });
              loadOrders();
              Alert.alert('Success', 'Order cancelled successfully');
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'Failed to cancel order');
            }
          }
        }
      ]
    );
  };

  const getFilteredOrders = () => {
    if (selectedFilter === 'All') {
      return orders;
    }
    return orders.filter(order => 
      order.status.toLowerCase() === selectedFilter.toLowerCase()
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return '#4caf50';
      case 'processing':
        return '#ff9800';
      case 'pending':
        return '#2196f3';
      case 'cancelled':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const OrderCard = ({ order }) => {
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.orderDate}>{order.orderDate}</Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) }
          ]}>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          <Text style={styles.itemsTitle}>Items:</Text>
          {order.items && order.items.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.itemName}>
                {item.medicineName || item.name} x {item.quantity}
              </Text>
              <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalAmount}>
            Total: ₹{order.totalAmount}
          </Text>
          <View style={styles.orderActions}>
            {order.status.toLowerCase() === 'pending' && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => cancelOrder(order.id)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}>
              <Text style={styles.trackButtonText}>Track</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const filteredOrders = getFilteredOrders();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.selectedFilter
            ]}
            onPress={() => setSelectedFilter(filter)}>
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.selectedFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView
        style={styles.ordersList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptyMessage}>
              {selectedFilter === 'All' 
                ? "You haven't placed any orders yet."
                : `No ${selectedFilter.toLowerCase()} orders found.`}
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Shop')}>
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    color: '#1976d2',
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
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedFilter: {
    backgroundColor: '#1976d2',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  selectedFilterText: {
    color: 'white',
  },
  ordersList: {
    flex: 1,
    padding: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  orderItems: {
    marginBottom: 15,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  trackButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trackButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  shopButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdersScreen;