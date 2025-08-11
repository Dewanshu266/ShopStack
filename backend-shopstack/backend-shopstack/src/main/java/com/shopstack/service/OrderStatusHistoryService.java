package com.shopstack.service;

import com.shopstack.models.OrderStatusHistory;
import com.shopstack.models.Order;
import java.util.List;

public interface OrderStatusHistoryService {
    OrderStatusHistory addStatusHistory(Order order, String status);
    List<OrderStatusHistory> getStatusHistoryByOrder(Order order);
}
