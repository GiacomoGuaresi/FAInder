# Contribuire a FAInder

Grazie per il tuo interesse a contribuire a FAInder! Questo documento ti guiderà attraverso il processo di contribuzione.

## 🚀 Come Iniziare

### 1. Fork e Clone

```bash
# Fork il repository su GitHub
# Clona il tuo fork
git clone https://github.com/TUO_USERNAME/FAI-nder.git
cd FAI-nder

# Aggiungi upstream repository
git remote add upstream https://github.com/GiacomoGuaresi/FAI-nder.git
```

### 2. Setup Ambiente

Segui la [guida sviluppo](DEVELOPMENT.md) per configurare il tuo ambiente.

### 3. Crea un Branch

```bash
# Sincronizza con upstream
git fetch upstream
git checkout main
git merge upstream/main

# Crea branch per la tua feature
git checkout -b feature/nome-feature
# oppure
git checkout -b fix/descrizione-bug
```

## 📝 Tipi di Contributi

### 🐛 Bug Reports

Segnala bug usando GitHub Issues:

1. Usa template bug report
2. Fornisci dettagli: piattaforma, versione, steps
3. Allega screenshot se applicabile
4. Includi logs/error messages

### ✨ Feature Requests

Proponi nuove funzionalità:

1. Apri una Issue con label "enhancement"
2. Descrivi il caso d'uso
3. Spiega perché sarebbe utile
4. Suggerisci implementazione se possibile

### 💻 Code Contributions

#### Areas di Contributo

- **App Mobile**: Nuove funzionalità, UI improvements
- **Data Pipeline**: Miglioramenti scraping, data quality
- **Documentation**: README, docs, code comments
- **Testing**: Unit tests, integration tests
- **Performance**: Optimizations, bug fixes

#### Development Workflow

1. **Sviluppo**
   ```bash
   # Installa dipendenze
   npm install
   
   # Sviluppa la tua feature
   npm start
   ```

2. **Testing**
   ```bash
   # Test su più piattaforme
   npm run android
   npm run ios
   npm run web
   
   # Controlla linting
   npm run lint
   ```

3. **Commit**
   ```bash
   # Staging changes
   git add .
   
   # Commit con message convenzionale
   git commit -m "feat(map): add user location tracking"
   ```

4. **Push e PR**
   ```bash
   # Push al tuo fork
   git push origin feature/nome-feature
   
   # Apri Pull Request su GitHub
   ```

## 📋 Convenzioni

### Commit Messages

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: Nuova funzionalità
- `fix`: Bug fix
- `docs`: Documentazione
- `style`: Code style (no functional changes)
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Build process, dependencies

**Examples:**
```
feat(map): add user location tracking
fix(navigation): resolve tab switching issue  
docs(readme): update setup instructions
test(scraper): add unit tests for data parsing
```

### Code Style

#### TypeScript/React

```typescript
// Component interface
interface Props {
  title: string;
  onPress: () => void;
  visible?: boolean;
}

// Functional component
const MyComponent: React.FC<Props> = ({ 
  title, 
  onPress, 
  visible = true 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePress = useCallback(() => {
    setIsLoading(true);
    onPress();
  }, [onPress]);
  
  if (!visible) return null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyComponent;
```

#### Python (Script Scraping)

```python
def clean_html(html_text: str) -> Optional[str]:
    """Rimuove i tag HTML dal testo e pulisce il contenuto.
    
    Args:
        html_text: Testo HTML da pulire
        
    Returns:
        Testo pulito senza tag HTML o None se vuoto
    """
    if not html_text:
        return None
    
    # Rimuovi i tag HTML
    text = re.sub(r'<[^>]+>', '', html_text)
    
    # Pulisci spazi multipli
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text if text else None
```

### File Organization

```
src/
├── components/
│   ├── ui/           # Base UI components
│   └── features/     # Feature-specific components
├── hooks/            # Custom hooks
├── services/         # API services
├── utils/            # Utility functions
└── types/            # TypeScript types
```

## 🧪 Testing

### Unit Tests

```bash
# Esegui tests
npm test

# Coverage
npm run test:coverage
```

### Manual Testing Checklist

Prima di submit una PR, verifica:

- [ ] App compilia senza errori
- [ ] Funziona su Android
- [ ] Funziona su iOS (se possibile)
- [ ] Funziona su Web
- [ ] Non ci sono regressioni
- [ ] UI è responsive
- [ ] Performance accettabile

### Test Data

Per test con dati FAI:

```bash
# Usa dati di test esistenti
cp data/beni-fai.json data/beni-fai.test.json

# O genera subset per test
python scripts/fetch_beni_fai.py --test-mode
```

## 📖 Documentation

### Aggiornare Docs

Quando aggiungi funzionalità:

1. Aggiorna README se necessario
2. Documenta nuove funzioni in docs/
3. Aggiungi code comments per logica complessa
4. Aggiorna API documentation se cambi endpoint

### Documentation Style

- Usa Markdown per docs
- Includi esempi di codice
- Aggiungi screenshot per UI changes
- Mantieni docs in italiano (come progetto)

## 🔄 Review Process

### Pull Request Requirements

1. **Title**: Descrittivo e convenzionale
2. **Description**: Spiega changes e motivation
3. **Tests**: Include tests se applicabile
4. **Docs**: Aggiorna documentazione
5. **Screenshots**: Per UI changes

### Review Checklist

I reviewers verificheranno:

- Code follows project conventions
- No breaking changes
- Tests pass
- Documentation updated
- Performance acceptable
- Security considerations

### Merge Process

1. PR approved by maintainer
2. CI/CD checks pass
3. No conflicts with main
4. Squash merge (unless otherwise specified)

## 🏷️ Labels e Milestones

### Issue Labels

- `bug`: Bug reports
- `enhancement`: Feature requests
- `documentation`: Doc improvements
- `good first issue`: Beginner-friendly
- `help wanted`: Needs contribution
- `priority/high`: High priority

### Milestones

- `v1.1.0`: Next minor release
- `v2.0.0`: Major release (future)
- `backlog`: Future considerations

## 🎯 Roadmap

### Current Focus

- [ ] Improve map performance
- [ ] Add offline mode
- [ ] Enhanced search functionality
- [ ] Better error handling

### Future Features

- [ ] User accounts and sync
- [ ] Photo integration
- [ ] Social features
- [ ] AR mode

## 💬 Communication

### Canali

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Pull Requests**: Code reviews

### Etichette

- Sii costruttivo nei feedback
- Rispetta tempo dei volontari
- Fornisci contesto sufficiente
- Sii paziente con review process

## 🏆 Riconoscimenti

### Contributors

I contributi principali saranno riconosciuti in:

- README contributors section
- Release notes
- App credits (se appropriato)

### Recognition Types

- **Code Contributors**: PRs merged
- **Bug Hunters**: Critical bug reports
- **Documentation**: Doc improvements
- **Community**: Support in discussions

## 📄 License

Contribuendo accetti che il tuo codice sarà:

- Sotto la stessa MIT license
- Mantenuto nel repository
- Attribution in project credits

## 🆘 Aiuto e Supporto

### Domande Comuni

**Q: Come posso testare su dispositivo reale?**
A: Usa Expo Go app e scansiona QR code da `expo start`

**Q: Posso contribuire senza conoscere React Native?**
A: Sì! Contributi a documentation, data pipeline, e testing sono benvenuti

**Q: Come segnalo un security issue?**
A: Contatta direttamente il maintainer, non usare public issues

### Getting Help

1. Cerca in existing issues e discussions
2. Leggi documentation disponibile
3. Apri nuova issue con dettagli
4. Partecipa a GitHub discussions

---

Grazie per contribuire a FAInder! 🎉

Ogni contributo, grande o piccolo, è apprezzato e aiuta a migliorare il progetto per tutta la community.
