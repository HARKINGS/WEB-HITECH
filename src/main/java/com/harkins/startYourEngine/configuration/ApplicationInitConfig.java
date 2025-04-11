package com.harkins.startYourEngine.configuration;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.harkins.startYourEngine.entity.Permission;
import com.harkins.startYourEngine.entity.Role;
import com.harkins.startYourEngine.entity.User;
import com.harkins.startYourEngine.enums.PredefinedRole;
import com.harkins.startYourEngine.repository.PermissionRepository;
import com.harkins.startYourEngine.repository.RoleRepository;
import com.harkins.startYourEngine.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Configuration
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_USER_NAME = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "admin";

    PermissionRepository permissionRepository;

    private Set<Permission> getPermissionsByNames(Set<String> names) {
        return new HashSet<>(permissionRepository.findAllById(names));
    }

    private void addPermission(String permissionName, String permissionDescription) {
        if (permissionRepository.existsByName(permissionName)) return;

        permissionRepository.save(Permission.builder()
                .name(permissionName)
                .description(permissionDescription)
                .build());
    }

    private void initPermission() {
        addPermission("ASSIGN_PERMISSION_TO_ROLE", "Assign a permission to a role");

        addPermission("CREATE_PERMISSION", "Create a permission");
        addPermission("CREATE_ROLE", "Create a role");
        addPermission("CREATE_USER", "Create an account");

        addPermission("DELETE_PERMISSION", "Delete a permission");
        addPermission("DELETE_ROLE", "Delete a role");
        addPermission("DELETE_USER", "Delete an account");

        addPermission("GET_ALL_PERMISSIONS", "Get all permissions");
        addPermission("GET_ALL_ROLES", "Get all roles");
        addPermission("GET_ALL_USERS", "Get info of all account");

        addPermission("GET_USER", "Get info of an account");

        addPermission("UPDATE_PERMISSION", "Update permission information");
        addPermission("UPDATE_ROLE", "Update role information");
        addPermission("UPDATE_USER", "Update account information");
    }

    @Bean
    //    @ConditionalOnProperty(value = "datasource.driverClassName",
    //            prefix = "spring",
    //            havingValue = "com.mysql.cj.jdbc.Driver")
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        log.info("Initializing application.....");
        return args -> {
            //            initPermission();
            if (userRepository.findByUsername(ADMIN_USER_NAME).isEmpty()) { // chưa có tk admin
                initPermission();

                Set<String> userPermissions = Set.of("GET_USER");
                Set<String> staffPermissions = Set.of("CREATE_USER", "GET_USER", "UPDATE_USER");
                Set<String> adminPermissions = Set.of(
                        "GET_USER",
                        "GET_ALL_ROLES",
                        "GET_ALL_PERMISSIONS",
                        "GET_ALL_USERS",
                        "UPDATE_ROLE",
                        "UPDATE_PERMISSION",
                        "UPDATE_USER",
                        "DELETE_ROLE",
                        "DELETE_PERMISSION",
                        "DELETE_USER",
                        "CREATE_ROLE",
                        "CREATE_PERMISSION",
                        "CREATE_USER",
                        "ASSIGN_PERMISSION_TO_ROLE");

                roleRepository.save(Role.builder()
                        .name(PredefinedRole.USER)
                        .description("User role")
                        .permissions(getPermissionsByNames(userPermissions))
                        .build());

                roleRepository.save(Role.builder()
                        .name(PredefinedRole.STAFF)
                        .description("Staff role")
                        .permissions(getPermissionsByNames(staffPermissions))
                        .build());

                Role adminRole = roleRepository.save(Role.builder()
                        .name(PredefinedRole.ADMIN)
                        .description("Admin role")
                        .permissions(getPermissionsByNames(adminPermissions))
                        .build());

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder()
                        .username(ADMIN_USER_NAME)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .roles(roles)
                        .build();

                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }
            log.info("Application initialization completed .....");
        };
    }
}
