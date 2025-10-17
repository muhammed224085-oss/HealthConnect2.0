import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens (you'll need to create these)
import HomeScreen from './src/screens/HomeScreen';
import DoctorLoginScreen from './src/screens/DoctorLoginScreen';
import PatientLoginScreen from './src/screens/PatientLoginScreen';
import DoctorDashboardScreen from './src/screens/DoctorDashboardScreen';
import PatientDashboardScreen from './src/screens/PatientDashboardScreen';
import MedicineShopScreen from './src/screens/MedicineShopScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Dashboard" component={PatientDashboardScreen} />
      <Tab.Screen name="Shop" component={MedicineShopScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
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
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'HealthConnect' }}
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
          name="DoctorDashboard" 
          component={DoctorDashboardScreen}
          options={{ title: 'Doctor Dashboard' }}
        />
        <Stack.Screen 
          name="PatientDashboard" 
          component={PatientTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;