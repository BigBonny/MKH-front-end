import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isSignedIn } = useUser();

  // Load cart from database when user signs in
  useEffect(() => {
    if (isSignedIn && user) {
      loadCartFromDatabase();
    } else if (!isSignedIn) {
      // Clear cart when user signs out
      setItems([]);
    }
  }, [isSignedIn, user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading cart:', error);
        return;
      }

      if (data) {
        const cartItems = data.map(item => ({
          id: parseInt(item.product_id),
          name: item.name,
          price: parseFloat(item.price),
          image: item.image || '',
          quantity: item.quantity
        }));
        
        setItems(cartItems);
      }
    } catch (error) {
      console.error('Error loading cart from database:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveItemToDatabase = async (item: CartItem) => {
    if (!user) return;

    try {
      const itemData = {
        user_id: user.id,
        product_id: item.id.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('cart_items')
        .upsert(itemData, {
          onConflict: 'user_id,product_id'
        });

      if (error) {
        console.error('Error saving cart item:', error);
      }
    } catch (error) {
      console.error('Error saving cart item to database:', error);
    }
  };

  const removeItemFromDatabase = async (productId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId.toString());

      if (error) {
        console.error('Error removing cart item:', error);
      }
    } catch (error) {
      console.error('Error removing cart item from database:', error);
    }
  };

  const clearCartFromDatabase = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
      }
    } catch (error) {
      console.error('Error clearing cart from database:', error);
    }
  };

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);
      let updatedItems;
      
      if (existingItem) {
        updatedItems = prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...prevItems, newItem];
      }

      // Save to database if user is signed in
      if (isSignedIn && user) {
        const itemToSave = existingItem 
          ? { ...newItem, quantity: existingItem.quantity + newItem.quantity }
          : newItem;
        saveItemToDatabase(itemToSave);
      }

      return updatedItems;
    });
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    
    // Remove from database if user is signed in
    if (isSignedIn && user) {
      removeItemFromDatabase(id);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );

    // Update in database if user is signed in
    if (isSignedIn && user) {
      const item = items.find(item => item.id === id);
      if (item) {
        saveItemToDatabase({ ...item, quantity });
      }
    }
  };

  const clearCart = () => {
    setItems([]);
    
    // Clear from database if user is signed in
    if (isSignedIn && user) {
      clearCartFromDatabase();
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
