# iOS Permissions Setup

## Add to ios/Runner/Info.plist

When you're ready to add camera and location features, you'll need to add these permissions to your `ios/Runner/Info.plist` file.

Open the file and add these entries **inside the `<dict>` tag** (before the closing `</dict>`):

```xml
<!-- Camera Permission -->
<key>NSCameraUsageDescription</key>
<string>Camera access is required for eye tracking and impairment detection</string>

<!-- Location Permission -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location access is needed to provide safe ride options and navigation</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Location access helps provide safe ride options when you need them</string>
```

## Full Info.plist Example Location

The entries should go here:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Existing keys like CFBundleName, CFBundleVersion, etc. -->
    
    <!-- ADD YOUR NEW PERMISSIONS HERE -->
    <key>NSCameraUsageDescription</key>
    <string>Camera access is required for eye tracking and impairment detection</string>
    
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>Location access is needed to provide safe ride options and navigation</string>
    
    <!-- Rest of the file -->
</dict>
</plist>
```

## When to Add These

- **Camera permission**: When you implement the camera/eye tracking feature
- **Location permission**: When you implement the map and ride-sharing features

The app will work without these permissions until you add those features.
