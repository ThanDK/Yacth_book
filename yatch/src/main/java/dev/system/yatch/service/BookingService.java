package dev.system.yatch.service;

import dev.system.yatch.dto.request.BookingRequest;
import dev.system.yatch.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    List<BookingResponse> getAllBookings();

    BookingResponse getBookingById(String id);

    BookingResponse createBooking(BookingRequest request);

    BookingResponse updateBooking(String id, BookingRequest request);

    void deleteBooking(String id);
}
