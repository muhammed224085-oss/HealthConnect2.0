import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

const QRCodeScreen = ({ navigation }) => {
  const handleDownloadApp = () => {
    Alert.alert(
      'Download App',
      'The app will be available for download once it\'s published to app stores.',
      [{ text: 'OK' }]
    );
  };

  const handleOpenWebApp = () => {
    const webAppUrl = 'https://your-web-app-url.com'; // Replace with actual URL
    Linking.openURL(webAppUrl).catch(() => {
      Alert.alert('Error', 'Unable to open web application');
    });
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

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.logo}>📱</Text>
          <Text style={styles.title}>Install HealthConnect</Text>
          <Text style={styles.subtitle}>
            Get instant access to healthcare services on your mobile device
          </Text>

          {/* QR Code Placeholder */}
          <View style={styles.qrContainer}>
            <View style={styles.qrCode}>
              <Text style={styles.qrText}>QR CODE</Text>
              <Text style={styles.qrSubtext}>Scan to install</Text>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>How to install:</Text>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Open your phone's camera app</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Point camera at the QR code above</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Tap the notification to install</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleDownloadApp}>
              <Text style={styles.primaryButtonText}>Download App</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleOpenWebApp}>
              <Text style={styles.secondaryButtonText}>Open Web Version</Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <Text style={styles.featuresTitle}>App Features:</Text>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>Instant appointment booking</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💊</Text>
              <Text style={styles.featureText}>Online medicine ordering</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureText}>Direct doctor communication</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>Health records management</Text>
            </View>
          </View>

          {/* Share */}
          <View style={styles.shareContainer}>
            <Text style={styles.shareTitle}>Share with friends and family</Text>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>📤 Share App</Text>
            </TouchableOpacity>
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
  content: {
    alignItems: 'center',
    padding: 20,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  qrContainer: {
    marginBottom: 40,
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#1976d2',
  },
  qrText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  qrSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  instructions: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1976d2',
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: 'bold',
    marginRight: 15,
  },
  stepText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  actions: {
    width: '100%',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#1976d2',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1976d2',
  },
  secondaryButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  features: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: '100%',
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
  shareContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shareTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRCodeScreen;