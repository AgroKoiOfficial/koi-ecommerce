import {create} from 'zustand';

const useCartStore = create((set) => ({
  cart: (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('cart'))) || [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        const updatedCart = state.cart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
        );
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
        return { cart: updatedCart };
      }
      const updatedCart = [...state.cart, item];
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      return { cart: updatedCart };
    }),
  removeFromCart: (id) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      return { cart: updatedCart };
    }),
}));

export { useCartStore };
