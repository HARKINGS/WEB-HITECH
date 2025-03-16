package com.harkins.startYourEngine.service;

import com.harkins.startYourEngine.dto.request.PermissionRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.PermissionResponse;
import com.harkins.startYourEngine.entity.Permission;
import com.harkins.startYourEngine.mapper.PermissionMapper;
import com.harkins.startYourEngine.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    public PermissionResponse createPermission(PermissionRequest request) {
        Permission permission = permissionMapper.toPermission(request);
        permissionRepository.save(permission);
        return permissionMapper.toPermissionResponse(permission);
    }

    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll()
                .stream()
                .map(permissionMapper::toPermissionResponse)
                .toList();
    }

    public void deletePermission(String permissionName) {
        permissionRepository.deleteById(permissionName);
    }
}
