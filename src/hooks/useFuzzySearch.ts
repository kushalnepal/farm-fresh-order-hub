
import { useMemo } from 'react';
import Fuse from 'fuse.js';
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
  const {
    threshold = 0.6, // More lenient matching (0 = perfect match, 1 = match anything)
    keys = ['name', 'description', 'category'],
    includeScore = false
  } = options;

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys,
      threshold,
      includeScore,
      ignoreLocation: true,
      findAllMatches: true,
      minMatchCharLength: 1, // Allow single character matches
      includeMatches: true,
      shouldSort: true,
    });
  }, [items, threshold, includeScore]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      console.log('No search query, returning all items:', items.length);
      return items;
    }

    console.log('Searching for:', searchQuery);
    console.log('Available items:', items.map(item => item.name));
    
    const results = fuse.search(searchQuery);
    console.log('Fuse search results:', results);
    
    const mappedResults = results.map(result => result.item);
    console.log('Mapped results:', mappedResults.map(item => item.name));
    
    return mappedResults;
  }, [fuse, searchQuery, items]);

  return {
    results: searchResults,
    fuse
  };
};
