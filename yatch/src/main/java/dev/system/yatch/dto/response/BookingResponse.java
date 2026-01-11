package dev.system.yatch.dto.response;

import dev.system.yatch.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String id;
    private String bookingId; // e.g., "YB-2026-0001"

    private String yachtId;
    private String yachtName;

    private String slotId;
    private String slotLabel;
    private String slotStart;
    private String slotEnd;

    private LocalDate serviceDate;

    private String customerName;
    private String phone;
    private String email;

    private BookingStatus status; // "PENDING", "CONFIRMED", etc.
    private boolean emailSent;

    private String notes;
    private String cancelReason;

    // Reward/Voucher info
    private String rewardId;
    private String tokenTxTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
