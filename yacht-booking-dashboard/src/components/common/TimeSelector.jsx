// ===== TIME SELECTOR COMPONENT =====
// Custom 24-hour time dropdown selector
// Replaces native <input type="time"> for consistent behavior

export default function TimeSelector({ value = '09:00', onChange, className = '' }) {
    // Parse current value
    const [hour, minute] = (value || '09:00').split(':').map(s => s.padStart(2, '0'));

    // Generate hour options (00-23)
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

    // Generate minute options (00, 15, 30, 45 for simplicity, or 00-59 for full)
    const minutes = ['00', '15', '30', '45'];

    const handleHourChange = (e) => {
        onChange(`${e.target.value}:${minute}`);
    };

    const handleMinuteChange = (e) => {
        onChange(`${hour}:${e.target.value}`);
    };

    return (
        <div className={`flex gap-1 items-center ${className}`}>
            <select
                value={hour}
                onChange={handleHourChange}
                className="px-2 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
                {hours.map(h => (
                    <option key={h} value={h}>{h}</option>
                ))}
            </select>
            <span className="text-slate-400 font-bold">:</span>
            <select
                value={minute}
                onChange={handleMinuteChange}
                className="px-2 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
                {minutes.map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
            <span className="text-xs text-slate-400 ml-1">น.</span>
        </div>
    );
}
