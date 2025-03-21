package com.harkins.startYourEngine.service;

import com.harkins.startYourEngine.dto.request.CreateUserRequest;
import com.harkins.startYourEngine.dto.request.UpdateUserRequest;
import com.harkins.startYourEngine.dto.response.UserResponse;
import com.harkins.startYourEngine.entity.User;
import com.harkins.startYourEngine.mapper.UserMapper;
import com.harkins.startYourEngine.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;

    public UserResponse createUser(CreateUserRequest request) {
        if(userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("User already exists");
        User user = userMapper.toUser(request);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse getUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return userMapper.toUserResponse(user);
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    public UserResponse updateUser(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        userMapper.updateUser(user, request);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }
}
