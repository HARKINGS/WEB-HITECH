package com.harkins.startYourEngine.controller;

import com.harkins.startYourEngine.dto.request.RoleRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.RoleResponse;
import com.harkins.startYourEngine.service.RoleService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Builder
@RequestMapping("/roles")
public class RoleController {
    RoleService roleService;

    @PostMapping
    ApiResponse<RoleResponse> createRole(@Valid @RequestBody RoleRequest roleRequest) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.createRole(roleRequest))
                .build();
    }

    @GetMapping
    ApiResponse<List<RoleResponse>> getAllRoles() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRoles())
                .build();
    }

    @DeleteMapping("/{roleName}")
    ApiResponse<Void> deleteRole(@RequestParam("roleName") String roleName) {
        roleService.deleteRole(roleName);
        return ApiResponse.<Void>builder().build();
    }
}
