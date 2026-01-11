// ===== STATUS SELECTOR COMPONENT =====
import { STATUS_CONFIG } from '../../config/app.config';

export default function StatusSelector({
    currentStatus,
    onStatusChange,
    excludeStatuses = ['CANCELLED']
}) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {Object.entries(STATUS_CONFIG)
                .filter(([key]) => !excludeStatuses.includes(key))
                .map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => onStatusChange(key)}
                        disabled={currentStatus === key}
                        className={`p-2 rounded-lg text-xs font-medium border transition flex flex-col items-center gap-1
              ${currentStatus === key
                                ? 'ring-2 ring-blue-500 bg-blue-50'
                                : `${config.bgLight} ${config.borderColor} hover:opacity-80`
                            }`}
                    >
                        <span className="text-xl">{config.icon}</span>
                        <span className={config.textColor}>{config.label}</span>
                    </button>
                ))}
        </div>
    );
}
