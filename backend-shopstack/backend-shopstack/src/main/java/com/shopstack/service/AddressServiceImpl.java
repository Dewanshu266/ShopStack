package com.shopstack.service;

import com.shopstack.models.Address;
import com.shopstack.models.User;
import com.shopstack.repositories.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {
    @Autowired
    private AddressRepository addressRepository;

    @Override
    public Address addAddress(Address address, User user) {
        address.setUser(user);
        return addressRepository.save(address);
    }

    @Override
    public List<Address> getAddressesByUser(User user) {
        return addressRepository.findAll().stream()
                .filter(a -> a.getUser().getId().equals(user.getId()))
                .toList();
    }

    @Override
    public Address updateAddress(Long addressId, Address updatedAddress) {
        Address existing = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + addressId));
        existing.setStreet(updatedAddress.getStreet());
        existing.setCity(updatedAddress.getCity());
        existing.setState(updatedAddress.getState());
        existing.setCountry(updatedAddress.getCountry());
        existing.setZipCode(updatedAddress.getZipCode());
        return addressRepository.save(existing);
    }

    @Override
    public void deleteAddress(Long addressId) {
        addressRepository.deleteById(addressId);
    }
}
