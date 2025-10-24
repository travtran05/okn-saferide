# OKN SafeRide - Flutter Setup Guide

## Prerequisites Installation

### 1. Install Flutter SDK
```bash
# macOS (using Homebrew)
brew install --cask flutter

# Or download from: https://docs.flutter.dev/get-started/install
```

### 2. Install VS Code Extensions
Open VS Code and install:
- **Flutter** (by Dart Code)
- **Dart** (by Dart Code)

### 3. Install Xcode (for iPhone deployment)
- Download from Mac App Store
- Open Xcode once to accept license agreements
- Install Command Line Tools:
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

### 4. Install CocoaPods (iOS dependencies)
```bash
sudo gem install cocoapods
```

### 5. Verify Flutter Installation
```bash
flutter doctor
```
Fix any issues shown in red.

---

## Project Setup

### Step 1: Create Flutter Project
```bash
cd /path/to/your/projects
flutter create okn_saferide
cd okn_saferide
```

### Step 2: Replace main.dart
Replace the content in `lib/main.dart` with the provided Flutter code.

### Step 3: Update pubspec.yaml
Replace `pubspec.yaml` with the provided configuration file.

### Step 4: Get Dependencies
```bash
flutter pub get
```

---

## Git Repository Setup

### Step 1: Initialize Git
```bash
git init
git add .
git commit -m "Initial commit: OKN SafeRide Flutter app"
```

### Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository named `okn-saferide`
3. **Don't** initialize with README

### Step 3: Connect and Push
```bash
git remote add origin https://github.com/YOUR_USERNAME/okn-saferide.git
git branch -M main
git push -u origin main
```

### Step 4: Share with Friend
Send your friend:
- Repository URL: `https://github.com/YOUR_USERNAME/okn-saferide`
- They can clone: `git clone https://github.com/YOUR_USERNAME/okn-saferide.git`

---

## iPhone Deployment

### Step 1: Connect Your iPhone
1. Connect iPhone via USB
2. Trust the computer on iPhone when prompted
3. Enable Developer Mode on iPhone:
   - Settings > Privacy & Security > Developer Mode > ON
   - Restart iPhone

### Step 2: Open iOS Project in Xcode
```bash
open ios/Runner.xcworkspace
```

### Step 3: Configure Signing
1. Select **Runner** in the project navigator
2. Select **Signing & Capabilities** tab
3. Check **Automatically manage signing**
4. Select your **Team** (Apple ID)
5. Change **Bundle Identifier** to something unique:
   - Example: `com.yourname.oknSaferide`

### Step 4: Deploy to iPhone
In VS Code:
1. Open Command Palette: `Cmd + Shift + P`
2. Type "Flutter: Select Device"
3. Choose your iPhone
4. Press **F5** or click "Run > Start Debugging"

Or via terminal:
```bash
flutter run
```

### Step 5: Trust Developer on iPhone
First time running:
1. iPhone will show "Untrusted Developer"
2. Go to: Settings > General > VPN & Device Management
3. Trust your Apple ID
4. Run app again

---

## Development Workflow

### Run in Development Mode
```bash
flutter run
# or press F5 in VS Code
```

### Hot Reload (while app is running)
- Press `r` in terminal
- Or save file in VS Code (auto hot reload)

### Hot Restart
- Press `R` in terminal

### Check for Issues
```bash
flutter analyze
```

### Format Code
```bash
flutter format lib/
```

---

## Sharing Development Build with Friend

### Option 1: TestFlight (Recommended for iOS)
1. Enroll in Apple Developer Program ($99/year)
2. Archive app in Xcode
3. Upload to App Store Connect
4. Add friend as tester in TestFlight

### Option 2: Direct Installation (Free, Temporary)
Your friend needs:
1. Clone the git repo
2. Follow setup steps above
3. Connect their iPhone
4. Run with their own Apple ID

### Option 3: Ad Hoc Distribution
1. Register friend's device UDID in Apple Developer
2. Create Ad Hoc provisioning profile
3. Build IPA and share
4. Install via Xcode or configurator

---

## Common Commands Reference

```bash
# Create new Flutter project
flutter create project_name

# Run on connected device
flutter run

# Build release APK (Android)
flutter build apk

# Build release iOS
flutter build ios

# Clean build files
flutter clean

# Update dependencies
flutter pub get

# Run tests
flutter test

# Check app performance
flutter run --profile
```

---

## Troubleshooting

### "No devices found"
- Ensure iPhone is connected and unlocked
- Run: `flutter devices`
- Check USB cable and trust settings

### "Code signature invalid"
- Clean build: `flutter clean`
- Delete derived data in Xcode
- Re-sign in Xcode

### "Pod install failed"
```bash
cd ios
pod deintegrate
pod install
cd ..
flutter clean
flutter run
```

### Permission Issues
Add to `ios/Runner/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Camera needed for impairment detection</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location needed for safe ride options</string>
```

---

## Next Steps

1. ✅ Set up development environment
2. ✅ Create Flutter project
3. ✅ Initialize Git repository
4. ✅ Deploy to iPhone
5. 🔄 Add features incrementally:
   - Camera integration
   - Face/eye tracking (ML Kit)
   - OKN stimulus rendering
   - Gain calculation
   - Location services
   - Ride-sharing integration

---

## Resources

- Flutter Docs: https://docs.flutter.dev
- VS Code Flutter: https://docs.flutter.dev/development/tools/vs-code
- iOS Deployment: https://docs.flutter.dev/deployment/ios
- Git Basics: https://git-scm.com/doc
