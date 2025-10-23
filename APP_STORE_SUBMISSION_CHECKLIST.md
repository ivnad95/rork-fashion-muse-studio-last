# iOS App Store Submission Checklist

**App:** Fashion Muse Studio v1.0.0
**Date:** 2025-10-23
**Target:** iOS App Store Initial Release

---

## CRITICAL (Must Complete Before Submission)

### Legal Documents
- [ ] **Privacy Policy** - Host PRIVACY_POLICY.md on public URL
- [ ] **Terms of Service** - Host TERMS_OF_SERVICE.md on public URL
- [ ] **Update Settings URLs** - Update URLs in app/(tabs)/settings.tsx (lines 474, 491)
- [ ] **Add to App Store Connect** - Privacy Policy URL in app metadata

### Apple Configuration
- [ ] **Create App** in App Store Connect
- [ ] **Update eas.json** with real Apple credentials:
  - Apple ID email
  - App Store Connect App ID
  - Apple Team ID
- [ ] **Generate Certificates** - Distribution certificate and provisioning profile

### App Assets
- [ ] **Screenshots** - Create for 6.7", 6.5", 5.5" devices (3-10 each)
- [ ] **App Icon** - Verify 1024x1024 icon is correct
- [ ] **App Description** - Copy from APP_STORE_METADATA.md
- [ ] **Keywords** - fashion,photo,AI,photoshoot,model,photography,editor,beauty,style,portrait,filter,professional
- [ ] **Support URL** - Set up support page and add URL

---

## HIGH PRIORITY (Strongly Recommended)

### Testing
- [ ] **Device Testing**
  - [ ] iPhone SE (smallest screen)
  - [ ] iPhone 15 or 14 Pro Max (largest screen)
  - [ ] iPad (if supporting tablets)
- [ ] **iOS Version Testing**
  - [ ] iOS 16.x (minimum)
  - [ ] iOS 17.x (latest)
- [ ] **Functional Testing**
  - [ ] Guest mode flow
  - [ ] Sign up/sign in
  - [ ] Photo upload from library
  - [ ] Camera capture
  - [ ] AI generation (1-4 images)
  - [ ] History storage
  - [ ] Settings changes
  - [ ] Privacy Policy link
  - [ ] Terms of Service link

### Quality & Polish
- [ ] **Accessibility**
  - [ ] Test VoiceOver on main screens
  - [ ] Verify accessibility labels on buttons
  - [ ] Check color contrast
- [ ] **Performance**
  - [ ] App launches in < 2 seconds
  - [ ] No crashes during testing
  - [ ] Memory usage acceptable
- [ ] **Error Handling**
  - [ ] Network offline errors shown
  - [ ] API timeout handled gracefully
  - [ ] Permission denied handled

---

## MEDIUM PRIORITY (Nice to Have)

### Marketing Assets
- [ ] **App Preview Video** (15-30 seconds)
- [ ] **Promotional Materials** ready for launch
- [ ] **Press Kit** prepared

### Additional Polish
- [ ] **Crash Reporting** - Consider adding Sentry (update Privacy Policy if added)
- [ ] **Analytics** - Consider adding (with user consent)
- [ ] **Localization** - Plan for future languages

---

## VERIFICATION (Before Hitting Submit)

### Final Code Review
- [ ] **Remove Development Code**
  - [ ] Verify add-credits.ts import is conditional (line 14-16 in app/_layout.tsx)
  - [ ] Remove or disable console.log statements in production
- [ ] **Verify API Integration**
  - [ ] Test API calls work in production mode
  - [ ] Verify error handling for all API failures
- [ ] **Check Permissions**
  - [ ] Only necessary permissions requested
  - [ ] All permission descriptions are clear

### Metadata Verification
- [ ] **App Information**
  - [ ] App name: "Fashion Muse Studio"
  - [ ] Version: 1.0.0
  - [ ] Bundle ID matches
- [ ] **Content Rating**
  - [ ] Completed questionnaire
  - [ ] Rating: 9+ (user-generated content)
- [ ] **Privacy Labels**
  - [ ] Photos: App Functionality
  - [ ] Email: Account Creation (optional)
  - [ ] No tracking enabled

### Build Preparation
- [ ] **Create Production Build**
  ```bash
  eas build --platform ios --profile production
  ```
- [ ] **Test Build** via TestFlight
- [ ] **No Crashes** in TestFlight testing
- [ ] **Submit Build**
  ```bash
  eas submit --platform ios --profile production
  ```

---

## SUBMISSION

### App Store Connect
1. [ ] **Select Build** in App Store Connect
2. [ ] **Add Screenshots** for all required sizes
3. [ ] **Add App Preview Video** (optional)
4. [ ] **Complete All Metadata** fields
5. [ ] **Set Pricing** (Free)
6. [ ] **Configure Privacy Labels**
7. [ ] **Add App Review Information**
8. [ ] **Save** all changes

### App Review Information
- [ ] **Contact Info** - Your name, email, phone
- [ ] **Demo Account** - Not needed (guest mode available)
- [ ] **Notes for Reviewer** - Copy from APP_STORE_METADATA.md
- [ ] **Explain AI Integration** - Mention Rork Toolkit API usage

### Final Submit
- [ ] **Review Everything** one last time
- [ ] **Click Submit for Review**
- [ ] **Monitor Status** in App Store Connect

---

## POST-SUBMISSION

### While in Review (24-48 hours typical)
- [ ] Check App Store Connect daily
- [ ] Respond to reviewer questions promptly
- [ ] Have fixes ready if needed

### If Approved
- [ ] **Announce Launch** on social media
- [ ] **Monitor Reviews** and ratings
- [ ] **Track Analytics** in App Store Connect
- [ ] **Plan v1.1** based on feedback

### If Rejected
- [ ] **Read Rejection Carefully**
- [ ] **Fix Issues** in code or metadata
- [ ] **Test Thoroughly**
- [ ] **Resubmit** with resolution notes

---

## QUICK REFERENCE

### Files Modified in This PR
- ✅ `app.json` - Updated permission descriptions, removed microphone
- ✅ `app/(tabs)/settings.tsx` - Added Privacy Policy and Terms links
- ✅ `eas.json` - Added submission notes
- ✅ `PRIVACY_POLICY.md` - NEW
- ✅ `TERMS_OF_SERVICE.md` - NEW
- ✅ `IOS_APP_STORE_QUALITY_PLAN.md` - NEW
- ✅ `APP_STORE_METADATA.md` - NEW
- ✅ `APP_STORE_SUBMISSION_CHECKLIST.md` - NEW (this file)

### Still TODO Before Submission
1. **Host legal documents** on public URLs
2. **Update URLs** in settings screen
3. **Create screenshots** (3-10 per size)
4. **Update EAS config** with Apple credentials
5. **Create App Store Connect app**
6. **Set up support URL**
7. **Complete device testing**
8. **Build and submit to TestFlight**
9. **Complete App Store metadata**
10. **Submit for review**

### Estimated Time to Submission
- **Critical Items:** 1-2 days
- **Testing & Polish:** 2-3 days
- **Screenshots & Assets:** 1 day
- **Total:** 4-6 days from now

---

## NEED HELP?

### Documentation
- See `IOS_APP_STORE_QUALITY_PLAN.md` for detailed quality plan
- See `APP_STORE_METADATA.md` for all metadata and descriptions
- See `PRIVACY_POLICY.md` for privacy policy text
- See `TERMS_OF_SERVICE.md` for terms of service text

### Apple Resources
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Review Status](https://developer.apple.com/app-store/review/)

### Expo/EAS Resources
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)

---

**Good luck with your App Store submission! 🚀**

---

**Checklist Version:** 1.0
**Last Updated:** 2025-10-23
