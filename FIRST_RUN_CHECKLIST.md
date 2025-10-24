# First Run Checklist ✅

Follow these steps **in order** to get your app running on iPhone for the first time.

---

## ☑️ Part 1: Install Tools (One Time)

### Step 1: Install Flutter
```bash
brew install --cask flutter
```
**Verify**: 
```bash
flutter --version
```
Should show Flutter version (e.g., Flutter 3.x.x)

---

### Step 2: Install VS Code Extensions
1. Open VS Code
2. Click Extensions icon (left sidebar) or press `Cmd+Shift+X`
3. Search and install:
   - ✅ **Flutter** (by Dart Code)
   - ✅ **Dart** (by Dart Code)

---

### Step 3: Install Xcode
1. Open **Mac App Store**
2. Search "Xcode"
3. Click **Install** (may take 30+ min, it's ~12GB)
4. After install, **open Xcode once** to accept license
5. Run these commands:
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

---

### Step 4: Install CocoaPods
```bash
sudo gem install cocoapods
```
**Verify**:
```bash
pod --version
```

---

### Step 5: Run Flutter Doctor
```bash
flutter doctor
```

**You should see**:
- ✅ Flutter
- ✅ Xcode
- ✅ VS Code

**Fix any ❌ errors shown**

---

## ☑️ Part 2: Create Project

### Step 6: Create Flutter Project
```bash
# Navigate to your projects folder
cd ~/Documents/Projects  # or wherever you keep projects

# Create the project
flutter create okn_saferide

# Enter the folder
cd okn_saferide
```

---

### Step 7: Replace Files
Replace these files with the ones I provided:

1. **lib/main.dart** → Replace entire content
2. **pubspec.yaml** → Replace entire content
3. Add these new files to project root:
   - **.gitignore**
   - **README.md**
   - **SETUP_GUIDE.md**
   - **IOS_PERMISSIONS.md**
   - **QUICK_REFERENCE.md**

---

### Step 8: Get Dependencies
```bash
flutter pub get
```

**You should see**: "Got dependencies!"

---

## ☑️ Part 3: iPhone Setup

### Step 9: Prepare Your iPhone
1. **Connect iPhone** to Mac with cable
2. **Unlock iPhone**
3. Tap **Trust** when prompted
4. Go to iPhone Settings:
   - **Settings > Privacy & Security > Developer Mode**
   - Toggle **ON**
   - **Restart iPhone** when prompted
5. After restart, confirm "Enable Developer Mode"

---

### Step 10: Configure Xcode Signing
```bash
# Open the iOS project in Xcode
open ios/Runner.xcworkspace
```

In Xcode:
1. Click **Runner** in left sidebar (top item)
2. Click **Signing & Capabilities** tab (top)
3. Check ✅ **Automatically manage signing**
4. Under **Team**, select your **Apple ID**
   - If no team shows, click "Add Account" and sign in
5. Change **Bundle Identifier** to something unique:
   - Example: `com.yourname.oknSaferide`

**Close Xcode** (you don't need it anymore!)

---

## ☑️ Part 4: First Run!

### Step 11: Check Device Connection
```bash
flutter devices
```

**You should see** your iPhone listed. Example:
```
iPhone 14 Pro (mobile) • 00001234-ABCD... • ios • iOS 17.0
```

---

### Step 12: Run the App! 🚀
```bash
flutter run
```

**What happens**:
1. App builds (takes 2-3 minutes first time)
2. Installs on iPhone
3. iPhone might show **"Untrusted Developer"** error

---

### Step 13: Trust Developer on iPhone (If needed)
If you see "Untrusted Developer" on iPhone:

1. Go to iPhone: **Settings**
2. Scroll to: **General**
3. Scroll to: **VPN & Device Management**
4. Under **Developer App**, tap your **Apple ID**
5. Tap **Trust "[Your Apple ID]"**
6. Tap **Trust** in popup

---

### Step 14: Run Again
```bash
flutter run
```

**SUCCESS!** 🎉 The app should now open on your iPhone!

---

## ☑️ Part 5: Make Changes & Hot Reload

### Step 15: Open Project in VS Code
```bash
# From your project folder
code .
```

---

### Step 16: Make a Change
1. Open **lib/main.dart**
2. Find line 51 (the app title):
```dart
title: const Text('OKN SafeRide'),
```
3. Change it to:
```dart
title: const Text('🚗 OKN SafeRide'),
```
4. **Save** the file (`Cmd+S`)

**The app updates instantly!** That's hot reload! 🔥

---

## ☑️ Part 6: Git Setup (Optional but Recommended)

### Step 17: Initialize Git
```bash
git init
git add .
git commit -m "Initial commit: Basic OKN SafeRide app"
```

---

### Step 18: Create GitHub Repo
1. Go to https://github.com/new
2. Name: `okn-saferide`
3. Don't initialize with README
4. Click **Create repository**

---

### Step 19: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/okn-saferide.git
git branch -M main
git push -u origin main
```

**Now your code is online!** 🌐

---

## 🎯 You're Done!

### What You Have Now:
- ✅ Working Flutter app on your iPhone
- ✅ Development environment set up
- ✅ Hot reload working (instant updates)
- ✅ Git repository (optional)

### What's Next:
1. **Test features**: Press START TEST in the app
2. **Add features**: Follow feature guides when ready
3. **Share with friend**: Send them your GitHub link

---

## 🆘 If Something Goes Wrong

### App won't install?
```bash
flutter clean
flutter pub get
flutter run
```

### iPhone not showing in devices?
- Check cable connection
- Make sure iPhone is unlocked
- Try: `flutter devices`

### Code signing error?
- Open `ios/Runner.xcworkspace` in Xcode
- Re-select your Team in Signing

### Still stuck?
- Run: `flutter doctor -v`
- Check SETUP_GUIDE.md
- See QUICK_REFERENCE.md

---

**Congratulations!** You're now a mobile app developer! 🎊
