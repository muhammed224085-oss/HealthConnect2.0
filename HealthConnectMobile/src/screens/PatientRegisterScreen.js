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
import { patientAPI } from '../services/api';
import { testConnection } from '../services/api';

const PatientRegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
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
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!formData.age.trim()) {
      Alert.alert('Error', 'Please enter your age');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        age: parseInt(formData.age),
        gender: formData.gender,
        address: formData.address,
      };

      console.log('Attempting patient registration...', { email: formData.email });
      const response = await patientAPI.register(registrationData);
      
      if (response.data && response.data.id) {
        Alert.alert(
          'Success', 
          'Registration successful! Please login to continue.',
          [{ text: 'OK', onPress: () => navigation.navigate('PatientLogin') }]
        );
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Connection timeout. Please check your internet connection and try again.';
      } else if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        if (status === 400) {
          errorMessage = 'Invalid registration data. Please check your information.';
        } else if (status === 409) {
          errorMessage = 'Email already exists. Please use a different email.';
        } else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      }
      
      Alert.alert(
        'Registration Error', 
        errorMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: () => handleRegister() }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const result = await testConnection();
      Alert.alert(
        'Connection Test',
        result.success 
          ? `✅ Connection successful!\nServer: ${result.server}\nResponse time: ${result.responseTime}ms`
          : `❌ Connection failed: ${result.error}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Connection Test Failed',
        `❌ Unable to test connection: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.logo}>👤</Text>
          <Text style={styles.title}>Patient Registration</Text>
          <Text style={styles.subtitle}>Create your patient account</Text>
        </View>

        {/* Registration Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
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
            <Text style={styles.label}>Password *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                placeholder="Gender"
                value={formData.gender}
                onChangeText={(value) => handleInputChange('gender', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your address"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Test Connection Button (for debugging) */}
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestConnection}
            disabled={loading}>
            <Text style={styles.testButtonText}>Test Connection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}>
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('PatientLogin')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  registerButton: {
    backgroundColor: '#1976d2',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  testButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '600',
  },
  termsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PatientRegisterScreen;