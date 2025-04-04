package com.harkins.startYourEngine.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.harkins.startYourEngine.dto.request.RoleRequest;
import com.harkins.startYourEngine.dto.response.RoleResponse;
import com.harkins.startYourEngine.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest roleRequest);

    RoleResponse toRoleResponse(Role role);
}
