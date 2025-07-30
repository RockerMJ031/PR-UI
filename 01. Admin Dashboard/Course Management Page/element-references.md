# Course Management Page - Element References

## Form Element IDs

### Search and Filter Section
- `searchInput` - Course search input field
- `statusFilter` - Course status filter dropdown
- `instructorFilter` - Instructor filter dropdown
- `dateRangeFilter` - Date range filter input
- `categoryFilter` - Course category filter dropdown
- `sortBy` - Sort options dropdown
- `sortOrder` - Sort order (ascending/descending) toggle

### Course List Section
- `courseList` - Main course list container
- `courseGrid` - Course grid layout container
- `courseTable` - Course table container
- `courseItems` - Individual course items container

### Course Actions Section
- `bulkActions` - Bulk actions dropdown
- `selectedCourses` - Selected courses counter
- `selectAllCourses` - Select all courses checkbox

### Course Details Modal
- `courseModal` - Course details modal container
- `courseModalContent` - Modal content area
- `courseDetailsForm` - Course details form
- `courseTitle` - Course title input
- `courseDescription` - Course description textarea
- `courseInstructor` - Course instructor select
- `courseStartDate` - Course start date input
- `courseEndDate` - Course end date input
- `courseFee` - Course fee input
- `courseCapacity` - Course capacity input
- `courseStatus` - Course status select

### Add/Edit Course Form
- `addCourseForm` - Add new course form
- `editCourseForm` - Edit existing course form
- `courseImageUpload` - Course image upload input
- `courseMaterials` - Course materials upload
- `coursePrerequisites` - Course prerequisites input
- `courseObjectives` - Course objectives textarea

### Pagination Section
- `pagination` - Pagination container
- `pageNumbers` - Page numbers container
- `prevPage` - Previous page button
- `nextPage` - Next page button
- `pageSize` - Items per page selector
- `totalCourses` - Total courses count display

## Button Functionalities

### Main Actions
- `addCourseBtn` - Add new course button
- `refreshCoursesBtn` - Refresh course list button
- `exportCoursesBtn` - Export courses data button
- `importCoursesBtn` - Import courses data button

### Course Item Actions
- `viewCourseBtn` - View course details button
- `editCourseBtn` - Edit course button
- `deleteCourseBtn` - Delete course button
- `duplicateCourseBtn` - Duplicate course button
- `archiveCourseBtn` - Archive course button

### Course Management Actions
- `extendCourseBtn` - Extend course duration button
- `cancelCourseBtn` - Cancel course button
- `enrollStudentBtn` - Enroll student button
- `manageStudentsBtn` - Manage course students button

### Bulk Actions
- `bulkDeleteBtn` - Bulk delete selected courses
- `bulkArchiveBtn` - Bulk archive selected courses
- `bulkExportBtn` - Bulk export selected courses
- `bulkStatusChangeBtn` - Bulk status change button

### Modal Actions
- `saveChangesBtn` - Save course changes button
- `cancelChangesBtn` - Cancel changes button
- `closeModalBtn` - Close modal button
- `confirmDeleteBtn` - Confirm course deletion

### Filter Actions
- `applyFiltersBtn` - Apply filters button
- `clearFiltersBtn` - Clear all filters button
- `resetFiltersBtn` - Reset filters to default

## CSS Class Names

### Layout Classes
- `.container` - Main page container
- `.header` - Page header section
- `.management-container` - Course management wrapper
- `.toolbar` - Action toolbar container
- `.content-area` - Main content area
- `.sidebar` - Filter sidebar

### Search and Filter Classes
- `.search-section` - Search section container
- `.search-input` - Search input styling
- `.filter-section` - Filter section container
- `.filter-group` - Filter group container
- `.filter-dropdown` - Filter dropdown styling
- `.active-filters` - Active filters display
- `.filter-tag` - Individual filter tag

### Course List Classes
- `.course-list` - Course list container
- `.course-grid` - Grid view styling
- `.course-table` - Table view styling
- `.course-item` - Individual course item
- `.course-card` - Course card styling
- `.course-row` - Course table row
- `.course-header` - Course item header
- `.course-content` - Course item content
- `.course-footer` - Course item footer

### Course Information Classes
- `.course-title` - Course title styling
- `.course-description` - Course description styling
- `.course-instructor` - Instructor information
- `.course-dates` - Course date information
- `.course-fee` - Course fee display
- `.course-status` - Course status indicator
- `.course-capacity` - Course capacity information
- `.course-enrollment` - Enrollment information

### Action Classes
- `.action-buttons` - Action buttons container
- `.primary-actions` - Primary action buttons
- `.secondary-actions` - Secondary action buttons
- `.bulk-actions` - Bulk action controls
- `.course-actions` - Individual course actions

### Form Element Classes
- `.form-input` - Standard input field styling
- `.form-select` - Select dropdown styling
- `.form-textarea` - Textarea styling
- `.form-label` - Form field labels
- `.form-group` - Form field container
- `.form-row` - Form row layout

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

### Modal Classes
- `.modal` - Modal container
- `.modal-overlay` - Modal overlay
- `.modal-content` - Modal content area
- `.modal-header` - Modal header
- `.modal-body` - Modal body
- `.modal-footer` - Modal footer
- `.modal-close` - Modal close button

### Status Classes
- `.status-active` - Active course status
- `.status-inactive` - Inactive course status
- `.status-completed` - Completed course status
- `.status-cancelled` - Cancelled course status
- `.status-draft` - Draft course status
- `.status-archived` - Archived course status

### State Classes
- `.loading` - Loading state styling
- `.spinner` - Loading spinner animation
- `.disabled` - Disabled state styling
- `.selected` - Selected item styling
- `.highlighted` - Highlighted item styling
- `.expanded` - Expanded item styling
- `.collapsed` - Collapsed item styling

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

## Dynamic Elements (Data Attributes)

- `data-course-id` - Course identifier for dynamic elements
- `data-instructor-id` - Instructor identifier
- `data-status` - Course status
- `data-category` - Course category
- `data-start-date` - Course start date
- `data-end-date` - Course end date
- `data-fee` - Course fee
- `data-capacity` - Course capacity
- `data-enrolled` - Number of enrolled students

## JavaScript Manager Class

- `CourseManagementSystem` - Main class managing the course system
- `courseManager` - Global instance variable

### Key Methods
- `init()` - Initialize the course management system
- `loadCourses()` - Load course data
- `searchCourses()` - Search courses functionality
- `filterCourses()` - Filter courses by criteria
- `sortCourses()` - Sort courses
- `renderCourseList()` - Render course list
- `createCourseItem()` - Create individual course item
- `handleCourseAction()` - Handle course actions
- `showCourseModal()` - Display course modal
- `saveCourse()` - Save course changes
- `deleteCourse()` - Delete course
- `bulkAction()` - Handle bulk actions
- `setupEventListeners()` - Set up event handlers
- `showNotification()` - Display notifications
- `updatePagination()` - Update pagination controls

### Data Structures
- `sampleCourses` - Sample course data array
- `filteredCourses` - Filtered course results
- `selectedCourses` - Selected courses for bulk actions
- `currentPage` - Current pagination page
- `itemsPerPage` - Items per page setting