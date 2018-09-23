import {
  SuccessResponse,
  ErrorResponse,
  GameActionResponse,
  ResponseType
} from "@rcg/common";

export const errorResponse = (code: string, error: string): ErrorResponse => {
  return {
    code,
    message: error,
    type: ResponseType.error
  };
};

export const successResponse = (
  code: string,
  payload: GameActionResponse | object
): SuccessResponse => {
  return {
    code,
    payload,
    type: ResponseType.info
  };
};
