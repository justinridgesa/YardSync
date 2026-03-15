export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

export class ApiErrorClass extends Error implements ApiError {
  code?: string;
  statusCode: number;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

export const throwError = (
  message: string,
  statusCode: number = 500,
  code?: string
): never => {
  throw new ApiErrorClass(message, statusCode, code);
};

// Common errors
export const Errors = {
  unauthorized: () =>
    throwError('Unauthorized', 401, 'UNAUTHORIZED'),
  
  forbidden: () =>
    throwError('Forbidden', 403, 'FORBIDDEN'),
  
  notFound: (resource: string) =>
    throwError(`${resource} not found`, 404, 'NOT_FOUND'),
  
  badRequest: (message: string) =>
    throwError(message, 400, 'BAD_REQUEST'),
  
  conflict: (message: string) =>
    throwError(message, 409, 'CONFLICT'),
  
  internal: (message: string) =>
    throwError(message, 500, 'INTERNAL_SERVER_ERROR'),
};

// RBAC helpers
export const checkRole = (userRole: string, ...allowedRoles: string[]): boolean => {
  return allowedRoles.includes(userRole);
};

export const requireRole = (userRole: string, ...allowedRoles: string[]): void => {
  if (!checkRole(userRole, ...allowedRoles)) {
    Errors.forbidden();
  }
};
