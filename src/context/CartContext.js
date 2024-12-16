import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItemCount, setCartItemCount] = useState(0);

    const updateCartCount = async () => {
        try {
            const response = await axiosInstance.get('/api/cart');
            setCartItemCount(response.data.items.length);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    const value = {
        cartItemCount,
        updateCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}; 