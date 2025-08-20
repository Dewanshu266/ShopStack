package com.shopstack.dto;

import com.shopstack.models.CartItem;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDto {
    private List<CartItem> items;
    private double totalPrice;
}
