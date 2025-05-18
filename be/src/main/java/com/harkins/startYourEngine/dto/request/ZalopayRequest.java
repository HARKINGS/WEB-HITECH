package com.harkins.startYourEngine.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ZalopayRequest {
    @NotBlank(message = "NOT_EMPTY")
    String orderId; // ID của đơn hàng trong hệ thống của bạn

    @NotBlank(message = "NOT_EMPTY")
    Double amount; // Số tiền thanh toán (nên dùng Double thay vì String)

    @NotBlank(message = "NOT_EMPTY")
    String description; // Mô tả đơn hàng (tùy chọn)

    @NotBlank(message = "NOT_EMPTY")
    String appTransId; // ID giao dịch ZaloPay (tùy chọn, thường được tạo bởi server)
}
