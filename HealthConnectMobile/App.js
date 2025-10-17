import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import DoctorLoginScreen from './src/screens/DoctorLoginScreen';
import PatientLoginScreen from './src/screens/PatientLoginScreen';
import DoctorRegisterScreen from './src/screens/DoctorRegisterScreen';
import PatientRegisterScreen from './src/screens/PatientRegisterScreen';
import DoctorDashboardScreen from './src/screens/DoctorDashboardScreen';
import PatientDashboardScreen from './src/screens/PatientDashboardScreen';
import MedicineShopScreen from './src/screens/MedicineShopScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ChatScreen from './src/screens/ChatScreen';
import QRCodeScreen from './src/screens/QRCodeScreen';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import UserManagementScreen from './src/screens/UserManagementScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import InvoiceScreen from './src/screens/InvoiceScreen';
import DoctorWalletScreen from './src/screens/DoctorWalletScreen';
import PharmacyWalletScreen from './src/screens/PharmacyWalletScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Patient Bottom Tabs
function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}>
      <Tab.Screen 
        name="Dashboard" 
        component={PatientDashboardScreen}
        options={{
          tabBarIcon: () => '🏠',
        }}
      />
      <Tab.Screen 
        name="Shop" 
        component={MedicineShopScreen}
        options={{
          tabBarIcon: () => '💊',
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          tabBarIcon: () => '📦',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarIcon: () => '💬',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1976d2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        
        {/* Home and Auth Screens */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: '🏥 HealthConnect',
            headerStyle: { backgroundColor: '#1976d2' }
          }}
        />
        
        <Stack.Screen 
          name="DoctorLogin" 
          component={DoctorLoginScreen}
          options={{ title: 'Doctor Login' }}
        />
        
        <Stack.Screen 
          name="PatientLogin" 
          component={PatientLoginScreen}
          options={{ title: 'Patient Login' }}
        />
        
        <Stack.Screen 
          name="DoctorRegister" 
          component={DoctorRegisterScreen}
          options={{ title: 'Doctor Registration' }}
        />
        
        <Stack.Screen 
          name="PatientRegister" 
          component={PatientRegisterScreen}
          options={{ title: 'Patient Registration' }}
        />

        <Stack.Screen 
          name="AdminLogin" 
          component={AdminLoginScreen}
          options={{ title: 'Admin Login' }}
        />
        
        {/* Dashboard Screens */}
        <Stack.Screen 
          name="DoctorDashboard" 
          component={DoctorDashboardScreen}
          options={{ title: 'Doctor Dashboard' }}
        />

        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen}
          options={{ title: 'Admin Dashboard' }}
        />

        <Stack.Screen 
          name="UserManagement" 
          component={UserManagementScreen}
          options={{ title: 'User Management' }}
        />
        
        <Stack.Screen 
          name="PatientDashboard" 
          component={PatientTabs}
          options={{ headerShown: false }}
        />

        {/* Payment Screens */}
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen}
          options={{ title: 'Payment' }}
        />

        <Stack.Screen 
          name="Invoice" 
          component={InvoiceScreen}
          options={{ title: 'Invoice' }}
        />

        <Stack.Screen 
          name="DoctorWallet" 
          component={DoctorWalletScreen}
          options={{ title: 'Doctor Wallet' }}
        />

        <Stack.Screen 
          name="PharmacyWallet" 
          component={PharmacyWalletScreen}
          options={{ title: 'Pharmacy Wallet' }}
        />
        
        {/* Other Screens */}
        <Stack.Screen 
          name="QRCode" 
          component={QRCodeScreen}
          options={{ title: 'Install App' }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
