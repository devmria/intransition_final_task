import { createContext, useContext, useEffect, useState } from 'react';
import { CategoryData } from '@intransition/shared-types';
import { CategoryService } from '~services/Category/CategoryService';

interface CategoriesContextProps {
  categories: CategoryData[]
}

const CategoriesContext = createContext<CategoriesContextProps>({
  categories: [],
});

export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await CategoryService.getCategories();
        setCategories(data.categories);
      } catch (error) {
        setCategories([]);
      } 
    };
    loadCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);