
import { useMemo } from 'react';
import { Product } from '@/components/products/ProductCard';

interface UseFuzzySearchOptions {
  threshold?: number;
  keys?: string[];
  includeScore?: boolean;
}

export const useFuzzySearch = (
  items: Product[], 
  searchQuery: string,
  options: UseFuzzySearchOptions = {}
) => {
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.trim().toLowerCase();
    
    return items.filter(item => {
      const name = item.name.toLowerCase();
      const description = item.description?.toLowerCase() || '';
      
      // Simple substring matching
      return name.includes(query) || description.includes(query);
    });
  }, [searchQuery, items]);

  return {
    results: searchResults
  };
};
