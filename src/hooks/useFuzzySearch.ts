
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
    threshold = 0.4, // Lower = more strict matching
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
      minMatchCharLength: 2,
    });
  }, [items, threshold, includeScore]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [fuse, searchQuery, items]);

  return {
    results: searchResults,
    fuse
  };
};
