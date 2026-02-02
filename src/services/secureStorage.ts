import * as SecureStore from 'expo-secure-store';
import { CardData } from '../types';

const CARD_STORAGE_KEY = 'user_card_data';

export async function saveCardData(cardData: CardData): Promise<void> {
  const jsonValue = JSON.stringify(cardData);
  await SecureStore.setItemAsync(CARD_STORAGE_KEY, jsonValue);
}

export async function getCardData(): Promise<CardData | null> {
  const jsonValue = await SecureStore.getItemAsync(CARD_STORAGE_KEY);
  if (!jsonValue) return null;
  return JSON.parse(jsonValue) as CardData;
}

export async function deleteCardData(): Promise<void> {
  await SecureStore.deleteItemAsync(CARD_STORAGE_KEY);
}

export async function hasCardData(): Promise<boolean> {
  const data = await SecureStore.getItemAsync(CARD_STORAGE_KEY);
  return data !== null;
}
