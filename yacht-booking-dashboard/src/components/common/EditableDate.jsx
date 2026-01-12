import { useRef } from 'react';
import { formatDateThai } from '../../utils/date.utils';

export default function EditableDate({
    label,
    date,
    onChange,
    className = "",
    showTime = true
}) {
    const inputRef = useRef(null);

    // Helper: Format Date object to YYYY-MM-DDTHH:mm string for input
    const formatForInput = (d) => {
        if (!d) return '';
        const dateObj = new Date(d);
        // Safety check for invalid dates
        if (isNaN(dateObj.getTime())) return '';

        const pad = (n) => String(n).padStart(2, '0');
        const year = dateObj.getFullYear();
        const month = pad(dateObj.getMonth() + 1);
        const day = pad(dateObj.getDate());
        const hours = pad(dateObj.getHours());
        const minutes = pad(dateObj.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Helper: Handle input change
    const handleChange = (e) => {
        const val = e.target.value;
        if (!val) return;
        // Convert input string back to Date object
        const newDate = new Date(val);
        if (onChange) onChange(newDate);
    };

    // Helper: Trigger picker (Standard)
    const handleClick = (e) => {
        // Prevent bubbling
        e.stopPropagation();

        if (inputRef.current) {
            try {
                // Modern API to open picker
                if ('showPicker' in HTMLInputElement.prototype) {
                    inputRef.current.showPicker();
                } else {
                    // Fallback
                    inputRef.current.focus();
                    inputRef.current.click();
                }
            } catch (err) {
                console.error("Picker failed:", err);
            }
        }
    };

    return (
        <div
            className={`cursor-pointer group relative text-right ${className}`}
            onClick={handleClick}
            title={label ? `คลิกเพื่อแก้ไข ${label}` : 'คลิกเพื่อแก้ไข'}
        >
            {label && (
                <label className="text-xs text-slate-400 font-medium block mb-1 group-hover:text-blue-500 transition-colors cursor-pointer pointer-events-none">
                    {label} ✎
                </label>
            )}
            <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors pointer-events-none">
                {formatDateThai(date, showTime)}
            </p>

            {/* Hidden Native Input */}
            <input
                ref={inputRef}
                type="datetime-local"
                value={formatForInput(date)}
                onChange={handleChange}
                className="absolute top-0 right-0 opacity-0 w-0 h-full pointer-events-none border-0 p-0 m-0"
                tabIndex={-1}
                aria-hidden="true"
            />
        </div>
    );
}
