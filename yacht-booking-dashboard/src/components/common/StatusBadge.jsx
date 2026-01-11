// ===== STATUS BADGE COMPONENT =====
import { STATUS_CONFIG } from '../../config/app.config';

export default function StatusBadge({ status, size = 'md', showLabel = true }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

    const sizeClasses = {
        sm: 'text-xs px-1.5 py-0.5',
        md: 'text-sm px-2 py-1',
        lg: 'text-base px-3 py-1.5'
    };

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgLight} ${config.textColor} ${sizeClasses[size]}`}
        >
            <span>{config.icon}</span>
            {showLabel && <span>{config.label}</span>}
        </span>
    );
}
