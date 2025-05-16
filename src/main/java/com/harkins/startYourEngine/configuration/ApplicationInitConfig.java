package com.harkins.startYourEngine.configuration;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

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
        //        AddressService
        //        addPermission("SAVE_ADDRESS", "Save and Update Address");

        //        AuthenticationService
        //        addPermission("LOGIN", "Login account");
        //        addPermission("LOOUT", "Loout account");
        addPermission("CHECK_TOKEN", "Check token Valid");
        addPermission("REFRESH_TOKEN", "Refresh token Valid");

        //        GoodsReviewService
        addPermission("CREATE_REVIEWS", "Create goods Review");
        addPermission("GET_REVIEWS_BY_ID", "Get reviews by id");
        addPermission("GET_ALL_REVIEWS", "Get all goods reviews");
        addPermission("GET_REVIEWS_BY_GOODS", "Get reviews by goods");
        addPermission("UPDATE_REVIEWS", "Update goods review");
        addPermission("DELETE_REVIEWS", "Delete goods review");

        //        GoodsService
        addPermission("CREATE_GOODS", "Create a goods");
        addPermission("GET_ALL_GOODS", "Get info of all goods");
        addPermission("UPDATE_GOODS", "Update goods information");
        addPermission("DELETE_GOODS", "Delete a goods");
        addPermission("GET_GOODS_BY_ID", "Get info of a goods by goodsid");
        addPermission("GET_GOODS_BY_NAME", "Get info of a goods by name");
        addPermission("GET_GOODS_BY_CATEGORY", "Get info of a goods by category");

        //        OrderService
        addPermission("PLACE_ORDER", "Place order");
        addPermission("DELETE_ORDER", "Delete order");
        addPermission("UPDATE_ORDERITEM", "Update order item");
        addPermission("GET_ORDER_BY_ID", "Get order by id");
        addPermission("GET_CURRENT_USERORDERS", "Get current user orders");
        addPermission("UPDATE_ORDER_STATUS", "Update order status");
        addPermission("UPDATE_PAYMENT_STATUS", "Update payment status");
        addPermission("GET_ALL_ORDERS", "Get all orders");
        addPermission("GET_ORDERS_BY_STATUS", "Get orders by status");
        addPermission("GET_ORDERS_BY_USERID", "Get orders by userid");

        //        PermissionService
        addPermission("CREATE_PERMISSION", "Create a permission");
        addPermission("GET_ALL_PERMISSIONS", "Get all permissions");
        addPermission("DELETE_PERMISSION", "Delete a permission");

        //        RoleService
        addPermission("CREATE_ROLE", "Create a role");
        addPermission("DELETE_ROLE", "Delete a role");
        addPermission("GET_ALL_ROLES", "Get all roles");

        //        UserService
        addPermission("CREATE_USER", "Create an account");
        addPermission("DELETE_USER", "Delete an account");
        addPermission("GET_ALL_USERS", "Get info of all accounts");
        addPermission("GET_USER", "Get info of an account");
        addPermission("UPDATE_USER", "Update account information");

        //        VoucherService
        addPermission("CREATE_VOUCHER", "Create a voucher");
        addPermission("DELETE_VOUCHER", "Delete a voucher");
        addPermission("GET_VOUCHER", "Get info of a voucher");
        addPermission("GET_ALL_VOUCHERS", "Get info of all vouchers");

        //        ZaloPayService
        addPermission("CREATE_ORDER", "Create an order");
        addPermission("GET_ORDER_STATUS", "Get order status");
        addPermission("UPDATE_ORDER_TRANSACTIONID", "Update order transaction id");
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

                Set<String> userPermissions = Set.of(
                        "GET_REVIEWS_BY_GOODS",
                        "GET_ALL_GOODS",
                        "GET_GOODS_BY_ID",
                        "GET_GOODS_BY_NAME",
                        "GET_GOODS_BY_CATEGORY",
                        "GET_VOUCHER",
                        "GET_ALL_VOUCHERS",
                        "CREATE_REVIEWS",
                        "GET_ALL_REVIEWS",
                        "GET_REVIEWS_BY_ID",
                        "PLACE_ORDER",
                        "DELETE_ORDER",
                        "UPDATE_ORDERITEM",
                        "GET_ORDER_BY_ID",
                        "GET_CURRENT_USERORDERS",
                        "UPDATE_ORDER_STATUS",
                        "UPDATE_PAYMENT_STATUS",
                        "GET_ALL_ORDERS",
                        "GET_ORDERS_BY_STATUS",
                        "GET_ORDERS_BY_USERID",
                        "GET_ORDER_STATUS",
                        "CREATE_ORDER",
                        "UPDATE_ORDER_TRANSACTIONID");

                Set<String> staffPermissions = Set.of(
                        "CHECK_TOKEN",
                        "REFRESH_TOKEN",
                        "CREATE_GOODS",
                        "GET_ALL_GOODS",
                        "GET_GOODS_BY_ID",
                        "GET_GOODS_BY_NAME",
                        "GET_GOODS_BY_CATEGORY",
                        "GET_REVIEWS_BY_GOODS",
                        "CREATE_VOUCHER",
                        "DELETE_VOUCHER",
                        "GET_VOUCHER",
                        "GET_ALL_VOUCHERS",
                        "CREATE_REVIEWS",
                        "GET_REVIEWS_BY_ID",
                        "GET_ALL_REVIEWS",
                        "UPDATE_REVIEWS",
                        "DELETE_REVIEWS",
                        "PLACE_ORDER",
                        "DELETE_ORDER",
                        "UPDATE_ORDERITEM",
                        "GET_ORDER_BY_ID",
                        "GET_CURRENT_USERORDERS",
                        "UPDATE_ORDER_STATUS",
                        "UPDATE_PAYMENT_STATUS",
                        "GET_ALL_ORDERS",
                        "GET_ORDERS_BY_STATUS",
                        "GET_ORDERS_BY_USERID",
                        "GET_ORDER_STATUS",
                        "CREATE_ORDER",
                        "UPDATE_ORDER_TRANSACTIONID");

                Set<String> adminPermissions = permissionRepository.findAll().stream()
                        .map(Permission::getName)
                        .collect(Collectors.toSet());

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
