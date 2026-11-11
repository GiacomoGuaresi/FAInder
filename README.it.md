<div align="center">
  <img src="assets/images/LOGO.png" alt="Logo di FAInder" width="160"/>
  <h1>FAInder</h1>
  <p>I luoghi del FAI (Fondo Ambiente Italiano) su mappa, con il registro di quelli che hai visitato.</p>
  <p><a href="README.md">English</a></p>
</div>

FAInder è un'app Android/iOS per gli iscritti al FAI e per chi è curioso del patrimonio italiano. Mostra su mappa circa 2.000 luoghi (i beni del FAI e le strutture che offrono vantaggi agli iscritti), permette di filtrarli per categoria e tiene traccia di dove sei stato. È un progetto indipendente, **non affiliato al FAI**.

<!-- screenshot: docs/screenshots/ (mappa, dettaglio luogo, check-in, tessera, statistiche) -->

## Cosa fa

- **Mappa** dei luoghi intorno a te, con ricerca per località o indirizzo e filtri per categoria.
- **Scheda del luogo** con una breve descrizione, il link alla pagina ufficiale FAI e le indicazioni in Google Maps.
- **Check-in**: segna un luogo come visitato, preferito o non interessante; ogni stato ha il suo colore sulla mappa e il suo elenco.
- **Tessera**: tieni a portata di mano il PDF o la foto della tua tessera FAI.
- **Statistiche**: visite per anno, categorie e stagione preferite.

Tutto quello che segni resta sul telefono. Non c'è account e non c'è server.

## Stato

Versione 1.0, sviluppata e provata su Android. Lo stesso codice si può compilare per iOS, ma non è distribuita una build iOS. La schermata delle statistiche è la parte più recente e la meno rifinita.

## Provala

Scarica l'APK dall'[ultima release](https://github.com/GiacomoGuaresi/FAInder/releases/latest) e installalo su un telefono Android (va consentita l'installazione da origini sconosciute).

Per avviarla dai sorgenti:

```bash
git clone https://github.com/GiacomoGuaresi/FAInder.git
cd FAInder
npm install
npm start
```

Il resto è in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) (in inglese).

## Com'è fatta

- **App**: React Native con Expo (SDK 54) ed Expo Router, in TypeScript.
- **Mappa**: Leaflet con le mappe di OpenStreetMap dentro una WebView; app e mappa si scambiano messaggi per aggiornare i segnaposto senza ricaricare. La ricerca degli indirizzi usa Nominatim. Nessuna chiave API.
- **Archiviazione**: AsyncStorage per visite, preferiti, filtri e tessera.
- **Dati**: uno script Python legge due endpoint pubblici del FAI e scrive `data/beni-fai.json`; una GitHub Action lo esegue ogni notte e salva il file quando cambia. L'app scarica il file da questo repository e, senza rete, usa la copia inclusa.
- **Test**: la logica di filtri, visite e statistiche sta in `lib/` ed è coperta da Jest; lo script dei dati da pytest. La CI esegue lint, controllo dei tipi e test a ogni pull request.

I dettagli sui dati sono in [docs/DATA.md](docs/DATA.md) (in inglese).

## Sui dati

FAInder usa solo informazioni che il sito del FAI già espone pubblicamente, senza login. Per ogni luogo il file JSON contiene nome, coordinate, categorie, una breve descrizione e il link alla pagina ufficiale, a cui l'app rimanda sempre per il contenuto completo.

Il nome "FAI" e i testi sui luoghi appartengono al Fondo Ambiente Italiano e ai rispettivi titolari. Accuratezza e aggiornamento non sono garantiti. Se il FAI o un altro titolare dei diritti vuole che qualcosa sia modificato o rimosso, può [aprire una issue](https://github.com/GiacomoGuaresi/FAInder/issues): intervengo subito.

## Come è stata fatta

Ho scritto l'app a mano a febbraio 2026 (66 commit; gli altri commit nella cronologia sono gli aggiornamenti notturni dei dati fatti da GitHub Actions). A novembre 2026 ho usato Claude per sistemare la documentazione, spostare la logica in `lib/` e aggiungere test e CI: quei commit sono co-firmati e riconoscibili.

## Contribuire

Vedi [CONTRIBUTING.md](CONTRIBUTING.md).

## Licenza

Codice sotto [licenza MIT](LICENSE). I dati sui luoghi restano soggetti alle condizioni del sito FAI.
