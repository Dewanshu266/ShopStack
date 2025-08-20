package com.shopstack.service;

import com.shopstack.models.OrderStatusHistory;
import com.shopstack.models.Order;
import com.shopstack.repositories.OrderStatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class OrderStatusHistoryServiceImpl implements OrderStatusHistoryService {
    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;

    @Override
    public OrderStatusHistory addStatusHistory(Order order, String status) {
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .status(status)
                .updatedAt(new Date())
                .build();
        return orderStatusHistoryRepository.save(history);
    }

    @Override
    public List<OrderStatusHistory> getStatusHistoryByOrder(Order order) {
        return orderStatusHistoryRepository.findAll().stream()
                .filter(h -> h.getOrder().getId().equals(order.getId()))
                .toList();
    }
}
