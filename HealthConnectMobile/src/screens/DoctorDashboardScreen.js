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
import { appointmentAPI, patientAPI } from '../services/api';

const DoctorDashboardScreen = ({ navigation }) => {
  const [doctor, setDoctor] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedToday: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctorData();
    loadDashboardData();
  }, []);

  const loadDoctorData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setDoctor(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading doctor data:', error);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const doctor = JSON.parse(userData);
        
        // Load today's appointments
        try {
          const appointmentsResponse = await appointmentAPI.getByDoctor(doctor.id);
          const today = new Date().toDateString();
          const todayAppts = appointmentsResponse.data.filter(apt => 
            new Date(apt.appointmentDate).toDateString() === today
          );
          setTodayAppointments(todayAppts.slice(0, 5)); // Show first 5
          
          // Calculate stats
          setStats({
            totalPatients: appointmentsResponse.data.length,
            todayAppointments: todayAppts.length,
            pendingAppointments: todayAppts.filter(apt => apt.status === 'pending').length,
            completedToday: todayAppts.filter(apt => apt.status === 'completed').length,
          });
        } catch (error) {
          console.log('Error loading appointments:', error);
          // Set demo data
          setStats({
            totalPatients: 45,
            todayAppointments: 8,
            pendingAppointments: 3,
            completedToday: 5,
          });
          
          setTodayAppointments([
            {
              id: '1',
              patientName: 'John Doe',
              time: '09:00 AM',
              type: 'General Checkup',
              status: 'pending'
            },
            {
              id: '2',
              patientName: 'Jane Smith',
              time: '10:30 AM',
              type: 'Follow-up',
              status: 'completed'
            },
            {
              id: '3',
              patientName: 'Mike Johnson',
              time: '02:00 PM',
              type: 'Consultation',
              status: 'pending'
            }
          ]);
        }
        
        // Load recent patients
        try {
          const patientsResponse = await patientAPI.getAll();
          setRecentPatients(patientsResponse.data.slice(0, 3));
        } catch (error) {
          console.log('Error loading patients:', error);
          // Set demo data
          setRecentPatients([
            {
              id: '1',
              name: 'Sarah Wilson',
              age: 28,
              lastVisit: '2024-01-15',
              condition: 'Hypertension'
            },
            {
              id: '2',
              name: 'Robert Brown',
              age: 45,
              lastVisit: '2024-01-14',
              condition: 'Diabetes'
            }
          ]);
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
      title: 'View Appointments',
      icon: '📅',
      color: '#1976d2',
      action: () => navigation.navigate('DoctorAppointments'),
    },
    {
      title: 'Patient Records',
      icon: '👥',
      color: '#4caf50',
      action: () => navigation.navigate('PatientRecords'),
    },
    {
      title: 'Prescriptions',
      icon: '💊',
      color: '#ff9800',
      action: () => navigation.navigate('Prescriptions'),
    },
    {
      title: 'Messages',
      icon: '💬',
      color: '#9c27b0',
      action: () => navigation.navigate('Chat'),
    },
  ];

  const StatCard = ({ title, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
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
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.doctorName}>Dr. {doctor?.name || 'Doctor'}</Text>
            <Text style={styles.specialization}>{doctor?.specialization}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard 
            title="Total Patients" 
            value={stats.totalPatients} 
            color="#1976d2" 
          />
          <StatCard 
            title="Today's Appointments" 
            value={stats.todayAppointments} 
            color="#4caf50" 
          />
          <StatCard 
            title="Pending" 
            value={stats.pendingAppointments} 
            color="#ff9800" 
          />
          <StatCard 
            title="Completed Today" 
            value={stats.completedToday} 
            color="#9c27b0" 
          />
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

        {/* Today's Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {todayAppointments.length > 0 ? (
            todayAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentTime}>
                  <Text style={styles.timeText}>{appointment.time}</Text>
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.patientName}>{appointment.patientName}</Text>
                  <Text style={styles.appointmentType}>{appointment.type}</Text>
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
              <Text style={styles.emptyStateText}>No appointments today</Text>
            </View>
          )}
        </View>

        {/* Recent Patients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Patients</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentPatients.length > 0 ? (
            recentPatients.map((patient) => (
              <View key={patient.id} style={styles.patientCard}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.patientInitial}>
                    {patient.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.patientInfo}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.patientDetails}>Age: {patient.age}</Text>
                  <Text style={styles.patientCondition}>{patient.condition}</Text>
                </View>
                <View style={styles.patientActions}>
                  <Text style={styles.lastVisit}>{patient.lastVisit}</Text>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent patients</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return '#4caf50';
    case 'pending':
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
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  specialization: {
    fontSize: 14,
    color: '#1976d2',
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
    color: '#333',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
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
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  appointmentTime: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 15,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appointmentType: {
    fontSize: 14,
    color: '#666',
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
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  patientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  patientInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  patientInfo: {
    flex: 1,
  },
  patientDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  patientCondition: {
    fontSize: 12,
    color: '#ff9800',
    marginTop: 2,
  },
  patientActions: {
    alignItems: 'flex-end',
  },
  lastVisit: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  viewButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  viewButtonText: {
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

export default DoctorDashboardScreen;