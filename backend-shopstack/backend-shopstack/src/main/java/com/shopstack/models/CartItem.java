package com.shopstack.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

@Entity
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@ManyToOne
	@JoinColumn(name = "product_id")
	@com.fasterxml.jackson.annotation.JsonManagedReference
	private Product product;

	@ManyToOne
	@JoinColumn(name = "user_id")
	@com.fasterxml.jackson.annotation.JsonIgnore
	private User user;
    @Min(1)
    private int quantity;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

    
    
}
