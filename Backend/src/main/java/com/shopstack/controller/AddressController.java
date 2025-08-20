package com.shopstack.controller;

import com.shopstack.models.Address;
import com.shopstack.models.User;
import com.shopstack.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    @Autowired
    private AddressService addressService;
    @Autowired
    private com.shopstack.repositories.UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Address> addAddress(@RequestBody Address address, Principal principal) {
        // Assume a method to get User from Principal
        User user = getUserFromPrincipal(principal);
        Address saved = addressService.addAddress(address, user);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Address>> getAddresses(Principal principal) {
        User user = getUserFromPrincipal(principal);
        return ResponseEntity.ok(addressService.getAddressesByUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address address) {
        return ResponseEntity.ok(addressService.updateAddress(id, address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    private User getUserFromPrincipal(Principal principal) {
        if (principal == null) throw new RuntimeException("No principal found");
        String username = principal.getName();
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}
