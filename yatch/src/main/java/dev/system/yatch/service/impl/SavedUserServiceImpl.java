package dev.system.yatch.service.impl;

import dev.system.yatch.dto.request.SavedUserRequest;
import dev.system.yatch.dto.response.SavedUserResponse;
import dev.system.yatch.entity.SavedUser;
import dev.system.yatch.enums.UserType;
import dev.system.yatch.repository.SavedUserRepository;
import dev.system.yatch.service.SavedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedUserServiceImpl implements SavedUserService {

    private final SavedUserRepository savedUserRepository;

    @Override
    public List<SavedUserResponse> getAll() {
        return savedUserRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SavedUserResponse> getByType(UserType type) {
        return savedUserRepository.findByUserType(type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SavedUserResponse getById(String id) {
        SavedUser user = savedUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        return mapToResponse(user);
    }

    @Override
    public SavedUserResponse create(SavedUserRequest request) {
        // Generate user ID
        long count = savedUserRepository.count();
        String userId = String.format("U-%04d", count + 1);

        SavedUser user = SavedUser.builder()
                .userId(userId)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .userType(request.getUserType() != null ? request.getUserType() : UserType.REGULAR)
                .isActive(true)
                .notes(request.getNotes())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return mapToResponse(savedUserRepository.save(user));
    }

    @Override
    public SavedUserResponse update(String id, SavedUserRequest request) {
        SavedUser user = savedUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        if (request.getName() != null)
            user.setName(request.getName());
        if (request.getEmail() != null)
            user.setEmail(request.getEmail());
        if (request.getPhone() != null)
            user.setPhone(request.getPhone());
        if (request.getUserType() != null)
            user.setUserType(request.getUserType());
        if (request.getNotes() != null)
            user.setNotes(request.getNotes());

        user.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(savedUserRepository.save(user));
    }

    @Override
    public void delete(String id) {
        savedUserRepository.deleteById(id);
    }

    private SavedUserResponse mapToResponse(SavedUser user) {
        return SavedUserResponse.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .userType(user.getUserType())
                .isActive(user.isActive())
                .notes(user.getNotes())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
