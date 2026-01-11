package dev.system.yatch.dto.request;

import dev.system.yatch.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedUserRequest {
    private String name;
    private String email;
    private String phone;
    private UserType userType;
    private String notes;
}
