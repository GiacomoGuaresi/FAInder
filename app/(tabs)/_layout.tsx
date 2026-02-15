import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useRef, useState } from 'react';
import { Animated, Image, ImageSourcePropType, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCategoryContext } from '../../contexts/CategoryContext';

const logo: ImageSourcePropType = require('@/assets/images/LOGO.png');
const faiFavicon: ImageSourcePropType = require('@/assets/images/fai-website-favicon.png'); // TODO: Download from fondoambiente.it

function CustomHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.headerTitle}>FAInder</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 16,
  },
  logo: {
    width: 80,
    height: 32,
    tintColor: '#e74f30',
    marginRight: -20,
    marginLeft: -20,
  },
  themeBar: {
    height: 28,
    backgroundColor: '#e74f30',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: 'white',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop:36,
    paddingBottom:8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeSidebarButton: {
    padding: 8,
  },
  sidebarContent: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  propertiesHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  propertiesHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Account for back button width
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  placeholder: {
    width: 40, // Match back button width for centering
  },
  categorySection: {
    marginTop: 8,
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  clearFiltersButton: {
    padding: 4,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f8f8f8',
    marginBottom: 6,
  },
  categoryItemSelected: {
    backgroundColor: '#e74f30',
  },
  categoryCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryCheckboxSelected: {
    backgroundColor: '#e74f30',
    borderColor: '#e74f30',
  },
  categoryCheckboxInner: {
    width: 8,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  categoryTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 320,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterModalClose: {
    padding: 4,
  },
  filterModalList: {
    maxHeight: 300,
  },
  filterModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clearFiltersButtonModal: {
    padding: 8,
  },
  applyFiltersButton: {
    backgroundColor: '#e74f30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyFiltersText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  filterMapButton: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    flexDirection: 'row',
    width: 50,
    height: 50,
  },
  filterMapButtonActive: {
    backgroundColor: '#e74f30',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#e74f30',
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const router = useRouter();
  const { availableCategories, selectedCategories, toggleCategory, clearCategories } = useCategoryContext();
  
  // Animation values
  const sidebarTranslateX = useRef(new Animated.Value(-280)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -280 : 0;
    const overlayToValue = isSidebarOpen ? 0 : 1;

    setIsSidebarOpen(!isSidebarOpen);

    // Animate sidebar
    Animated.spring(sidebarTranslateX, {
      toValue,
      tension: 300,
      friction: 30,
      useNativeDriver: true,
    }).start();

    // Animate overlay
    Animated.timing(overlayOpacity, {
      toValue: overlayToValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const navigateToLuoghiPreferiti = () => {
    toggleSidebar();
    router.push('/(tabs)/luoghi-preferiti');
  };

  const navigateToLuoghiVisitati = () => {
    toggleSidebar();
    router.push('/(tabs)/luoghi-visitati');
  };

  const navigateToLuoghiNonInteressati = () => {
    toggleSidebar();
    router.push('/(tabs)/luoghi-non-interessati');
  };

  const navigateToTuttiLuoghi = () => {
    toggleSidebar();
    router.push('/(tabs)/tutti-luoghi');
  };

  const navigateToAbout = () => {
    toggleSidebar();
    router.push('/(tabs)/about');
  };

  const openFaiWebsite = async () => {
    toggleSidebar();
    await WebBrowser.openBrowserAsync('https://www.fondoambiente.it/');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Sidebar Overlay */}
      <Animated.View 
        style={[styles.overlay, { opacity: overlayOpacity }]} 
        pointerEvents={isSidebarOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          style={{ flex: 1 }} 
          onPress={toggleSidebar}
          activeOpacity={1}
        />
      </Animated.View>
      
      {/* Sidebar */}
      <Animated.View 
        style={[
          styles.sidebar, 
          { transform: [{ translateX: sidebarTranslateX }] }
        ]}
      >
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Menu</Text>
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeSidebarButton}>
            <Ionicons name="close" size={24} color="#333333" />
          </TouchableOpacity>
        </View>
        <View style={styles.sidebarContent}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToLuoghiPreferiti}
          >
            <Ionicons name="star" size={20} color="#FFD700" style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Luoghi Preferiti</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToLuoghiVisitati}
          >
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Luoghi Visitati</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToLuoghiNonInteressati}
          >
            <Ionicons name="eye-off" size={20} color="#666" style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Luoghi Non Interessati</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToTuttiLuoghi}
          >
            <Ionicons name="map" size={20} color="#e74f30" style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Tutti gli Altri Luoghi</Text>
          </TouchableOpacity>
          
          <View style={{ flex: 1 }} />
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: '#f0f0f0' }]}
            onPress={navigateToAbout}
          >
            <Ionicons name="information-circle-outline" size={20} color="#e74f30" style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={openFaiWebsite}
          >
            <Image source={faiFavicon} style={[styles.menuItemIcon, { width: 20, height: 20, resizeMode: 'contain' }]} />
            <Text style={styles.menuItemText}>Sito FAI</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Barra arancione */}
      <View style={styles.themeBar} />
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#e74f30',
          tabBarStyle: {
            backgroundColor: 'white',
          },
          tabBarActiveBackgroundColor: '#e74f30',
          headerShown: true,
          header: () => <CustomHeader />,
          headerStyle: {
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
          },
          headerTintColor: '#e74f30',
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }) => <Ionicons name="menu" size={28} color={color} />,
            headerShown: false,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              toggleSidebar();
            },
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Mappa beni',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="map.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Tessera FAI',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="creditcard.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="luoghi-preferiti"
          options={{
            title: 'Luoghi Preferiti',
            href: null, // Hide from tab bar, only accessible via sidebar
            tabBarStyle: { display: 'none' }, // Hide tab bar on this screen
            headerShown: true,
            header: () => (
              <View style={styles.propertiesHeader}>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#333333" />
                </TouchableOpacity>
                <Text style={styles.propertiesHeaderTitle}>Luoghi Preferiti</Text>
                <View style={styles.placeholder} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="luoghi-visitati"
          options={{
            title: 'Luoghi Visitati',
            href: null, // Hide from tab bar, only accessible via sidebar
            tabBarStyle: { display: 'none' }, // Hide tab bar on this screen
            headerShown: true,
            header: () => (
              <View style={styles.propertiesHeader}>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#333333" />
                </TouchableOpacity>
                <Text style={styles.propertiesHeaderTitle}>Luoghi Visitati</Text>
                <View style={styles.placeholder} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="luoghi-non-interessati"
          options={{
            title: 'Luoghi Non Interessati',
            href: null, // Hide from tab bar, only accessible via sidebar
            tabBarStyle: { display: 'none' }, // Hide tab bar on this screen
            headerShown: true,
            header: () => (
              <View style={styles.propertiesHeader}>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#333333" />
                </TouchableOpacity>
                <Text style={styles.propertiesHeaderTitle}>Luoghi Non Interessati</Text>
                <View style={styles.placeholder} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="tutti-luoghi"
          options={{
            title: 'Tutti gli Altri Luoghi',
            href: null, // Hide from tab bar, only accessible via sidebar
            tabBarStyle: { display: 'none' }, // Hide tab bar on this screen
            headerShown: true,
            header: () => (
              <View style={styles.propertiesHeader}>
                <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#333333" />
                </TouchableOpacity>
                <Text style={styles.propertiesHeaderTitle}>Tutti gli Altri Luoghi</Text>
                <View style={styles.placeholder} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            href: null, // Hide from tab bar, only accessible via sidebar
            tabBarStyle: { display: 'none' }, // Hide tab bar on this screen
            headerShown: false, // Use custom header in the component
          }}
        />
      </Tabs>

      {/* Filter Button Overlay - only show on map screen */}
      {availableCategories.length > 0 && (
        <TouchableOpacity 
          style={[
            styles.filterMapButton,
            selectedCategories.size > 0 && styles.filterMapButtonActive
          ]}
          onPress={openFilterModal}
        >
          <Ionicons 
            name="funnel" 
            size={16} 
            color={selectedCategories.size > 0 ? "white" : "#333"} 
          />
          {selectedCategories.size > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{selectedCategories.size}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeFilterModal}
      >
        <TouchableOpacity 
          style={styles.filterModalOverlay} 
          activeOpacity={1}
          onPress={closeFilterModal}
        >
          <TouchableOpacity 
            style={styles.filterModalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filtra per Categoria</Text>
              <TouchableOpacity onPress={closeFilterModal} style={styles.filterModalClose}>
                <Ionicons name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filterModalList} showsVerticalScrollIndicator={false}>
              {availableCategories.map((category) => {
                const isSelected = selectedCategories.has(category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      isSelected && styles.categoryItemSelected
                    ]}
                    onPress={() => toggleCategory(category.id)}
                  >
                    <View style={[
                      styles.categoryCheckbox,
                      isSelected && styles.categoryCheckboxSelected
                    ]}>
                      {isSelected && <View style={styles.categoryCheckboxInner} />}
                    </View>
                    <Text style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextSelected
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
            <View style={styles.filterModalFooter}>
              <TouchableOpacity 
                onPress={clearCategories} 
                style={styles.clearFiltersButtonModal}
                disabled={selectedCategories.size === 0}
              >
                <Ionicons 
                  name="close-circle" 
                  size={20} 
                  color={selectedCategories.size > 0 ? "#e74f30" : "#ccc"} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={closeFilterModal}
              >
                <Text style={styles.applyFiltersText}>Applica</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
