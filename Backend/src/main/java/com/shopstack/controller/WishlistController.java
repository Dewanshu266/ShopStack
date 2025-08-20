package com.shopstack.controller;

import com.shopstack.models.WishlistItem;
import com.shopstack.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItem>> getWishlist(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(wishlistService.getWishlistForUser(username));
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<WishlistItem> addToWishlist(@PathVariable Long productId, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(wishlistService.addToWishlist(username, productId));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId, Authentication authentication) {
        String username = authentication.getName();
        wishlistService.removeFromWishlist(username, productId);
        return ResponseEntity.noContent().build();
    }
}
