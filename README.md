<div align="center">
  <img src="assets/images/LOGO.png" alt="FAInder Logo" width="200"/>
  <h1>FAInder</h1>
</div>

FAInder è un progetto **open source** che raccoglie e rende consultabili, in forma geografica, alcuni luoghi e attività presenti sulla piattaforma pubblica del Fondo Ambiente Italiano (FAI).

Il progetto nasce con l'obiettivo di **facilitare la ricerca e la scoperta** di luoghi di interesse culturale, storico e territoriale, attraverso una rappresentazione su mappa semplice e accessibile.

## 📱 App Mobile

FAInder include un'applicazione mobile nativa per iOS e Android che permette di:

- **Esplorare la mappa** dei beni FAI con la propria posizione
- **Tracciare i luoghi visitati** con un sistema di check-in
- **Visualizzare i dettagli** di ogni bene e accedere alla pagina ufficiale FAI
- **Consultare la propria "Carta FAI"** con le statistiche di progresso

L'app è sviluppata con React Native/Expo e offre un'esperienza utente ottimizzata per dispositivi mobili.

---

## 🎯 Obiettivo del progetto

FAInder ha uno scopo **puramente informativo e sperimentale**:

- aggregare dati pubblicamente accessibili
- trasformarli in un formato leggero (JSON) adatto a mappe e applicazioni
- consentire la consultazione rapida dei luoghi tramite coordinate geografiche
- rimandare sempre alla pagina ufficiale del luogo sul sito FAI

Il progetto **non sostituisce**, **non replica** e **non intende competere** con i servizi ufficiali del FAI.

---

## 🛠️ Setup Sviluppo

### Prerequisiti
- Node.js (v18 o superiore)
- Expo CLI
- Python 3.11+ (per lo script di scraping)
- npm o yarn

### Configurazione Ambiente

1. **Installa le dipendenze**:
   ```bash
   npm install
   ```

2. **Avvia l'app**:
   ```bash
   npm start
   # oppure
   expo start
   ```

**Nota**: L'app utilizza OpenStreetMap e non richiede API key per funzionare. Assicurati di avere configurato correttamente `eas.json` per le credenziali di build.

### Build di Produzione

Per la build di produzione:

```bash
# Build Android
eas build --platform android

# Build iOS  
eas build --platform ios

# Build Web
eas build --platform web
```

---

## � Struttura del Progetto

```
FAInder/
├── app/                    # Navigazione e schermate React Native
│   ├── (tabs)/            # Tab navigation (Explore, About, etc.)
│   ├── _layout.tsx        # Layout principale
│   └── modal.tsx          # Componenti modali
├── components/            # Componenti riutilizzabili
│   ├── ui/               # Componenti UI base
│   └── ...               # Altri componenti custom
├── constants/            # Costanti dell'app (temi, configurazioni)
├── data/                 # Dati generati (beni-fai.json)
├── hooks/                # Custom hooks React
├── scripts/              # Script di utilità
│   ├── fetch_beni_fai.py # Script scraping dati FAI
│   └── reset-project.js  # Reset progetto
├── services/             # Servizi API e logica business
├── assets/               # Risorse statiche (immagini, icone)
├── .github/workflows/    # GitHub Actions (update automatico)
└── docs/                 # Documentazione dettagliata
```

### Componenti Principali

- **App Mobile**: React Native con Expo Router per navigazione
- **Data Pipeline**: Script Python per scraping e GitHub Actions per aggiornamento automatico
- **Map Integration**: OpenStreetMap tramite react-native-maps
- **Storage**: AsyncStorage per tracking locale luoghi visitati

---

## � Contenuto del repository

Il repository include:

- uno script di scraping che interroga le API pubbliche del FAI
- un file JSON generato automaticamente contenente:
  - coordinate geografiche
  - nome del luogo
  - link alla pagina ufficiale FAI
- una semplice applicazione che utilizza questi dati per mostrarli su mappa

Il file JSON viene aggiornato automaticamente tramite GitHub Actions.

---

## 🔌 API e Dati

### Fonte dei Dati

I dati provengono esclusivamente da **endpoint pubblici** della piattaforma FAI:

```
https://platform.fondoambiente.it/api/luoghi/faixme
```

### Struttura dei Dati

Il file `data/beni-fai.json` contiene un array di oggetti con la seguente struttura:

```json
{
  "id": "12345",
  "title": "Nome del Luogo",
  "lat": 45.1234,
  "lng": 9.5678,
  "url": "https://fondoambiente.it/luoghi/slug-del-luogo",
  "description": "Descrizione pulita del luogo"
}
```

### Script di Scraping

Lo script `scripts/fetch_beni_fai.py` esegue le seguenti operazioni:

1. **Paginazione**: Recupera i dati paginati dall'API FAI
2. **Filtraggio**: Mantiene solo luoghi con coordinate valide
3. **Pulizia**: Rimuovi tag HTML dalle descrizioni
4. **Normalizzazione**: Formatta i dati in struttura coerente
5. **Output**: Salva in formato JSON leggibile

### Aggiornamento Automatico

I dati vengono aggiornati automaticamente tramite GitHub Actions:
- **Frequenza**: Ogni giorno a mezzanotte (UTC)
- **Trigger**: Manuale via `workflow_dispatch`
- **Output**: Commit automatico con timestamp

Vengono utilizzate **solo informazioni già accessibili pubblicamente**, senza autenticazione, login o aggiramento di sistemi di protezione.

---

## 🚀 Sviluppo

### Workflow Locale

1. **Setup Ambiente**:
   ```bash
   # Clona il repository
   git clone https://github.com/GiacomoGuaresi/FAI-nder.git
   cd FAI-nder
   
   # Installa dipendenze
   npm install
   ```

2. **Sviluppo App**:
   ```bash
   # Avvia development server
   npm start
   
   # Test su dispositivo/simulator
   npm run android    # Android
   npm run ios        # iOS  
   npm run web        # Web
   ```

3. **Aggiornamento Dati**:
   ```bash
   # Manual update dei dati FAI
   python scripts/fetch_beni_fai.py
   ```

### Debug e Testing

- **Debug**: Usa Expo DevTools per ispezionare l'app
- **Logs**: Controlla console Metro per errori runtime
- **Testing**: I test sono nella cartella `__tests__/`

### Code Style

- **Linting**: `npm run lint` per controllare stile codice
- **TypeScript**: Configurazione in `tsconfig.json`
- **ESLint**: Regole in `eslint.config.js`

---

## 🤝 Contribuire

Questo progetto **NON è affiliato, sponsorizzato o approvato** dal Fondo Ambiente Italiano (FAI).

- Il nome “FAI” è di proprietà del Fondo Ambiente Italiano.
- Tutti i contenuti testuali, multimediali e informativi restano di proprietà dei rispettivi titolari.
- FAInder si limita a **rimandare alle pagine ufficiali** del sito FAI, senza duplicarne i contenuti.

Se il FAI o altri titolari dei diritti ritengono che questo progetto violi in qualsiasi modo le loro policy, sono invitati a contattare l’autore per una rapida rimozione o modifica.

---

## � Contribuire

### Come Contribuire

1. **Fork** il repository
2. **Crea un branch**: `git checkout -b feature/nuova-funzionalita`
3. **Commit**: `git commit -m 'Aggiungi nuova funzionalità'`
4. **Push**: `git push origin feature/nuova-funzionalita`
5. **Pull Request**: Apri una PR su GitHub

### Aree di Contributo

- **Bug Fix**: Correzioni e miglioramenti
- **Features**: Nuove funzionalità per l'app
- **Documentation**: Miglioramento documentazione
- **Data Quality**: Miglioramento script scraping

### Linee Guida

- Mantieni il codice pulito e commentato
- Segui le convenzioni TypeScript/React
- Testa le modifiche su più piattaforme
- Aggiorna la documentazione se necessario

I dati generati da questo progetto sono destinati a:

- ricerca
- sperimentazione
- visualizzazione geografica
- uso educativo e non commerciale

Non è garantita l’accuratezza, completezza o attualità delle informazioni.

---

## � Documentazione Dettagliata

Per documentazione tecnica approfondita, consulta la cartella [`docs/`](./docs):

- **[🚀 Sviluppo](./docs/DEVELOPMENT.md)** - Guida completa sviluppo app mobile
### App Mobile
- React Native con Expo
- React Native Maps per la visualizzazione geografica
- AsyncStorage per il tracciamento locale
- Expo Location per i servizi di geolocalizzazione

### Web
- Applicazione web client-side per la visualizzazione

---

## 📜 Licenza

Il codice del progetto è distribuito sotto licenza **MIT License**.

- **Codice**: [MIT License](./LICENSE) - uso, modifica, distribuzione liberi
- **Dati**: Soggetti alle condizioni d'uso del sito FAI di origine
- **Attribuzione**: Mantenere copyright e licenza in copie

### Cosa Puoi Fare

✅ **Uso Commerciale**: Utilizzare il software per scopi commerciali  
✅ **Modifica**: Modificare il codice sorgente  
✅ **Distribuzione**: Distribuire copie modificate o originali  
✅ **Uso Privato**: Utilizzare privatamente senza obbligo di distribuzione  

### Condizioni

⚠️ **Copyright**: Includere il copyright originale in tutte le copie  
⚠️ **License**: Includere una copia della licenza MIT  
⚠️ **Attribution**: Mantenere notice di copyright e licenza  

### Limitazioni

❌ **Responsabilità**: Nessuna garanzia o responsabilità dell'autore  
❌ **Dati FAI**: I dati dei beni FAI rimangono di proprietà del FAI  

---

## ✉️ Contatti

Per segnalazioni, richieste o problemi:
- apri una **Issue** su GitHub
- oppure contatta l'autore tramite il profilo GitHub
