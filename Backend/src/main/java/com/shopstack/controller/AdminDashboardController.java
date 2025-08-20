package com.shopstack.controller;

import com.shopstack.models.Product;
import com.shopstack.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {
    @Autowired
    private ProductRepository productRepository;

    // Example: Get analytics for low stock products
    @GetMapping("/analytics/low-stock")
    public ResponseEntity<List<Product>> getLowStockAnalytics() {
        List<Product> lowStock = productRepository.findAll().stream()
            .filter(Product::isLowStockAlert)
            .collect(Collectors.toList());
        return ResponseEntity.ok(lowStock);
    }

    // Add more analytics endpoints as needed
}
