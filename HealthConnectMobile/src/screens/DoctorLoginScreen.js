import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doctorAPI } from '../services/api';

const DoctorLoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await doctorAPI.login(formData);
      
      if (response.data && response.data.id) {
        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
        await AsyncStorage.setItem('userType', 'doctor');
        
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => navigation.replace('DoctorDashboard') }
        ]);
      } else {
        Alert.alert('Error', 'Invalid login credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Demo login for testing
      if (formData.email === 'doctor@demo.com' && formData.password === 'demo123') {
        const demoDoctor = {
          id: 'demo-doctor-1',
          name: 'Dr. John Smith',
          email: 'doctor@demo.com',
          specialization: 'General Medicine',
          experience: '10 years',
          qualification: 'MBBS, MD',
          phone: '+91 9876543210'
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(demoDoctor));
        await AsyncStorage.setItem('userType', 'doctor');
        
        Alert.alert('Success', 'Demo login successful!', [
          { text: 'OK', onPress: () => navigation.replace('DoctorDashboard') }
        ]);
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset functionality will be implemented soon.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>👨‍⚕️</Text>
          <Text style={styles.title}>Doctor Login</Text>
          <Text style={styles.subtitle}>Access your medical practice portal</Text>
        </View>

        {/* Demo Credentials Info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoTitle}>Demo Credentials:</Text>
          <Text style={styles.demoText}>Email: doctor@demo.com</Text>
          <Text style={styles.demoText}>Password: demo123</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.passwordToggleText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorRegister')}>
            <Text style={styles.registerLink}>Register Here</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Doctor Portal Features:</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📅</Text>
            <Text style={styles.featureText}>Manage Appointments</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>👥</Text>
            <Text style={styles.featureText}>Patient Management</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💊</Text>
            <Text style={styles.featureText}>Prescription Management</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💬</Text>
            <Text style={styles.featureText}>Patient Communication</Text>
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
    padding: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  demoInfo: {
    backgroundColor: '#e3f2fd',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 5,
  },
  demoText: {
    fontSize: 12,
    color: '#1976d2',
    fontFamily: 'monospace',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordToggle: {
    padding: 12,
  },
  passwordToggleText: {
    fontSize: 18,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#1976d2',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#666',
  },
  registerLink: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
  },
  features: {
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 30,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
});

export default DoctorLoginScreen;