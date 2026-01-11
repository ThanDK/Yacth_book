// ===== BOOKING HOOKS - Custom hooks for booking state =====
import { useState, useCallback, useMemo, useEffect } from 'react';
import { bookingService, yachtService, parseDateSafe } from '../services';
import { getSlotsForDate } from '../utils/booking.utils';
import { toDateString } from '../utils/date.utils';
import { useToast } from '../contexts/ToastContext';

/**
 * Custom hook for managing yacht and booking state
 */
export function useBookingState() {
    const { success, error: toastError } = useToast();
    const [yachts, setYachts] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Parallel fetch
                const [yachtsData, bookingsData] = await Promise.all([
                    yachtService.getAll(),
                    bookingService.getAll()
                ]);

                setYachts(yachtsData);

                // Parse dates for UI components (using safe date parsing to prevent timezone shift)
                const parsedBookings = bookingsData.map(b => ({
                    ...b,
                    createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
                    updatedAt: b.updatedAt ? new Date(b.updatedAt) : new Date(),
                    // FIXED: Use parseDateSafe to prevent timezone shift for date-only fields
                    serviceDate: parseDateSafe(b.serviceDate) || new Date(b.serviceDate)
                }));
                setBookings(parsedBookings);
            } catch (err) {
                console.error("Failed to fetch data", err);
                setError(err.message);
                toastError("โหลดข้อมูลไม่สำเร็จ: " + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Add new booking
    const addBooking = useCallback(async (formData, yacht, slot) => {
        try {
            // Build complete payload with all required fields
            const payload = {
                yachtId: yacht.id,
                slotId: slot.id,
                serviceDate: formData.serviceDate, // Service handles formatting
                customerName: formData.customerName,
                phone: formData.phone,
                email: formData.email || '',
                notes: formData.notes || '',
                rewardId: formData.rewardId || '',
                tokenTxTime: formData.tokenTxTime || '',
                // CRITICAL: Include status and emailSent to prevent data loss
                status: formData.status || 'PENDING',
                emailSent: formData.emailSent === true, // Explicit boolean conversion
            };

            const newBooking = await bookingService.create(payload);

            // Format for state (using safe date parsing to prevent timezone shift)
            const formattedBooking = {
                ...newBooking,
                serviceDate: parseDateSafe(newBooking.serviceDate) || new Date(newBooking.serviceDate),
                createdAt: new Date(newBooking.createdAt),
                updatedAt: new Date(newBooking.updatedAt)
            };

            setBookings(prev => [...prev, formattedBooking]);
            success("จองสำเร็จ!");
            return formattedBooking;
        } catch (err) {
            console.error(err);
            toastError("จองไม่สำเร็จ: " + err.message);
            throw err;
        }
    }, [bookings]);

    // Update booking
    const updateBooking = useCallback(async (id, updates) => {
        try {
            const updatedBooking = await bookingService.update(id, updates);

            setBookings(prev => prev.map(b =>
                b.id === id ? {
                    ...updatedBooking,
                    // FIXED: Use safe date parsing to prevent timezone shift
                    serviceDate: parseDateSafe(updatedBooking.serviceDate) || new Date(updatedBooking.serviceDate),
                    createdAt: new Date(updatedBooking.createdAt),
                    updatedAt: new Date(updatedBooking.updatedAt)
                } : b
            ));
            success("อัปเดตข้อมูลสำเร็จ");
        } catch (err) {
            console.error(err);
            toastError("อัปเดตไม่สำเร็จ: " + err.message);
        }
    }, []);

    // Delete booking
    const deleteBooking = useCallback(async (id) => {
        try {
            await bookingService.delete(id);
            setBookings(prev => prev.filter(b => b.id !== id));
            success("ลบรายการจองแล้ว");
        } catch (err) {
            console.error(err);
            toastError("ลบรายการไม่สำเร็จ");
        }
    }, []);

    // Add yacht
    const addYacht = useCallback(async (yachtData) => {
        try {
            const newYacht = await yachtService.create(yachtData);
            setYachts(prev => [...prev, newYacht]);
            success("เพิ่มเรือลำใหม่เรียบร้อย");
            return newYacht;
        } catch (err) {
            console.error(err);
            toastError("เพิ่มเรือไม่สำเร็จ");
        }
    }, []);

    // Update yacht
    const updateYacht = useCallback(async (id, updates) => {
        try {
            const updatedYacht = await yachtService.update(id, updates);
            setYachts(prev => prev.map(y => y.id === id ? updatedYacht : y));
            success("แก้ไขข้อมูลเรือสำเร็จ");
        } catch (err) {
            console.error(err);
            toastError("แก้ไขข้อมูลเรือไม่สำเร็จ");
        }
    }, []);

    // Delete yacht
    const deleteYacht = useCallback(async (id) => {
        const hasBookings = bookings.some(b =>
            b.yachtId === id && !['USED', 'CANCELLED'].includes(b.status)
        );
        if (hasBookings) {
            return { success: false, message: 'ไม่สามารถลบได้ มีการจองที่ยังไม่เสร็จสิ้น' };
        }

        try {
            await yachtService.delete(id);
            setYachts(prev => prev.filter(y => y.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, message: 'Delete failed' };
        }
    }, [bookings]);

    // Check if slot is booked (Client-side optimistic check)
    const isSlotBooked = useCallback((yachtId, date, slotId) => {
        const dateStr = toDateString(date);
        return bookings.some(b =>
            b.yachtId === yachtId &&
            toDateString(b.serviceDate) === dateStr &&
            b.slotId === slotId &&
            b.status !== 'CANCELLED'
        );
    }, [bookings]);

    // Get bookings for date
    const getBookingsForDate = useCallback((date) => {
        if (!date) return [];
        const dateStr = toDateString(date);
        return bookings
            .filter(b => toDateString(b.serviceDate) === dateStr)
            .sort((a, b) => a.slotStart.localeCompare(b.slotStart));
    }, [bookings]);

    // Get available slots for yacht on date
    const getAvailableSlots = useCallback((yachtId, date) => {
        const yacht = yachts.find(y => y.id === yachtId);
        if (!yacht) return [];
        const slots = getSlotsForDate(yacht, date);
        return slots.filter(slot => !isSlotBooked(yachtId, date, slot.id));
    }, [yachts, isSlotBooked]);

    // Active yachts only
    const activeYachts = useMemo(() => yachts.filter(y => y.isActive), [yachts]);

    return {
        // State
        yachts,
        bookings,
        activeYachts,
        isLoading,
        error,
        // Booking actions
        addBooking,
        updateBooking,
        deleteBooking,
        // Yacht actions
        addYacht,
        updateYacht,
        deleteYacht,
        // Helpers
        isSlotBooked,
        getBookingsForDate,
        getAvailableSlots
    };
}
