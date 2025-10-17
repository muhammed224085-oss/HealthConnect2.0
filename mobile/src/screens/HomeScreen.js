import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏥 HealthConnect</Text>
        <Text style={styles.subtitle}>Your Healthcare Partner</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.card, styles.doctorCard]}
          onPress={() => navigation.navigate('DoctorLogin')}>
          <Text style={styles.cardIcon}>👨‍⚕️</Text>
          <Text style={styles.cardTitle}>Doctor Login</Text>
          <Text style={styles.cardSubtitle}>Access your dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.patientCard]}
          onPress={() => navigation.navigate('PatientLogin')}>
          <Text style={styles.cardIcon}>🏥</Text>
          <Text style={styles.cardTitle}>Patient Login</Text>
          <Text style={styles.cardSubtitle}>Book appointments & order medicines</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Healthcare made simple and accessible
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doctorCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#1976d2',
  },
  patientCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#4caf50',
  },
  cardIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default HomeScreen;