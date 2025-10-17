import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appointmentAPI, orderAPI } from '../services/api';

const PatientDashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
    loadDashboardData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        
        // Load recent appointments
        try {
          const appointmentsResponse = await appointmentAPI.getByPatient(user.id);
          setAppointments(appointmentsResponse.data.slice(0, 3)); // Show last 3
        } catch (error) {
          console.log('Error loading appointments:', error);
        }
        
        // Load recent orders
        try {
          const ordersResponse = await orderAPI.getByPatient(user.id);
          setRecentOrders(ordersResponse.data.slice(0, 3)); // Show last 3
        } catch (error) {
          console.log('Error loading orders:', error);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    loadDashboardData();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userType');
      navigation.replace('Home');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const quickActions = [
    {
      title: 'Find Doctors',
      icon: '👨‍⚕️',
      color: '#1976d2',
      action: () => navigation.navigate('DoctorList'),
    },
    {
      title: 'Medicine Shop',
      icon: '💊',
      color: '#4caf50',
      action: () => navigation.navigate('Shop'),
    },
    {
      title: 'My Orders',
      icon: '📦',
      color: '#ff9800',
      action: () => navigation.navigate('Orders'),
    },
    {
      title: 'Chat',
      icon: '💬',
      color: '#9c27b0',
      action: () => navigation.navigate('Chat'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Patient'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, { backgroundColor: action.color + '15' }]}
                onPress={action.action}>
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={[styles.quickActionTitle, { color: action.color }]}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Appointments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentDoctor}>
                    Dr. {appointment.doctorName || 'Unknown'}
                  </Text>
                  <Text style={styles.appointmentDate}>
                    {appointment.appointmentDate}
                  </Text>
                  <Text style={styles.appointmentType}>
                    {appointment.consultationType}
                  </Text>
                </View>
                <View style={[
                  styles.appointmentStatus,
                  { backgroundColor: getStatusColor(appointment.status) }
                ]}>
                  <Text style={styles.appointmentStatusText}>
                    {appointment.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent appointments</Text>
            </View>
          )}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.orderDate}>{order.orderDate}</Text>
                  <Text style={styles.orderAmount}>₹{order.totalAmount}</Text>
                </View>
                <View style={[
                  styles.orderStatus,
                  { backgroundColor: getStatusColor(order.status) }
                ]}>
                  <Text style={styles.orderStatusText}>
                    {order.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent orders</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
    case 'delivered':
      return '#4caf50';
    case 'pending':
    case 'processing':
      return '#ff9800';
    case 'cancelled':
      return '#f44336';
    default:
      return '#9e9e9e';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  quickActionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  appointmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDoctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  appointmentType: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  appointmentStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  appointmentStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  orderAmount: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: 'bold',
    marginTop: 2,
  },
  orderStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  orderStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default PatientDashboardScreen;