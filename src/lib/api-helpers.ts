import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorClass } from './errors';

export type ApiHandler = (
  req: NextRequest
) => Promise<NextResponse>;

/**
 * Wraps API route handlers with error handling
 */
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof ApiErrorClass) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        );
      }

      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Parse request body with validation
 */
export async function parseBody<T>(
  req: NextRequest,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error) {
    throw new ApiErrorClass('Invalid request body', 400);
  }
}

/**
 * Get URL search params
 */
export function getSearchParams(
  req: NextRequest
): Record<string, string | string[]> {
  const params: Record<string, string | string[]> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  });
  return params;
}

/**
 * Success response
 */
export function successResponse<T>(data: T, statusCode: number = 200) {
  return NextResponse.json(data, { status: statusCode });
}

/**
 * Error response
 */
export function errorResponse(message: string, statusCode: number = 500) {
  return NextResponse.json({ error: message }, { status: statusCode });
}
