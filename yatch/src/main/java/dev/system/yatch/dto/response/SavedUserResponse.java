package dev.system.yatch.dto.response;

import dev.system.yatch.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedUserResponse {
    private String id;
    private String userId;
    private String name;
    private String email;
    private String phone;
    private UserType userType;
    private boolean isActive;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
