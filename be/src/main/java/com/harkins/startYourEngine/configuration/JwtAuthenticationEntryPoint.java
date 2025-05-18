package com.harkins.startYourEngine.configuration;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.exception.ErrorCode;

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    // khi authentication fail thì điều hướng User đi đâu
    // phương thức này sẽ được gọi khi người dùng không được xác thực (unauthenticated)
    public void commence(
            HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        ErrorCode errorCode = ErrorCode.UNAUTHENTICATED;

        // ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
        // nếu muốn trả về 401 thì dùng UNAUTHORIZED, còn nếu muốn trả về 403 thì dùng UNAUTHENTICATED
        response.setStatus(errorCode.getStatusCode().value());
        // set status code cho response, nếu không set thì mặc định là 200 OK
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        // set content type cho response, nếu không set thì mặc định là text/html
        // dạng được thiết lập ở đây là JSON
        // MediaType.APPLICATION_JSON_VALUE là một hằng số trong Spring Framework,

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        ObjectMapper objectMapper = new ObjectMapper();
        // tạo một đối tượng ObjectMapper để chuyển đổi đối tượng thành chuỗi JSON
        // ObjectMapper là một lớp trong thư viện Jackson, được sử dụng để chuyển đổi giữa các đối tượng Java và JSON

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
        // chuyển đổi đối tượng thành chuỗi JSON và ghi vào response writer
        response.flushBuffer(); // xóa bộ đệm của response, đảm bảo rằng tất cả dữ liệu đã được ghi vào response
        // và gửi đến client ngay lập tức
    }
}
