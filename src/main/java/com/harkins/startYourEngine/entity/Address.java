package com.harkins.startYourEngine.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String street;
    private String city;
    private String state;
    private String country;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    String fullAddress;

    public String getFullAddress() {
        return String.format("%s, %s, %s, %s", 
                street != null ? street : "", 
                city != null ? city : "", 
                state != null ? state : "", 
                country != null ? country : "");
    }
    
}
