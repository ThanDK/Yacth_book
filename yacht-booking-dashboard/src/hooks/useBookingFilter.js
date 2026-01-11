import { useState, useMemo } from 'react';

export function useBookingFilter(bookings) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [yachtFilter, setYachtFilter] = useState('ALL');

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const matchSearch =
                b.customerName.toLowerCase().includes(search.toLowerCase()) ||
                b.phone.includes(search) ||
                (b.email && b.email.toLowerCase().includes(search.toLowerCase())) ||
                (b.rewardId && b.rewardId.toLowerCase().includes(search.toLowerCase())) ||
                b.bookingId.toLowerCase().includes(search.toLowerCase());

            const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
            const matchYacht = yachtFilter === 'ALL' || b.yachtId === yachtFilter;

            return matchSearch && matchStatus && matchYacht;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [bookings, search, statusFilter, yachtFilter]);

    return {
        search, setSearch,
        statusFilter, setStatusFilter,
        yachtFilter, setYachtFilter,
        filteredBookings
    };
}
