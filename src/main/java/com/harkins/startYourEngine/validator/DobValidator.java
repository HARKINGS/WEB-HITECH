package com.harkins.startYourEngine.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

//  DobValidator là một custom validator để kiểm tra ngày sinh (LocalDate).
//  DobConstraint: Annotation được dùng để đánh dấu các trường cần kiểm tra ngày sinh hợp lệ.
//  LocalDate: Kiểu dữ liệu được kiểm tra.
public class DobValidator implements ConstraintValidator<DobConstraint, LocalDate> {
    private int min;

    @Override
    public void initialize(DobConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        this.min = constraintAnnotation.min();
    }

    @Override
    public boolean isValid(LocalDate value, ConstraintValidatorContext context) {
        if(Objects.isNull(value)) return true;
        long age = ChronoUnit.YEARS.between(value, LocalDate.now());
        return age >= min;
    }
}
