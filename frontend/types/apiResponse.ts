export interface ApiResponse<T> {
  result: string;
  detail: T;
}

export interface ErrorResponse {
  message?: string;
  code?: string;
}

export enum ApiResponseTypes {
  success,
  error
}
