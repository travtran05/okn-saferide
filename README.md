# OKN SafeRide 🚗👁️

A Flutter mobile app for detecting impairment using **Optokinetic Nystagmus (OKN)** eye tracking and providing safe transportation options.

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

### For Development:
```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/okn-saferide.git
cd okn-saferide

# 2. Install dependencies
flutter pub get

# 3. Run on your device
flutter run
```

### For Your Friend (to test on their iPhone):
1. **Share this repo**: Send them the GitHub link
2. **They clone it**: `git clone https://github.com/YOUR_USERNAME/okn-saferide.git`
3. **They follow setup**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
4. **Run on their device**: Connect iPhone and run `flutter run`

---

## 📋 Current Status

### ✅ Phase 1 (Complete) - Basic UI
- [x] App structure and navigation
- [x] Animated stripe stimulus (basic)
- [x] Progress ring and timer
- [x] Results display
- [x] Metrics cards
- [x] Safe ride suggestions UI

### 🔄 Phase 2 (Next) - Camera & Eye Tracking
- [ ] Camera access
- [ ] Face detection (ML Kit)
- [ ] Iris/pupil tracking
- [ ] Real-time eye position calculation
- [ ] OKN gain algorithm

### 📅 Phase 3 (Future) - Full Features
- [ ] Location services
- [ ] Map integration
- [ ] Deep links to ride apps
- [ ] Friend contact system
- [ ] Data persistence
- [ ] Settings and calibration

---

## 🛠️ Development Setup

**Full setup instructions**: [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Quick checklist**:
- ✅ Flutter SDK installed
- ✅ VS Code with Flutter extension
- ✅ Xcode installed (for iOS)
- ✅ iPhone in Developer Mode
- ✅ Apple ID configured in Xcode

---

## 📱 Testing on iPhone

### First Time Setup:
1. **Connect iPhone** via USB
2. **Trust computer** on iPhone
3. **Enable Developer Mode**: Settings > Privacy & Security > Developer Mode
4. **Run app**: `flutter run` or press F5 in VS Code
5. **Trust developer**: Settings > General > Device Management > Trust your Apple ID

### Every Time After:
Just run `flutter run` - that's it! ✨

---

## 📦 Project Structure

```
okn-saferide/
├── lib/
│   └── main.dart           # Main app code
├── ios/                    # iOS-specific files
├── android/                # Android-specific files (future)
├── pubspec.yaml            # Dependencies
├── SETUP_GUIDE.md          # Detailed setup instructions
├── IOS_PERMISSIONS.md      # iOS permission configuration
└── README.md               # This file
```

---

## 🔧 Adding Features

The app is designed for **incremental development**. Here's the recommended order:

### 1. Camera Access
```yaml
# Add to pubspec.yaml
dependencies:
  camera: ^0.10.5+5
```

### 2. Face/Eye Detection
```yaml
# Add to pubspec.yaml
dependencies:
  google_ml_kit: ^0.16.3
```

### 3. Location Services
```yaml
# Add to pubspec.yaml
dependencies:
  geolocator: ^10.1.0
  url_launcher: ^6.2.1
```

After adding each dependency:
```bash
flutter pub get
flutter run
```

---

## 🤝 Sharing with Friends

### Option 1: Git Clone (Easiest for developers)
They need Flutter installed, then:
```bash
git clone https://github.com/YOUR_USERNAME/okn-saferide.git
cd okn-saferide
flutter pub get
flutter run
```

### Option 2: TestFlight (Best for non-developers)
- Requires Apple Developer account ($99/year)
- Build and upload to App Store Connect
- Add friends as testers

### Option 3: Direct Install (Free, short-term)
- Friend needs Xcode
- Install via their Apple ID
- App expires after 7 days (free account) or 1 year (paid)

---

## 🐛 Troubleshooting

### "No devices found"
```bash
flutter devices
# Make sure your iPhone shows up
```

### "Code signing error"
1. Open `ios/Runner.xcworkspace` in Xcode
2. Select Runner > Signing & Capabilities
3. Choose your Team (Apple ID)

### "Pod install failed"
```bash
cd ios
pod install
cd ..
flutter clean
flutter run
```

### Camera permission not working
- Add permissions to `ios/Runner/Info.plist` (see [IOS_PERMISSIONS.md](IOS_PERMISSIONS.md))

---

## 📚 Resources

- **Flutter Docs**: https://docs.flutter.dev
- **ML Kit**: https://developers.google.com/ml-kit
- **OKN Research**: [Various academic papers on optokinetic nystagmus]

---

## 📄 License

This is a demo/research project. Use at your own risk.

---

## 🎯 Roadmap

**v1.0** (Current)
- Basic UI
- Simulated test flow
- Results display

**v1.1** (Next)
- Real camera integration
- Basic eye detection

**v1.2** (Future)
- Full OKN algorithm
- Location services
- Ride integration

**v2.0** (Advanced)
- Machine learning improvements
- User accounts
- Historical data
- Advanced analytics

---

## ✨ Contributing

Found a bug? Want to add a feature? 
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Remember**: This is a demo app for research/educational purposes. Never use it to make actual driving decisions! 🚗🔬
