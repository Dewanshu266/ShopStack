package com.shopstack.repositories;

import com.shopstack.models.CartItem;
import com.shopstack.models.Product;
import com.shopstack.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    void deleteByUser(User user);
    CartItem findByUserAndProduct(User user, Product product);
    


}
