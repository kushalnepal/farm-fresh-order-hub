
import { useMemo } from 'react';
import { Product } from '@/components/products/ProductCard';
import { CartItem } from '@/context/CartContext';

interface UserPurchaseHistory {
  userId: string;
  items: number[]; // product IDs
}

// Simulated user purchase history data
const mockPurchaseHistory: UserPurchaseHistory[] = [
  { userId: 'user1', items: [1, 2] }, // Vegetables + Chicken
  { userId: 'user2', items: [1, 3] }, // Vegetables + Grass
  { userId: 'user3', items: [2, 3] }, // Chicken + Grass
  { userId: 'user4', items: [1, 2, 3] }, // All three
  { userId: 'user5', items: [1, 2] }, // Vegetables + Chicken
  { userId: 'user6', items: [2, 3] }, // Chicken + Grass
];

export const useCollaborativeFiltering = (
  cartItems: CartItem[],
  allProducts: Product[]
) => {
  const recommendations = useMemo(() => {
    if (cartItems.length === 0) {
      return [];
    }

    console.log('Generating collaborative filtering recommendations...');
    
    // Get current cart product IDs
    const cartProductIds = cartItems.map(item => item.id);
    console.log('Cart product IDs:', cartProductIds);
    
    // Find users who bought similar items (collaborative filtering)
    const similarUsers = mockPurchaseHistory.filter(history =>
      history.items.some(productId => cartProductIds.includes(productId))
    );
    
    console.log('Similar users found:', similarUsers.length);
    
    // Count frequency of products bought by similar users
    const productFrequency = new Map<number, number>();
    
    similarUsers.forEach(user => {
      user.items.forEach(productId => {
        if (!cartProductIds.includes(productId)) {
          // Only recommend products not already in cart
          productFrequency.set(
            productId, 
            (productFrequency.get(productId) || 0) + 1
          );
        }
      });
    });
    
    console.log('Product frequency map:', Array.from(productFrequency.entries()));
    
    // Sort by frequency (collaborative filtering - most co-purchased first)
    const sortedRecommendations = Array.from(productFrequency.entries())
      .sort(([, freqA], [, freqB]) => freqB - freqA)
      .slice(0, 3); // Top 3 recommendations
    
    // Map back to product objects
    const recommendedProducts = sortedRecommendations
      .map(([productId]) => allProducts.find(p => p.id === productId))
      .filter(Boolean) as Product[];
    
    console.log('Final recommendations:', recommendedProducts.map(p => p.name));
    
    return recommendedProducts;
  }, [cartItems, allProducts]);

  return {
    recommendations,
    hasRecommendations: recommendations.length > 0
  };
};
