package com.shopstack.service;

import com.shopstack.models.Product;
import com.shopstack.repositories.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    // Product Recommendations: Recommend products by category and similar price
    public List<Product> recommendProducts(Long productId) {
        Product baseProduct = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        String category = baseProduct.getCategory();
        double price = baseProduct.getPrice();
        return productRepository.findAll().stream()
            .filter(p -> !p.getId().equals(productId))
            .filter(p -> p.getCategory().equalsIgnoreCase(category) || Math.abs(p.getPrice() - price) < 500)
            .limit(5)
            .toList();
    }
    // Inventory Management: Update stock and check low stock
    public Product updateStock(Long productId, int quantityChange) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        int newQuantity = product.getQuantity() + quantityChange;
        product.setQuantity(newQuantity);
        product.setLowStockAlert(newQuantity <= 5); // Alert if stock <= 5
        return productRepository.save(product);
    }

    public boolean isLowStock(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return product.isLowStockAlert();
    }
    @Override
    public List<Product> getProductsByCategory(String category) {
        String cat = category == null ? "" : category.trim().toLowerCase();
        return productRepository.findAll().stream()
                .filter(p -> p.getCategory() != null && p.getCategory().trim().toLowerCase().equals(cat))
                .toList();
    }

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPrice(updatedProduct.getPrice());
        // Only update image if a new image is provided
        if (updatedProduct.getImage() != null) {
            existing.setImage(updatedProduct.getImage());
        }
        existing.setQuantity(updatedProduct.getQuantity());
        existing.setLowStockAlert(updatedProduct.getQuantity() <= 5);

        return productRepository.save(existing);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
