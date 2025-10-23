# Privacy Policy for Fashion Muse Studio

**Effective Date:** October 23, 2025
**Last Updated:** October 23, 2025

## Introduction

Welcome to Fashion Muse Studio ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you understand how your information is used. This Privacy Policy explains our practices regarding the collection, use, and disclosure of information when you use our mobile application.

## Information We Collect

### 1. Personal Information You Provide

When you create an account, we collect:
- **Name:** To personalize your experience
- **Email Address:** For account authentication and recovery
- **Password:** Stored securely using cryptographic hashing (never stored in plain text)

**Guest Mode:** You can use the app without creating an account. In guest mode, we generate a temporary local identifier but collect no personal information.

### 2. Photos and Images

- **Source Photos:** Images you upload or capture to transform into fashion photoshoots
- **Generated Images:** AI-transformed fashion images created by our service
- **Storage:** All images are stored locally on your device in an encrypted SQLite database
- **Third-Party Processing:** Your images are temporarily sent to our AI processing service (Rork Toolkit API) to generate fashion transformations. Images are not retained by the API after processing.

### 3. Automatically Collected Information

We collect minimal automatically generated information:
- **Usage Credits:** Track your remaining generation credits (stored locally)
- **Generation History:** Dates and times of your image generations (stored locally)
- **App Version:** For compatibility purposes

### 4. Information We Do NOT Collect

We want to be clear about what we don't collect:
- ❌ Location data
- ❌ Browsing history
- ❌ Device identifiers (IDFA/IDFV)
- ❌ Analytics or tracking data (no third-party analytics SDKs)
- ❌ Crash reports (currently; may be added with user consent in future versions)
- ❌ Advertising data
- ❌ Contacts or calendar data
- ❌ Audio data (microphone is not used)

## How We Use Your Information

### Local Processing
- **Account Management:** Email and password for secure local authentication
- **Image Storage:** Store your original and generated images locally on your device
- **History Tracking:** Maintain a local history of your generations
- **Credit Management:** Track available credits for image generation

### Third-Party Processing
- **AI Image Generation:** Your selected photos are sent to our secure AI processing API (Rork Toolkit at toolkit.rork.com) to create fashion transformations
- **Processing Only:** The API processes your image and returns the result. Images are not stored, shared, or used for any other purpose by the API provider

## Data Storage and Security

### Local Storage (On Your Device)
- **SQLite Database:** All user data, images, and history are stored in an encrypted SQLite database on your device using SQLCipher encryption
- **AsyncStorage:** Session tokens are stored securely in your device's secure storage
- **Device-Only Access:** Your data never leaves your device except when you explicitly choose to generate an image

### Cloud Storage
- **No Cloud Sync:** We do not sync your data to cloud servers
- **No Backups:** We do not create cloud backups of your data
- **Local Only:** All data remains on your device

### Security Measures
- ✅ Password hashing using SHA-256 with random salt
- ✅ SQLCipher database encryption (iOS)
- ✅ HTTPS encryption for all API communications
- ✅ Secure local storage using iOS Keychain and AsyncStorage
- ✅ No third-party analytics or tracking SDKs

## Data Sharing and Disclosure

### We Do NOT Share Your Data
We do not sell, rent, or share your personal information with third parties for marketing purposes.

### Limited Third-Party Processing
- **AI Processing Service (Rork Toolkit):** When you generate an image, your selected photo is temporarily sent to our AI processing API. The image is processed and returned, then immediately deleted from the API servers. No images are retained.

### Legal Requirements
We may disclose information if required by law, such as:
- To comply with legal process or government requests
- To protect our rights, privacy, safety, or property
- To prevent fraud or security issues

However, since all data is stored locally on your device, we have no access to your data unless you explicitly share it with us.

## Your Rights and Choices

### Access and Control
- **View Your Data:** All your data is stored locally and accessible through the app
- **Delete Your Account:** You can delete your account and all associated data from the settings screen
- **Export Data:** Currently not available; planned for future update
- **Modify Information:** You can update your name and profile image in settings

### Photo Permissions
- **Camera Access:** Required only when you want to take a photo within the app
- **Photo Library Access:** Required only when you want to select an existing photo
- **Revoke Permissions:** You can revoke these permissions in iOS Settings at any time

### Guest Mode
- **No Account Required:** Use the app without creating an account
- **Free Credits:** Guest users receive 50 free credits to try the app
- **Local Storage:** Guest data is stored locally with the identifier "guest"
- **Upgrade:** Convert to a full account at any time to preserve your history

## Children's Privacy

Fashion Muse Studio is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately, and we will take steps to delete such information.

**Age Restriction:** The app is rated for users 9+ due to minimal content concerns.

## Data Retention

### Active Accounts
- Your data is retained locally on your device as long as you have the app installed
- Data persists until you explicitly delete your account or uninstall the app

### Deleted Accounts
- When you delete your account, all associated data is immediately removed from your device's local database
- There is no cloud data to delete

### Uninstalling the App
- Uninstalling the app removes all local data from your device
- There are no residual cloud data or server-side records

## Third-Party Services

### Rork Toolkit API
- **Purpose:** AI image generation and transformation
- **Data Sent:** Your selected photo (temporarily)
- **Data Retention:** Images are not stored after processing
- **Privacy Policy:** Governed by Rork's privacy practices
- **Security:** All communications use HTTPS encryption

### No Other Third Parties
We do not use:
- Advertising networks
- Analytics services (Google Analytics, Firebase, etc.)
- Social media integration
- Payment processors (currently no in-app purchases)

## International Data Transfers

Since all data is stored locally on your device:
- No international data transfers occur (except temporary API calls for image processing)
- Your data is subject to the privacy laws of your country/region
- API processing may occur on servers in different regions, but images are not retained

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. When we make changes:
- We will update the "Last Updated" date at the top
- We will notify you through the app if changes are material
- Continued use of the app after changes constitutes acceptance

**Version History:**
- v1.0 (October 23, 2025): Initial privacy policy

## Your Consent

By using Fashion Muse Studio, you consent to this Privacy Policy.

## Contact Us

If you have questions or concerns about this Privacy Policy or our practices:

**Email:** help@fashionmusestudio.com
**App Version:** 1.0.0
**Developer:** Rork Platform (Update with actual developer name)

## Additional Information for California Residents (CCPA)

If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):

### Your Rights
- **Right to Know:** Request information about personal data we collect (all data is local)
- **Right to Delete:** Request deletion of your personal data (available in settings)
- **Right to Opt-Out:** Opt-out of sale of personal information (we don't sell data)
- **Right to Non-Discrimination:** Not be discriminated against for exercising your rights

### Data Collection Summary
- **Personal Information:** Name, email (stored locally)
- **Categories:** Account credentials, user-generated content (photos)
- **Purpose:** App functionality and service provision
- **Sharing:** No sharing with third parties (except temporary API processing)
- **Sale:** We do not sell personal information

## Additional Information for EU Residents (GDPR)

If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):

### Legal Basis for Processing
- **Consent:** You provide consent when creating an account
- **Contract Performance:** Processing necessary to provide the service
- **Legitimate Interests:** Improving app functionality and security

### Your GDPR Rights
- **Access:** Request a copy of your data (stored locally on your device)
- **Rectification:** Correct inaccurate data (available in settings)
- **Erasure:** Request deletion of your data (available in settings)
- **Portability:** Request your data in a portable format (planned for future update)
- **Objection:** Object to processing (you can delete your account)
- **Withdraw Consent:** Withdraw consent at any time

### Data Controller
Since all data is stored locally on your device, you are the effective controller of your data. We provide the software but do not have access to your data.

## App Store Privacy Labels

### Data Used to Track You
- **None:** We do not track you across apps or websites

### Data Linked to You
- **Contact Information:** Email (stored locally, not linked to third parties)
- **User Content:** Photos and generated images (stored locally)

### Data Not Linked to You
- **None:** All collected data is linked to your local account

---

**This privacy policy is designed to comply with:**
- Apple App Store privacy requirements
- California Consumer Privacy Act (CCPA)
- General Data Protection Regulation (GDPR)
- Children's Online Privacy Protection Act (COPPA)

**Important Note:** This is a privacy policy template. Before publishing to the App Store, you should:
1. Review with a legal professional
2. Host this policy on a publicly accessible website
3. Update contact information with actual support email
4. Update developer/company information
5. Ensure compliance with all applicable laws in your jurisdiction

---

**End of Privacy Policy**
