package dev.system.yatch.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
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
public class BookingRequest {
    private String yachtId;
    private String slotId;

    // Using LocalDate for just the Date part (YYYY-MM-DD)
    private LocalDate serviceDate;

    // Enum lock
    private BookingStatus status;

    private String customerName;
    private String phone;
    private String email;

    private String notes;
    private String cancelReason;

    // Optional: for creation tracking if passed from frontend (though usually
    // backend sets this)
    private LocalDateTime createdAt;

    // Voucher/Reward info
    private String rewardId;
    private String tokenTxTime;

    @JsonProperty("emailSent")
    private Boolean emailSent;
}
