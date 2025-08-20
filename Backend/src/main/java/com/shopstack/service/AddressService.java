package com.shopstack.service;

import com.shopstack.models.Address;
import com.shopstack.models.User;
import java.util.List;

public interface AddressService {
    Address addAddress(Address address, User user);
    List<Address> getAddressesByUser(User user);
    Address updateAddress(Long addressId, Address updatedAddress);
    void deleteAddress(Long addressId);
}
