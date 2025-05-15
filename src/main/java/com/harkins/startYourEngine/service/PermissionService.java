package com.harkins.startYourEngine.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.harkins.startYourEngine.dto.request.PermissionRequest;
import com.harkins.startYourEngine.dto.response.PermissionResponse;
import com.harkins.startYourEngine.entity.Permission;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.mapper.PermissionMapper;
import com.harkins.startYourEngine.repository.PermissionRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

//    @PreAuthorize("hasRole('ADMIN')")
    @PreAuthorize("hasAuthority('CREATE_PERMISSION')")
    public PermissionResponse createPermission(PermissionRequest request) {
        if (permissionRepository.existsByName(request.getName())) throw new AppException(ErrorCode.PERMISSION_EXISTED);
        Permission permission = permissionMapper.toPermission(request);
        permissionRepository.save(permission);
        return permissionMapper.toPermissionResponse(permission);
    }

    @PreAuthorize("hasAuthority('GET_ALL_PERMISSIONS')")
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permissionMapper::toPermissionResponse)
                .toList();
    }

    @PreAuthorize("hasAuthority('DELETE_PERMISSION')")
    public void deletePermission(String permissionName) {
        permissionRepository.deleteById(permissionName);
    }
}
