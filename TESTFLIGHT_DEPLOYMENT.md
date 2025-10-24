# TestFlight Deployment Guide

This guide will help you deploy **Fashion Muse Studio** to TestFlight for iOS beta testing.

## Prerequisites

Before you begin, ensure you have:

1. ✅ **Apple Developer Account** ($99/year)
   - Sign up at [developer.apple.com](https://developer.apple.com)

2. ✅ **Expo Account** (Free)
   - Create at [expo.dev](https://expo.dev)

3. ✅ **macOS Computer** (required for iOS builds)

4. ✅ **Xcode Installed** (from Mac App Store)

5. ✅ **EAS CLI Installed**
   ```bash
   npm install -g eas-cli
   ```

## Step 1: Configure Apple Developer Account

### 1.1 Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **"My Apps"** → **"+"** → **"New App"**
3. Fill in details:
   - **Platform**: iOS
   - **Name**: Fashion Muse Studio
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: Create new → `app.rork.fashionmusestudio` (or use existing from app.json)
   - **SKU**: `fashion-muse-studio-v1`
   - **User Access**: Full Access

4. **Important**: Note your **App ID** - you'll need this later

### 1.2 Get Your Apple Team ID

1. Go to [Apple Developer Membership](https://developer.apple.com/account/#!/membership/)
2. Copy your **Team ID** (10-character code)
3. Save it - you'll need this for eas.json

## Step 2: Configure EAS Build

### 2.1 Login to Expo

```bash
eas login
```

Enter your Expo account credentials.

### 2.2 Update eas.json Configuration

Open `eas.json` and update the `submit.production.ios` section with your Apple details:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",     // Your Apple ID email
        "ascAppId": "1234567890",                    // App Store Connect App ID
        "appleTeamId": "ABCD123456"                  // Your Apple Team ID
      }
    }
  }
}
```

### 2.3 Update app.json (Optional)

Update the app name and bundle identifier if needed:

```json
{
  "expo": {
    "name": "Fashion Muse Studio",
    "ios": {
      "bundleIdentifier": "app.rork.fashionmusestudio"
    }
  }
}
```

## Step 3: Build for TestFlight

### 3.1 Start the Build

Run the EAS build command for TestFlight:

```bash
eas build --platform ios --profile testflight
```

**This will:**
- Generate iOS signing credentials (if needed)
- Build the .ipa file on Expo's cloud servers
- Take approximately 10-20 minutes

### 3.2 Handle Signing Credentials

When prompted:

1. **"Generate a new Apple Distribution Certificate?"** → Yes
2. **"Generate a new Apple Provisioning Profile?"** → Yes
3. **"Set up Push Notifications?"** → No (unless you need them)

EAS will handle all certificate generation automatically.

### 3.3 Monitor Build Progress

- Build progress will be shown in the terminal
- You can also monitor at: https://expo.dev/accounts/YOUR_USERNAME/projects/YOUR_PROJECT/builds

## Step 4: Submit to TestFlight

### Option A: Auto-Submit (Recommended)

After build completes, submit to TestFlight:

```bash
eas submit --platform ios --latest
```

**This will:**
- Upload the .ipa to App Store Connect
- Register the build with TestFlight
- Process the build (takes 5-15 minutes)

### Option B: Manual Upload

1. Download the .ipa file from the build page
2. Open **Transporter** app (Mac App Store)
3. Sign in with your Apple ID
4. Drag and drop the .ipa file
5. Click **"Deliver"**

## Step 5: Configure TestFlight

### 5.1 Add Build Information

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app → **TestFlight** tab
3. Wait for build to process (status shows "Processing" then "Ready to Submit")
4. Click on the build number

### 5.2 Fill Required Information

Complete these fields:

1. **What to Test**:
   ```
   Initial beta release of Fashion Muse Studio.

   Key features to test:
   - Image upload and selection
   - AI-powered fashion photoshoot generation
   - Portrait format image output (3:4 ratio)
   - Results viewing and saving
   - Generation history
   - Credit system

   Please report any bugs or issues you encounter.
   ```

2. **Test Details** (if required):
   - Description of test objectives
   - Known issues (if any)

3. **Export Compliance**:
   - If your app uses encryption: Select **"Yes"**
   - If using standard HTTPS only: Select **"No"**

### 5.3 Add Testers

#### Internal Testing (Apple Developer Team Members):

1. Go to **TestFlight** → **Internal Testing**
2. Click **"+"** next to Internal Testers
3. Add team members by email
4. They'll receive an invite email

#### External Testing (Public Beta Testers):

1. Go to **TestFlight** → **External Testing**
2. Create a new group (e.g., "Beta Testers")
3. Add the build to the group
4. **Note**: External testing requires App Review (1-2 days)
5. Add testers:
   - Email addresses (manual)
   - Public link (anyone with link can join)

### 5.4 Distribute Build

1. Select your tester group
2. Click **"Add Build to Test"**
3. Select the build version
4. Click **"Submit for Testing"** (for external) or **"Start Testing"** (for internal)

## Step 6: Testers Install the App

### For Testers:

1. **Install TestFlight** app from App Store
2. **Check email** for TestFlight invite
3. **Tap "View in TestFlight"** or "Start Testing"
4. **Install** the app from TestFlight
5. **Test** and provide feedback

### Public Link Testing:

If using public link:
1. Share the public link: `https://testflight.apple.com/join/YOUR_CODE`
2. Testers open link on iOS device
3. They install TestFlight (if not already installed)
4. App installs automatically

## Troubleshooting

### Build Failed

**Error: "Invalid Bundle Identifier"**
- Solution: Ensure bundle ID in app.json matches App Store Connect
- Run: `eas build:configure`

**Error: "Provisioning Profile doesn't include signing certificate"**
- Solution: Revoke and regenerate credentials
- Run: `eas credentials`

### TestFlight Issues

**Build Stuck "Processing"**
- This is normal - can take 5-30 minutes
- Check App Store Connect notifications for any issues

**"Missing Export Compliance"**
- You must answer export compliance questions
- Go to App Store Connect → TestFlight → Build → Export Compliance

**"Build Expired"**
- TestFlight builds expire after 90 days
- Create a new build before expiration

## Updating the App

### To Release a New Version:

1. **Update version** in app.json:
   ```json
   {
     "expo": {
       "version": "1.0.1"
     }
   }
   ```

2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Version 1.0.1: Bug fixes and improvements"
   git push
   ```

3. **Build new version**:
   ```bash
   eas build --platform ios --profile testflight
   ```

4. **Submit to TestFlight**:
   ```bash
   eas submit --platform ios --latest
   ```

5. **Add to TestFlight** in App Store Connect

## Best Practices

### Before Each Release:

- ✅ Test thoroughly on simulator and physical device
- ✅ Clear console of any errors or warnings
- ✅ Update version number in app.json
- ✅ Write clear "What to Test" notes
- ✅ Commit all code to git before building

### TestFlight Tips:

- **Internal testing**: No review required, instant distribution
- **External testing**: Requires Apple review (1-2 days)
- **Build expiration**: Builds last 90 days
- **Tester limit**: 10,000 external testers max
- **Feedback**: Testers can send screenshots and feedback via TestFlight

## Quick Reference Commands

```bash
# Login to EAS
eas login

# Configure EAS project
eas build:configure

# Build for TestFlight
eas build --platform ios --profile testflight

# Submit to TestFlight
eas submit --platform ios --latest

# Check build status
eas build:list

# View credentials
eas credentials

# Create production build (for App Store)
eas build --platform ios --profile production
```

## Next Steps After TestFlight

Once testing is complete and you're ready for the App Store:

1. Create production build:
   ```bash
   eas build --platform ios --profile production
   ```

2. Submit for App Review:
   - Fill in App Store listing (screenshots, description, etc.)
   - Submit for review in App Store Connect
   - Review takes 1-3 days typically

## Support

- **Expo EAS Docs**: https://docs.expo.dev/build/introduction/
- **TestFlight Guide**: https://developer.apple.com/testflight/
- **App Store Connect**: https://appstoreconnect.apple.com

## Current App Details

- **App Name**: Fashion Muse Studio
- **Bundle ID**: `app.rork.liquid-glass-fashion-app-q7e9uo5m-ne13q4mt-86oegyng-z34avf6w-j4dba864`
- **Version**: 1.0.0
- **Expo SDK**: 53
- **React Native**: 0.79.6

---

**Good luck with your TestFlight deployment! 🚀**
