package com.shopstack.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import com.shopstack.models.Product;
import com.shopstack.models.User;
import com.shopstack.repositories.OrderRepository;
import com.shopstack.repositories.ProductRepository;
import com.shopstack.repositories.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {
    @Autowired
    private com.shopstack.service.OrderStatusHistoryService orderStatusHistoryService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private com.shopstack.repositories.CartItemRepository cartItemRepository;

    private RazorpayClient razorpayClient;

    public PaymentService() throws Exception {
        // Replace with your Razorpay API keys
        this.razorpayClient = new RazorpayClient("rzp_test_7eHty2v7oDxvIG", "2CqvDMqglKsUrp5Xq5fQ0DSK");
    }

    public com.shopstack.models.Order createOrder(String username, Long productId, int quantity, String paymentMethod) throws Exception {
        User user = userRepository.findByUsername(username).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();
        if (product.getQuantity() < quantity) throw new RuntimeException("Insufficient stock");
        double totalAmount = product.getPrice() * quantity;

        String paymentId = null;
        if (paymentMethod.equalsIgnoreCase("RAZORPAY")) {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int)(totalAmount * 100)); // Razorpay expects amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());
            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            paymentId = razorpayOrder.get("id");
        } else if (paymentMethod.equalsIgnoreCase("PAYPAL")) {
            // Stub: Integrate PayPal API here
            paymentId = "PAYPAL_TXN_" + System.currentTimeMillis();
        } else if (paymentMethod.equalsIgnoreCase("STRIPE")) {
            // Stub: Integrate Stripe API here
            paymentId = "STRIPE_TXN_" + System.currentTimeMillis();
        } else if (paymentMethod.equalsIgnoreCase("UPI")) {
            // Stub: Integrate UPI API here
            paymentId = "UPI_TXN_" + System.currentTimeMillis();
        } else if (paymentMethod.equalsIgnoreCase("NETBANKING")) {
            // Stub: Integrate Netbanking API here
            paymentId = "NETBANKING_TXN_" + System.currentTimeMillis();
        } else {
            throw new RuntimeException("Unsupported payment method");
        }

        com.shopstack.models.Order order = com.shopstack.models.Order.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .totalAmount(totalAmount)
                .paymentId(paymentId)
                .paymentMethod(paymentMethod)
                .status("CREATED")
                .orderDate(new Date())
                .build();
        orderRepository.save(order);
        return order;
    }
    @Autowired
    private com.shopstack.repositories.AddressRepository addressRepository;

    @Transactional
    public java.util.List<com.shopstack.models.Order> createOrderForCart(String username, java.util.List<com.shopstack.dto.CartItemDto> items, String paymentMethod, Long addressId) throws Exception {
        User user = userRepository.findByUsername(username).orElseThrow();
        double totalAmount = 0;
        java.util.List<Product> productsToUpdate = new java.util.ArrayList<>();
        for (com.shopstack.dto.CartItemDto item : items) {
            Product product = productRepository.findById(item.getProductId()).orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            if (product.getQuantity() < item.getQuantity()) throw new RuntimeException("Insufficient stock for product: " + product.getName());
            totalAmount += product.getPrice() * item.getQuantity();
            productsToUpdate.add(product);
        }

        String paymentId = null;
        if (paymentMethod.equalsIgnoreCase("RAZORPAY")) {
            org.json.JSONObject orderRequest = new org.json.JSONObject();
            orderRequest.put("amount", (int)(totalAmount * 100));
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());
            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            paymentId = razorpayOrder.get("id");
        } else if (paymentMethod.equalsIgnoreCase("PAYPAL")) {
            paymentId = "PAYPAL_TXN_" + System.currentTimeMillis();
        } else if (paymentMethod.equalsIgnoreCase("STRIPE")) {
            paymentId = "STRIPE_TXN_" + System.currentTimeMillis();
        } else if (paymentMethod.equalsIgnoreCase("UPI")) {
            paymentId = "UPI_TXN_" + System.currentTimeMillis();
        } else if (paymentMethod.equalsIgnoreCase("NETBANKING")) {
            paymentId = "NETBANKING_TXN_" + System.currentTimeMillis();
        } else {
            throw new RuntimeException("Unsupported payment method");
        }

        com.shopstack.models.Address address = null;
        if (addressId != null) {
            address = addressRepository.findById(addressId).orElse(null);
            if (address == null) throw new RuntimeException("Invalid address selected");
        }

        java.util.List<com.shopstack.models.Order> orders = new java.util.ArrayList<>();
        for (int i = 0; i < items.size(); i++) {
            com.shopstack.dto.CartItemDto item = items.get(i);
            Product product = productsToUpdate.get(i);
            // Decrement stock atomically
            int newQty = product.getQuantity() - item.getQuantity();
            if (newQty < 0) throw new RuntimeException("Insufficient stock for product: " + product.getName());
            product.setQuantity(newQty);
            product.setLowStockAlert(newQty <= 5);
            productRepository.save(product);

            com.shopstack.models.Order order = com.shopstack.models.Order.builder()
                .user(user)
                .product(product)
                .quantity(item.getQuantity())
                .totalAmount(product.getPrice() * item.getQuantity())
                .paymentId(paymentId)
                .paymentMethod(paymentMethod)
                .status("PLACED")
                .orderDate(new java.util.Date())
                .address(address)
                .build();
            orderRepository.save(order);
            // Add status history for the order
            orderStatusHistoryService.addStatusHistory(order, "PLACED");
            orders.add(order);
        }
        // Clear user's cart after placing order
        cartItemRepository.deleteByUser(user);
        return orders;
    }
}
