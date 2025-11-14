# 🔥 Firebase Setup Guide

Complete guide to setting up Firebase for Murugan Wallpapers app.

## 📝 Step-by-Step Firebase Configuration

### 1. Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `murugan-wallpapers`
4. Enable/disable Google Analytics (optional)
5. Click **"Create project"**

### 2. Register Your App

1. In Firebase Console, click the **Web icon** (</>)
2. Register app nickname: `Murugan Wallpapers Web`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. **Copy the configuration object** - you'll need this!

```javascript
// Your config will look like this:
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "murugan-wallpapers.firebaseapp.com",
  projectId: "murugan-wallpapers",
  storageBucket: "murugan-wallpapers.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 3. Enable Authentication

1. Go to **Authentication** in left sidebar
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Enable **"Phone"** provider:
   - Click on "Phone"
   - Toggle "Enable"
   - Click "Save"

#### Phone Authentication Notes:
- For development, Firebase provides test phone numbers
- For production, you'll need to verify your app
- Consider using Firebase Admin SDK for backend OTP verification

### 4. Set Up Firestore Database

1. Go to **Firestore Database** in left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to your users)
5. Click **"Enable"**

#### Create Collections:

**Collection: `wallpapers`**
1. Click **"Start collection"**
2. Collection ID: `wallpapers`
3. Add first document:
   - Document ID: Auto-ID
   - Fields:
     ```
     title: "Lord Murugan Blessing"
     imageUrl: "https://your-image-url.com/image.jpg"
     thumbnailUrl: "https://your-image-url.com/thumb.jpg"
     tags: ["murugan", "devotional", "blessing"]
     createdAt: timestamp (now)
     ```

**Collection: `videos`**
1. Click **"Start collection"**
2. Collection ID: `videos`
3. Add first document:
   - Document ID: Auto-ID
   - Fields:
     ```
     title: "Murugan Bhajan"
     thumbnailUrl: "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
     videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID"
     youtubeId: "VIDEO_ID"
     duration: "5:30"
     createdAt: timestamp (now)
     ```

**Collection: `favorites`**
- This will be created automatically when users save favorites
- No need to add documents manually

### 5. Set Up Storage

1. Go to **Storage** in left sidebar
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Click **"Next"**
5. Select location (same as Firestore)
6. Click **"Done"**

#### Upload Wallpapers:

1. Click **"Upload file"**
2. Create folder: `wallpapers/`
3. Upload your images
4. Copy the download URL for each image
5. Use these URLs in Firestore documents

### 6. Configure Security Rules

#### Firestore Rules:

1. Go to **Firestore Database** > **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to wallpapers and videos
    match /wallpapers/{wallpaperId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /videos/{videoId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // User-specific favorites
    match /favorites/{favoriteId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click **"Publish"**

#### Storage Rules:

1. Go to **Storage** > **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /wallpapers/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

3. Click **"Publish"**

### 7. Update App Configuration

1. Open `firebase.config.js` in your project
2. Replace the placeholder config with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. Save the file

### 8. Test the Connection

1. Start your app: `npm start`
2. Check the console for any Firebase errors
3. Try fetching wallpapers from Firestore
4. Test authentication flow

## 🎯 Quick Data Import

### Sample Wallpaper Document:

```json
{
  "title": "Lord Murugan with Peacock",
  "imageUrl": "https://picsum.photos/800/1200?random=1",
  "thumbnailUrl": "https://picsum.photos/400/600?random=1",
  "tags": ["murugan", "peacock", "devotional", "colorful"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "views": 0,
  "downloads": 0
}
```

### Sample Video Document:

```json
{
  "title": "Murugan Kavadi Attam",
  "thumbnailUrl": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "youtubeId": "dQw4w9WgXcQ",
  "duration": "5:30",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "views": 0
}
```

## 🔐 Production Security

Before going to production:

1. **Change Firestore rules** from test mode to production mode
2. **Change Storage rules** to restrict write access
3. **Enable App Check** for additional security
4. **Set up Firebase Admin SDK** for server-side operations
5. **Implement rate limiting** to prevent abuse
6. **Add monitoring** and alerts

## 📊 Optional: Enable Analytics

1. Go to **Analytics** in Firebase Console
2. Click **"Enable Google Analytics"**
3. Follow the setup wizard
4. Analytics will automatically track:
   - Screen views
   - User engagement
   - App crashes
   - Custom events

## 🆘 Troubleshooting

### Error: "Firebase not initialized"
- Check that you've updated `firebase.config.js`
- Verify all config values are correct
- Restart the app

### Error: "Permission denied"
- Check Firestore security rules
- Ensure user is authenticated for protected operations
- Verify the rules are published

### Error: "Storage upload failed"
- Check Storage security rules
- Verify file size limits
- Check internet connection

### Error: "Phone authentication not working"
- Ensure Phone provider is enabled in Firebase Console
- Check that you're using a valid phone number format
- For testing, use Firebase test phone numbers

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Phone Auth](https://firebase.google.com/docs/auth/web/phone-auth)

---

**Need Help?** Check the main README.md or create an issue on GitHub.
