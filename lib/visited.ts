import { VisitedPlace } from './types';

/**
 * Legge i luoghi visitati salvati in AsyncStorage.
 * Accetta entrambi i formati usati dall'app: array di id (`[1, 2]`)
 * e array di oggetti (`[{ id, visitDate }]`). Tutto il resto dà una lista vuota.
 */
export const parseVisited = (stored: string | null | undefined): VisitedPlace[] => {
  if (!stored) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const seen = new Set<number>();
  const places: VisitedPlace[] = [];
  parsed.forEach(item => {
    let place: VisitedPlace | null = null;
    if (typeof item === 'number') {
      place = { id: item, visitDate: '' };
    } else if (item && typeof item === 'object' && typeof item.id === 'number') {
      place = { id: item.id, visitDate: typeof item.visitDate === 'string' ? item.visitDate : '' };
    }
    if (place && !seen.has(place.id)) {
      seen.add(place.id);
      places.push(place);
    }
  });
  return places;
};

/** Serializza i luoghi visitati mantenendo le date note. */
export const serializeVisited = (ids: Iterable<number>, visitDates: Map<number, string>): string =>
  JSON.stringify(Array.from(ids).map(id => ({ id, visitDate: visitDates.get(id) ?? '' })));
