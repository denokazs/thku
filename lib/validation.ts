/**
 * Input validation schemas and helpers for API endpoints
 */

import { sanitizeString } from './sanitize';

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    sanitized?: any;
}

// Re-export sanitizeString for convenience if needed, 
// or simply rely on the imported one for internal use.
export { sanitizeString };


/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate member data
 */
export function validateMember(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const sanitized: any = {};

    // Name validation
    if (!data.name || typeof data.name !== 'string') {
        errors.push({ field: 'name', message: 'Name is required and must be a string' });
    } else {
        sanitized.name = sanitizeString(data.name);
        if (sanitized.name.length < 2) {
            errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
        }
        if (sanitized.name.length > 100) {
            errors.push({ field: 'name', message: 'Name must not exceed 100 characters' });
        }
    }

    // Email validation
    if (!data.email || typeof data.email !== 'string') {
        errors.push({ field: 'email', message: 'Email is required' });
    } else {
        sanitized.email = sanitizeString(data.email.toLowerCase());
        if (!isValidEmail(sanitized.email)) {
            errors.push({ field: 'email', message: 'Invalid email format' });
        }
    }

    // ClubId validation
    if (!data.clubId || typeof data.clubId !== 'number') {
        errors.push({ field: 'clubId', message: 'Club ID is required and must be a number' });
    } else {
        sanitized.clubId = data.clubId;
    }

    // Optional fields
    if (data.department) {
        sanitized.department = sanitizeString(data.department);
    }

    if (data.studentId) {
        sanitized.studentId = sanitizeString(data.studentId);
    }

    if (data.role) {
        sanitized.role = sanitizeString(data.role);
    }

    if (data.reason) {
        sanitized.reason = sanitizeString(data.reason);
        if (sanitized.reason.length > 500) {
            errors.push({ field: 'reason', message: 'Reason must not exceed 500 characters' });
        }
    }

    // Additional fields
    if (data.joinedAt) sanitized.joinedAt = sanitizeString(data.joinedAt);
    if (data.phone) sanitized.phone = sanitizeString(data.phone);
    if (data.avatar) sanitized.avatar = sanitizeString(data.avatar);
    if (data.isFeatured !== undefined) sanitized.isFeatured = Boolean(data.isFeatured);
    if (data.customImage) sanitized.customImage = sanitizeString(data.customImage);
    if (data.customTitle) sanitized.customTitle = sanitizeString(data.customTitle);

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: errors.length === 0 ? sanitized : undefined
    };
}

/**
 * Validate club data
 */
export function validateClub(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const sanitized: any = {};

    // ID validation (required for updates)
    if (data.id !== undefined) {
        if (typeof data.id !== 'number') {
            errors.push({ field: 'id', message: 'ID must be a number' });
        } else {
            sanitized.id = data.id;
        }
    }

    // Name validation
    if (data.name) {
        if (typeof data.name !== 'string') {
            errors.push({ field: 'name', message: 'Name must be a string' });
        } else {
            sanitized.name = sanitizeString(data.name);
            if (sanitized.name.length < 3 || sanitized.name.length > 100) {
                errors.push({ field: 'name', message: 'Name must be between 3 and 100 characters' });
            }
        }
    }

    // Description validation
    if (data.description) {
        sanitized.description = sanitizeString(data.description);
        if (sanitized.description.length > 500) {
            errors.push({ field: 'description', message: 'Description must not exceed 500 characters' });
        }
    }

    // Long description validation
    if (data.longDescription) {
        sanitized.longDescription = sanitizeString(data.longDescription);
        if (sanitized.longDescription.length > 5000) {
            errors.push({ field: 'longDescription', message: 'Long description must not exceed 5000 characters' });
        }
    }

    // Social media validation
    if (data.socialMedia) {
        sanitized.socialMedia = {};
        if (data.socialMedia.email && !isValidEmail(data.socialMedia.email)) {
            errors.push({ field: 'socialMedia.email', message: 'Invalid email format' });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: errors.length === 0 ? { ...data, ...sanitized } : undefined
    };
}

/**
 * Validate event data
 */
export function validateEvent(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const sanitized: any = {};

    // Title validation
    if (!data.title || typeof data.title !== 'string') {
        errors.push({ field: 'title', message: 'Title is required' });
    } else {
        sanitized.title = sanitizeString(data.title);
        if (sanitized.title.length < 3 || sanitized.title.length > 200) {
            errors.push({ field: 'title', message: 'Title must be between 3 and 200 characters' });
        }
    }

    // Description validation
    if (data.description) {
        sanitized.description = sanitizeString(data.description);
        if (sanitized.description.length > 2000) {
            errors.push({ field: 'description', message: 'Description must not exceed 2000 characters' });
        }
    }

    // ClubId validation
    if (!data.clubId || typeof data.clubId !== 'number') {
        errors.push({ field: 'clubId', message: 'Club ID is required' });
    } else {
        sanitized.clubId = data.clubId;
    }

    // Date validation
    if (data.date) {
        const dateObj = new Date(data.date);
        if (isNaN(dateObj.getTime())) {
            errors.push({ field: 'date', message: 'Invalid date format' });
        } else {
            sanitized.date = data.date;
        }
    }

    // Cover Image validation
    if (data.coverImage && typeof data.coverImage === 'string') {
        sanitized.coverImage = sanitizeString(data.coverImage);
    }

    // Event Images validation
    if (data.images && Array.isArray(data.images)) {
        sanitized.images = data.images.filter((img: any) => typeof img === 'string');
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: errors.length === 0 ? { ...data, ...sanitized } : undefined
    };
}

/**
 * Validate message data
 */
export function validateMessage(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const sanitized: any = {};

    // Subject validation
    if (!data.subject || typeof data.subject !== 'string') {
        errors.push({ field: 'subject', message: 'Subject is required' });
    } else {
        sanitized.subject = sanitizeString(data.subject);
        if (sanitized.subject.length < 3 || sanitized.subject.length > 200) {
            errors.push({ field: 'subject', message: 'Subject must be between 3 and 200 characters' });
        }
    }

    // Content validation
    if (!data.content || typeof data.content !== 'string') {
        errors.push({ field: 'content', message: 'Content is required' });
    } else {
        sanitized.content = sanitizeString(data.content);
        if (sanitized.content.length < 10 || sanitized.content.length > 5000) {
            errors.push({ field: 'content', message: 'Content must be between 10 and 5000 characters' });
        }
    }

    // ClubId validation
    if (!data.clubId || typeof data.clubId !== 'number') {
        errors.push({ field: 'clubId', message: 'Club ID is required' });
    } else {
        sanitized.clubId = data.clubId;
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: errors.length === 0 ? { ...data, ...sanitized } : undefined
    };
}
