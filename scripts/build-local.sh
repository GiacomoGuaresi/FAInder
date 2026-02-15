#!/bin/bash

# Script per build locale dell'app Android
# Esegue prebuild pulito e build locale con EAS

echo "🚀 Inizio build locale dell'app Android..."

# Step 1: Prebuild pulito
echo "📱 Eseguendo prebuild pulito..."
npx expo prebuild --clean --non-interactive

if [ $? -ne 0 ]; then
    echo "❌ Errore durante il prebuild"
    echo "💡 Controlla che la configurazione in app.config.js sia corretta"
    exit 1
fi

echo "✅ Prebuild completato con successo"

# Step 2: Build locale Android
echo "🔨 Eseguendo build locale Android..."
npx eas build --platform android --profile production --local --clear-cache --non-interactive

if [ $? -ne 0 ]; then
    echo "❌ Errore durante la build"
    echo "💡 Controlla che EAS sia configurato correttamente"
    exit 1
fi

echo "🎉 Build completata con successo!"
echo "📁 L'APK è stato generato nella directory di output"
