package dev.system.yatch.service.impl;

import dev.system.yatch.dto.request.YachtRequest;
import dev.system.yatch.dto.response.YachtResponse;
import dev.system.yatch.entity.Yacht;
import dev.system.yatch.repository.YachtRepository;
import dev.system.yatch.service.YachtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class YachtServiceImpl implements YachtService {

    private final YachtRepository yachtRepository;

    @Override
    public List<YachtResponse> getAllYachts() {
        return yachtRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public YachtResponse getYachtById(String id) {
        Yacht yacht = yachtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yacht not found: " + id));
        return mapToResponse(yacht);
    }

    @Override
    public YachtResponse createYacht(YachtRequest request) {
        Yacht yacht = Yacht.builder()
                .name(request.getName())
                .description(request.getDescription())
                .capacity(request.getCapacity())
                .isActive(request.getIsActive())
                .timeSlots(request.getTimeSlots())
                .dateOverrides(request.getDateOverrides())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return mapToResponse(yachtRepository.save(yacht));
    }

    @Override
    public YachtResponse updateYacht(String id, YachtRequest request) {
        Yacht yacht = yachtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Yacht not found: " + id));

        // Update fields (Partial Update Check)
        if (request.getName() != null)
            yacht.setName(request.getName());
        if (request.getDescription() != null)
            yacht.setDescription(request.getDescription());
        if (request.getCapacity() != null && request.getCapacity() > 0)
            yacht.setCapacity(request.getCapacity());

        if (request.getIsActive() != null)
            yacht.setActive(request.getIsActive());

        if (request.getTimeSlots() != null)
            yacht.setTimeSlots(request.getTimeSlots());
        if (request.getDateOverrides() != null)
            yacht.setDateOverrides(request.getDateOverrides());

        yacht.setUpdatedAt(LocalDateTime.now());

        return mapToResponse(yachtRepository.save(yacht));
    }

    @Override
    public void deleteYacht(String id) {
        yachtRepository.deleteById(id);
    }

    // ===== MAPPER =====
    private YachtResponse mapToResponse(Yacht yacht) {
        return YachtResponse.builder()
                .id(yacht.getId())
                .name(yacht.getName())
                .description(yacht.getDescription())
                .capacity(yacht.getCapacity())
                .isActive(yacht.isActive())
                .timeSlots(yacht.getTimeSlots())
                .dateOverrides(yacht.getDateOverrides())
                .createdAt(yacht.getCreatedAt())
                .updatedAt(yacht.getUpdatedAt())
                .build();
    }
}
