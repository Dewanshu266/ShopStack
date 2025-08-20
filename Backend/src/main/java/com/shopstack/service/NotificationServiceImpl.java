package com.shopstack.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {
    @Override
    public void sendOrderUpdate(String to, String message) {
        // Stub: Integrate with email/SMS provider here
        System.out.println("Sending notification to " + to + ": " + message);
    }
}
