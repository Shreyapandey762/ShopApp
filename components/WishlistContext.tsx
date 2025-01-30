import React, { createContext, useState, ReactNode } from 'react';

type WishlistContextType = {
  wishlist: number[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistProviderProps = {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const addToWishlist = (productId: number) => {
    if (!wishlist.includes(productId)) {
      setWishlist([...wishlist, productId]);
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(wishlist.filter((id) => id !== productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
