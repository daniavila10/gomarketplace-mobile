import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsStorage = await AsyncStorage.getItem('@GoMarketplace');

      if (productsStorage) {
        setProducts(JSON.parse(productsStorage));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const productExists = products.filter(item => item.id === product.id);

      if (productExists.length === 0) {
        setProducts([...products, { ...product, quantity: 1 }]);

        await AsyncStorage.setItem('@GoMarketplace', JSON.stringify(products));
      }
    },
    [setProducts, products],
  );

  const increment = useCallback(async id => {
    setProducts(state =>
      state.map(product => {
        if (product.id === id) {
          product.quantity += 1;

          return product;
        }

        return product;
      }),
    );

    await AsyncStorage.setItem('@GoMarketplace', JSON.stringify(products));
  }, []);

  const decrement = useCallback(
    async id => {
      const productExists = products.filter(
        item => item.id === id && item.quantity > 1,
      );

      if (productExists.length > 0) {
        setProducts(state =>
          state.map(product => {
            if (product.id === id) {
              product.quantity -= 1;

              return product;
            }

            return product;
          }),
        );
      } else {
        setProducts(state => state.filter(item => item.id !== id));
      }

      await AsyncStorage.setItem('@GoMarketplace', JSON.stringify(products));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
