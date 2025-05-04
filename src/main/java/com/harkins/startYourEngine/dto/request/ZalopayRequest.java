package com.harkins.startYourEngine.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZalopayRequest {
    private Long orderId; // ID của đơn hàng trong hệ thống của bạn
    private Double amount; // Số tiền thanh toán (nên dùng Double thay vì String)
    private String description; // Mô tả đơn hàng (tùy chọn)
    private String appTransId; // ID giao dịch ZaloPay (tùy chọn, thường được tạo bởi server)
}
