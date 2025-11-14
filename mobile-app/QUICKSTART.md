# 🚀 Quick Start Guide - Murugan Wallpapers

Get your app running in 5 minutes!

## ⚡ Fast Setup

### 1. Install Dependencies (2 minutes)

```bash
cd mobile-app
npm install
```

### 2. Firebase Setup (2 minutes)

1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Phone Authentication
4. Create Firestore Database (test mode)
5. Copy your config from Project Settings
6. Paste into `firebase.config.js`

### 3. Run the App (1 minute)

```bash
npm start
```

Scan the QR code with Expo Go app on your phone!

## 📱 Demo Mode

The app works in **demo mode** without Firebase setup:
- Mock wallpapers and videos are displayed
- OTP login accepts any 6-digit code
- All features work locally

## 🎯 Next Steps

1. **Add Real Data**: Upload wallpapers to Firebase Storage
2. **Configure OTP**: Set up proper phone authentication
3. **Customize**: Change colors and branding
4. **Test**: Try on both iOS and Android
5. **Deploy**: Build for production

## 🆘 Need Help?

- Check `README.md` for detailed instructions
- Common issues are in the Troubleshooting section
- The app includes helpful error messages

## 🎨 Customization Tips

### Change Primary Color
Find and replace `#FF6B35` with your color in all files.

### Add Your Logo
Replace files in `assets/` folder:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024)

### Modify App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

## ✅ Verification Checklist

- [ ] Dependencies installed successfully
- [ ] App starts without errors
- [ ] Can navigate between screens
- [ ] Images load properly
- [ ] Search works
- [ ] Can add to favorites
- [ ] Download and share work

## 🎉 You're Ready!

Your app is now running. Start customizing and adding your content!

---

**Pro Tip**: Use the demo mode to test all features before setting up Firebase.
