package com.shopstack;

import com.shopstack.models.Product;
import com.shopstack.models.Role;
import com.shopstack.repositories.RoleRepository;
import com.shopstack.models.User;
import com.shopstack.repositories.ProductRepository;
import com.shopstack.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        if (productRepository.count() == 0) {

            Product p1 = Product.builder()
                .name("Apple iPhone 13")
                .description("Latest iPhone model")
                .price(79999.99)
                .image(null)

                .quantity(10)
                .category("Mobiles")
                .build();
            Product p2 = Product.builder()
                .name("Samsung Galaxy S21")
                .description("High-end Android phone")
                .price(69999.99)
                .image(null)

                .quantity(10)
                .category("Mobiles")
                .build();
            Product p3 = Product.builder()
                .name("Sony WH-1000XM4")
                .description("Noise-cancelling headphones")
                .price(24999.99)
                .image(null)

                .quantity(10)
                .category("Electronics")
                .build();

            productRepository.save(p1);
            productRepository.save(p2);
            productRepository.save(p3);
        }

       
        if (userRepository.count() == 0) {
            // Ensure roles exist in DB
            Role adminRole = roleRepository.findByName("ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ADMIN").build()));
            Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("USER").build()));

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@shop.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setMobileNo("9999999999"); // Default mobile number
            Set<Role> adminRoles = new HashSet<>();
            adminRoles.add(adminRole);
            admin.setRoles(adminRoles);

            User user = new User();
            user.setUsername("user");
            user.setEmail("user@shop.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setMobileNo("8888888888"); // Default mobile number
            Set<Role> userRoles = new HashSet<>();
            userRoles.add(userRole);
            user.setRoles(userRoles);

            userRepository.save(admin);
            userRepository.save(user);
        }
    }
}
