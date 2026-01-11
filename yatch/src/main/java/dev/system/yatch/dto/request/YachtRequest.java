package dev.system.yatch.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import dev.system.yatch.dto.common.TimeSlotDTO;
import dev.system.yatch.enums.YachtType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YachtRequest {
    private String name;
    private String description;
    private Integer capacity;

    @Builder.Default
    @JsonProperty("isActive")
    private Boolean isActive = true;

    private YachtType yachtType; // REGULAR or FRACTIONAL

    private List<TimeSlotDTO> timeSlots;

    private Map<String, List<TimeSlotDTO>> dateOverrides;
}
