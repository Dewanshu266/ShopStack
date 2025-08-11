package com.shopstack.controller;

import com.shopstack.models.Product;
import com.shopstack.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    // Get recommended products for a given product
    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<Product>> getRecommendedProducts(@PathVariable Long id) {
        return ResponseEntity.ok(productService.recommendProducts(id));
    }
    // Get products with low stock
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        List<Product> lowStockProducts = productService.getAllProducts().stream()
            .filter(Product::isLowStockAlert)
            .toList();
        return ResponseEntity.ok(lowStockProducts);
    }

    // Update stock for a product
    @PostMapping("/{id}/update-stock")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Product> updateStock(@PathVariable Long id, @RequestParam int quantityChange) {
        return ResponseEntity.ok(productService.updateStock(id, quantityChange));
    }
    // Get products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    private final ProductService productService;

    // get all products (accessible to everyone)
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // get product by ID (accessible to everyone)
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // add product (admin only, with image upload)
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Product> addProduct(
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws Exception {
        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImage(imageFile.getBytes());
        }
        Product createdProduct = productService.addProduct(product);
        return ResponseEntity.ok(createdProduct);
    }

    // serve product image
    @GetMapping(value = "/{id}/image", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        return productService.getProductById(id)
                .filter(p -> p.getImage() != null)
                .map(p -> ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(p.getImage()))
                .orElse(ResponseEntity.notFound().build());
    }

    // update product (admin only, JSON only)
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Product> updateProductJson(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product product = productService.updateProduct(id, updatedProduct);
        return ResponseEntity.ok(product);
    }

    // update product (admin only, with image upload)
    @PostMapping(value = "/{id}/update", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Product> updateProductWithImage(
            @PathVariable Long id,
            @RequestPart("product") Product updatedProduct,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws Exception {
        if (imageFile != null && !imageFile.isEmpty()) {
            updatedProduct.setImage(imageFile.getBytes());
        }
        Product product = productService.updateProduct(id, updatedProduct);
        return ResponseEntity.ok(product);
    }

    // delete product (admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
