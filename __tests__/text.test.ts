import { decodeHtmlEntities, truncateText } from '@/lib/text';

describe('decodeHtmlEntities', () => {
  it('decodifica le entità più comuni nei testi FAI', () => {
    expect(decodeHtmlEntities('Citt&agrave; d&#39;arte &amp; natura')).toBe("Città d'arte & natura");
    expect(decodeHtmlEntities('&ldquo;Villa&rdquo;&nbsp;&ndash; 5&euro;')).toBe('"Villa" – 5€');
  });

  it('sostituisce tutte le occorrenze, non solo la prima', () => {
    expect(decodeHtmlEntities('perch&eacute; s&eacute;')).toBe('perché sé');
  });

  it('lascia invariato il testo senza entità e le entità sconosciute', () => {
    expect(decodeHtmlEntities('Castello di Masino')).toBe('Castello di Masino');
    expect(decodeHtmlEntities('&copy; FAI')).toBe('&copy; FAI');
  });
});

describe('truncateText', () => {
  it('non tocca i testi entro il limite', () => {
    expect(truncateText('breve')).toBe('breve');
    expect(truncateText('a'.repeat(200))).toBe('a'.repeat(200));
  });

  it('taglia a 200 caratteri e aggiunge i puntini', () => {
    expect(truncateText('a'.repeat(201))).toBe('a'.repeat(200) + '...');
  });

  it('toglie lo spazio finale prima dei puntini', () => {
    expect(truncateText('ciao mondo', 5)).toBe('ciao...');
  });
});
