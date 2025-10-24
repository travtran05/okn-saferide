# OKN SafeRide 🚗👁️

A React Native mobile app built with **Expo Go** for detecting impairment using **Optokinetic Nystagmus (OKN)** eye tracking and providing safe transportation options.

## ⚠️ Demo / Research Purpose Only
This app is for **demonstration and research purposes only**. It is not a medical device and should not be used to make real driving decisions.

---

## 🎯 What It Does

OKN SafeRide helps detect potential impairment by:

1. **Eye Tracking Test** - Uses moving visual stripes (optokinetic stimulus) while tracking eye movements
2. **OKN Gain Analysis** - Calculates the ratio of eye velocity to stimulus velocity
3. **Impairment Assessment** - Estimates likelihood of impairment based on OKN gain
4. **Safe Transportation** - Provides links to Uber, Lyft, taxis, and public transit if needed

### How OKN Works
- Normal OKN gain ≈ 1.0 (eyes track stimulus perfectly)
- Impaired individuals often show reduced gain (<0.75)
- The test runs for 10 seconds with moving vertical stripes

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Expo Go app** on your phone - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/okn-saferide.git
cd okn-saferide

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

### Running on Your Phone

1. **Start the dev server**: Run `npm start` in the project directory
2. **Open Expo Go** on your phone
3. **Scan the QR code** displayed in the terminal or browser
4. The app will load on your phone! 🎉

### Running on Simulator/Emulator

```bash
# iOS Simulator (Mac only)
npm run ios

# Android Emulator
npm run android
```

---

## 📋 Current Status

### ✅ Phase 1 (Complete) - Basic UI
- [x] App structure and navigation
- [x] Animated stripe stimulus
- [x] Progress ring and timer
- [x] Results display
- [x] Metrics cards
- [x] Safe ride suggestions UI

### 🔄 Phase 2 (Next) - Camera & Eye Tracking
- [ ] Camera access (expo-camera)
- [ ] Face detection
- [ ] Iris/pupil tracking
- [ ] Real-time eye position calculation
- [ ] OKN gain algorithm

### 📅 Phase 3 (Future) - Full Features
- [ ] Location services
- [ ] Map integration
- [ ] Deep links to ride apps
- [ ] Friend contact system
- [ ] Data persistence (AsyncStorage)
- [ ] Settings and calibration

---

## 🛠️ Development

### Project Structure

```
okn-saferide/
├── App.tsx                 # Main app code
├── assets/                 # Images and icons
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── README.md               # This file
```

### Adding Features

#### 1. Camera Access
```bash
npm install expo-camera
```

Then request permissions in App.tsx:
```typescript
import { Camera } from 'expo-camera';

const [permission, requestPermission] = Camera.useCameraPermissions();
```

#### 2. Location Services
```bash
npm install expo-location
```

#### 3. Opening External Apps
```bash
npm install expo-linking
```

Use `Linking.openURL()` to open Uber, Lyft, etc.

---

## 📱 Building for Production

### Create Production Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Publishing Updates (Over-the-Air)

```bash
eas update --branch production
```

---

## 🤝 Sharing with Friends

### Option 1: Expo Go (Easiest - No Build Required)
1. Start dev server: `npm start`
2. Send friend the QR code or link
3. They scan it with Expo Go app
4. ✅ App runs immediately!

**Limitations**: Only works while dev server is running, requires Expo Go app

### Option 2: Development Build (Better Experience)
1. Build a development app: `eas build --profile development`
2. Install the build on their phone
3. They can run it without Expo Go!

### Option 3: TestFlight / Play Store Internal Testing
1. Create production build: `eas build --platform ios/android`
2. Upload to TestFlight (iOS) or Internal Testing (Android)
3. Add friends as testers
4. ✅ Professional distribution!

---

## 🐛 Troubleshooting

### "Unable to connect to Metro"
- Make sure your phone and computer are on the same WiFi network
- Try restarting the dev server: `npm start --clear`

### "Error: expo-cli not found"
```bash
npm install -g expo-cli
```

### Camera not working
- Make sure you've added camera permissions to app.json:
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs camera access..."
      }
    }
  }
}
```

### Metro bundler cache issues
```bash
# Clear cache and restart
npm start -- --clear
# or
expo start -c
```

---

## 📚 Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Expo Go App**: [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **OKN Research**: [Various academic papers on optokinetic nystagmus]

---

## 🎨 Technologies Used

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe JavaScript
- **React Native SVG** - For animated stripe rendering
- **Expo Screen Orientation** - Lock portrait mode

---

## 📄 License

This is a demo/research project. Use at your own risk.

---

## 🎯 Roadmap

**v1.0** (Current)
- ✅ Basic UI
- ✅ Simulated test flow
- ✅ Results display
- ✅ Expo Go compatible

**v1.1** (Next)
- [ ] Real camera integration
- [ ] Basic eye detection

**v1.2** (Future)
- [ ] Full OKN algorithm
- [ ] Location services
- [ ] Ride integration

**v2.0** (Advanced)
- [ ] Machine learning improvements
- [ ] User accounts
- [ ] Historical data
- [ ] Advanced analytics

---

## ✨ Contributing

Found a bug? Want to add a feature? 
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 🚀 Why Expo?

- **Fast development**: Hot reload, instant updates
- **Easy sharing**: Friends can test via QR code
- **Cross-platform**: One codebase for iOS & Android
- **Rich ecosystem**: Camera, location, notifications built-in
- **Over-the-air updates**: Push updates without app store review

---

**Remember**: This is a demo app for research/educational purposes. Never use it to make actual driving decisions! 🚗🔬
