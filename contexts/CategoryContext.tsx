import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
}

interface CategoryContextType {
  availableCategories: Category[];
  setAvailableCategories: (categories: Category[]) => void;
  selectedCategories: Set<number>;
  hiddenCategories: Set<number>;
  toggleCategory: (categoryId: number) => void;
  toggleHiddenCategory: (categoryId: number) => void;
  clearCategories: () => void;
  clearHiddenCategories: () => void;
}

const CATEGORY_FILTERS_STORAGE_KEY = 'fai_category_filters';
const HIDDEN_CATEGORIES_STORAGE_KEY = 'fai_hidden_categories';

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [hiddenCategories, setHiddenCategories] = useState<Set<number>>(new Set());

  // Carica i filtri salvati all'avvio
  useEffect(() => {
    (async () => {
      try {
        const [stored, hiddenStored] = await Promise.all([
          AsyncStorage.getItem(CATEGORY_FILTERS_STORAGE_KEY),
          AsyncStorage.getItem(HIDDEN_CATEGORIES_STORAGE_KEY)
        ]);
        
        if (stored) {
          const savedCategories = JSON.parse(stored);
          setSelectedCategories(new Set(savedCategories));
        }
        
        if (hiddenStored) {
          const savedHiddenCategories = JSON.parse(hiddenStored);
          setHiddenCategories(new Set(savedHiddenCategories));
        }
      } catch (error) {
        console.error('Error loading category filters:', error);
      }
    })();
  }, []);

  // Salva i filtri quando cambiano
  useEffect(() => {
    (async () => {
      try {
        if (selectedCategories.size > 0) {
          await AsyncStorage.setItem(CATEGORY_FILTERS_STORAGE_KEY, JSON.stringify(Array.from(selectedCategories)));
        } else {
          await AsyncStorage.removeItem(CATEGORY_FILTERS_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error saving category filters:', error);
      }
    })();
  }, [selectedCategories]);

  // Salva le categorie nascoste quando cambiano
  useEffect(() => {
    (async () => {
      try {
        if (hiddenCategories.size > 0) {
          await AsyncStorage.setItem(HIDDEN_CATEGORIES_STORAGE_KEY, JSON.stringify(Array.from(hiddenCategories)));
        } else {
          await AsyncStorage.removeItem(HIDDEN_CATEGORIES_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error saving hidden categories:', error);
      }
    })();
  }, [hiddenCategories]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const clearCategories = () => {
    setSelectedCategories(new Set());
  };

  const toggleHiddenCategory = (categoryId: number) => {
    setHiddenCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const clearHiddenCategories = () => {
    setHiddenCategories(new Set());
  };

  return (
    <CategoryContext.Provider value={{
      availableCategories,
      setAvailableCategories,
      selectedCategories,
      hiddenCategories,
      toggleCategory,
      toggleHiddenCategory,
      clearCategories,
      clearHiddenCategories,
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
}
