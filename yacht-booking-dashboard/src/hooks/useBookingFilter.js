// ===== useBookingFilter Hook =====
// Filters bookings and syncs state with URL for persistence
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useBookingFilter(bookings, { syncWithURL = false } = {}) {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read initial values from URL if syncWithURL is enabled
    const getInitialValue = (key, defaultValue) => {
        if (syncWithURL) {
            return searchParams.get(key) || defaultValue;
        }
        return defaultValue;
    };

    const [search, setSearchState] = useState(getInitialValue('q', ''));
    const [statusFilter, setStatusFilterState] = useState(getInitialValue('status', 'ALL'));
    const [yachtFilter, setYachtFilterState] = useState(getInitialValue('yacht', 'ALL'));

    // Sync state with URL when syncWithURL is enabled
    const updateURLParam = useCallback((key, value) => {
        if (!syncWithURL) return;
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (value === 'ALL' || value === '' || value === null) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
            return newParams;
        }, { replace: true });
    }, [syncWithURL, setSearchParams]);

    // Wrapped setters that also update URL
    const setSearch = useCallback((value) => {
        setSearchState(value);
        updateURLParam('q', value);
    }, [updateURLParam]);

    const setStatusFilter = useCallback((value) => {
        setStatusFilterState(value);
        updateURLParam('status', value);
    }, [updateURLParam]);

    const setYachtFilter = useCallback((value) => {
        setYachtFilterState(value);
        updateURLParam('yacht', value);
    }, [updateURLParam]);

    // Sync from URL on mount/navigation (for browser back/forward)
    useEffect(() => {
        if (!syncWithURL) return;
        const urlSearch = searchParams.get('q') || '';
        const urlStatus = searchParams.get('status') || 'ALL';
        const urlYacht = searchParams.get('yacht') || 'ALL';

        if (urlSearch !== search) setSearchState(urlSearch);
        if (urlStatus !== statusFilter) setStatusFilterState(urlStatus);
        if (urlYacht !== yachtFilter) setYachtFilterState(urlYacht);
    }, [searchParams, syncWithURL]); // eslint-disable-line react-hooks/exhaustive-deps

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
