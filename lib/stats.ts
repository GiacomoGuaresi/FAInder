import { isHiddenByCategory } from './filters';
import { FaiPoint, VisitedPlace } from './types';

export interface CategoryStat {
  visited: number;
  favorites: number;
  notInterested: number;
}

export type Season = 'Primavera' | 'Estate' | 'Autunno' | 'Inverno';

export const UNCATEGORIZED = 'Senza categoria';

/** Data della visita; se manca o non è valida si usa `now`. */
const visitDateOrNow = (place: VisitedPlace, now: Date): Date => {
  if (!place.visitDate) {
    return now;
  }
  const date = new Date(place.visitDate);
  return isNaN(date.getTime()) ? now : date;
};

export const visitYear = (place: VisitedPlace, now: Date): number =>
  visitDateOrNow(place, now).getFullYear();

/** Visite a luoghi ancora presenti nei dati e non nascosti per categoria. */
export const filterVisibleVisits = (
  visits: VisitedPlace[],
  points: FaiPoint[],
  hidden: Set<number>
): VisitedPlace[] => {
  const byId = new Map(points.map(point => [point.id, point]));
  return visits.filter(visit => {
    const point = byId.get(visit.id);
    return !!point && !isHiddenByCategory(point, hidden);
  });
};

export const filterVisibleIds = (
  ids: Set<number>,
  points: FaiPoint[],
  hidden: Set<number>
): Set<number> => {
  const byId = new Map(points.map(point => [point.id, point]));
  return new Set(
    Array.from(ids).filter(id => {
      const point = byId.get(id);
      return !!point && !isHiddenByCategory(point, hidden);
    })
  );
};

export const countVisitsByYear = (visits: VisitedPlace[], now: Date): Record<number, number> =>
  visits.reduce((acc, place) => {
    const year = visitYear(place, now);
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

export const computeCategoryStats = (
  points: FaiPoint[],
  visits: VisitedPlace[],
  favorites: Set<number>,
  notInterested: Set<number>
): Record<string, CategoryStat> => {
  const visitedIds = new Set(visits.map(visit => visit.id));

  return points.reduce((acc, point) => {
    const names =
      point.categories && point.categories.length > 0
        ? point.categories.map(category => category.name)
        : [UNCATEGORIZED];

    names.forEach(name => {
      if (!acc[name]) {
        acc[name] = { visited: 0, favorites: 0, notInterested: 0 };
      }
      if (visitedIds.has(point.id)) acc[name].visited++;
      if (favorites.has(point.id)) acc[name].favorites++;
      if (notInterested.has(point.id)) acc[name].notInterested++;
    });
    return acc;
  }, {} as Record<string, CategoryStat>);
};

export const topCategories = (
  stats: Record<string, CategoryStat>,
  limit: number = 3
): [string, CategoryStat][] =>
  Object.entries(stats)
    .sort(([, a], [, b]) => b.visited - a.visited)
    .slice(0, limit);

export const topPlacesByYear = (
  visits: VisitedPlace[],
  points: FaiPoint[],
  year: number,
  now: Date,
  limit: number = 3
): FaiPoint[] => {
  const byId = new Map(points.map(point => [point.id, point]));
  return visits
    .filter(visit => visitYear(visit, now) === year)
    .map(visit => byId.get(visit.id))
    .filter((point): point is FaiPoint => !!point)
    .slice(0, limit);
};

export const seasonOfMonth = (month: number): Season => {
  if (month >= 2 && month <= 4) return 'Primavera';
  if (month >= 5 && month <= 7) return 'Estate';
  if (month >= 8 && month <= 10) return 'Autunno';
  return 'Inverno';
};

export const computeSeasonStats = (visits: VisitedPlace[], now: Date): Record<Season, number> => {
  const seasons: Record<Season, number> = { Primavera: 0, Estate: 0, Autunno: 0, Inverno: 0 };
  visits.forEach(visit => {
    seasons[seasonOfMonth(visitDateOrNow(visit, now).getMonth())]++;
  });
  return seasons;
};

/** A parità vince la stagione che viene dopo nell'ordine Primavera → Inverno. */
export const topSeason = (stats: Record<Season, number>): Season =>
  (Object.entries(stats) as [Season, number][]).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
