
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
    threshold = 0.4,
    keys = ['name', 'description', 'category'],
    includeScore = false
  } = options;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      console.log('No search query, returning all items:', items.length);
      return items;
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();
    console.log('Searching for:', trimmedQuery);
    console.log('Available items:', items.map(item => item.name));
    
    // For specific product searches (like "tomato"), prioritize name matches heavily
    const isSpecificProductSearch = trimmedQuery.length > 2 && !trimmedQuery.includes(' ');
    
    const fuseConfig = {
      keys: isSpecificProductSearch 
        ? [
            { name: 'name', weight: 10 }, // Heavy weight on name for specific searches
            { name: 'description', weight: 2 },
            { name: 'category', weight: 0.1 } // Very low weight on category
          ]
        : [
            { name: 'name', weight: 3 },
            { name: 'description', weight: 1 },
            { name: 'category', weight: 1 }
          ],
      threshold: isSpecificProductSearch ? 0.3 : threshold, // Stricter for specific searches
      includeScore,
      ignoreLocation: true,
      findAllMatches: true,
      minMatchCharLength: 1,
      includeMatches: true,
      shouldSort: true,
      distance: isSpecificProductSearch ? 50 : 100, // Shorter distance for specific searches
      useExtendedSearch: true,
    };

    const fuse = new Fuse(items, fuseConfig);
    
    // First try exact fuzzy search
    let results = fuse.search(trimmedQuery);
    
    // If we're searching for a specific product and got too many results,
    // filter to only include items where the name closely matches
    if (isSpecificProductSearch && results.length > 0) {
      const nameMatchResults = results.filter(result => {
        const itemName = result.item.name.toLowerCase();
        return itemName.includes(trimmedQuery) || trimmedQuery.includes(itemName.split(' ')[0]);
      });
      
      if (nameMatchResults.length > 0) {
        results = nameMatchResults;
      }
    }
    
    // If no results with current threshold, try with more lenient threshold only for general searches
    if (results.length === 0 && !isSpecificProductSearch) {
      console.log('No results with current threshold, trying lenient search...');
      const lenientFuse = new Fuse(items, {
        keys: keys.map(key => ({ name: key, weight: key === 'name' ? 3 : 1 })),
        threshold: 0.8,
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
        if (isSpecificProductSearch) {
          // For specific searches, only match names
          return item.name.toLowerCase().includes(trimmedQuery);
        } else {
          // For general searches, match all fields
          const searchText = `${item.name} ${item.description} ${item.category}`.toLowerCase();
          return searchText.includes(trimmedQuery);
        }
      });
      console.log('Partial matches found:', partialMatches.map(item => item.name));
      return partialMatches;
    }
    
    console.log('Fuse search results:', results.length);
    
    const mappedResults = results.map(result => result.item);
    console.log('Mapped results:', mappedResults.map(item => item.name));
    
    return mappedResults;
  }, [searchQuery, items, keys, threshold, includeScore]);

  return {
    results: searchResults
  };
};
