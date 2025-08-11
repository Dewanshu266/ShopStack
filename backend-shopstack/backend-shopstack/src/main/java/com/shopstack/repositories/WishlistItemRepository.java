package com.shopstack.repositories;

import com.shopstack.models.WishlistItem;
import com.shopstack.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser(User user);
}
