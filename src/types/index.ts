export interface Asset {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  url: string;
  category: string;
  createdAt: string;
}

export interface CardData {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
}
