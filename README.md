# Student Data Processing Frontend (Angular 18)
Frontend component.

## Prerequisites

- Node.js >= 18.x
- Angular CLI 18.x
- Backend API running on http://localhost:8083

## Installation

```bash
# Install dependencies
npm install

# Install Angular CLI globally (if not installed)
npm install -g @angular/cli@18
```

## Running the Application

```bash
# Start development server
npm start

# Or use Angular CLI
ng serve
```

The application will run on `http://localhost:4200`

## Features

### Task A: Data Generation
- Enter number of records (e.g., 1000000)
- Click "Generate Excel File"
- File is saved to: `C:\var\log\applications\API\dataprocessing\`

### Task B: Data Processing
- Upload the generated Excel file (.xlsx)
- System converts to CSV and adds 10 to all scores
- CSV saved to same directory

### Task C: Data Upload
- Upload the processed CSV file
- System saves to PostgreSQL database
- Adds 5 more to all scores (total +15 from original)

### Task D: Report
- **Pagination**: Navigate through records (20 per page)
- **Search**: Find specific student by ID
- **Filter**: Filter by class using dropdown
- **Export**: Download data as Excel, CSV, or PDF

## Backend API Endpoints

The frontend calls these backend endpoints:

- `POST /api/generate` - Generate Excel
- `POST /api/process` - Process Excel to CSV
- `POST /api/upload` - Upload CSV to database
- `GET /api/upload/count` - Get total students
- `DELETE /api/upload/clear` - Clear database
- `GET /api/report` - Get paginated students
- `GET /api/report/classes` - Get available classes
- `GET /api/report/export/excel` - Export to Excel
- `GET /api/report/export/csv` - Export to CSV
- `GET /api/report/export/pdf` - Export to PDF


## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Testing the Application

1. **Start backend**: Ensure Spring Boot backend is running on port 8083
2. **Start frontend**: Run `npm start`
3. **Open browser**: Navigate to `http://localhost:4200`
4. **Test Task A**: Generate 10 records (for quick testing)
5. **Test Task B**: Upload the generated Excel file
6. **Test Task C**: Upload the processed CSV file
7. **Test Task D**: View report, search, filter, and export

## Performance Testing

For the 1 million record requirement:
1. Enter 1000000 in Task A and generate
2. Wait for completion (30-60 seconds)
3. Process the Excel file in Task B
4. Upload the CSV in Task C
5. Record all processing times for submission
