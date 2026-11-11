<div align="center">
  <img src="assets/images/LOGO.png" alt="FAInder logo" width="160"/>
  <h1>FAInder</h1>
  <p>The places of FAI (Fondo Ambiente Italiano) on a map, with a personal log of the ones you have visited.</p>
  <p><a href="README.it.md">Italiano</a></p>
</div>

FAInder is an Android/iOS app for FAI members and anyone curious about Italian heritage. It shows about 2,000 places on a map (FAI properties and the venues that offer benefits to FAI members), lets you filter them by category, and keeps track of where you have been. It is an independent project, **not affiliated with FAI**.

<!-- screenshots: docs/screenshots/ (map, place detail, check-in, membership card, statistics) -->

## What it does

- **Map** of all places around you, with search by town or address and filters by category.
- **Place sheet** with a short description, a link to the official FAI page and directions in Google Maps.
- **Check-in**: mark a place as visited, favourite or not interesting; each state has its own marker colour and its own list.
- **Membership card**: keep a PDF or a photo of your FAI card at hand.
- **Statistics**: visits per year, favourite categories and season.

Everything you mark stays on your phone. There is no account and no server.

## Status

Version 1.0, developed and tested on Android. The same code can be built for iOS, but no iOS build is distributed. The statistics screen is the most recent part and the least polished.

## Try it

Download the APK from the [latest release](https://github.com/GiacomoGuaresi/FAInder/releases/latest) and install it on an Android phone (you need to allow installation from unknown sources).

To run it from source:

```bash
git clone https://github.com/GiacomoGuaresi/FAInder.git
cd FAInder
npm install
npm start
```

More in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## How it is built

- **App**: React Native with Expo (SDK 54) and Expo Router, in TypeScript.
- **Map**: Leaflet with OpenStreetMap tiles inside a WebView; the app and the map exchange messages to update markers without reloading. Address search uses Nominatim. No API keys.
- **Storage**: AsyncStorage for visits, favourites, filters and the membership card.
- **Data**: a Python script reads two public FAI endpoints and writes `data/beni-fai.json`; a GitHub Action runs it every night and commits the file when it changes. The app downloads the file from this repository and falls back to the bundled copy when offline.
- **Tests**: the logic for filters, visits and statistics lives in `lib/` and is covered by Jest; the data script is covered by pytest. CI runs lint, type check and tests on every pull request.

Details on the data in [docs/DATA.md](docs/DATA.md).

## About the data

FAInder uses only information that the FAI website already serves publicly, without login. For each place the JSON file holds name, coordinates, categories, a short description and the link to the official page, where the app always sends you for the full content.

"FAI" and all texts about the places belong to Fondo Ambiente Italiano and their respective owners. Accuracy and freshness are not guaranteed. If FAI or another rights holder wants something changed or removed, please [open an issue](https://github.com/GiacomoGuaresi/FAInder/issues) and I will act on it promptly.

## How it was made

I wrote the app by hand in February 2026 (66 commits; the other commits in the history are the nightly data updates made by GitHub Actions). In November 2026 I used Claude to tidy up the documentation, move the logic into `lib/`, and add tests and CI: those commits are co-authored and marked as such.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Code under the [MIT License](LICENSE). The data about the places remains subject to the terms of the FAI website.
