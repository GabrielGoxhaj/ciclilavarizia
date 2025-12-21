export interface PaginationDto {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  pagination?: PaginationDto;
}
