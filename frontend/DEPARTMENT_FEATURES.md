# Department Management System

This document outlines the department management functionality added to the application for better document categorization.

## Features Added

### 1. Department Management in Settings

- **Location**: Settings page → Departments section
- **Functionality**: 
  - Create new departments with name, description, and color
  - View all created departments in a grid layout
  - Edit existing departments
  - Delete departments (with confirmation)
  - Department statistics showing document count

### 2. Department Selection in Document Upload

- **Location**: Upload Documents page
- **Functionality**:
  - Required department selection before uploading documents
  - Dropdown showing all available departments
  - Documents are tagged with the selected department
  - Error handling if no department is selected

### 3. Department Filtering in Knowledge Base

- **Location**: Knowledge Base page
- **Functionality**:
  - Filter documents by department using dropdown
  - Department column in the document table
  - Color-coded department indicators
  - Combined filtering (department + status + search)

## Components Created

### 1. `DepartmentContext.js`
- React context for managing department state
- Provides CRUD operations for departments
- Handles loading states and error management

### 2. `DepartmentForm.jsx`
- Modal component for creating/editing departments
- Form validation
- Color picker with predefined options
- Real-time form feedback

### 3. `DepartmentsSection.jsx`
- Main component for the Settings page
- Department grid display
- Action buttons for edit/delete
- Empty state handling

### 4. `departmentService.js`
- API service utilities for department operations
- Centralized HTTP requests
- Error handling

## API Endpoints Expected

The frontend expects the following API endpoints:

```
GET    /departments/           - Get all departments
POST   /departments/           - Create new department
PUT    /departments/{id}       - Update department
DELETE /departments/{id}       - Delete department
POST   /documents/upload       - Upload documents (now accepts department_id)
GET    /documents/             - Get documents (now includes department_id)
```

## Data Structure

### Department Object
```javascript
{
  id: number,
  name: string,
  description: string,
  color: string, // hex color code
  document_count: number, // optional
  created_at: string,
  updated_at: string
}
```

### Document Object (Updated)
```javascript
{
  id: number,
  filename: string,
  file_type: string,
  size: number,
  status: string,
  department_id: number, // new field
  created_at: string,
  updated_at: string
}
```

## Styling

- All styles follow the existing design system
- Uses CSS variables from `common.css`
- Responsive design with mobile-first approach
- Consistent with existing UI patterns

## Usage Flow

1. **Admin creates departments** in Settings → Departments
2. **Users select department** when uploading documents
3. **Documents are categorized** by department
4. **Users filter documents** by department in Knowledge Base

## Benefits

- **Better Organization**: Documents are categorized by department
- **Improved Search**: Filter documents by department for faster access
- **Visual Organization**: Color-coded departments for easy identification
- **Access Control**: Foundation for department-based permissions (future enhancement)

## Future Enhancements

- Department-based user permissions
- Department analytics and reporting
- Bulk department assignment for existing documents
- Department templates with predefined settings
