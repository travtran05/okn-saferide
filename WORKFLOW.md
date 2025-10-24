# Project Workflow & Structure 📊

## Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR DEVELOPMENT SETUP                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────┐
        │      1. Write Code in VS Code       │
        │     (lib/main.dart, etc.)          │
        └────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────┐
        │    2. Save File (Auto Hot Reload)   │
        │       Changes appear instantly      │
        └────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────┐
        │     3. Test on Your iPhone          │
        │    Connected via USB cable          │
        └────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────┐
        │   4. Commit to Git & Push to        │
        │          GitHub Repo                │
        └────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────┐
        │  5. Friend Clones Repo & Runs       │
        │      on Their iPhone                │
        └────────────────────────────────────┘
```

---

## Project File Structure

```
okn-saferide/                         # Your project folder
│
├── 📄 README.md                      # Project overview
├── 📄 SETUP_GUIDE.md                 # Detailed setup instructions
├── 📄 FIRST_RUN_CHECKLIST.md         # Step-by-step first run
├── 📄 QUICK_REFERENCE.md             # Command cheat sheet
├── 📄 IOS_PERMISSIONS.md             # iOS permission setup
├── 📄 .gitignore                     # Git ignore rules
│
├── 📄 pubspec.yaml                   # Dependencies & config
│
├── 📁 lib/                           # Your Dart code
│   ├── main.dart                     # Main app entry point
│   ├── screens/                      # (create later) Different screens
│   ├── widgets/                      # (create later) Reusable widgets
│   └── services/                     # (create later) Camera, location, etc.
│
├── 📁 ios/                           # iOS-specific files
│   ├── Runner.xcworkspace            # Open this in Xcode
│   └── Runner/
│       └── Info.plist                # Add permissions here
│
├── 📁 android/                       # Android files (future)
│
├── 📁 assets/                        # (create later) Images, icons
│
└── 📁 test/                          # Unit tests (future)
```

---

## Git Workflow

```
┌──────────────┐
│  Local Mac   │
│  (Your Code) │
└──────┬───────┘
       │
       │ git add .
       │ git commit
       │ git push
       │
       ▼
┌──────────────┐
│   GitHub     │
│  (Online)    │
└──────┬───────┘
       │
       │ git clone / git pull
       │
       ▼
┌──────────────┐
│ Friend's Mac │
│ (Their Copy) │
└──────────────┘
```

---

## Feature Development Roadmap

```
Phase 1: Basic UI (CURRENT)
├── ✅ App structure
├── ✅ Animated stripes
├── ✅ Progress indicator
├── ✅ Results display
└── ✅ Safe ride UI

Phase 2: Camera & Tracking (NEXT)
├── ⬜ Camera access
├── ⬜ Face detection
├── ⬜ Iris tracking
├── ⬜ Eye position calculation
└── ⬜ Real OKN algorithm

Phase 3: Location & Integration
├── ⬜ GPS location
├── ⬜ Map display
├── ⬜ Uber/Lyft deep links
├── ⬜ Friend contacts
└── ⬜ Home location

Phase 4: Polish & Advanced
├── ⬜ Settings screen
├── ⬜ Calibration
├── ⬜ Data persistence
├── ⬜ History tracking
└── ⬜ Export results
```

---

## Dependencies Timeline

```
NOW (Phase 1)
└── No external dependencies needed
    Basic Flutter only

PHASE 2 (Camera)
├── camera: ^0.10.5+5
└── google_ml_kit: ^0.16.3

PHASE 3 (Location)
├── geolocator: ^10.1.0
├── url_launcher: ^6.2.1
└── flutter_map or google_maps

PHASE 4 (Polish)
├── shared_preferences
├── sqflite (database)
└── provider or riverpod (state management)
```

---

## Development Cycle

```
     ┌─────────────┐
     │   Develop   │ ← Write code in VS Code
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │    Test     │ ← Hot reload on iPhone
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │  Commit     │ ← Save to Git
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │   Push      │ ← Upload to GitHub
     └──────┬──────┘
            │
            ▼
     ┌─────────────┐
     │   Deploy    │ ← Friend pulls & runs
     └─────────────┘
```

---

## iPhone Deployment Methods

```
METHOD 1: Development (What you're doing now)
┌─────────────────────────────────────┐
│ ✅ Free                              │
│ ✅ Instant updates                   │
│ ⚠️  App expires after 7 days         │
│ ⚠️  Requires cable connection        │
│ 👥 You + close friends with Xcode    │
└─────────────────────────────────────┘

METHOD 2: TestFlight (Future)
┌─────────────────────────────────────┐
│ 💰 $99/year Apple Developer          │
│ ✅ Up to 100 testers                 │
│ ✅ Over-the-air updates              │
│ ✅ No expiration                     │
│ 👥 Anyone you invite                 │
└─────────────────────────────────────┘

METHOD 3: App Store (Future)
┌─────────────────────────────────────┐
│ 💰 $99/year Apple Developer          │
│ ✅ Public availability               │
│ ✅ Official distribution             │
│ ⏰ Review process (1-3 days)         │
│ 👥 Everyone                          │
└─────────────────────────────────────┘
```

---

## Data Flow (Future - with camera)

```
📱 iPhone Camera
       │
       ▼
🎥 Camera Stream
       │
       ▼
👁️ Face Detection (ML Kit)
       │
       ▼
🔵 Iris Position
       │
       ▼
📊 OKN Gain Calculation
       │
       ▼
✅ Impairment Assessment
       │
       ▼
🚗 Safe Ride Options (if needed)
```

---

## Key Files You'll Edit

```
MOST EDITED
├── lib/main.dart              # 90% of your time here
│
SOMETIMES EDITED
├── pubspec.yaml               # Adding dependencies
├── ios/Runner/Info.plist      # Adding permissions
│
RARELY EDITED
└── ios/Runner.xcworkspace     # Only for signing issues
```

---

## Quick Decision Tree

```
Want to...

Add a feature?
└─▶ Edit lib/main.dart
    └─▶ Save & hot reload

Add a package?
└─▶ Edit pubspec.yaml
    └─▶ Run: flutter pub get

Fix iOS build error?
└─▶ flutter clean
    └─▶ flutter run

Share with friend?
└─▶ git push
    └─▶ Friend: git clone / git pull

Deploy permanently?
└─▶ Get Apple Developer account
    └─▶ Use TestFlight
```

---

## Collaboration Workflow

```
YOU                          FRIEND
│                            │
│ 1. Write feature           │
│ 2. git push                │
│                            │
├────────────▶ GitHub ◀──────┤
│                            │
│                            │ 3. git pull
│                            │ 4. flutter run
│                            │ 5. Test on their iPhone
│                            │
│ 6. They find bug           │
│                            │ 7. git push fix
│                            │
├────────────▶ GitHub ◀──────┤
│                            │
│ 8. git pull                │
│ 9. Continue dev            │
```

---

## Remember

- 💾 **Save often** - Hot reload is instant
- 🔄 **Commit regularly** - Small commits are better
- 📱 **Test on device** - Simulator can't access camera
- 📚 **Read docs** - Flutter docs are excellent
- 🆘 **Google errors** - Stack Overflow is your friend
- 🎯 **Start small** - Add features incrementally

---

**You got this!** 🚀
