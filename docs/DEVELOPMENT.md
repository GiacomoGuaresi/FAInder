# Development

## Requirements

- Node.js 20 or newer and npm
- For running on a device: Android Studio (Android) or Xcode (iOS)
- Python 3.11 or newer, only for the data script

No API keys and no `.env` values are needed: `.env.example` is empty on purpose.

## Run the app

```bash
npm install
npm start          # Expo dev server
npm run android    # build and run on an Android device or emulator
npm run ios        # build and run on an iOS simulator
```

The map runs in a WebView and the app uses native modules, so use a development build (`npm run android` / `npm run ios`). The web target (`npm run web`) is not maintained.

## Checks

```bash
npm run lint         # ESLint (Expo config)
npm run typecheck    # tsc --noEmit
npm test             # Jest, tests in __tests__/
python -m pytest scripts   # tests for the data script (needs: pip install requests pytest)
```

CI (`.github/workflows/ci.yml`) runs all of them on pull requests and on pushes to `main`, except for pushes that only change `data/`.

## Project layout

```
app/                 screens (Expo Router)
  (tabs)/index.tsx     map, search, filters, place sheet, check-in
  (tabs)/explore.tsx   membership card
  (tabs)/statistiche.tsx, luoghi-*.tsx, tutti-luoghi.tsx   statistics and lists
  (tabs)/_layout.tsx   tabs and side menu
lib/                 logic without React: filters, visits, statistics, text helpers
__tests__/           Jest tests for lib/
contexts/            category filters shared between screens
components/, hooks/, constants/   UI building blocks and theme
data/beni-fai.json   places shown by the app, regenerated every night
scripts/             data script, its tests, local build script
```

## Data stored on the phone

All in AsyncStorage:

| Key | Content |
| --- | --- |
| `fai_visited_places` | `[{ "id": 123, "visitDate": "2026-02-14T10:00:00.000Z" }]`. Older versions stored a plain array of ids; `lib/visited.ts` reads both. |
| `fai_favorites_places` | array of place ids |
| `fai_not_interested_places` | array of place ids |
| `fai_category_filters`, `fai_hidden_categories` | arrays of category ids |
| `fai_card_pdf` | URI and MIME type of the membership card file |

## Building the APK

Releases are built locally:

```bash
./scripts/build-local.sh
```

It runs `expo prebuild --clean` and then `eas build --platform android --profile production --local`, which needs the Android SDK, a JDK and an Expo account (`eas login`). The APK is written to the project root; `*.apk` is git-ignored. Attach it to a GitHub release.

`.github/workflows/build-apk.yml` is an attempt to do the same through EAS in CI. It has never completed successfully and does not publish a release: treat it as work in progress.
