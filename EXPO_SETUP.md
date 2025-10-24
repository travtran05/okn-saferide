# Expo Setup Guide 🚀

Quick guide to get OKN SafeRide running with Expo Go.

## Prerequisites

### 1. Install Node.js
Download and install Node.js v18+ from https://nodejs.org/

Check installation:
```bash
node --version
npm --version
```

### 2. Install Expo Go App on Your Phone

**iOS**: https://apps.apple.com/app/expo-go/id982107779

**Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

---

## First Time Setup

### Step 1: Install Dependencies
```bash
cd okn-saferide
npm install
```

This will install:
- Expo SDK
- React Native
- React Native SVG (for animated stripes)
- TypeScript support
- All other dependencies

### Step 2: Start Development Server
```bash
npm start
```

You'll see:
- A QR code in the terminal
- A browser window with dev tools
- Options to run on iOS/Android

### Step 3: Open on Your Phone

#### iPhone:
1. Open **Camera app**
2. Point at the QR code
3. Tap the Expo Go notification
4. App loads! ✨

#### Android:
1. Open **Expo Go app**
2. Tap "Scan QR code"
3. Point at the QR code
4. App loads! ✨

---

## Development Workflow

### Starting the App
```bash
npm start
```

### Clearing Cache (if you have issues)
```bash
npm start -- --clear
```

### Running on Simulators

**iOS Simulator** (Mac only):
```bash
npm run ios
```

**Android Emulator**:
```bash
npm run android
```

---

## Making Changes

1. Edit `App.tsx`
2. Save the file
3. App automatically reloads on your phone! 🎉

That's the magic of Expo - instant hot reload!

---

## Troubleshooting

### "Can't connect to Metro"
- Ensure phone and computer are on the **same WiFi network**
- Try restarting: `npm start -- --clear`

### "Module not found"
```bash
rm -rf node_modules
npm install
npm start
```

### Port 8081 already in use
```bash
npm start -- --port 8082
```

### Expo Go won't load the app
- Check WiFi connection
- Make sure dev server is running
- Try closing and reopening Expo Go

---

## Building for Production

### Create a Standalone Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Publish Updates
```bash
eas update
```

---

## Sharing with Friends

### While Developing
1. Start server: `npm start`
2. Click "Share" button in Expo Dev Tools
3. Send link to friend
4. They open in Expo Go!

**Note**: Your dev server must be running, and you must be on the same network OR use tunnel mode:
```bash
npm start -- --tunnel
```

### Production Sharing
Use EAS Build to create standalone apps for TestFlight or Google Play.

---

## Project Structure

```
okn-saferide/
├── App.tsx              # Main app component
├── app.json             # Expo configuration
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── babel.config.js      # Babel config
├── assets/              # Images, icons
│   ├── icon.png         # App icon (1024x1024)
│   ├── splash.png       # Splash screen
│   └── ...
└── node_modules/        # Installed packages
```

---

## Next Steps

### Add Camera Functionality
```bash
npm install expo-camera
```

Then in App.tsx:
```typescript
import { Camera } from 'expo-camera';
const [permission, requestPermission] = Camera.useCameraPermissions();
```

### Add Location Services
```bash
npm install expo-location
```

### Add Deep Linking (for Uber, Lyft)
```bash
npm install expo-linking
```

---

## Useful Commands

```bash
# Start dev server
npm start

# Clear cache
npm start -- --clear

# Use tunnel (for remote testing)
npm start -- --tunnel

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Check for issues
npx expo-doctor
```

---

## Resources

- **Expo Docs**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **Expo Forums**: https://forums.expo.dev
- **Discord**: https://discord.gg/expo

---

Happy coding! 🎉

