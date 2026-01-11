package dev.system.yatch.service;

import dev.system.yatch.dto.request.SavedUserRequest;
import dev.system.yatch.dto.response.SavedUserResponse;
import dev.system.yatch.enums.UserType;

import java.util.List;

public interface SavedUserService {
    List<SavedUserResponse> getAll();

    List<SavedUserResponse> getByType(UserType type);

    SavedUserResponse getById(String id);

    SavedUserResponse create(SavedUserRequest request);

    SavedUserResponse update(String id, SavedUserRequest request);

    void delete(String id);
}
