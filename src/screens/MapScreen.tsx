import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { Asset } from '../types';
import { getAllAssets } from '../database/database';
import { openExternalUrl } from '../utils/linking';

const INITIAL_REGION: Region = {
  latitude: 45.0,
  longitude: 10.0,
  latitudeDelta: 50,
  longitudeDelta: 50,
};

export default function MapScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await getAllAssets();
      setAssets(data);
    } catch (err) {
      setError('Failed to load assets from database');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = useCallback((asset: Asset) => {
    Alert.alert(
      asset.name,
      asset.description,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Link',
          onPress: () => openExternalUrl(asset.url),
        },
      ]
    );
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading assets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={false}
        showsCompass={true}
        showsScale={true}
      >
        {assets.map((asset) => (
          <Marker
            key={asset.id}
            coordinate={{
              latitude: asset.latitude,
              longitude: asset.longitude,
            }}
            title={asset.name}
            description={asset.description}
            onCalloutPress={() => handleMarkerPress(asset)}
          >
            <Callout tooltip={false}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{asset.name}</Text>
                <Text style={styles.calloutDescription}>{asset.description}</Text>
                <Text style={styles.calloutHint}>Tap to open link</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  callout: {
    width: 200,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  calloutHint: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
});
