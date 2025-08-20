package com.shopstack.service;

import com.shopstack.models.Product;
import com.shopstack.models.ProductReview;
import com.shopstack.models.User;
import com.shopstack.repositories.ProductRepository;
import com.shopstack.repositories.ProductReviewRepository;
import com.shopstack.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductReviewService {
    @Autowired
    private ProductReviewRepository reviewRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    public ProductReview addReview(String username, Long productId, int rating, String comment) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();
        ProductReview review = ProductReview.builder()
                .user(user)
                .product(product)
                .rating(rating)
                .comment(comment)
                .build();
        return reviewRepository.save(review);
    }

    public List<ProductReview> getReviewsForProduct(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow();
        return reviewRepository.findByProduct(product);
    }
}
