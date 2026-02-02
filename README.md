# Offline Assets App

An offline-first React Native + Expo mobile application for Android and iOS.

## Features

- **Offline-first architecture**: Works completely without internet connection
- **Local SQLite database**: Asset data stored and queried locally
- **Interactive map**: Display geolocated asset markers using react-native-maps
- **External linking**: Open asset URLs in external browser
- **Secure card storage**: Save payment card data using encrypted secure storage

## Tech Stack

- **React Native** with **Expo SDK 52**
- **TypeScript** for type safety
- **expo-router** for file-based navigation
- **expo-sqlite** for local SQLite database
- **react-native-maps** for map display
- **expo-secure-store** for encrypted card storage
- **expo-linking** for external URL handling

## Project Structure

```
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout with DB initialization
│   └── (tabs)/             # Tab navigation
│       ├── _layout.tsx     # Tab bar configuration
│       ├── index.tsx       # Map screen (home)
│       └── card.tsx        # Card management screen
├── src/
│   ├── database/           # SQLite database layer
│   │   ├── schema.ts       # Table definitions
│   │   └── database.ts     # DB operations
│   ├── data/
│   │   └── seed.json       # Initial asset data
│   ├── screens/            # Screen components
│   │   ├── MapScreen.tsx   # Map with markers
│   │   └── CardScreen.tsx  # Card form
│   ├── services/
│   │   └── secureStorage.ts # Secure card storage
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces
│   └── utils/
│       └── linking.ts      # External URL helper
├── assets/                 # App icons and images
├── app.json                # Expo configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Google Maps API Key** (required for maps):
   
   Edit `app.json` and replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:
   - For iOS: `expo.ios.config.googleMapsApiKey`
   - For Android: `expo.android.config.googleMaps.apiKey`

3. **Run the app**:
   ```bash
   # Start Expo development server
   npm start

   # Run on iOS simulator
   npm run ios

   # Run on Android emulator
   npm run android
   ```

4. **Build for production** (requires Expo prebuild for native modules):
   ```bash
   npx expo prebuild
   npx expo run:ios
   npx expo run:android
   ```

## Architecture Decisions

### Offline-First Design
- All data is stored locally in SQLite
- No network requests required for core functionality
- Database is seeded on first launch from bundled JSON

### SQLite with expo-sqlite
- Uses the new async API from expo-sqlite v15
- Prepared statements for efficient batch inserts
- Indexes on frequently queried columns

### Secure Storage
- Card data encrypted using expo-secure-store
- Uses iOS Keychain / Android Keystore under the hood
- No sensitive data stored in plain text

### Navigation
- expo-router for file-based routing
- Tab navigation for main screens
- Clean separation between routing and screen logic

### Maps
- react-native-maps for cross-platform map support
- Markers with callouts for asset information
- Tap callout to open external link

## SQLite Schema

```sql
CREATE TABLE IF NOT EXISTS assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_coordinates ON assets(latitude, longitude);
```

## Notes

- **Google Maps API Key**: Required for production. Get one from [Google Cloud Console](https://console.cloud.google.com/)
- **Development builds**: For full native module support, use `expo prebuild` and run native builds
- **Expo Go limitations**: react-native-maps requires a development build, not Expo Go
