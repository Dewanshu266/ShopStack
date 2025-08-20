package com.shopstack.service;

import com.shopstack.models.CartItem;
import com.shopstack.models.Product;
import com.shopstack.models.User;
import com.shopstack.repositories.CartItemRepository;
import com.shopstack.repositories.ProductRepository;
import com.shopstack.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartItemRepository cartItemRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public CartItem addToCart(Long productId, int quantity, String username) {
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be greater than 0");

        User user = userRepo.findByUsername(username).orElseThrow();
        Product product = productRepo.findById(productId).orElseThrow();

        // Check for duplicate
        CartItem existingItem = cartItemRepo.findByUserAndProduct(user, product);
        if (existingItem != null) {
            // Update quantity instead of duplicating
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepo.save(existingItem);
        }

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setUser(user);
        return cartItemRepo.save(item);
    }

    @Override
    public Map<String, Object> getUserCart(String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        List<CartItem> items = cartItemRepo.findByUser(user);

        double totalPrice = items.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        response.put("totalPrice", totalPrice);
        return response;
    }

    @Override
    public void removeFromCart(Long cartItemId, String username) {
        cartItemRepo.deleteById(cartItemId);
    }

    @Override
    public void clearCart(String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        cartItemRepo.deleteByUser(user);
    }

    @Override
    public CartItem updateCartItem(Long cartItemId, int quantity, String username) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        CartItem item = cartItemRepo.findById(cartItemId)
                        .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Optional: check if the cart item belongs to the logged-in user
        if (!item.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized cart access");
        }

        item.setQuantity(quantity);
        return cartItemRepo.save(item);
    }

}
