import {
  computeCategoryStats,
  computeSeasonStats,
  countVisitsByYear,
  filterVisibleIds,
  filterVisibleVisits,
  seasonOfMonth,
  topCategories,
  topPlacesByYear,
  topSeason,
  UNCATEGORIZED,
} from '@/lib/stats';
import { FaiPoint, VisitedPlace } from '@/lib/types';

const NOW = new Date(2026, 10, 11, 12); // 11 novembre 2026, ora locale

const point = (id: number, categories: [number, string][] = []): FaiPoint => ({
  id,
  title: `Luogo ${id}`,
  lat: 45,
  lng: 9,
  url: `https://fondoambiente.it/luoghi/${id}`,
  categories: categories.map(([cid, name]) => ({ id: cid, name })),
});

const ARTE: [number, string] = [8, 'Arte'];
const CIBO: [number, string] = [9, 'Cibo'];

const points = [point(1, [ARTE]), point(2, [ARTE, CIBO]), point(3, [CIBO]), point(4)];

const visit = (id: number, visitDate: string = ''): VisitedPlace => ({ id, visitDate });
// Mezzogiorno locale: l'anno e il mese non dipendono dal fuso orario di chi esegue i test
const on = (year: number, month: number, day: number = 15) => new Date(year, month - 1, day, 12).toISOString();

describe('visite visibili', () => {
  it('scarta le visite a luoghi non più presenti nei dati', () => {
    expect(filterVisibleVisits([visit(1), visit(99)], points, new Set())).toEqual([visit(1)]);
  });

  it('scarta visite e preferiti di categorie nascoste', () => {
    const hidden = new Set([9]);
    expect(filterVisibleVisits([visit(1), visit(2), visit(4)], points, hidden).map(v => v.id)).toEqual([1, 4]);
    expect(Array.from(filterVisibleIds(new Set([1, 3, 99]), points, hidden))).toEqual([1]);
  });
});

describe('countVisitsByYear', () => {
  it('conta le visite per anno', () => {
    const visits = [visit(1, on(2025, 6)), visit(2, on(2026, 1)), visit(3, on(2026, 3))];
    expect(countVisitsByYear(visits, NOW)).toEqual({ 2025: 1, 2026: 2 });
  });

  it('attribuisce all\'anno corrente le visite senza data o con data non valida', () => {
    expect(countVisitsByYear([visit(1), visit(2, 'non una data')], NOW)).toEqual({ 2026: 2 });
  });

  it('separa correttamente le visite a cavallo d\'anno', () => {
    const visits = [visit(1, on(2025, 12, 31)), visit(2, on(2026, 1, 1))];
    expect(countVisitsByYear(visits, NOW)).toEqual({ 2025: 1, 2026: 1 });
  });

  it('senza visite restituisce un oggetto vuoto', () => {
    expect(countVisitsByYear([], NOW)).toEqual({});
  });
});

describe('computeCategoryStats', () => {
  it('conta visitati, preferiti e non interessati per ogni categoria del luogo', () => {
    const stats = computeCategoryStats(points, [visit(1), visit(2)], new Set([2, 3]), new Set([3]));
    expect(stats).toEqual({
      Arte: { visited: 2, favorites: 1, notInterested: 0 },
      Cibo: { visited: 1, favorites: 2, notInterested: 1 },
      [UNCATEGORIZED]: { visited: 0, favorites: 0, notInterested: 0 },
    });
  });

  it('raccoglie i luoghi senza categoria sotto "Senza categoria"', () => {
    const stats = computeCategoryStats([point(4)], [visit(4)], new Set(), new Set());
    expect(stats).toEqual({ [UNCATEGORIZED]: { visited: 1, favorites: 0, notInterested: 0 } });
  });
});

describe('topCategories', () => {
  it('ordina per visite decrescenti e rispetta il limite', () => {
    const stats = {
      A: { visited: 1, favorites: 0, notInterested: 0 },
      B: { visited: 5, favorites: 0, notInterested: 0 },
      C: { visited: 3, favorites: 0, notInterested: 0 },
    };
    expect(topCategories(stats, 2).map(([name]) => name)).toEqual(['B', 'C']);
  });
});

describe('topPlacesByYear', () => {
  it('restituisce i luoghi visitati in quell\'anno, nell\'ordine di visita', () => {
    const visits = [visit(3, on(2026, 2)), visit(1, on(2025, 5)), visit(2, on(2026, 4)), visit(4, on(2026, 5))];
    expect(topPlacesByYear(visits, points, 2026, NOW, 2).map(p => p.id)).toEqual([3, 2]);
    expect(topPlacesByYear(visits, points, 2024, NOW)).toEqual([]);
  });
});

describe('stagioni', () => {
  it('assegna i mesi alle stagioni (mesi da 0 a 11)', () => {
    expect([11, 0, 1].map(seasonOfMonth)).toEqual(['Inverno', 'Inverno', 'Inverno']);
    expect([2, 3, 4].map(seasonOfMonth)).toEqual(['Primavera', 'Primavera', 'Primavera']);
    expect([5, 6, 7].map(seasonOfMonth)).toEqual(['Estate', 'Estate', 'Estate']);
    expect([8, 9, 10].map(seasonOfMonth)).toEqual(['Autunno', 'Autunno', 'Autunno']);
  });

  it('conta le visite per stagione; senza data vale il mese corrente', () => {
    const visits = [visit(1, on(2026, 4)), visit(2, on(2026, 7)), visit(3, on(2025, 7)), visit(4)];
    expect(computeSeasonStats(visits, NOW)).toEqual({ Primavera: 1, Estate: 2, Autunno: 1, Inverno: 0 });
  });

  it('sceglie la stagione con più visite', () => {
    expect(topSeason({ Primavera: 1, Estate: 4, Autunno: 2, Inverno: 0 })).toBe('Estate');
  });

  it('a parità (anche senza visite) vince l\'ultima nell\'ordine', () => {
    expect(topSeason({ Primavera: 0, Estate: 0, Autunno: 0, Inverno: 0 })).toBe('Inverno');
    expect(topSeason({ Primavera: 2, Estate: 2, Autunno: 0, Inverno: 0 })).toBe('Estate');
  });
});
