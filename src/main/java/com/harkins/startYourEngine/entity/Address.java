package com.harkins.startYourEngine.entity;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String street;
    String city;
    String state;
    String country;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    String fullAddress;

    public String getFullAddress() {
        return String.format(
                "%s, %s, %s, %s",
                street != null ? street : "",
                city != null ? city : "",
                state != null ? state : "",
                country != null ? country : "");
    }
}
