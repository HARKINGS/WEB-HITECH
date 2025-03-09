package com.harkins.startYourEngine.exception;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalHandleExeption {
    @ExceptionHandler(value = Exception.class)
    public String handleException(Exception e) {
        return null;
    }
}
