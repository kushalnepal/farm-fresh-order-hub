
import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { Product } from '@/components/products/ProductCard';

interface UseFuzzySearchOptions {
  threshold?: number;
  keys?: string[];
  includeScore?: boolean;
}

// Calculate Levenshtein distance for typo tolerance
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
    threshold = 0.3,
    keys = ['name', 'description'],
    includeScore = false
  } = options;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      console.log('No search query, returning all items:', items.length);
      return items;
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();
    console.log('Searching for:', trimmedQuery);
    
    // Use stricter Fuse.js configuration
    const fuseConfig = {
      keys: [
        { name: 'name', weight: 0.9 }, // Heavily prioritize name matches
        { name: 'description', weight: 0.1 } // Minimal weight for description
      ],
      threshold: 0.3, // Stricter threshold
      includeScore,
      ignoreLocation: true,
      findAllMatches: false, // Only find best matches
      minMatchCharLength: 2, // Require at least 2 characters to match
      includeMatches: true,
      shouldSort: true,
      distance: 50, // Reduce search distance
      useExtendedSearch: false,
    };

    const fuse = new Fuse(items, fuseConfig);
    let results = fuse.search(trimmedQuery);
    
    console.log('Fuse results:', results.length);
    
    // Filter Fuse results to only include reasonable matches
    const filteredFuseResults = results.filter(result => {
      if (result.score && result.score > 0.5) return false; // Remove poor matches
      
      const itemName = result.item.name.toLowerCase();
      
      // Check if there's a reasonable similarity
      const nameDistance = levenshteinDistance(trimmedQuery, itemName);
      const maxAllowedDistance = Math.min(3, Math.floor(trimmedQuery.length * 0.5));
      
      if (nameDistance <= maxAllowedDistance) return true;
      
      // Check if query matches beginning of any word in the name
      const words = itemName.split(' ');
      return words.some(word => {
        const wordDistance = levenshteinDistance(trimmedQuery, word);
        return wordDistance <= Math.min(2, Math.floor(word.length * 0.4));
      });
    });
    
    if (filteredFuseResults.length > 0) {
      const mappedResults = filteredFuseResults.map(result => result.item);
      console.log('Filtered Fuse results:', mappedResults.map(item => item.name));
      return mappedResults;
    }
    
    // If no good Fuse results, try custom typo-tolerant matching
    console.log('No good Fuse results, trying custom matching...');
    
    const customMatches = items.filter(item => {
      const itemName = item.name.toLowerCase();
      
      // Check exact substring match first
      if (itemName.includes(trimmedQuery)) {
        return true;
      }
      
      // Allow very limited typos for exact name matching
      const nameDistance = levenshteinDistance(trimmedQuery, itemName);
      const maxDistance = Math.min(2, Math.floor(Math.min(trimmedQuery.length, itemName.length) * 0.3));
      
      if (nameDistance <= maxDistance && nameDistance <= 2) {
        return true;
      }
      
      // Check if query matches beginning of words (with minimal typos)
      const words = itemName.split(' ');
      return words.some(word => {
        if (word.startsWith(trimmedQuery.substring(0, Math.min(3, trimmedQuery.length)))) {
          const wordDistance = levenshteinDistance(trimmedQuery, word);
          return wordDistance <= Math.min(2, Math.floor(word.length * 0.3));
        }
        return false;
      });
    });
    
    console.log('Custom matches found:', customMatches.map(item => item.name));
    return customMatches;
  }, [searchQuery, items, keys, threshold, includeScore]);

  return {
    results: searchResults
  };
};
