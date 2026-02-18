
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, PagedResponse, ApiResponse, GenerateRequest } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8083/api';

  constructor(private http: HttpClient) {}

  // Task A: Generate Excel
  generateExcel(request: GenerateRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/generate`, request);
  }

  // Task B: Process Excel to CSV
  processExcelToCsv(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(`${this.apiUrl}/process`, formData);
  }

  // Task C: Upload CSV to Database
  uploadCsvToDatabase(file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(`${this.apiUrl}/upload`, formData);
  }

  // Get student count
  getStudentCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/upload/count`);
  }

  // Clear all students
  clearAllStudents(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/upload/clear`);
  }

  // Task D: Get paginated report
  getStudentReport(
    page: number = 0,
    size: number = 20,
    studentId?: number,
    studentClass?: string,
    sortBy: string = 'studentId',
    sortOrder: string = 'asc'
  ): Observable<PagedResponse<Student>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (studentId) {
      params = params.set('studentId', studentId.toString());
    }
    if (studentClass) {
      params = params.set('studentClass', studentClass);
    }

    return this.http.get<PagedResponse<Student>>(`${this.apiUrl}/report`, { params });
  }

  // Get available classes
  getAvailableClasses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/report/classes`);
  }

  // Export to Excel
  exportToExcel(studentId?: number, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (studentId) params = params.set('studentId', studentId.toString());
    if (studentClass) params = params.set('studentClass', studentClass);

    return this.http.get(`${this.apiUrl}/report/export/excel`, {
      params,
      responseType: 'blob'
    });
  }

  // Export to CSV
  exportToCsv(studentId?: number, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (studentId) params = params.set('studentId', studentId.toString());
    if (studentClass) params = params.set('studentClass', studentClass);

    return this.http.get(`${this.apiUrl}/report/export/csv`, {
      params,
      responseType: 'blob'
    });
  }

  // Export to PDF
  exportToPdf(studentId?: number, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (studentId) params = params.set('studentId', studentId.toString());
    if (studentClass) params = params.set('studentClass', studentClass);

    return this.http.get(`${this.apiUrl}/report/export/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  // Helper method to download file
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
