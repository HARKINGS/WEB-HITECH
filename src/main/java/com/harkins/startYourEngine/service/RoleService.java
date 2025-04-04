package com.harkins.startYourEngine.service;

import java.util.HashSet;
import java.util.List;

import org.springframework.stereotype.Service;

import com.harkins.startYourEngine.dto.request.RoleRequest;
import com.harkins.startYourEngine.dto.response.RoleResponse;
import com.harkins.startYourEngine.entity.Role;
import com.harkins.startYourEngine.mapper.RoleMapper;
import com.harkins.startYourEngine.repository.PermissionRepository;
import com.harkins.startYourEngine.repository.RoleRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;
    PermissionRepository permissionRepository;

    public RoleResponse createRole(RoleRequest roleRequest) {
        Role role = roleMapper.toRole(roleRequest);
        var permissions = permissionRepository.findAllById(roleRequest.getPermissions());

        role.setPermissions(new HashSet<>(permissions));
        roleRepository.save(role);

        return roleMapper.toRoleResponse(roleRepository.save(role));
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream().map(roleMapper::toRoleResponse).toList();
    }

    public void deleteRole(String roleName) {
        roleRepository.deleteById(roleName);
    }
}
