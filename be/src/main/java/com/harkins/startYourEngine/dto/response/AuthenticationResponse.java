package com.harkins.startYourEngine.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationResponse {
    // Phản hồi lại token cho người dùng sau khi đăng nhập (từ AuthenticationRequest)
    String token;
    boolean authenticated; // True nếu user cung cấp username và password đúng
}
