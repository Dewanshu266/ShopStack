package com.shopstack.repositories;

import com.shopstack.models.ProductReview;
import com.shopstack.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByProduct(Product product);
}
