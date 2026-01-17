// ===== useURLState Hook =====
// Syncs React state with URL query parameters for persistence across refresh
import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/**
 * Custom hook to manage state via URL query parameters.
 * Provides get/set helpers that automatically update the URL.
 * 
 * @returns {Object} - { getParam, setParam, setParams, removeParam, getAllParams }
 */
export function useURLState() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Get a single param value
    const getParam = useCallback((key) => {
        return searchParams.get(key);
    }, [searchParams]);

    // Get all params as an object
    const getAllParams = useMemo(() => {
        const params = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }, [searchParams]);

    // Set a single param (preserves other params)
    const setParam = useCallback((key, value) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (value === null || value === undefined || value === '') {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }
            return newParams;
        }, { replace: true });
    }, [setSearchParams]);

    // Set multiple params at once (preserves other params)
    const setParams = useCallback((paramsObj) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            Object.entries(paramsObj).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    newParams.delete(key);
                } else {
                    newParams.set(key, String(value));
                }
            });
            return newParams;
        }, { replace: true });
    }, [setSearchParams]);

    // Remove a param
    const removeParam = useCallback((key) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete(key);
            return newParams;
        }, { replace: true });
    }, [setSearchParams]);

    // Clear all params
    const clearParams = useCallback(() => {
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    return {
        getParam,
        setParam,
        setParams,
        removeParam,
        clearParams,
        getAllParams,
        searchParams // Raw access if needed
    };
}

export default useURLState;
