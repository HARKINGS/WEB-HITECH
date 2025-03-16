package com.harkins.startYourEngine.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.harkins.startYourEngine.dto.request.CreateUserRequest;
import com.harkins.startYourEngine.dto.request.UpdateUserRequest;
import com.harkins.startYourEngine.dto.response.UserResponse;
import com.harkins.startYourEngine.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(CreateUserRequest request);

    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UpdateUserRequest request);
}