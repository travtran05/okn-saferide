# Quick Reference Card 📝

## Essential Commands

### First Time Setup
```bash
# Create Flutter project
flutter create okn_saferide
cd okn_saferide

# Copy the provided files:
# - Replace lib/main.dart
# - Replace pubspec.yaml
# - Copy .gitignore, README.md, etc.

# Get dependencies
flutter pub get

# Check if everything works
flutter doctor
```

### Daily Development
```bash
# See connected devices
flutter devices

# Run app (select device if multiple)
flutter run

# Run with hot reload enabled (default)
flutter run

# Run in release mode (faster)
flutter run --release

# Clean build cache
flutter clean
```

### While App is Running
```
r     - Hot reload (instant updates)
R     - Hot restart (full restart)
q     - Quit
```

### Git Workflow
```bash
# First time
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/okn-saferide.git
git push -u origin main

# Regular updates
git add .
git commit -m "Description of changes"
git push

# Pull friend's changes
git pull
```

### Testing & Quality
```bash
# Check for issues
flutter analyze

# Format code
flutter format lib/

# Run tests
flutter test
```

### iPhone Deployment
```bash
# List iOS devices
flutter devices

# Run on specific device
flutter run -d [device-id]

# Build for iOS
flutter build ios

# Open Xcode
open ios/Runner.xcworkspace
```

### Debugging
```bash
# See detailed logs
flutter run -v

# Clear everything and rebuild
flutter clean
flutter pub get
flutter run

# Fix iOS build issues
cd ios
pod deintegrate
pod install
cd ..
```

### Adding Dependencies
```bash
# 1. Add to pubspec.yaml under dependencies:
#    package_name: ^version

# 2. Get the package
flutter pub get

# 3. Import in your Dart file
#    import 'package:package_name/package_name.dart';
```

### Common Packages You'll Need

#### Camera
```yaml
dependencies:
  camera: ^0.10.5+5
```
```dart
import 'package:camera/camera.dart';
```

#### ML Kit (Face Detection)
```yaml
dependencies:
  google_ml_kit: ^0.16.3
```
```dart
import 'package:google_ml_kit/google_ml_kit.dart';
```

#### Location
```yaml
dependencies:
  geolocator: ^10.1.0
```
```dart
import 'package:geolocator/geolocator.dart';
```

#### URL Launcher (Open maps, phone)
```yaml
dependencies:
  url_launcher: ^6.2.1
```
```dart
import 'package:url_launcher/url_launcher.dart';
```

### VS Code Shortcuts
```
F5              - Start debugging
Shift + F5      - Stop debugging
Cmd + Shift + P - Command palette
Cmd + .         - Quick fix
```

### Xcode Shortcuts
```
Cmd + B         - Build
Cmd + R         - Run
Cmd + .         - Stop
Cmd + Shift + K - Clean build folder
```

### File Structure
```
okn-saferide/
├── lib/
│   ├── main.dart          # Your main app
│   ├── screens/           # Create for new screens
│   ├── widgets/           # Create for reusable widgets
│   └── services/          # Create for camera, location services
├── ios/
│   └── Runner/
│       └── Info.plist     # Add permissions here
├── pubspec.yaml           # Dependencies
└── .gitignore             # Git ignore rules
```

### Common Issues & Fixes

#### "No devices found"
```bash
flutter devices
# Ensure phone is connected and unlocked
```

#### "Build failed"
```bash
flutter clean
flutter pub get
flutter run
```

#### "Pod install failed" (iOS)
```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..
```

#### "Code signing error"
1. Open `ios/Runner.xcworkspace` in Xcode
2. Runner > Signing & Capabilities
3. Select your Team

#### "Permission denied"
- Add to `ios/Runner/Info.plist`
- See IOS_PERMISSIONS.md

### Performance Tips
```bash
# Profile mode (test performance)
flutter run --profile

# Release mode (fastest)
flutter run --release

# Check app size
flutter build ios --analyze-size
```

### Useful Resources
- Flutter docs: https://docs.flutter.dev
- Flutter packages: https://pub.dev
- Flutter Discord: https://discord.gg/N7Yshp4
- Stack Overflow: Tag `flutter`

---

## Your Next Steps

1. ✅ **Setup**: Follow SETUP_GUIDE.md
2. ✅ **Run**: Get the basic app running
3. 🔄 **Add Camera**: Implement camera feature
4. 🔄 **Add Eye Tracking**: Implement ML Kit face detection
5. 🔄 **Add Location**: Implement map and location
6. 🔄 **Polish**: Improve UI and add features

---

**Pro Tip**: Keep this file open while developing! 💡
