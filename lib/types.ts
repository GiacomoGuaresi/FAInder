export interface Category {
  /** Nei dati la categoria fissa "Bene FAI" ha id `null`. */
  id: number;
  name: string;
}

export interface FaiPoint {
  id: number;
  title: string;
  lat: number;
  lng: number;
  url: string;
  description?: string;
  categories?: Category[];
}

export interface VisitedPlace {
  id: number;
  /** ISO date string; empty when the visit was recorded without a date. */
  visitDate: string;
}
