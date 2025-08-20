package com.shopstack.service;

import com.shopstack.dto.LoginDto;
import com.shopstack.dto.RegisterDto;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> register(RegisterDto registerDto);
    ResponseEntity<?> login(LoginDto loginDto);
}
