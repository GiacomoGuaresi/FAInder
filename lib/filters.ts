import { Category, FaiPoint } from './types';

/** Categorie uniche presenti nei punti, ordinate per nome. */
export const extractCategories = (points: FaiPoint[]): Category[] => {
  const categoryMap = new Map<number, string>();
  points.forEach(point => {
    if (point.categories) {
      point.categories.forEach(category => {
        categoryMap.set(category.id, category.name);
      });
    }
  });
  return Array.from(categoryMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

/** Filtro della mappa: nessuna categoria selezionata = tutti i punti. */
export const filterBySelectedCategories = (points: FaiPoint[], selected: Set<number>): FaiPoint[] => {
  if (selected.size === 0) {
    return points;
  }
  return points.filter(point =>
    !!point.categories &&
    point.categories.some(category => selected.has(category.id))
  );
};

/** Un punto è nascosto se almeno una sua categoria è tra quelle nascoste. */
export const isHiddenByCategory = (point: FaiPoint, hidden: Set<number>): boolean => {
  if (!point.categories || point.categories.length === 0) {
    return false;
  }
  return point.categories.some(category => hidden.has(category.id));
};

export const filterVisiblePoints = (points: FaiPoint[], hidden: Set<number>): FaiPoint[] =>
  points.filter(point => !isHiddenByCategory(point, hidden));
