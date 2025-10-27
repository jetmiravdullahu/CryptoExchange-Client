export interface SuccessResponse<T> {
  message: string
  success: boolean
  data: T
}

export interface PaginatedResponse<T> extends SuccessResponse<IPagination<T>> {}

export interface ErrorResponse {
  message: string
}

export interface ValidationErrorResponse<T> extends ErrorResponse {
  errors: ValidationErrors<T>
}

export type ArrayItemValidationErrors<T> = {
  [index: string]: { [K in keyof T]?: Array<string> };
};


export type ValidationErrors<T> = {
  [K in keyof T]?: K extends keyof T
    ? T[K] extends Array<infer U>
      ? ArrayItemValidationErrors<U> | undefined
      : Array<string>
    : never;
};

interface IPagination<T> extends PaginationType {
  data: Array<T>

  first_page_url: string
  prev_page_url: string | null
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    page: number | null
    active: boolean
  }>
  next_page_url: string | null
  path: string
}

export type PaginationType = {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}
