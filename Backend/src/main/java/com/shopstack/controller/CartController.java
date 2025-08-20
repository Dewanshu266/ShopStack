package com.shopstack.controller;

import com.shopstack.dto.CartItemDto;
import com.shopstack.models.CartItem;
import com.shopstack.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/api/user/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@Valid @RequestBody CartItemDto cartItemDto,
                                              Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(cartService.addToCart(cartItemDto.getProductId(), cartItemDto.getQuantity(), username));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(cartService.getUserCart(username));
    }

    @DeleteMapping("/delete/{cartItemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long cartItemId,
                                        Authentication authentication) {
        cartService.removeFromCart(cartItemId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/update/{cartItemId}")
    public ResponseEntity<CartItem> updateQuantity(@PathVariable Long cartItemId,
                                                   @RequestParam int quantity,
                                                   Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(cartService.updateCartItem(cartItemId, quantity, username));
    }
}
