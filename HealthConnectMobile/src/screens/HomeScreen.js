import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>🏥</Text>
          <Text style={styles.title}>HealthConnect</Text>
          <Text style={styles.subtitle}>Your Healthcare Partner</Text>
        </View>

        {/* Login Cards */}
        <View style={styles.cardsContainer}>
          
          {/* Doctor Login Card */}
          <TouchableOpacity
            style={[styles.card, styles.doctorCard]}
            onPress={() => navigation.navigate('DoctorLogin')}>
            <Text style={styles.cardIcon}>👨‍⚕️</Text>
            <Text style={styles.cardTitle}>Doctor Portal</Text>
            <Text style={styles.cardSubtitle}>
              Manage appointments and consultations
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => navigation.navigate('DoctorLogin')}>
                <Text style={styles.loginBtnText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => navigation.navigate('DoctorRegister')}>
                <Text style={styles.registerBtnText}>Register</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Patient Login Card */}
          <TouchableOpacity
            style={[styles.card, styles.patientCard]}
            onPress={() => navigation.navigate('PatientLogin')}>
            <Text style={styles.cardIcon}>🏥</Text>
            <Text style={styles.cardTitle}>Patient Portal</Text>
            <Text style={styles.cardSubtitle}>
              Book appointments & order medicines
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => navigation.navigate('PatientLogin')}>
                <Text style={styles.loginBtnText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => navigation.navigate('PatientRegister')}>
                <Text style={styles.registerBtnText}>Register</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Admin Login Card */}
          <TouchableOpacity
            style={[styles.card, styles.adminCard]}
            onPress={() => navigation.navigate('AdminLogin')}>
            <Text style={styles.cardIcon}>⚙️</Text>
            <Text style={styles.cardTitle}>Admin Portal</Text>
            <Text style={styles.cardSubtitle}>
              System administration and management
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.adminBtn}
                onPress={() => navigation.navigate('AdminLogin')}>
                <Text style={styles.adminBtnText}>Admin Access</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>App Features</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📅</Text>
              <Text style={styles.featureText}>Book Appointments</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💊</Text>
              <Text style={styles.featureText}>Order Medicines</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureText}>Chat with Doctors</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📦</Text>
              <Text style={styles.featureText}>Track Orders</Text>
            </View>
          </View>
        </View>

        {/* QR Code Section */}
        <TouchableOpacity
          style={styles.qrSection}
          onPress={() => navigation.navigate('QRCode')}>
          <Text style={styles.qrIcon}>📱</Text>
          <Text style={styles.qrText}>Share App with QR Code</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardsContainer: {
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  doctorCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#1976d2',
  },
  patientCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#4caf50',
  },
  cardIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 15,
  },
  loginBtn: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  loginBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerBtn: {
    borderWidth: 2,
    borderColor: '#1976d2',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  registerBtnText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  adminBtn: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  adminBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  feature: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  qrSection: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  qrIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  qrText: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
  },
});

export default HomeScreen;