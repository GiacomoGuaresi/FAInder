import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { CardData } from '../types';
import { saveCardData, getCardData, deleteCardData } from '../services/secureStorage';

export default function CardScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [hasExistingCard, setHasExistingCard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExistingCard();
  }, []);

  const loadExistingCard = async () => {
    try {
      const existingCard = await getCardData();
      if (existingCard) {
        setCardNumber(existingCard.cardNumber);
        setCardholderName(existingCard.cardholderName);
        setExpirationDate(existingCard.expirationDate);
        setHasExistingCard(true);
      }
    } catch (err) {
      console.error('Failed to load card data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').substring(0, 19) : '';
  };

  const formatExpirationDate = (text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpirationChange = (text: string) => {
    setExpirationDate(formatExpirationDate(text));
  };

  const validateCard = (): boolean => {
    const cleanedNumber = cardNumber.replace(/\s/g, '');
    if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
      Alert.alert('Invalid Card', 'Please enter a valid card number');
      return false;
    }
    if (cardholderName.trim().length < 2) {
      Alert.alert('Invalid Name', 'Please enter the cardholder name');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
      Alert.alert('Invalid Date', 'Please enter expiration date as MM/YY');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateCard()) return;

    try {
      const cardData: CardData = {
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardholderName: cardholderName.trim(),
        expirationDate,
      };
      await saveCardData(cardData);
      setHasExistingCard(true);
      Alert.alert('Success', 'Card saved securely');
    } catch (err) {
      Alert.alert('Error', 'Failed to save card data');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCardData();
              setCardNumber('');
              setCardholderName('');
              setExpirationDate('');
              setHasExistingCard(false);
              Alert.alert('Deleted', 'Card removed from secure storage');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete card data');
              console.error(err);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Card Number</Text>
          <TextInput
            style={styles.input}
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
            autoComplete="cc-number"
          />

          <Text style={styles.cardLabel}>Cardholder Name</Text>
          <TextInput
            style={styles.input}
            value={cardholderName}
            onChangeText={setCardholderName}
            placeholder="JOHN DOE"
            autoCapitalize="characters"
            autoComplete="cc-name"
          />

          <Text style={styles.cardLabel}>Expiration Date</Text>
          <TextInput
            style={[styles.input, styles.smallInput]}
            value={expirationDate}
            onChangeText={handleExpirationChange}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
            autoComplete="cc-exp"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {hasExistingCard ? 'Update Card' : 'Save Card'}
          </Text>
        </TouchableOpacity>

        {hasExistingCard && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Card</Text>
          </TouchableOpacity>
        )}

        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            🔒 Your card data is stored securely using encrypted storage on your device.
            No data is sent to any server.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  smallInput: {
    width: 120,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 18,
    fontWeight: '600',
  },
  securityNote: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#0066cc',
    textAlign: 'center',
    lineHeight: 20,
  },
});
