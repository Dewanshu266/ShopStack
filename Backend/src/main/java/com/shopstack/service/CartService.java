package com.shopstack.service;

import com.shopstack.models.CartItem;

import java.util.List;
import java.util.Map;

public interface CartService {
    CartItem addToCart(Long productId, int quantity, String username);
    Map<String, Object> getUserCart(String username);
    void removeFromCart(Long cartItemId, String username);
    void clearCart(String username);
    
	CartItem updateCartItem(Long cartItemId, int quantity, String username);
}
