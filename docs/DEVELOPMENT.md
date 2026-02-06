# Guida Sviluppo FAInder

## 🚀 Setup Ambiente di Sviluppo

### Prerequisiti

- Node.js 18+ 
- Expo CLI
- Python 3.11+
- Git
- Dispositivo Android/iOS o emulatori

### Installazione

```bash
# Clona il repository
git clone https://github.com/GiacomoGuaresi/FAI-nder.git
cd FAI-nder

# Installa dipendenze Node.js
npm install

# Installa dipendenze Python (per scraping)
pip install requests
```

### Configurazione Variabili d'Ambiente

```bash
# Copia il template
cp .env.example .env

# L'app usa OpenStreetMap, non sono richieste API key
# Il file .env è vuoto o contiene configurazioni opzionali
```

## 📱 Sviluppo App Mobile

### Avvio Development Server

```bash
# Avvia Expo development server
npm start
# oppure
expo start
```

### Test su Piattaforme

```bash
# Test su Android
npm run android

# Test su iOS  
npm run ios

# Test su Web
npm run web
```

### Expo DevTools

Quando avvii `expo start`, vedrai un QR code e opzioni:

- Scansiona QR code con Expo Go app (mobile)
- Premi `a` per Android emulator
- Premi `i` per iOS simulator  
- Premi `w` per web browser
- Premi `d` per aprire Expo DevTools

## 🗺️ Gestione Dati

### Aggiornamento Manuale Dati FAI

```bash
# Esegui script scraping
python scripts/fetch_beni_fai.py

# Output: data/beni-fai.json aggiornato
```

### Struttura Dati

Il file `data/beni-fai.json` contiene:

```json
[
  {
    "id": "12345",
    "title": "Villa del Balbianello",
    "lat": 45.9876,
    "lng": 9.2345,
    "url": "https://fondoambiente.it/luoghi/villa-del-balbianello",
    "description": "Descrizione del luogo..."
  }
]
```

## 🛠️ Debug e Troubleshooting

### Logging

- **Console Metro**: Vedi logs runtime e errori
- **Expo DevTools**: Ispeziona componenti e stato
- **Device Logs**: Usa `adb logcat` (Android) o Xcode (iOS)

### Issues Comuni

#### Metro non si avvia
```bash
# Clear cache
npm start -- --clear
```

#### Dipendenze corrotte
```bash
# Reinstalla node_modules
rm -rf node_modules package-lock.json
npm install
```

#### Problemi Python script
```bash
# Installa requests
pip install requests

# Controlla versione Python
python --version  # deve essere 3.11+
```

## 📦 Build e Deploy

### Development Build

```bash
# Build locale per test
eas build --platform android --profile development
eas build --platform ios --profile development
```

### Production Build

```bash
# Build production
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

### Configurazione EAS

Il file `eas.json` contiene configurazioni build. Assicurati di:

1. Configurare account Expo
2. Impostare credenziali build (se necessario)
3. Definire profili custom se richiesto

## 🧪 Testing

### Unit Tests

```bash
# Esegui test (quando disponibili)
npm test
```

### Manual Testing Checklist

- [ ] Map loads correctly
- [ ] Location permissions work
- [ ] Check-in functionality
- [ ] Navigation between tabs
- [ ] External links open
- [ ] Data refresh works

## 📝 Code Style

### Linting

```bash
# Controlla stile codice
npm run lint
```

### Convenzioni

- **TypeScript**: Usa tipi forti
- **React**: Functional components con hooks
- **Naming**: camelCase per variabili, PascalCase per componenti
- **Imports**: Groupa imports per tipo

### Struttura Componenti

```typescript
// Component example
import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

export default MyComponent;
```

## 🔄 Workflow Git

### Branch Strategy

- `main`: Branch principale (stabile)
- `develop`: Branch sviluppo
- `feature/*`: Feature specifiche
- `fix/*`: Bug fixes

### Commit Messages

```
type(scope): description

feat(map): add user location tracking
fix(navigation): resolve tab switching issue
docs(readme): update setup instructions
```

## 📚 Risorse Utili

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Expo Router](https://expo.github.io/expo-router/)
- [TypeScript React](https://react-typescript-cheatsheet.netlify.app/)

## 🆘 Supporto

Per problemi di sviluppo:

1. Controlla [GitHub Issues](https://github.com/GiacomoGuaresi/FAI-nder/issues)
2. Consulta documentazione Expo ufficiale
3. Crea nuova issue con dettagli del problema
