# 🕉️ Murugan Wallpapers - React Native Mobile App

A beautiful, production-ready mobile app for browsing and downloading devotional wallpapers and videos of Lord Murugan.

## 📱 Features

- **Browse Wallpapers & Videos**: Pinterest-style grid layout with infinite scroll
- **Full-Screen Viewer**: Immersive wallpaper viewing experience
- **Download & Share**: Save wallpapers to device and share with friends
- **Favorites**: Save your favorite wallpapers and videos
- **Search**: Find wallpapers and videos quickly
- **Phone OTP Login**: Secure authentication with Firebase
- **Dark Mode**: Automatic dark theme support
- **Lazy Loading**: Optimized image loading for better performance

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: React Context API
- **Image Handling**: Expo Image with lazy loading
- **Video Player**: React Native YouTube iFrame

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (for Mac) or Android Studio (for Android development)
- A Firebase account

## 🚀 Installation & Setup

### Step 1: Install Dependencies

```bash
cd mobile-app
npm install
```

### Step 2: Firebase Configuration

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Enable Authentication**:
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable "Phone" authentication
   - Configure your app's authorized domains

3. **Create Firestore Database**:
   - Go to Firestore Database
   - Click "Create Database"
   - Start in test mode (change to production rules later)
   - Choose a location

4. **Set Up Storage**:
   - Go to Storage
   - Click "Get Started"
   - Start in test mode

5. **Get Firebase Config**:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Click the web icon (</>) to add a web app
   - Copy the configuration object

6. **Update Firebase Config**:
   - Open `firebase.config.js`
   - Replace the placeholder values with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Set Up Firestore Collections

Create the following collections in Firestore:

#### Collection: `wallpapers`
```json
{
  "title": "Lord Murugan 1",
  "imageUrl": "https://example.com/image.jpg",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "tags": ["murugan", "devotional", "hindu"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Collection: `videos`
```json
{
  "title": "Murugan Bhajan 1",
  "thumbnailUrl": "https://example.com/thumb.jpg",
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "youtubeId": "VIDEO_ID",
  "duration": "5:30",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Collection: `favorites`
```json
{
  "userId": "user-id",
  "itemId": "wallpaper-id",
  "itemType": "wallpaper",
  "itemData": { /* wallpaper or video object */ },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Step 4: Run the App

```bash
# Start Expo development server
npm start

# Or run on specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## 📱 Running on Physical Device

1. Install the **Expo Go** app on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in the terminal with:
   - iOS: Camera app
   - Android: Expo Go app

## 🏗️ Project Structure

```
mobile-app/
├── App.js                      # Entry point
├── app.json                    # Expo configuration
├── firebase.config.js          # Firebase setup
├── package.json                # Dependencies
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js     # Navigation setup
│   ├── screens/
│   │   ├── LoginScreen.js      # Phone OTP login
│   │   ├── HomeScreen.js       # Main screen with tabs
│   │   ├── WallpaperDetailScreen.js
│   │   ├── VideoPlayerScreen.js
│   │   ├── FavoritesScreen.js
│   │   └── ProfileScreen.js
│   ├── components/
│   │   ├── SearchBar.js        # Search component
│   │   ├── GridItem.js         # Wallpaper grid item
│   │   ├── VideoCard.js        # Video card component
│   │   └── LoadingSpinner.js   # Loading indicator
│   ├── services/
│   │   └── firebaseService.js  # Firebase operations
│   ├── utils/
│   │   ├── downloadHelper.js   # Download functionality
│   │   └── shareHelper.js      # Share functionality
│   └── contexts/
│       └── AuthContext.js      # Authentication state
└── assets/                     # Images and icons
```

## 🔧 Configuration

### Customizing Colors

Edit the primary color in your screens and components:
- Primary Color: `#FF6B35` (Orange)
- Accent Color: `#F7931E`
- Background: `#fff` (Light) / `#1a1a1a` (Dark)

### Adding More Wallpapers/Videos

1. Upload images to Firebase Storage
2. Add document to Firestore `wallpapers` or `videos` collection
3. The app will automatically fetch and display them

## 📝 Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Wallpapers - read only
    match /wallpapers/{wallpaperId} {
      allow read: if true;
      allow write: if false; // Only admins can write
    }
    
    // Videos - read only
    match /videos/{videoId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Favorites - user specific
    match /favorites/{favoriteId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /wallpapers/{allPaths=**} {
      allow read: if true;
      allow write: if false; // Only admins
    }
  }
}
```

## 🐛 Troubleshooting

### Issue: "Expo Go app not connecting"
**Solution**: Ensure your phone and computer are on the same WiFi network.

### Issue: "Firebase not initialized"
**Solution**: Check that you've updated `firebase.config.js` with your actual Firebase credentials.

### Issue: "Images not loading"
**Solution**: 
- Check internet connection
- Verify image URLs in Firestore
- Check Firebase Storage permissions

### Issue: "Phone OTP not working"
**Solution**: 
- The demo uses a simplified OTP flow
- For production, implement proper Firebase Phone Auth with reCAPTCHA
- Consider using Firebase Admin SDK on a backend server

### Issue: "Download not working on Android"
**Solution**: 
- Grant storage permissions in device settings
- Check that `expo-media-library` is properly installed

### Issue: "YouTube videos not playing"
**Solution**: 
- Ensure valid YouTube video IDs
- Check internet connection
- Verify `react-native-youtube-iframe` is installed

## 📦 Building for Production

### iOS

```bash
# Build for iOS
expo build:ios

# Or use EAS Build (recommended)
npm install -g eas-cli
eas build --platform ios
```

### Android

```bash
# Build for Android
expo build:android

# Or use EAS Build (recommended)
npm install -g eas-cli
eas build --platform android
```

## 🔐 Production Checklist

Before deploying to production:

- [ ] Update Firebase security rules
- [ ] Implement proper Phone OTP verification
- [ ] Add error tracking (Sentry, Crashlytics)
- [ ] Add analytics (Firebase Analytics, Mixpanel)
- [ ] Test on multiple devices
- [ ] Optimize images and assets
- [ ] Add app icons and splash screens
- [ ] Set up CI/CD pipeline
- [ ] Add privacy policy and terms of service
- [ ] Test offline functionality
- [ ] Implement proper error boundaries

## 📄 License

This project is licensed under the MIT License.

## 🙏 Credits

- Built with React Native and Expo
- Firebase for backend services
- Icons from Expo Vector Icons
- Images from Picsum (demo only)

## 📞 Support

For issues and questions:
- Email: support@muruganwallpapers.com
- GitHub Issues: [Create an issue]

---

**Made with ❤️ for devotees of Lord Murugan**
