package com.shopstack.service;

import com.shopstack.models.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    // Product Recommendations
    List<Product> recommendProducts(Long productId);
    List<Product> getProductsByCategory(String category);
    List<Product> getAllProducts();
    Optional<Product> getProductById(Long id);
    Product addProduct(Product product);
    Product updateProduct(Long id, Product updatedProduct);
    void deleteProduct(Long id);

    // Inventory Management
    Product updateStock(Long productId, int quantityChange);
    boolean isLowStock(Long productId);
}
