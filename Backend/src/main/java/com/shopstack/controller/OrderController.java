  
package com.shopstack.controller;

import com.shopstack.models.Order;
import com.shopstack.models.OrderStatusHistory;
import com.shopstack.models.Product;
import com.shopstack.models.User;
import com.shopstack.dto.PlaceOrderRequest;
import com.shopstack.dto.CartItemDto;
import com.shopstack.service.OrderStatusHistoryService;
import com.shopstack.repositories.OrderRepository;
import com.shopstack.repositories.CartItemRepository;
import com.shopstack.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import com.shopstack.repositories.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.security.core.Authentication;

import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/place")
    public ResponseEntity<?> placeOrderFromCart(@RequestBody PlaceOrderRequest request, Authentication authentication) {
        String username = authentication.getName();
        try {
            User user = userRepository.findByUsername(username).orElseThrow();
            java.util.List<com.shopstack.models.CartItem> cartItems = cartItemRepository.findByUser(user);
            if (cartItems.isEmpty()) {
                return ResponseEntity.badRequest().body("Cart is empty");
            }
            // Convert CartItem to CartItemDto
            java.util.List<CartItemDto> items = new java.util.ArrayList<>();
            for (com.shopstack.models.CartItem ci : cartItems) {
                items.add(new CartItemDto(ci.getProduct().getId(), ci.getQuantity()));
            }
            java.util.List<Order> orders = paymentService.createOrderForCart(username, items, request.getPaymentMethod(), request.getAddressId());
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Order placement failed for user {}: {}", username, e.getMessage(), e);
            return ResponseEntity.badRequest().body("Order placement failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrdersForUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        List<Order> orders = orderRepository.findByUser(user);
        return ResponseEntity.ok(orders);
    }
    @Autowired
    private com.shopstack.service.NotificationService notificationService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderStatusHistoryService orderStatusHistoryService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private com.shopstack.repositories.UserRepository userRepository;

    // CartItemRepository and PaymentService autowired above

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, Authentication authentication) {
        String username = authentication.getName();
        try {
            User user = userRepository.findByUsername(username).orElseThrow();
            Optional<Order> orderOpt = orderRepository.findById(orderId);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.status(404).body("Order not found");
            }
            Order order = orderOpt.get();
            if (order.getUser() == null || user.getId() == null || !order.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Unauthorized: You do not own this order");
            }
            if ("CANCELLED".equals(order.getStatus())) {
                return ResponseEntity.badRequest().body("Order already cancelled");
            }
            order.setStatus("CANCELLED");
            orderRepository.save(order);
            orderStatusHistoryService.addStatusHistory(order, "CANCELLED");
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            logger.error("Order cancel failed for user {} and order {}: {}", username, orderId, e.getMessage(), e);
            return ResponseEntity.status(500).body("Order cancel failed: " + e.getMessage());
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        orderStatusHistoryService.addStatusHistory(order, status);
        orderRepository.save(order);
        // Send notification to user (stub: use email)
        if (order.getUser() != null && order.getUser().getEmail() != null) {
            notificationService.sendOrderUpdate(order.getUser().getEmail(), "Your order status is now: " + status);
        }
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{orderId}/status-history")
    public ResponseEntity<List<OrderStatusHistory>> getOrderStatusHistory(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        return ResponseEntity.ok(orderStatusHistoryService.getStatusHistoryByOrder(order));
    }
}
