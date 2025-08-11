package com.shopstack.service;

public interface NotificationService {
    void sendOrderUpdate(String to, String message);
}
