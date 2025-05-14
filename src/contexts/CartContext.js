// src/contexts/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const CartContext = createContext();

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from local storage on initial load
    try {
        const savedCart = localStorage.getItem('shoppingCart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("Error parsing cart from localStorage", error);
        return []; 
    }
  });

  // Save cart to local storage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    } catch (error) {
        console.error("Error saving cart to localStorage", error);
    }
  }, [cartItems]);

  // Function to add an item to the cart
  const addToCart = (product, quantityToAdd = 1) => {
    // Ensure quantity is a positive number
    const validQuantity = Math.max(1, quantityToAdd);

    if (!product || typeof product.id === 'undefined') {
        console.error("Invalid product provided to addToCart:", product);
        return; // Prevent adding invalid product
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // If item exists, increase quantity by quantityToAdd
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + validQuantity }
            : item
        );
      } else {
        // If item doesn't exist, add it with the specified quantity
        const { id, name, price, imageUrl } = product;
        // Ensure price is a number when adding
        const itemPrice = typeof price === 'number' && !isNaN(price) ? price : 0;
        return [...prevItems, { id, name, price: itemPrice, imageUrl, quantity: validQuantity }];
      }
    });
    // Optional: Add user feedback here (e.g., toast notification)
    console.log(`${validQuantity} of ${product.name} added to cart!`);
  };

  // Function to remove an item from the cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Function to update quantity
  const updateQuantity = (productId, quantity) => {
     const newQuantity = Math.max(0, quantity); // Allow quantity to become 0 to remove
     setCartItems(prevItems =>
       prevItems.map(item =>
         item.id === productId ? { ...item, quantity: newQuantity } : item
       ).filter(item => item.quantity > 0) // Remove item if quantity is 0 or less
     );
  };

  // Function to clear the entire cart
  const clearCart = () => {
      setCartItems([]);
      console.log("Cart cleared!");
  };

  // Calculate total items count
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // ***** FIX: Calculate total price *****
  const cartTotal = cartItems.reduce((total, item) => {
      // Ensure item.price is a valid number before multiplying
      const price = typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0;
      const quantity = typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0;
      return total + (price * quantity);
  }, 0);


  // Value provided by the context
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,         
    cartItemCount,   
    cartTotal,         
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the Cart context easily
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};