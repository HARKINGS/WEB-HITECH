package com.harkins.startYourEngine.mapper;

import org.mapstruct.Mapper;

import com.harkins.startYourEngine.dto.request.PermissionRequest;
import com.harkins.startYourEngine.dto.response.PermissionResponse;
import com.harkins.startYourEngine.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest response);

    PermissionResponse toPermissionResponse(Permission permission);
}
