package dev.system.yatch.entity;

import dev.system.yatch.dto.common.TimeSlotDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "yachts")
public class Yacht {
    @Id
    private String id;
    
    private String name;
    private String description;
    private int capacity;
    
    @Builder.Default
    private boolean isActive = true;
    
    private List<TimeSlotDTO> timeSlots;
    
    // Key: Date string "YYYY-MM-DD", Value: List of slots for that day
    private Map<String, List<TimeSlotDTO>> dateOverrides;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
