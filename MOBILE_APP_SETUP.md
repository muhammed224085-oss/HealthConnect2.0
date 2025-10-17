# HealthConnect Mobile App

## Overview
This directory contains the React Native mobile application for HealthConnect.

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- React Native CLI
- For iOS: Xcode (Mac only)
- For Android: Android Studio

## Quick Start

### 1. Install React Native CLI
```bash
npm install -g react-native-cli
```

### 2. Create React Native Project
```bash
npx react-native init HealthConnectMobile
cd HealthConnectMobile
```

### 3. Install Dependencies
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install axios
npm install react-native-qrcode-svg
npm install react-native-svg
```

### 4. For iOS (Mac only)
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

### 5. For Android
```bash
npx react-native run-android
```

## Project Structure
```
HealthConnectMobile/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── DoctorLoginScreen.js
│   │   ├── PatientLoginScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── MedicineShopScreen.js
│   │   └── OrdersScreen.js
│   ├── components/
│   │   ├── Header.js
│   │   ├── Button.js
│   │   └── Card.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── services/
│   │   └── api.js
│   └── utils/
│       └── constants.js
├── App.js
└── package.json
```

## API Configuration
Update the API base URL in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://YOUR_SERVER_IP:8080/api';
```

## Building for Production

### Android APK
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

### iOS IPA (Mac only)
1. Open `ios/HealthConnectMobile.xcworkspace` in Xcode
2. Select Product > Archive
3. Follow the distribution wizard

## Features
- ✅ User Authentication (Doctor/Patient)
- ✅ Doctor Appointment Booking
- ✅ Medicine Shopping
- ✅ Order Tracking
- ✅ Real-time Chat
- ✅ Push Notifications (optional)
- ✅ Offline Support

## Troubleshooting

### Metro Bundler Issues
```bash
npx react-native start --reset-cache
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
```

### iOS Build Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

## Publishing

### Google Play Store
1. Create a Google Play Developer account
2. Prepare app assets (screenshots, descriptions)
3. Upload the APK/AAB file
4. Submit for review

### Apple App Store
1. Create an Apple Developer account
2. Prepare app assets
3. Upload via Xcode or App Store Connect
4. Submit for review

## Resources
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Publishing to Play Store](https://reactnative.dev/docs/signed-apk-android)
- [Publishing to App Store](https://reactnative.dev/docs/publishing-to-app-store)