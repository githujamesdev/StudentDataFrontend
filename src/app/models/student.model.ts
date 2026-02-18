
export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  dob: string;
  studentClass: string;
  score: number;
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  fileName?: string;
  recordCount?: number;
  processingTimeMs?: number;
}

export interface GenerateRequest {
  recordCount: number;
}
