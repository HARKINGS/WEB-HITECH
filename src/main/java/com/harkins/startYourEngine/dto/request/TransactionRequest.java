package com.harkins.startYourEngine.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TransactionRequest {
    private String status;
    private String message;
    private String orderInfo;
   
}
