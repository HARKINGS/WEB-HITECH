package com.harkins.startYourEngine.mapper;

import com.harkins.startYourEngine.dto.request.PermissionRequest;
import com.harkins.startYourEngine.dto.response.PermissionResponse;
import com.harkins.startYourEngine.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest response);
    PermissionResponse toPermissionResponse(Permission permission);
}
