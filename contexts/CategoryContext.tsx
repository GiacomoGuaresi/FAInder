import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Category {
  id: number;
  name: string;
}

interface CategoryContextType {
  availableCategories: Category[];
  setAvailableCategories: (categories: Category[]) => void;
  selectedCategories: Set<number>;
  toggleCategory: (categoryId: number) => void;
  clearCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());

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

  return (
    <CategoryContext.Provider value={{
      availableCategories,
      setAvailableCategories,
      selectedCategories,
      toggleCategory,
      clearCategories,
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
