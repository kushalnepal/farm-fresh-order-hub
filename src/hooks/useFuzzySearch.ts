
import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { Product } from '@/components/products/ProductCard';

interface UseFuzzySearchOptions {
  threshold?: number;
  keys?: string[];
  includeScore?: boolean;
}

// Calculate Levenshtein distance for better typo handling
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[len2][len1];
};

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
    
    // First try standard Fuse.js search with lenient settings
    const fuseConfig = {
      keys: [
        { name: 'name', weight: 0.8 },
        { name: 'description', weight: 0.2 },
        { name: 'category', weight: 0.1 }
      ],
      threshold: 0.7, // Very lenient
      includeScore,
      ignoreLocation: true,
      findAllMatches: true,
      minMatchCharLength: 1,
      includeMatches: true,
      shouldSort: true,
      distance: 200,
      useExtendedSearch: false,
    };

    const fuse = new Fuse(items, fuseConfig);
    let results = fuse.search(trimmedQuery);
    
    console.log('Fuse results:', results.length);
    
    // If Fuse didn't find results, try custom typo-tolerant matching
    if (results.length === 0) {
      console.log('No Fuse results, trying typo-tolerant search...');
      
      const typoMatches = items.filter(item => {
        const itemName = item.name.toLowerCase();
        
        // Check exact substring match first
        if (itemName.includes(trimmedQuery)) {
          return true;
        }
        
        // Check if query is a typo of the item name
        const maxDistance = Math.floor(Math.max(trimmedQuery.length, itemName.length) * 0.4);
        const distance = levenshteinDistance(trimmedQuery, itemName);
        
        if (distance <= maxDistance) {
          return true;
        }
        
        // Check if query matches beginning of words
        const words = itemName.split(' ');
        return words.some(word => {
          const wordDistance = levenshteinDistance(trimmedQuery, word);
          return wordDistance <= Math.floor(word.length * 0.4);
        });
      });
      
      console.log('Typo matches found:', typoMatches.map(item => item.name));
      return typoMatches;
    }
    
    const mappedResults = results.map(result => result.item);
    console.log('Final results:', mappedResults.map(item => item.name));
    
    return mappedResults;
  }, [searchQuery, items, keys, threshold, includeScore]);

  return {
    results: searchResults
  };
};
