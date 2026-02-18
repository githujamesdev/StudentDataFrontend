import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StudentService } from './services/student.service';
import { Student, PagedResponse, ApiResponse } from './models/student.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Student Data Processing System';

  // Task A: Data Generation
  recordCount: number = 1000000;
  generateLoading: boolean = false;
  generateMessage: string = '';
  generateError: string = '';

  // Task B: Data Processing (Excel to CSV)
  processLoading: boolean = false;
  processMessage: string = '';
  processError: string = '';
  selectedExcelFile: File | null = null;

  // Task C: Data Upload (CSV to Database)
  uploadLoading: boolean = false;
  uploadMessage: string = '';
  uploadError: string = '';
  selectedCsvFile: File | null = null;
  studentCount: number = 0;

  // Task D: Report
  students: Student[] = [];
  currentPage: number = 0;
  pageSize: number = 20;
  totalElements: number = 0;
  totalPages: number = 0;
  searchStudentId: number | null = null;
  filterClass: string = '';
  availableClasses: string[] = [];
  reportLoading: boolean = false;
  reportError: string = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudentCount();
    this.loadAvailableClasses();
    this.loadStudents();
  }


  generateExcel(): void {
    if (!this.recordCount || this.recordCount < 1) {
      this.generateError = 'Please enter a valid number of records (minimum 1)';
      return;
    }

    this.generateLoading = true;
    this.generateError = '';
    this.generateMessage = '';

    this.studentService.generateExcel({ recordCount: this.recordCount }).subscribe({
      next: (response: ApiResponse) => {
        this.generateLoading = false;
        if (response.success) {
          this.generateMessage = `✓ Success! Generated ${response.recordCount?.toLocaleString()} records in ${response.processingTimeMs}ms. File: ${response.fileName}`;
        } else {
          this.generateError = response.message;
        }
      },
      error: (error) => {
        this.generateLoading = false;
        this.generateError = `Error: ${error.error?.message || error.message || 'Failed to generate Excel'}`;
      }
    });
  }

  onExcelFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith('.xlsx')) {
        this.processError = 'Please select an Excel file (.xlsx)';
        this.selectedExcelFile = null;
        return;
      }
      this.selectedExcelFile = file;
      this.processError = '';
    }
  }

  processExcelToCsv(): void {
    if (!this.selectedExcelFile) {
      this.processError = 'Please select an Excel file first';
      return;
    }

    this.processLoading = true;
    this.processError = '';
    this.processMessage = '';

    this.studentService.processExcelToCsv(this.selectedExcelFile).subscribe({
      next: (response: ApiResponse) => {
        this.processLoading = false;
        if (response.success) {
          this.processMessage = `✓ Success! Processed to CSV. File: ${response.fileName}. Time: ${response.processingTimeMs}ms`;
        } else {
          this.processError = response.message;
        }
      },
      error: (error) => {
        this.processLoading = false;
        this.processError = `Error: ${error.error?.message || error.message || 'Failed to process Excel'}`;
      }
    });
  }

  onCsvFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        this.uploadError = 'Please select a CSV file (.csv)';
        this.selectedCsvFile = null;
        return;
      }
      this.selectedCsvFile = file;
      this.uploadError = '';
    }
  }

  uploadCsvToDatabase(): void {
    if (!this.selectedCsvFile) {
      this.uploadError = 'Please select a CSV file first';
      return;
    }

    this.uploadLoading = true;
    this.uploadError = '';
    this.uploadMessage = '';

    this.studentService.uploadCsvToDatabase(this.selectedCsvFile).subscribe({
      next: (response: ApiResponse) => {
        this.uploadLoading = false;
        if (response.success) {
          this.uploadMessage = `✓ Success! Uploaded ${response.recordCount?.toLocaleString()} records in ${response.processingTimeMs}ms`;
          this.loadStudentCount();
          this.loadAvailableClasses();
          this.loadStudents(); 
        } else {
          this.uploadError = response.message;
        }
      },
      error: (error) => {
        this.uploadLoading = false;
        this.uploadError = `Error: ${error.error?.message || error.message || 'Failed to upload CSV'}`;
      }
    });
  }

  loadStudentCount(): void {
    this.studentService.getStudentCount().subscribe({
      next: (count) => {
        this.studentCount = count;
      },
      error: (error) => {
        console.error('Failed to load student count', error);
      }
    });
  }

  clearDatabase(): void {
    if (!confirm('Are you sure you want to delete all students from the database?')) {
      return;
    }

    this.studentService.clearAllStudents().subscribe({
      next: () => {
        this.uploadMessage = '✓ Database cleared successfully';
        this.loadStudentCount();
        this.loadStudents();
      },
      error: (error) => {
        this.uploadError = `Error clearing database: ${error.message}`;
      }
    });
  }

  loadStudents(): void {
    this.reportLoading = true;
    this.reportError = '';

    const studentId = this.searchStudentId || undefined;
    const studentClass = this.filterClass || undefined;

    this.studentService.getStudentReport(
      this.currentPage,
      this.pageSize,
      studentId,
      studentClass
    ).subscribe({
      next: (response: PagedResponse<Student>) => {
        this.reportLoading = false;
        this.students = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        this.reportLoading = false;
        this.reportError = `Error loading students: ${error.message}`;
      }
    });
  }

  loadAvailableClasses(): void {
    this.studentService.getAvailableClasses().subscribe({
      next: (classes) => {
        this.availableClasses = classes;
      },
      error: (error) => {
        console.error('Failed to load classes', error);
      }
    });
  }

  searchStudents(): void {
    this.currentPage = 0;
    this.loadStudents();
  }

  clearFilters(): void {
    this.searchStudentId = null;
    this.filterClass = '';
    this.currentPage = 0;
    this.loadStudents();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadStudents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadStudents();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadStudents();
    }
  }

  exportExcel(): void {
    const studentId = this.searchStudentId || undefined;
    const studentClass = this.filterClass || undefined;

    this.studentService.exportToExcel(studentId, studentClass).subscribe({
      next: (blob) => {
        this.studentService.downloadFile(blob, 'students_report.xlsx');
      },
      error: (error) => {
        alert('Failed to export Excel: ' + error.message);
      }
    });
  }

  exportCsv(): void {
    const studentId = this.searchStudentId || undefined;
    const studentClass = this.filterClass || undefined;

    this.studentService.exportToCsv(studentId, studentClass).subscribe({
      next: (blob) => {
        this.studentService.downloadFile(blob, 'students_report.csv');
      },
      error: (error) => {
        alert('Failed to export CSV: ' + error.message);
      }
    });
  }

  exportPdf(): void {
    const studentId = this.searchStudentId || undefined;
    const studentClass = this.filterClass || undefined;

    this.studentService.exportToPdf(studentId, studentClass).subscribe({
      next: (blob) => {
        this.studentService.downloadFile(blob, 'students_report.pdf');
      },
      error: (error) => {
        alert('Failed to export PDF: ' + error.message);
      }
    });
  }
}
