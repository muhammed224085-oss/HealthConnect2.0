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

const AdminDashboardScreen = ({ navigation }) => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalOrders: 0,
    totalMedicines: 0,
    pendingApprovals: 0,
    todayRevenue: 0,
    systemHealth: 'Good',
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAdminData();
    loadDashboardData();
  }, []);

  const loadAdminData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setAdmin(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Demo data - in real app, load from API
      setStats({
        totalUsers: 1247,
        totalDoctors: 85,
        totalPatients: 1162,
        totalOrders: 3456,
        totalMedicines: 250,
        pendingApprovals: 12,
        todayRevenue: 15420,
        systemHealth: 'Excellent',
      });

      setRecentActivity([
        {
          id: 1,
          type: 'user_registration',
          message: 'New doctor registration: Dr. Sarah Johnson',
          time: '2 minutes ago',
          icon: '👨‍⚕️'
        },
        {
          id: 2,
          type: 'order',
          message: 'Large order placed: ₹2,450',
          time: '15 minutes ago',
          icon: '📦'
        },
        {
          id: 3,
          type: 'system',
          message: 'System backup completed successfully',
          time: '1 hour ago',
          icon: '💾'
        },
        {
          id: 4,
          type: 'approval',
          message: 'Medicine approval pending: Amoxicillin',
          time: '2 hours ago',
          icon: '⚠️'
        }
      ]);
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
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from admin panel?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('user');
              await AsyncStorage.removeItem('userType');
              navigation.replace('Home');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  // Keep action metadata static to avoid recreating on every render
  const adminActions = React.useMemo(() => [
    {
      title: 'User Management',
      icon: '👥',
      color: '#1976d2',
      action: () => navigation.navigate('UserManagement'),
      description: 'Manage doctors and patients'
    },
    {
      title: 'Medicine Inventory',
      icon: '💊',
      color: '#4caf50',
      action: () => navigation.navigate('MedicineInventory'),
      description: 'Stock and pricing control'
    },
    {
      title: 'Order Management',
      icon: '📦',
      color: '#ff9800',
      action: () => navigation.navigate('OrderManagement'),
      description: 'Track and manage orders'
    },
    {
      title: 'Analytics',
      icon: '📊',
      color: '#9c27b0',
      action: () => navigation.navigate('Analytics'),
      description: 'System reports and insights'
    },
    {
      title: 'System Settings',
      icon: '⚙️',
      color: '#607d8b',
      action: () => navigation.navigate('SystemSettings'),
      description: 'Configuration and preferences'
    },
    {
      title: 'Support Tickets',
      icon: '🎫',
      color: '#e91e63',
      action: () => navigation.navigate('SupportTickets'),
      description: 'User support and issues'
    },
  ], [navigation]);

  const StatCard = ({ title, value, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ActivityItem = ({ activity }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityIcon}>{activity.icon}</Text>
      <View style={styles.activityContent}>
        <Text style={styles.activityMessage}>{activity.message}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
    </View>
  );

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
            <Text style={styles.adminName}>{admin?.name || 'Administrator'}</Text>
            <Text style={styles.systemStatus}>System Status: {stats.systemHealth}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            color="#1976d2"
            subtitle={`${stats.totalDoctors} doctors, ${stats.totalPatients} patients`}
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders} 
            color="#4caf50" 
          />
          <StatCard 
            title="Medicine Stock" 
            value={stats.totalMedicines} 
            color="#ff9800" 
          />
          <StatCard 
            title="Pending Approvals" 
            value={stats.pendingApprovals} 
            color="#f44336" 
          />
        </View>

        {/* Revenue Card */}
        <View style={styles.revenueCard}>
          <Text style={styles.revenueTitle}>Today's Revenue</Text>
          <Text style={styles.revenueAmount}>₹{stats.todayRevenue.toLocaleString()}</Text>
          <Text style={styles.revenueSubtext}>+12% from yesterday</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Actions</Text>
          <View style={styles.actionsGrid}>
            {adminActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { backgroundColor: action.color + '15' }]}
                onPress={action.action}>
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={[styles.actionTitle, { color: action.color }]}>
                  {action.title}
                </Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivity.slice(0, 5).map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </View>

        {/* System Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Health</Text>
          <View style={styles.healthGrid}>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Server Status</Text>
              <View style={[styles.healthIndicator, { backgroundColor: '#4caf50' }]}>
                <Text style={styles.healthStatus}>Online</Text>
              </View>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Database</Text>
              <View style={[styles.healthIndicator, { backgroundColor: '#4caf50' }]}>
                <Text style={styles.healthStatus}>Healthy</Text>
              </View>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>API Response</Text>
              <View style={[styles.healthIndicator, { backgroundColor: '#ff9800' }]}>
                <Text style={styles.healthStatus}>120ms</Text>
              </View>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Storage</Text>
              <View style={[styles.healthIndicator, { backgroundColor: '#4caf50' }]}>
                <Text style={styles.healthStatus}>65% Used</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
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
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  systemStatus: {
    fontSize: 14,
    color: '#4caf50',
    marginTop: 2,
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  revenueCard: {
    backgroundColor: '#1976d2',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  revenueTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  revenueAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  revenueSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 30,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  healthItem: {
    width: '48%',
    marginBottom: 15,
  },
  healthLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  healthIndicator: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  healthStatus: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AdminDashboardScreen;