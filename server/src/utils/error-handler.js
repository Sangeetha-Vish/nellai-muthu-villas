import * as Sentry from "@sentry/nextjs";

/**
 * Standardized API Error Handler
 * Mask sensitive data and ensure uniform error responses.
 */
export function handleApiError(error, context = {}) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Log the error to Sentry with context
    Sentry.captureException(error, { extra: context });

    // PII Masking: Avoid logging specific user details in the console
    const maskedContext = { ...context };
    if (maskedContext.email) maskedContext.email = '***@***.***';
    if (maskedContext.password) maskedContext.password = '********';

    console.error('[API Error]', {
        message: error.message,
        stack: isProduction ? undefined : error.stack,
        ...maskedContext
    });

    const statusCode = error.statusCode || 500;
    const message = (isProduction && statusCode === 500)
        ? 'An unexpected error occurred. Please try again later.'
        : error.message;

    return Response.json(
        { success: false, error: message },
        { status: statusCode }
    );
}

/**
 * Simple retry wrapper for transient failures (e.g. DB connection spikes)
 */
export async function withRetry(fn, retries = 3, delay = 500) {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1, delay * 2);
    }
}
