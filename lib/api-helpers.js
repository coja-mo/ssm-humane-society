import { NextResponse } from 'next/server';

/**
 * Standardized API response helpers.
 * Use these in API routes for consistent JSON response formatting.
 */

/** Success response */
export function ok(data, status = 200) {
  return NextResponse.json(data, { status });
}

/** Created response (201) */
export function created(data) {
  return NextResponse.json(data, { status: 201 });
}

/** Bad request (400) */
export function badRequest(message = 'Bad request') {
  return NextResponse.json({ error: message }, { status: 400 });
}

/** Not found (404) */
export function notFound(message = 'Not found') {
  return NextResponse.json({ error: message }, { status: 404 });
}

/** Internal server error (500) */
export function serverError(message = 'Internal server error') {
  return NextResponse.json({ error: message }, { status: 500 });
}

/**
 * Try-catch wrapper for API route handlers.
 * Catches errors and returns a consistent 500 response.
 *
 * @param {Function} handler - async (request) => Response
 * @returns {Function}
 */
export function withErrorHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (err) {
      console.error(`[API Error] ${request.method} ${request.nextUrl.pathname}:`, err);
      return serverError(process.env.NODE_ENV === 'development' ? err.message : 'Internal server error');
    }
  };
}

/**
 * Parse and validate JSON body from request.
 * Returns null if body is missing or invalid.
 */
export async function parseBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/**
 * Validate that required fields exist in an object.
 * @param {object} data
 * @param {string[]} fields
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateRequired(data, fields) {
  const missing = fields.filter(f => !data[f] && data[f] !== 0 && data[f] !== false);
  return { valid: missing.length === 0, missing };
}
