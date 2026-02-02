import * as Linking from 'expo-linking';

export async function openExternalUrl(url: string): Promise<void> {
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    console.warn(`Cannot open URL: ${url}`);
  }
}
