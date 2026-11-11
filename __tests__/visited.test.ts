import { parseVisited, serializeVisited } from '@/lib/visited';

describe('parseVisited', () => {
  it('legge il formato con soli id', () => {
    expect(parseVisited('[3, 7]')).toEqual([
      { id: 3, visitDate: '' },
      { id: 7, visitDate: '' },
    ]);
  });

  it('legge il formato con id e data', () => {
    const stored = JSON.stringify([{ id: 3, visitDate: '2026-02-14T10:00:00.000Z' }, { id: 7 }]);
    expect(parseVisited(stored)).toEqual([
      { id: 3, visitDate: '2026-02-14T10:00:00.000Z' },
      { id: 7, visitDate: '' },
    ]);
  });

  it('scarta duplicati ed elementi non validi', () => {
    expect(parseVisited('[3, 3, "x", null, {"id": "4"}, {"id": 5}]')).toEqual([
      { id: 3, visitDate: '' },
      { id: 5, visitDate: '' },
    ]);
  });

  it('restituisce una lista vuota per dati assenti o corrotti', () => {
    expect(parseVisited(null)).toEqual([]);
    expect(parseVisited('')).toEqual([]);
    expect(parseVisited('{non json')).toEqual([]);
    expect(parseVisited('{"id": 1}')).toEqual([]);
  });
});

describe('serializeVisited', () => {
  it('salva id e data, con data vuota se non nota', () => {
    const dates = new Map([[3, '2026-02-14T10:00:00.000Z']]);
    expect(JSON.parse(serializeVisited(new Set([3, 7]), dates))).toEqual([
      { id: 3, visitDate: '2026-02-14T10:00:00.000Z' },
      { id: 7, visitDate: '' },
    ]);
  });

  it('è l\'inverso di parseVisited', () => {
    const places = [{ id: 1, visitDate: '2025-06-01T00:00:00.000Z' }, { id: 2, visitDate: '' }];
    const dates = new Map(places.map(p => [p.id, p.visitDate]));
    expect(parseVisited(serializeVisited(places.map(p => p.id), dates))).toEqual(places);
  });
});
