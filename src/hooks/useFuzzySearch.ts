
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
    threshold = 0.4, // More lenient matching (0 = perfect match, 1 = match anything)
    keys = ['name', 'description', 'category'],
    includeScore = false
  } = options;

  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: keys.map(key => ({ name: key, weight: key === 'name' ? 3 : 1 })), // Prioritize name matches
      threshold,
      includeScore,
      ignoreLocation: true,
      findAllMatches: true,
      minMatchCharLength: 1,
      includeMatches: true,
      shouldSort: true,
      distance: 100, // Allow matches further apart
      useExtendedSearch: true, // Enable extended search patterns
    });
  }, [items, threshold, includeScore]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      console.log('No search query, returning all items:', items.length);
      return items;
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();
    console.log('Searching for:', trimmedQuery);
    console.log('Available items:', items.map(item => item.name));
    
    // First try exact fuzzy search
    let results = fuse.search(trimmedQuery);
    
    // If no results with current threshold, try with very lenient threshold
    if (results.length === 0) {
      console.log('No results with current threshold, trying lenient search...');
      const lenientFuse = new Fuse(items, {
        keys: keys.map(key => ({ name: key, weight: key === 'name' ? 3 : 1 })),
        threshold: 0.8, // Very lenient
        ignoreLocation: true,
        findAllMatches: true,
        minMatchCharLength: 1,
        includeMatches: true,
        shouldSort: true,
        distance: 200,
      });
      results = lenientFuse.search(trimmedQuery);
    }
    
    // If still no results, try partial matching
    if (results.length === 0) {
      console.log('Still no results, trying partial matching...');
      const partialMatches = items.filter(item => {
        const searchText = `${item.name} ${item.description} ${item.category}`.toLowerCase();
        return searchText.includes(trimmedQuery) || 
               trimmedQuery.split('').every(char => searchText.includes(char));
      });
      console.log('Partial matches found:', partialMatches.map(item => item.name));
      return partialMatches;
    }
    
    console.log('Fuse search results:', results.length);
    
    const mappedResults = results.map(result => result.item);
    console.log('Mapped results:', mappedResults.map(item => item.name));
    
    return mappedResults;
  }, [fuse, searchQuery, items, keys]);

  return {
    results: searchResults,
    fuse
  };
};
