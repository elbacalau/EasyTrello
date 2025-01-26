export interface APIResponse<T> {
  result: string;
  detail: T;
}


export interface ErrorResponse {
  message: string;
  code: string;
}