package com.shopstack.controller;

import com.shopstack.models.ProductReview;
import com.shopstack.service.ProductReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ProductReviewController {
    private final ProductReviewService reviewService;

    @PostMapping
    public ResponseEntity<ProductReview> addReview(@PathVariable Long productId, @RequestBody ReviewRequest request, Authentication authentication) {
        String username = authentication.getName();
        ProductReview review = reviewService.addReview(username, productId, request.getRating(), request.getComment());
        return ResponseEntity.ok(review);
    }

    @GetMapping
    public ResponseEntity<List<ProductReview>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsForProduct(productId));
    }

    public static class ReviewRequest {
        private int rating;
        private String comment;
        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
}
