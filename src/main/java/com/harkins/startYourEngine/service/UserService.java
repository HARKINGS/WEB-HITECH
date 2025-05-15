package com.harkins.startYourEngine.service;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;

import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.harkins.startYourEngine.dto.request.CreateUserRequest;
import com.harkins.startYourEngine.dto.request.UpdateUserRequest;
import com.harkins.startYourEngine.dto.response.UserResponse;
import com.harkins.startYourEngine.entity.Role;
import com.harkins.startYourEngine.entity.User;
import com.harkins.startYourEngine.enums.PredefinedRole;
import com.harkins.startYourEngine.exception.AppException;
import com.harkins.startYourEngine.exception.ErrorCode;
import com.harkins.startYourEngine.mapper.UserMapper;
import com.harkins.startYourEngine.repository.RoleRepository;
import com.harkins.startYourEngine.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;

    @PreAuthorize("hasAuthority('CREATE_USER')")
    public UserResponse createUser(CreateUserRequest request, String roleType) {
        if (userRepository.existsByUsername(request.getUsername())) throw new AppException(ErrorCode.USER_EXISTED);

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        HashSet<Role> roles = new HashSet<>();

        if (Objects.equals(roleType, "STAFF"))
            roleRepository.findById(PredefinedRole.STAFF).ifPresent(roles::add);
        else if (Objects.equals(roleType, "USER"))
            roleRepository.findById(PredefinedRole.USER).ifPresent(roles::add);
        else throw new AppException(ErrorCode.WRONG_ROLE);

        user.setRoles(roles);

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserResponse(user);
    }

    //    Có quyền thay đổi và còn phải tên tài khoản trùng với tài khoản đăng nhập
    @PreAuthorize("hasAuthority('UPDATE_USER')")
    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse updateUser(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @PreAuthorize("hasAuthority('DELETE_USER')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

//    @PreAuthorize("hasAuthority('GET_ALL_USERS')")
    public List<UserResponse> getUsers() {
        log.info("In method get Users");
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PreAuthorize("hasAuthority('GET_USER')")
    public UserResponse getUser(String id) {
        log.info("In method get user by Id");
        return userMapper.toUserResponse(
                userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
    }
}
