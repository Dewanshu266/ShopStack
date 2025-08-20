package com.shopstack.models;



import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;
    
    private String description;

    @PositiveOrZero
    private double price;

    @PositiveOrZero
    private int quantity; // Current stock

    private boolean lowStockAlert; // True if stock is low


    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] image;

    @NotBlank
    private String category;

    public Product(String name, String description, double price, byte[] image) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
    }




}
