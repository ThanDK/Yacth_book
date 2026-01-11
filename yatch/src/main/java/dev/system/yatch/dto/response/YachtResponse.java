package dev.system.yatch.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import dev.system.yatch.dto.common.TimeSlotDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YachtResponse {
    private String id;
    private String name;
    private String description;
    private int capacity;
    @JsonProperty("isActive")
    private boolean isActive;

    private List<TimeSlotDTO> timeSlots;

    // Key: Date string "YYYY-MM-DD", Value: List of slots for that day
    private Map<String, List<TimeSlotDTO>> dateOverrides;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
