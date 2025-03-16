package com.harkins.startYourEngine.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD}) // annotation được sử dụng ở đâu (ở đây là ở field)
@Retention(RetentionPolicy.RUNTIME) // annotation được xử lý lúc nào (ở đây là lúc runtime)
@Constraint(validatedBy = {DobValidator.class}) // xác định class sẽ xử lý logic validate
public @interface DobConstraint { // @interface de tao 1 annotation
    String message() default "Invalid date of birth";
    int min() default 0;
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
