# Getting Started with OKN SafeRide Expo App

## Quick Start (5 minutes)

### 1. Install Node.js
If you don't have Node.js installed:
- Download from https://nodejs.org/ (v18 or higher)
- Install it

### 2. Install Dependencies
Open terminal in this folder and run:
```bash
npm install
```

### 3. Install Expo Go on Your Phone
- **iPhone**: Get it from the App Store
- **Android**: Get it from Google Play Store

Search for "Expo Go"

### 4. Start the App
```bash
npm start
```

### 5. Scan QR Code
- **iPhone**: Use Camera app, point at QR code
- **Android**: Open Expo Go, tap "Scan QR code"

That's it! The app should load on your phone! 🎉

---

## What Changed from Flutter?

This project was converted from Flutter to Expo/React Native:

### Technology Stack
- **Before**: Flutter (Dart language)
- **After**: React Native with Expo (TypeScript/JavaScript)

### Key Benefits
- ✅ Easier to share with friends (just scan QR code)
- ✅ Faster hot reload
- ✅ No need for Xcode/Android Studio for development
- ✅ Can test on any device with Expo Go app
- ✅ JavaScript/TypeScript ecosystem

### Same Features
All functionality preserved:
- ✅ Animated stripe stimulus
- ✅ 10-second test timer
- ✅ Progress ring
- ✅ OKN gain calculations (demo)
- ✅ Results display
- ✅ Safe ride suggestions

---

## Common Issues

### "npm: command not found"
Install Node.js from https://nodejs.org/

### "Can't connect to Metro"
Make sure your phone and computer are on the same WiFi network.

### Port already in use
```bash
npm start -- --port 8082
```

---

## Need Help?

1. Check [EXPO_SETUP.md](EXPO_SETUP.md) for detailed setup
2. Check [README.md](README.md) for full documentation
3. Visit https://docs.expo.dev for Expo documentation

---

## Project Structure

```
okn-saferide/
├── App.tsx                 # Main app (all code is here!)
├── app.json                # Expo config
├── package.json            # Dependencies
├── assets/                 # Images
├── GETTING_STARTED.md      # This file
├── EXPO_SETUP.md           # Detailed setup guide
└── README.md               # Full documentation
```

---

Happy coding! 🚗👁️

