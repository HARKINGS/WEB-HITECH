package com.harkins.startYourEngine.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ZalopayRequest {
    String orderId; // ID của đơn hàng trong hệ thống của bạn
    Double amount; // Số tiền thanh toán (nên dùng Double thay vì String)
    String description; // Mô tả đơn hàng (tùy chọn)
    String appTransId; // ID giao dịch ZaloPay (tùy chọn, thường được tạo bởi server)
}
