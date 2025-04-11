package com.harkins.startYourEngine.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.harkins.startYourEngine.dto.request.PermissionRequest;
import com.harkins.startYourEngine.dto.response.ApiResponse;
import com.harkins.startYourEngine.dto.response.PermissionResponse;
import com.harkins.startYourEngine.service.PermissionService;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Builder
@RequestMapping("/permissions")
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    ApiResponse<PermissionResponse> createPermission(@RequestBody PermissionRequest request) {
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.createPermission(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<PermissionResponse>> getAllPermissions() {
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionService.getAllPermissions())
                .build();
    }

    @DeleteMapping("/{permissionName}")
    ApiResponse<Void> deletePermission(@PathVariable("permissionName") String permissionName) {
        permissionService.deletePermission(permissionName);
        return ApiResponse.<Void>builder().build();
    }
}
