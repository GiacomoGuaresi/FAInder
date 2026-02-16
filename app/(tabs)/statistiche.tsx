import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCategoryContext } from '../../contexts/CategoryContext';

interface FaiPoint {
  id: number;
  title: string;
  lat: number;
  lng: number;
  url: string;
  description?: string;
  categories?: Category[];
}

interface Category {
  id: number;
  name: string;
}

interface VisitedPlace {
  id: number;
  visitDate: string;
}

const FAI_DATA_URL = 'https://raw.githubusercontent.com/GiacomoGuaresi/FAInder/main/data/beni-fai.json';
const VISITED_STORAGE_KEY = 'fai_visited_places';
const FAVORITES_STORAGE_KEY = 'fai_favorites_places';
const NOT_INTERESTED_STORAGE_KEY = 'fai_not_interested_places';

const screenWidth = Dimensions.get('window').width;

export default function StatisticheScreen() {
  const [loading, setLoading] = useState(true);
  const [faiPoints, setFaiPoints] = useState<FaiPoint[]>([]);
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>([]);
  const [favoritesIds, setFavoritesIds] = useState<Set<number>>(new Set());
  const [notInterestedIds, setNotInterestedIds] = useState<Set<number>>(new Set());
  const { hiddenCategories } = useCategoryContext();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(FAI_DATA_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FaiPoint[] = await response.json();
        setFaiPoints(data);
      } catch (error) {
        console.error('Error fetching FAI points:', error);
        try {
          const localData = require('../../data/beni-fai.json');
          setFaiPoints(localData);
        } catch (localError) {
          console.error('Error loading local data:', localError);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const [visitedStored, favoritesStored, notInterestedStored] = await Promise.all([
            AsyncStorage.getItem(VISITED_STORAGE_KEY),
            AsyncStorage.getItem(FAVORITES_STORAGE_KEY),
            AsyncStorage.getItem(NOT_INTERESTED_STORAGE_KEY)
          ]);

          if (visitedStored) {
            setVisitedPlaces(JSON.parse(visitedStored));
          }

          if (favoritesStored) {
            setFavoritesIds(new Set(JSON.parse(favoritesStored)));
          }

          if (notInterestedStored) {
            setNotInterestedIds(new Set(JSON.parse(notInterestedStored)));
          }
        } catch (error) {
          console.error('Error loading stored data:', error);
        }
      })();
    }, [])
  );

  // Filtra i luoghi escludendo quelli delle categorie nascoste
  const visiblePoints = faiPoints.filter(point => {
    if (!point.categories || point.categories.length === 0) {
      return true;
    }
    return !point.categories.some(category => hiddenCategories.has(category.id));
  });

  const filteredVisitedPlaces = visitedPlaces.filter(vp => {
    const point = faiPoints.find(p => p.id === vp.id);
    if (!point) return false;
    if (!point.categories || point.categories.length === 0) return true;
    return !point.categories.some(category => hiddenCategories.has(category.id));
  });

  const filteredFavoritesIds = new Set(
    Array.from(favoritesIds).filter(id => {
      const point = faiPoints.find(p => p.id === id);
      if (!point) return false;
      if (!point.categories || point.categories.length === 0) return true;
      return !point.categories.some(category => hiddenCategories.has(category.id));
    })
  );

  // Statistiche per anno
  const currentYear = new Date().getFullYear();
  const visitsByYear = filteredVisitedPlaces.reduce((acc, place) => {
    let year: number;
    
    if (!place.visitDate || place.visitDate === '') {
      year = currentYear;
    } else {
      try {
        const date = new Date(place.visitDate);
        year = isNaN(date.getTime()) ? currentYear : date.getFullYear();
      } catch {
        year = currentYear;
      }
    }
    
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Statistiche per categoria
  const categoryStats = visiblePoints.reduce((acc, point) => {
    if (point.categories && point.categories.length > 0) {
      point.categories.forEach(category => {
        if (!acc[category.name]) {
          acc[category.name] = {
            visited: 0,
            favorites: 0,
            notInterested: 0
          };
        }
        
        if (filteredVisitedPlaces.some(vp => vp.id === point.id)) {
          acc[category.name].visited++;
        }
        if (filteredFavoritesIds.has(point.id)) {
          acc[category.name].favorites++;
        }
        if (notInterestedIds.has(point.id)) {
          acc[category.name].notInterested++;
        }
      });
    } else {
      if (!acc['Senza categoria']) {
        acc['Senza categoria'] = {
          visited: 0,
          favorites: 0,
          notInterested: 0
        };
      }
      
      if (filteredVisitedPlaces.some(vp => vp.id === point.id)) {
        acc['Senza categoria'].visited++;
      }
      if (filteredFavoritesIds.has(point.id)) {
        acc['Senza categoria'].favorites++;
      }
      if (notInterestedIds.has(point.id)) {
        acc['Senza categoria'].notInterested++;
      }
    }
    return acc;
  }, {} as Record<string, { visited: number; favorites: number; notInterested: number }>);

  // Top luoghi visitati per anno
  const getTopPlacesByYear = (year: number, limit: number = 3) => {
    const yearVisits = filteredVisitedPlaces.filter(vp => {
      let visitYear: number;
      if (!vp.visitDate || vp.visitDate === '') {
        visitYear = currentYear;
      } else {
        try {
          const date = new Date(vp.visitDate);
          visitYear = isNaN(date.getTime()) ? currentYear : date.getFullYear();
        } catch {
          visitYear = currentYear;
        }
      }
      return visitYear === year;
    });

    return yearVisits
      .map(vp => faiPoints.find(p => p.id === vp.id))
      .filter(Boolean)
      .slice(0, limit);
  };

  // Stagioni preferite
  const getSeasonStats = () => {
    const seasons = { Primavera: 0, Estate: 0, Autunno: 0, Inverno: 0 };
    
    filteredVisitedPlaces.forEach(vp => {
      let month: number;
      if (!vp.visitDate || vp.visitDate === '') {
        month = new Date().getMonth();
      } else {
        try {
          const date = new Date(vp.visitDate);
          month = isNaN(date.getTime()) ? new Date().getMonth() : date.getMonth();
        } catch {
          month = new Date().getMonth();
        }
      }

      if (month >= 2 && month <= 4) seasons.Primavera++;
      else if (month >= 5 && month <= 7) seasons.Estate++;
      else if (month >= 8 && month <= 10) seasons.Autunno++;
      else seasons.Inverno++;
    });

    return seasons;
  };

  const seasonStats = getSeasonStats();
  const topSeason = Object.entries(seasonStats).reduce((a, b) => a[1] > b[1] ? a : b)[0];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Preparando il tuo viaggio...</Text>
      </View>
    );
  }

  const totalVisits = filteredVisitedPlaces.length;
  const totalFavorites = filteredFavoritesIds.size;
  const topCategories = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b.visited - a.visited)
    .slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Il tuo {currentYear}</Text>
          <Text style={styles.headerSubtitle}>Un anno di scoperte FAI</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
            <Text style={styles.statNumber}>{totalVisits}</Text>
            <Text style={styles.statLabel}>Luoghi visitati</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="star" size={32} color="#FFD700" />
            <Text style={styles.statNumber}>{totalFavorites}</Text>
            <Text style={styles.statLabel}>Preferiti</Text>
          </View>
        </View>

        {/* Top Categories */}
        {topCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Le tue categorie preferite</Text>
            {topCategories.map(([category, stats], index) => (
              <View key={category} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryRank}>#{index + 1}</Text>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryCount}>{stats.visited} visite</Text>
                </View>
                <View style={styles.categoryBar}>
                  <View style={[
                    styles.categoryBarFill, 
                    { width: `${Math.min((stats.visited / Math.max(...topCategories.map(([,s]) => s.visited))) * 100, 100)}%` }
                  ]} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Season Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>La tua stagione preferita</Text>
          <View style={styles.seasonCard}>
            <Text style={styles.seasonEmoji}>
              {topSeason === 'Primavera' ? '🌸' : topSeason === 'Estate' ? '☀️' : topSeason === 'Autunno' ? '🍂' : '❄️'}
            </Text>
            <Text style={styles.seasonName}>{topSeason}</Text>
            <Text style={styles.seasonCount}>{seasonStats[topSeason as keyof typeof seasonStats]} visite</Text>
          </View>
        </View>

        {/* Year by Year */}
        {Object.keys(visitsByYear).length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Il tuo viaggio nel tempo</Text>
            {Object.entries(visitsByYear)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([year, count]) => (
                <View key={year} style={styles.yearCard}>
                  <Text style={styles.yearText}>{year}</Text>
                  <Text style={styles.yearCount}>{count} luoghi</Text>
                </View>
              ))}
          </View>
        )}

        {/* Recent Top Places */}
        {Object.keys(visitsByYear).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I tuoi luoghi del cuore</Text>
            {Object.entries(visitsByYear)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 2)
              .map(([year]) => {
                const topPlaces = getTopPlacesByYear(parseInt(year), 2);
                return (
                  <View key={year} style={styles.yearSection}>
                    <Text style={styles.yearSectionTitle}>{year}</Text>
                    {topPlaces.map((place, index) => {
                      if (!place) return null;
                      return (
                        <View key={place.id} style={styles.placeCard}>
                          <Text style={styles.placeRank}>{index + 1}</Text>
                          <Text style={styles.placeName} numberOfLines={1}>
                            {place.title.replace(/&#39;/g, "'").replace(/&quot;/g, '"')}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
          </View>
        )}

        {/* Fun Facts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Curiosità</Text>
          <View style={styles.factCard}>
            <Ionicons name="time" size={24} color="#e74f30" />
            <Text style={styles.factText}>
              Hai visitato luoghi per {Object.keys(visitsByYear).length} {Object.keys(visitsByYear).length === 1 ? 'anno' : 'anni'}
            </Text>
          </View>
          
          {topCategories.length > 0 && (
            <View style={styles.factCard}>
              <Ionicons name="trophy" size={24} color="#e74f30" />
              <Text style={styles.factText}>
                La tua categoria top è "{topCategories[0][0]}" con {topCategories[0][1].visited} visite
              </Text>
            </View>
          )}
          
          {totalVisits > 0 && (
            <View style={styles.factCard}>
              <Ionicons name="heart" size={24} color="#e74f30" />
              <Text style={styles.factText}>
                Hai segnato come preferiti {totalFavorites} luoghi
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Continua a esplorare i tesori d'Italia!</Text>
          <Ionicons name="map" size={32} color="#fff" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e74f30',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
    backgroundColor: '#e74f30',
    paddingVertical: 30,
    borderRadius: 16,
    marginHorizontal: 20,
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e74f30',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoryCard: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryRank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74f30',
    marginRight: 12,
    minWidth: 30,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
  categoryBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  categoryBarFill: {
    height: '100%',
    backgroundColor: '#e74f30',
    borderRadius: 2,
  },
  seasonCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  seasonEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  seasonName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  seasonCount: {
    fontSize: 16,
    color: '#666',
  },
  yearCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  yearText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  yearCount: {
    fontSize: 16,
    color: '#e74f30',
    fontWeight: '600',
  },
  yearSection: {
    marginBottom: 20,
  },
  yearSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74f30',
    marginRight: 12,
    minWidth: 20,
  },
  placeName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  factCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: '#e74f30',
    paddingVertical: 20,
    borderRadius: 16,
    marginHorizontal: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
});
