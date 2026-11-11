import {
  extractCategories,
  filterBySelectedCategories,
  filterVisiblePoints,
  isHiddenByCategory,
} from '@/lib/filters';
import { FaiPoint } from '@/lib/types';

// Nei dati reali la categoria "Bene FAI" ha id null
const BENE_FAI_ID = null as unknown as number;

const point = (id: number, categories?: [number, string][]): FaiPoint => ({
  id,
  title: `Luogo ${id}`,
  lat: 45,
  lng: 9,
  url: `https://fondoambiente.it/luoghi/${id}`,
  categories: categories?.map(([cid, name]) => ({ id: cid, name })),
});

const points: FaiPoint[] = [
  point(1, [[8, "Visitare luoghi d'arte"]]),
  point(2, [[9, 'Soggiornare e mangiare'], [8, "Visitare luoghi d'arte"]]),
  point(3, [[BENE_FAI_ID, 'Bene FAI']]),
  point(4, []),
  point(5),
];

describe('extractCategories', () => {
  it('restituisce le categorie uniche ordinate per nome', () => {
    expect(extractCategories(points)).toEqual([
      { id: BENE_FAI_ID, name: 'Bene FAI' },
      { id: 9, name: 'Soggiornare e mangiare' },
      { id: 8, name: "Visitare luoghi d'arte" },
    ]);
  });

  it('gestisce una lista vuota', () => {
    expect(extractCategories([])).toEqual([]);
  });
});

describe('filterBySelectedCategories', () => {
  it('senza selezione restituisce tutti i punti', () => {
    expect(filterBySelectedCategories(points, new Set())).toBe(points);
  });

  it('tiene i punti con almeno una categoria selezionata', () => {
    const ids = filterBySelectedCategories(points, new Set([9])).map(p => p.id);
    expect(ids).toEqual([2]);
  });

  it('esclude i punti senza categorie quando c\'è una selezione', () => {
    const ids = filterBySelectedCategories(points, new Set([8])).map(p => p.id);
    expect(ids).toEqual([1, 2]);
  });

  it('funziona con la categoria "Bene FAI" (id null)', () => {
    const ids = filterBySelectedCategories(points, new Set([BENE_FAI_ID])).map(p => p.id);
    expect(ids).toEqual([3]);
  });
});

describe('categorie nascoste', () => {
  it('nasconde un punto se una sua categoria è nascosta', () => {
    expect(isHiddenByCategory(points[1], new Set([9]))).toBe(true);
    expect(isHiddenByCategory(points[0], new Set([9]))).toBe(false);
  });

  it('non nasconde mai i punti senza categorie', () => {
    expect(isHiddenByCategory(points[3], new Set([8, 9]))).toBe(false);
    expect(isHiddenByCategory(points[4], new Set([8, 9]))).toBe(false);
  });

  it('filterVisiblePoints toglie solo i punti nascosti', () => {
    const ids = filterVisiblePoints(points, new Set([8])).map(p => p.id);
    expect(ids).toEqual([3, 4, 5]);
  });
});
