package dev.system.yatch.entity;

import dev.system.yatch.enums.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Saved User entity - pre-saved customer info for quick booking
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "saved_users")
public class SavedUser {

    @Id
    private String id;

    private String userId; // Unique ID (e.g., "U-0001")
    private String name; // Customer name
    private String email;
    private String phone;

    private UserType userType; // REGULAR or FRACTIONAL

    private boolean isActive;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
