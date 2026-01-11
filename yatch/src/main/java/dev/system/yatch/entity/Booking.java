package dev.system.yatch.entity;

import dev.system.yatch.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    
    private String bookingId; // e.g., "YB-2026-0001"
    
    private String yachtId;
    private String yachtName;
    
    // Slot Details (Snapshot at booking time)
    private String slotId;
    private String slotLabel;
    private String slotStart;
    private String slotEnd;
    
    private LocalDate serviceDate;
    
    private String customerName;
    private String phone;
    private String email;
    
    private BookingStatus status;
    private boolean emailSent;
    
    private String notes;
    private String cancelReason;
    
    // Reward/Voucher info
    private String rewardId;
    private String tokenTxTime;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
