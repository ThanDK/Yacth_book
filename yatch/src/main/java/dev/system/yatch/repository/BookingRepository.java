package dev.system.yatch.repository;

import dev.system.yatch.entity.Booking;
import dev.system.yatch.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    // Find all bookings for a specific service date
    List<Booking> findByServiceDate(LocalDate serviceDate);

    // Find bookings by yacht and date (for availability check)
    List<Booking> findByYachtIdAndServiceDate(String yachtId, LocalDate serviceDate);

    // Find active bookings (not cancelled)
    List<Booking> findByStatusNot(BookingStatus status);

    // Find bookings by status
    List<Booking> findByStatus(BookingStatus status);
}
