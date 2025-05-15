package com.harkins.startYourEngine.exception;

import org.springframework.http.HttpStatus;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncatedgorized!", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid key", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME(1002, "Username must be at least {min} characters!", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1003, "Password must be at least {min} characters!", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1004, "User already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1005, "User not found!", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated!", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "Unauthorized!", HttpStatus.FORBIDDEN),
    ROLE_NOT_FOUND(1008, "Role not found!", HttpStatus.NOT_FOUND),
    ROLE_EXISTED(1009, "Role already exists", HttpStatus.BAD_REQUEST),
    PERMISSION_NOT_FOUND(1010, "Role not found!", HttpStatus.NOT_FOUND),
    PERMISSION_EXISTED(1011, "Permission already exists", HttpStatus.BAD_REQUEST),
    INVALID_DOB(1012, "Your age must be at least {min}!", HttpStatus.BAD_REQUEST),
    GOODS_NOT_FOUND(1010, "Goods not found!", HttpStatus.NOT_FOUND),
    REVIEW_NOT_FOUND(1011, "Review not found!", HttpStatus.NOT_FOUND),
    REVIEW_ALREADY_EXISTS(1012, "Review already exists!", HttpStatus.BAD_REQUEST),
    VOUCHER_EXISTED(1013, "Voucher already exists!", HttpStatus.BAD_REQUEST),
    VOUCHER_NOT_FOUND(1014, "Voucher not found!", HttpStatus.NOT_FOUND),
    NOT_EMPTY(1015, "Không được bỏ trống!", HttpStatus.BAD_REQUEST),
    WRONG_ROLE(1016, "Wrong role!", HttpStatus.BAD_REQUEST),
    ;

    int code;
    String message;
    HttpStatus statusCode;
}
