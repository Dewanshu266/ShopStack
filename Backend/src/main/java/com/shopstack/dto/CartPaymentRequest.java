package com.shopstack.dto;

import lombok.Data;
import java.util.List;

@Data
public class CartPaymentRequest {
    private List<CartItemDto> items;
    private String paymentMethod;
    private Long addressId;
}
