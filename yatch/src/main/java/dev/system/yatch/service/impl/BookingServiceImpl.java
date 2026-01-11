package dev.system.yatch.service.impl;

import dev.system.yatch.dto.common.TimeSlotDTO;
import dev.system.yatch.dto.request.BookingRequest;
import dev.system.yatch.dto.response.BookingResponse;
import dev.system.yatch.entity.Booking;
import dev.system.yatch.entity.Yacht;
import dev.system.yatch.enums.BookingStatus;
import dev.system.yatch.repository.BookingRepository;
import dev.system.yatch.repository.YachtRepository;
import dev.system.yatch.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final YachtRepository yachtRepository;

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
        return mapToResponse(booking);
    }

    @Override
    public BookingResponse createBooking(BookingRequest request) {
        // 1. Validate Yacht
        Yacht yacht = yachtRepository.findById(request.getYachtId())
                .orElseThrow(() -> new RuntimeException("Yacht not found"));

        // 2. Validate Slot Availability (Double Booking Check)
        validateSlotAvailability(request.getYachtId(), request.getServiceDate(), request.getSlotId(), null);

        // 3. Generate ID (Simple simulation, normally UUID or Seq)
        String bookingId = "YB-" + LocalDate.now().getYear() + "-" + System.currentTimeMillis();

        // 4. Map & Save (including all fields from request to prevent data loss)
        Booking booking = Booking.builder()
                .bookingId(bookingId)
                .yachtId(request.getYachtId())
                .yachtName(yacht.getName()) // Snapshot name
                .slotId(request.getSlotId())
                .slotLabel("Unknown") // Will be enriched below
                .serviceDate(request.getServiceDate())
                .customerName(request.getCustomerName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .status(request.getStatus() != null ? request.getStatus() : BookingStatus.PENDING)
                .emailSent(request.getEmailSent() != null ? request.getEmailSent() : false) // FIXED: Include emailSent
                .notes(request.getNotes())
                .cancelReason(request.getCancelReason())
                .rewardId(request.getRewardId())
                .tokenTxTime(request.getTokenTxTime())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Enrich slot details from yacht config
        enrichSlotDetails(booking, yacht);

        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse updateBooking(String id, BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));

        // Validation for Slot Change (Only if slot-related fields are provided and
        // different)
        boolean newYachtIdProvided = request.getYachtId() != null;
        boolean newSlotIdProvided = request.getSlotId() != null;
        boolean newDateProvided = request.getServiceDate() != null;

        String targetYachtId = newYachtIdProvided ? request.getYachtId() : booking.getYachtId();
        String targetSlotId = newSlotIdProvided ? request.getSlotId() : booking.getSlotId();
        LocalDate targetDate = newDateProvided ? request.getServiceDate() : booking.getServiceDate();

        boolean isSlotChanged = !booking.getYachtId().equals(targetYachtId) ||
                !booking.getSlotId().equals(targetSlotId) ||
                !booking.getServiceDate().equals(targetDate);

        if (isSlotChanged) {
            validateSlotAvailability(targetYachtId, targetDate, targetSlotId, id);

            // Update yacht snapshot info if yacht changed
            if (!booking.getYachtId().equals(targetYachtId)) {
                Yacht yacht = yachtRepository.findById(targetYachtId)
                        .orElseThrow(() -> new RuntimeException("Yacht not found"));
                booking.setYachtName(yacht.getName());
                // We'll enrich below with the new yacht
            }
        }

        // Update fields (Only if non-null in request)
        if (newYachtIdProvided)
            booking.setYachtId(request.getYachtId());
        if (newSlotIdProvided)
            booking.setSlotId(request.getSlotId());
        if (newDateProvided)
            booking.setServiceDate(request.getServiceDate());

        if (request.getCustomerName() != null)
            booking.setCustomerName(request.getCustomerName());
        if (request.getPhone() != null)
            booking.setPhone(request.getPhone());
        if (request.getEmail() != null)
            booking.setEmail(request.getEmail());
        if (request.getStatus() != null)
            booking.setStatus(request.getStatus());
        if (request.getNotes() != null)
            booking.setNotes(request.getNotes());
        if (request.getCancelReason() != null)
            booking.setCancelReason(request.getCancelReason());

        if (request.getRewardId() != null)
            booking.setRewardId(request.getRewardId());
        if (request.getTokenTxTime() != null)
            booking.setTokenTxTime(request.getTokenTxTime());
        if (request.getEmailSent() != null)
            booking.setEmailSent(request.getEmailSent());

        booking.setUpdatedAt(LocalDateTime.now());

        // Refresh slot labels if needed (using up-to-date values)
        if (isSlotChanged) {
            Yacht yacht = yachtRepository.findById(booking.getYachtId())
                    .orElseThrow(() -> new RuntimeException("Yacht not found"));
            enrichSlotDetails(booking, yacht);
        }

        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }

    // ===== VALIDATION =====
    private void validateSlotAvailability(String yachtId, LocalDate date, String slotId, String excludeBookingId) {
        List<Booking> existingBookings = bookingRepository.findByServiceDate(date);

        boolean isBooked = existingBookings.stream().anyMatch(b -> !b.getId().equals(excludeBookingId) && // Don't block
                                                                                                          // self update
                b.getYachtId().equals(yachtId) &&
                b.getSlotId().equals(slotId) &&
                b.getStatus() != BookingStatus.CANCELLED);

        if (isBooked) {
            throw new RuntimeException("Slot is already booked!");
        }
    }

    // ===== HELPER =====
    private void enrichSlotDetails(Booking booking, Yacht yacht) {
        if (yacht == null || booking == null || booking.getSlotId() == null) {
            return;
        }

        // First, try date-specific override slots (if service date is available)
        if (booking.getServiceDate() != null && yacht.getDateOverrides() != null) {
            String dateKey = booking.getServiceDate().toString(); // YYYY-MM-DD format
            List<TimeSlotDTO> overrideSlots = yacht.getDateOverrides().get(dateKey);
            if (overrideSlots != null) {
                overrideSlots.stream()
                        .filter(s -> s.getId().equals(booking.getSlotId()))
                        .findFirst()
                        .ifPresent(slot -> {
                            booking.setSlotLabel(slot.getLabel());
                            booking.setSlotStart(slot.getStart());
                            booking.setSlotEnd(slot.getEnd());
                        });
                // If found in overrides, return early
                if (booking.getSlotStart() != null) {
                    return;
                }
            }
        }

        // Try default time slots (with null check)
        if (yacht.getTimeSlots() != null) {
            yacht.getTimeSlots().stream()
                    .filter(s -> s.getId().equals(booking.getSlotId()))
                    .findFirst()
                    .ifPresent(slot -> {
                        booking.setSlotLabel(slot.getLabel());
                        booking.setSlotStart(slot.getStart());
                        booking.setSlotEnd(slot.getEnd());
                    });
        }

        // Fallback: search all date overrides if slot not found
        if (booking.getSlotStart() == null && yacht.getDateOverrides() != null) {
            yacht.getDateOverrides().values().stream()
                    .flatMap(List::stream)
                    .filter(s -> s.getId().equals(booking.getSlotId()))
                    .findFirst()
                    .ifPresent(slot -> {
                        booking.setSlotLabel(slot.getLabel());
                        booking.setSlotStart(slot.getStart());
                        booking.setSlotEnd(slot.getEnd());
                    });
        }
    }

    private BookingResponse mapToResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .bookingId(b.getBookingId())
                .yachtId(b.getYachtId())
                .yachtName(b.getYachtName())
                .slotId(b.getSlotId())
                .slotLabel(b.getSlotLabel())
                .slotStart(b.getSlotStart())
                .slotEnd(b.getSlotEnd())
                .serviceDate(b.getServiceDate())
                .customerName(b.getCustomerName())
                .phone(b.getPhone())
                .email(b.getEmail())
                .status(b.getStatus())
                .emailSent(b.isEmailSent())
                .notes(b.getNotes())
                .cancelReason(b.getCancelReason())
                .rewardId(b.getRewardId())
                .tokenTxTime(b.getTokenTxTime())
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}
