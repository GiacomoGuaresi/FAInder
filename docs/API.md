# API Documentation FAInder

## 🔌 Fonte Dati FAI

FAInder utilizza le API pubbliche del Fondo Ambiente Italiano per recuperare informazioni sui luoghi.

### Endpoint Principale

```
GET https://platform.fondoambiente.it/api/luoghi/faixme
```

### Parametri Query

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `limit` | number | Numero risultati per pagina (default: 300) |
| `page` | number | Numero pagina (paginazione) |
| `slug` | string | Filtro per slug (es: "null|NOT" per escludere null) |
| `with` | string | Include relazioni (es: "luogo") |

### Esempio Request

```bash
curl "https://platform.fondoambiente.it/api/luoghi/faixme?limit=300&page=1&slug=null|NOT&with=luogo"
```

## 📤 Struttura Response API

### Response Format

```json
{
  "data": [
    {
      "id": "12345",
      "descrizione_html": "<p>Descrizione con HTML...</p>",
      "luogo": {
        "id": "67890",
        "nome": "Nome Luogo",
        "slug": "nome-luogo",
        "coord_geo_lat": 45.1234,
        "coord_geo_long": 9.5678
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 300,
    "total": 1500
  }
}
```

### Campi Utilizzati da FAInder

Solo un sottoinsieme dei dati viene utilizzato:

#### Dati Luogo (`luogo` object)
- `id`: ID numerico univoco
- `nome`: Nome del luogo
- `slug`: Slug per URL
- `coord_geo_lat`: Latitudine
- `coord_geo_long`: Longitudine

#### Dati Offerta
- `id`: ID offerta
- `descrizione_html`: Descrizione in formato HTML

## 🔄 Processo di Trasformazione

### Script: `scripts/fetch_beni_fai.py`

Lo script esegue le seguenti operazioni:

1. **Paginazione**: Recupera tutti i dati paginando l'API
2. **Filtraggio**: Mantiene solo luoghi con coordinate valide
3. **Pulizia HTML**: Rimuove tag HTML dalle descrizioni
4. **Normalizzazione**: Crea struttura JSON coerente
5. **Deduplicazione**: Rimuove luoghi duplicati

### Logica di Filtraggio

```python
# Solo luoghi con coordinate valide
if lat is None or lng is None:
    continue

# Rimuovi duplicati per ID
if lid in luoghi:
    continue
```

### Pulizia HTML

```python
def clean_html(html_text):
    """Rimuove i tag HTML dal testo e pulisce il contenuto."""
    if not html_text:
        return None
    
    # Rimuovi i tag HTML
    text = re.sub(r'<[^>]+>', '', html_text)
    
    # Pulisci spazi multipli e caratteri speciali
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Rimuovi caratteri di escape
    text = text.replace('\r', '').replace('\n', ' ')
    
    return text if text else None
```

## 📦 Output: `data/beni-fai.json`

### Struttura Finale

```json
[
  {
    "id": "67890",
    "title": "Nome Luogo",
    "lat": 45.1234,
    "lng": 9.5678,
    "url": "https://fondoambiente.it/luoghi/nome-luogo",
    "description": "Descrizione pulita del luogo"
  }
]
```

### Mapping Campi

| Campo Output | Sorgente API | Descrizione |
|--------------|--------------|-------------|
| `id` | `luogo.id` | ID univoco luogo |
| `title` | `luogo.nome` | Nome visualizzato |
| `lat` | `luogo.coord_geo_lat` | Latitudine |
| `lng` | `luogo.coord_geo_long` | Longitudine |
| `url` | `luogo.slug` | URL pagina FAI |
| `description` | `descrizione_html` | Descrizione pulita |

## ⚡ Performance e Limitazioni

### Rate Limiting

- **Richieste**: 1 richiesta ogni 0.3 secondi
- **Timeout**: 30 secondi per richiesta
- **Paginazione**: 300 risultati per pagina

### Limitazioni Conosciute

1. **Dinamicità**: L'API potrebbe cambiare senza preavviso
2. **Disponibilità**: Servizio potrebbe essere temporaneamente non disponibile
3. **Completezza**: Alcuni luoghi potrebbero non avere coordinate complete

### Error Handling

```python
try:
    r = requests.get(BASE_URL, params=params, timeout=30)
    r.raise_for_status()
except requests.exceptions.RequestException as e:
    log.error(f"Errore richiesta API: {e}")
    # Gestione errore e retry
```

## 🔄 Aggiornamento Automatico

### GitHub Actions

Il workflow `.github/workflows/update-beni.yml` esegue:

1. **Trigger**: Ogni giorno a mezzanotte UTC
2. **Setup**: Python environment
3. **Fetch**: Esegue script scraping
4. **Commit**: Salva cambiamenti se presenti

### Manuale Update

```bash
# Esegui manualmente
python scripts/fetch_beni_fai.py

# Output example
12:34:56 | INFO    | 🚀 Avvio scraping FAI (solo luoghi)
12:34:57 | INFO    | ➡️  Fetch pagina 1
12:34:58 | INFO    | 📦 Ricevute 300 offerte
...
12:35:45 | INFO    | 📍 Luoghi unici salvati: 1234
12:35:45 | INFO    | 💾 File scritto: data/beni-fai.json
12:35:45 | INFO    | ✅ FINE
```

## 🛡️ Sicurezza e Privacy

### Dati Pubblici

- Solo endpoint pubblici senza autenticazione
- Nessun bypass di protezioni
- Dati già accessibili pubblicamente

### Best Practices

- User-Agent standard
- Timeout appropriati
- Rate limiting rispettato
- Nessun storage di dati sensibili

## 🐛 Troubleshooting

### Issues Comuni

#### API Non Risponde
```bash
# Test connessione
curl -I https://platform.fondoambiente.it/api/luoghi/faixme
```

#### Coordinate Mancanti
```python
# Log luoghi senza coordinate
if lat is None or lng is None:
    log.debug(f"❌ Luogo {lid} senza coordinate")
```

#### HTML Parsing Errori
```python
# Test pulizia HTML
test_html = "<p>Test <b>bold</b> text</p>"
clean = clean_html(test_html)
print(clean)  # "Test bold text"
```

### Debug Logging

Abilita debug logging modificando:

```python
logging.basicConfig(level=logging.DEBUG)
```

## 📊 Statistiche Dati

### Tipici Output Stats

```
📊 Offerte totali API: 1500+
📍 Luoghi unici salvati: 1200+
💾 File size: ~500KB
```

### Coverage

- **Nord Italia**: ~60% dei luoghi
- **Centro Italia**: ~25% dei luoghi  
- **Sud Italia**: ~15% dei luoghi

## 🔄 Versioning API

### Compatibility

Lo script è testato con:
- Python 3.11+
- requests 2.28+
- Standard library modules

### Breaking Changes

Se l'API FAI cambia:
1. Controlla response structure
2. Aggiorna script parsing
3. Test mapping campi
4. Aggiorna documentazione
