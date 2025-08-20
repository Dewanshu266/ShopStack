    
package com.shopstack.service;

import com.shopstack.dto.LoginDto;
import com.shopstack.dto.RegisterDto;
import com.shopstack.models.User;
import com.shopstack.models.Role;
import com.shopstack.repositories.RoleRepository;
import com.shopstack.repositories.UserRepository;
import com.shopstack.security.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;


import java.util.Collections;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public ResponseEntity<?> register(RegisterDto registerDto) {
        if (userRepo.existsByUsername(registerDto.getUsername())) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Username already taken!"));
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setMobileNo(registerDto.getMobileNo());

        String roleName = (registerDto.getRole() != null) ? registerDto.getRole().toUpperCase() : "USER";
        Role assignedRole = roleRepository.findByName(roleName)
            .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));

        user.setRoles(Collections.singleton(assignedRole));
        userRepo.save(user);

        // Automatically log in the user after registration
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                registerDto.getUsername(),
                registerDto.getPassword()
            )
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtProvider.generateToken(userDetails);

        // Prepare user info for frontend
        User savedUser = userRepo.findByUsername(registerDto.getUsername()).orElse(user);
        // Only send safe user info
        java.util.Map<String, Object> userInfo = new java.util.HashMap<>();
        userInfo.put("id", savedUser.getId());
        userInfo.put("username", savedUser.getUsername());
        userInfo.put("email", savedUser.getEmail());
        userInfo.put("roles", savedUser.getRoles().stream().map(Role::getName).toList());

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("token", token);
        response.put("user", userInfo);

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<?> login(LoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getUsername(),
                        loginDto.getPassword()
                )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtProvider.generateToken(userDetails);

            User user = userRepo.findByUsername(loginDto.getUsername()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(404).body(Collections.singletonMap("error", "User not found"));
            }
            java.util.Map<String, Object> userInfo = new java.util.HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("roles", user.getRoles().stream().map(Role::getName).toList());

            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", token);
            response.put("user", userInfo);

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid username or password"));
        }
    }
}
