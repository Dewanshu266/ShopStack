package com.shopstack.service;

import com.shopstack.models.Product;
import com.shopstack.models.User;
import com.shopstack.models.WishlistItem;
import com.shopstack.repositories.ProductRepository;
import com.shopstack.repositories.UserRepository;
import com.shopstack.repositories.WishlistItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {
    @Autowired
    private WishlistItemRepository wishlistItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    public List<WishlistItem> getWishlistForUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return wishlistItemRepository.findByUser(user);
    }

    public WishlistItem addToWishlist(String username, Long productId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();
        WishlistItem item = WishlistItem.builder().user(user).product(product).build();
        return wishlistItemRepository.save(item);
    }

    public void removeFromWishlist(String username, Long productId) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();
        List<WishlistItem> items = wishlistItemRepository.findByUser(user);
        items.stream().filter(i -> i.getProduct().getId().equals(productId)).forEach(wishlistItemRepository::delete);
    }
}
