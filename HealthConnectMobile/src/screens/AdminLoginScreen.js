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

const AdminLoginScreen = ({ navigation }) => {
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
      // Demo admin login
      if (formData.email === 'admin@healthconnect.com' && formData.password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          name: 'System Administrator',
          email: 'admin@healthconnect.com',
          role: 'admin',
          permissions: ['all'],
          loginTime: new Date().toISOString()
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(adminUser));
        await AsyncStorage.setItem('userType', 'admin');
        
        Alert.alert('Success', 'Admin login successful!', [
          { text: 'OK', onPress: () => navigation.replace('AdminDashboard') }
        ]);
      } else {
        Alert.alert('Error', 'Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
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
          <Text style={styles.logo}>⚙️</Text>
          <Text style={styles.title}>Admin Portal</Text>
          <Text style={styles.subtitle}>System Administration Access</Text>
        </View>

        {/* Demo Credentials Info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoTitle}>Demo Admin Credentials:</Text>
          <Text style={styles.demoText}>Email: admin@healthconnect.com</Text>
          <Text style={styles.demoText}>Password: admin123</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Admin Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter admin email"
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
                placeholder="Enter admin password"
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
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            <Text style={styles.loginButtonText}>
              {loading ? 'Signing In...' : 'Access Admin Panel'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityTitle}>🔐 Security Notice</Text>
          <Text style={styles.securityText}>
            Admin access is restricted to authorized personnel only. 
            All admin activities are logged and monitored for security purposes.
          </Text>
        </View>

        {/* Admin Features */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Admin Panel Features:</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>👥</Text>
            <Text style={styles.featureText}>User Management</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>System Analytics</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💊</Text>
            <Text style={styles.featureText}>Medicine Inventory</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📋</Text>
            <Text style={styles.featureText}>Reports & Logs</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚙️</Text>
            <Text style={styles.featureText}>System Configuration</Text>
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
    color: '#d32f2f',
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
    color: '#d32f2f',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  demoInfo: {
    backgroundColor: '#ffebee',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 5,
  },
  demoText: {
    fontSize: 12,
    color: '#d32f2f',
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
  loginButton: {
    backgroundColor: '#d32f2f',
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
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityNotice: {
    backgroundColor: '#fff3cd',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
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

export default AdminLoginScreen;