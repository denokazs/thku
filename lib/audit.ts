import fs from 'fs';
import path from 'path';

// Audit Log Structure
export interface AuditEntry {
    timestamp: string;
    action: string;
    actor: {
        id?: string | number;
        ip: string;
        role?: string;
    };
    target?: string;
    details?: any;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

const LOG_FILE = path.join(process.cwd(), 'audit.log');

/**
 * Mask PII (Personally Identifiable Information)
 */
function maskPII(data: any): any {
    if (!data) return data;
    const masked = { ...data };

    // Mask sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'creditCard'];
    for (const field of sensitiveFields) {
        if (masked[field]) masked[field] = '***MASKED***';
    }

    // Mask Email (leave domain)
    if (masked.email && typeof masked.email === 'string') {
        const [user, domain] = masked.email.split('@');
        masked.email = `${user.substring(0, 2)}***@${domain}`;
    }

    return masked;
}

/**
 * Append to Audit Log (Immutable append-only)
 */
export function logAudit(entry: Omit<AuditEntry, 'timestamp'>) {
    const logEntry: AuditEntry = {
        timestamp: new Date().toISOString(),
        ...entry,
        details: maskPII(entry.details)
    };

    // In production, send to external SIEM (Splunk, Datadog)
    // For now, write to local file
    const logLine = JSON.stringify(logEntry) + '\n';

    // Asynchronous write to not block main thread
    fs.appendFile(LOG_FILE, logLine, (err) => {
        if (err) console.error('AUDIT LOG FAILURE:', err);
    });

    // Alert on CRITICAL events (Simulated)
    if (entry.severity === 'CRITICAL' || process.env.PANIC_MODE === 'true') {
        // In Panic Mode, everything is critical or at least logged loudly
        console.error(`[AUDIT ${process.env.PANIC_MODE === 'true' ? 'PANIC-MODE' : ''}] ${entry.severity}: ${entry.action} by ${entry.actor.ip} - ${JSON.stringify(entry.details)}`);
    }
}
