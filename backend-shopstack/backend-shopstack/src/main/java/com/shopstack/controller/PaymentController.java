package com.shopstack.controller;

import com.shopstack.models.Order;
import com.shopstack.service.PaymentService;
import com.shopstack.dto.CartPaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<java.util.List<Order>> createOrder(@RequestBody CartPaymentRequest request, Authentication authentication) throws Exception {
        String username = authentication.getName();
        java.util.List<Order> orders = paymentService.createOrderForCart(username, request.getItems(), request.getPaymentMethod(), request.getAddressId());
        return ResponseEntity.ok(orders);
    }
}
