/**
 * Response type.
 */
export enum ResponseType {
  error,
  info
}

/**
 * Base response model.
 */
export interface Response {
  type: ResponseType;
}

/**
 * Error response model.
 */
export interface ErrorResponse extends Response {
  code: string;
  message: string;
}

/**
 * Success response model.
 */
export interface SuccessResponse extends Response {
  payload: any;
  code: string;
}
