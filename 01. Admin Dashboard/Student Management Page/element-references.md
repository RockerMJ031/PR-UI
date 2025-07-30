# Student Management Page - Element References

## Main Operation Button IDs

### Primary Actions
- `addStudentBtn` - Add new student button
- `bulkActionsBtn` - Bulk actions dropdown button
- `exportBtn` - Export students data button
- `importBtn` - Import students data button
- `refreshBtn` - Refresh student list button

### View Controls
- `viewToggle` - Toggle between grid/list view
- `sortBtn` - Sort options button
- `filterBtn` - Filter options button

## Search and Filter Element IDs

### Search Section
- `searchInput` - Main search input field
- `searchBtn` - Search button
- `clearSearchBtn` - Clear search button
- `advancedSearchBtn` - Advanced search toggle

### Filter Controls
- `statusFilter` - Student status filter dropdown
- `courseFilter` - Course enrollment filter dropdown
- `ageRangeFilter` - Age range filter slider
- `enrollmentDateFilter` - Enrollment date range filter
- `guardianFilter` - Guardian type filter
- `ehcpFilter` - EHCP status filter
- `applyFiltersBtn` - Apply filters button
- `clearFiltersBtn` - Clear all filters button

### Sort Controls
- `sortBy` - Sort by field dropdown
- `sortOrder` - Sort order toggle (asc/desc)

## Statistics Element IDs

### Summary Cards
- `totalStudents` - Total students count display
- `activeStudents` - Active students count display
- `newEnrollments` - New enrollments count display
- `pendingApprovals` - Pending approvals count display
- `completedCourses` - Completed courses count display
- `averageAge` - Average student age display

### Charts and Graphs
- `enrollmentChart` - Enrollment trends chart
- `statusChart` - Student status distribution chart
- `ageDistributionChart` - Age distribution chart

## Student List and Pagination Element IDs

### List Container
- `studentList` - Main student list container
- `studentGrid` - Student grid layout container
- `studentTable` - Student table container
- `studentCards` - Student cards container
- `noStudentsMessage` - No students found message

### Pagination
- `pagination` - Pagination container
- `pageNumbers` - Page numbers container
- `prevPageBtn` - Previous page button
- `nextPageBtn` - Next page button
- `firstPageBtn` - First page button
- `lastPageBtn` - Last page button
- `pageSize` - Items per page selector
- `pageInfo` - Page information display
- `totalPages` - Total pages display
- `currentPage` - Current page display

### Results Information
- `resultsInfo` - Results information display
- `showingResults` - Showing X of Y results display
- `totalResults` - Total results count

## Dynamically Generated Elements (Data Attributes)

### Student Cards
- `data-student-id` - Student identifier for cards and actions
- `data-status` - Student status for filtering
- `data-enrollment-date` - Enrollment date for sorting
- `data-age` - Student age for filtering
- `data-course-count` - Number of enrolled courses

### Action Elements
- `data-action` - Action type for buttons (view, edit, delete, etc.)
- `data-bulk-action` - Bulk action type
- `data-modal-target` - Target modal for actions

## Button Functionalities

### Student Actions (per student)
- `viewStudentBtn` - View student details
- `editStudentBtn` - Edit student information
- `deleteStudentBtn` - Delete student
- `contactStudentBtn` - Contact student/guardian
- `enrollCourseBtn` - Enroll student in course
- `viewCoursesBtn` - View student's courses
- `generateReportBtn` - Generate student report
- `archiveStudentBtn` - Archive student record

### Bulk Actions
- `bulkDeleteBtn` - Bulk delete selected students
- `bulkArchiveBtn` - Bulk archive selected students
- `bulkExportBtn` - Bulk export selected students
- `bulkEmailBtn` - Bulk email selected students
- `bulkStatusChangeBtn` - Bulk status change
- `selectAllBtn` - Select all students checkbox
- `deselectAllBtn` - Deselect all students

### Modal Actions
- `saveStudentBtn` - Save student changes
- `cancelEditBtn` - Cancel edit operation
- `confirmDeleteBtn` - Confirm student deletion
- `closeModalBtn` - Close modal dialog
- `addCourseBtn` - Add course to student
- `removeCourseBtn` - Remove course from student

### Communication Actions
- `sendEmailBtn` - Send email to student/guardian
- `sendSMSBtn` - Send SMS notification
- `scheduleCallBtn` - Schedule phone call
- `addNoteBtn` - Add note to student record

## CSS Class Names

### Layout Classes
- `.container` - Main page container
- `.header` - Page header section
- `.toolbar` - Action toolbar
- `.content-area` - Main content area
- `.sidebar` - Filter sidebar
- `.main-content` - Main content section

### Student List Classes
- `.student-list` - Student list container
- `.student-grid` - Grid view layout
- `.student-table` - Table view layout
- `.student-card` - Individual student card
- `.student-row` - Student table row
- `.student-header` - Student card header
- `.student-body` - Student card body
- `.student-footer` - Student card footer
- `.student-avatar` - Student avatar/photo
- `.student-info` - Student information section
- `.student-meta` - Student metadata
- `.student-actions` - Student action buttons

### Filter and Search Classes
- `.search-section` - Search section container
- `.search-input` - Search input styling
- `.filter-section` - Filter section container
- `.filter-group` - Filter group container
- `.filter-dropdown` - Filter dropdown styling
- `.active-filters` - Active filters display
- `.filter-tag` - Individual filter tag
- `.advanced-search` - Advanced search panel

### Statistics Classes
- `.stats-section` - Statistics section
- `.stat-card` - Individual statistic card
- `.stat-value` - Statistic value display
- `.stat-label` - Statistic label
- `.stat-change` - Statistic change indicator
- `.chart-container` - Chart container

### Status Classes
- `.status-active` - Active student status
- `.status-inactive` - Inactive student status
- `.status-pending` - Pending approval status
- `.status-graduated` - Graduated student status
- `.status-withdrawn` - Withdrawn student status
- `.status-suspended` - Suspended student status

### Action Classes
- `.action-buttons` - Action buttons container
- `.primary-actions` - Primary action buttons
- `.secondary-actions` - Secondary action buttons
- `.bulk-actions` - Bulk action controls
- `.student-actions` - Individual student actions
- `.quick-actions` - Quick action buttons

### Form Classes
- `.form-input` - Standard input field styling
- `.form-select` - Select dropdown styling
- `.form-textarea` - Textarea styling
- `.form-label` - Form field labels
- `.form-group` - Form field container
- `.form-row` - Form row layout
- `.form-section` - Form section container

### Button Classes
- `.btn` - Base button styling
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-success` - Success button
- `.btn-danger` - Danger/delete button
- `.btn-warning` - Warning button
- `.btn-info` - Info button
- `.btn-outline` - Outlined button style
- `.btn-sm` - Small button size
- `.btn-lg` - Large button size
- `.btn-icon` - Icon-only button

### Modal Classes
- `.modal` - Modal container
- `.modal-overlay` - Modal overlay
- `.modal-content` - Modal content area
- `.modal-header` - Modal header
- `.modal-body` - Modal body
- `.modal-footer` - Modal footer
- `.modal-close` - Modal close button
- `.modal-lg` - Large modal size
- `.modal-sm` - Small modal size

### State Classes
- `.loading` - Loading state styling
- `.spinner` - Loading spinner animation
- `.disabled` - Disabled state styling
- `.selected` - Selected item styling
- `.highlighted` - Highlighted item styling
- `.expanded` - Expanded item styling
- `.collapsed` - Collapsed item styling
- `.hidden` - Hidden element styling

### Validation Classes
- `.error` - Error state styling
- `.success` - Success state styling
- `.warning` - Warning state styling
- `.error-message` - Error message display
- `.required` - Required field indicator

### Pagination Classes
- `.pagination` - Pagination container
- `.page-item` - Individual page item
- `.page-link` - Page link styling
- `.page-active` - Active page styling
- `.page-disabled` - Disabled page styling
- `.page-info` - Pagination information
- `.page-size-selector` - Page size selector

## Data Structures

### Student Data
- `students` - Main students array
- `filteredStudents` - Filtered student results
- `selectedStudents` - Selected students for bulk actions
- `studentStats` - Student statistics data

### Pagination Data
- `currentPage` - Current pagination page
- `itemsPerPage` - Items per page setting
- `totalPages` - Total number of pages
- `totalStudents` - Total number of students

### Filter Data
- `activeFilters` - Currently active filters
- `filterOptions` - Available filter options
- `sortOptions` - Available sort options

## JavaScript Manager Class

- `StudentManagementSystem` - Main class managing the student system
- `studentManager` - Global instance variable

### Key Methods
- `init()` - Initialize the student management system
- `loadStudents()` - Load student data
- `generateSampleData()` - Generate sample student data
- `searchStudents()` - Search students functionality
- `filterStudents()` - Filter students by criteria
- `sortStudents()` - Sort students
- `renderStudentList()` - Render student list
- `createStudentCard()` - Create individual student card
- `handleStudentAction()` - Handle student actions
- `showStudentModal()` - Display student modal
- `saveStudent()` - Save student changes
- `deleteStudent()` - Delete student
- `bulkAction()` - Handle bulk actions
- `updatePagination()` - Update pagination controls
- `updateResultsInfo()` - Update results information
- `setupEventListeners()` - Set up event handlers
- `showNotification()` - Display notifications
- `exportStudents()` - Export student data
- `importStudents()` - Import student data