# Course Cancellation Page - Element References

## Form Element IDs

### Course Information Section
- `courseInfo` - Course information display container
- `courseId` - Course ID input/display field
- `courseName` - Course name display field
- `courseStartDate` - Course start date display field
- `courseEndDate` - Course end date display field
- `courseInstructor` - Course instructor display field
- `courseFee` - Course fee display field

### Cancellation Details Section
- `cancellationReason` - Cancellation reason select dropdown
- `cancellationDetails` - Additional cancellation details textarea
- `cancellationDate` - Cancellation effective date input
- `refundRequested` - Refund request checkbox
- `refundMethod` - Refund method select dropdown
- `refundAmount` - Calculated refund amount display

### Student Information Section
- `studentId` - Student ID input field
- `studentName` - Student name display field
- `studentEmail` - Student email display field
- `guardianName` - Guardian name display field
- `guardianEmail` - Guardian email display field

### Administrative Section
- `adminNotes` - Administrative notes textarea
- `approvalRequired` - Approval required checkbox
- `approverName` - Approver name input field
- `cancellationFee` - Cancellation fee input field

### Form Container
- `courseCancellationForm` - Main cancellation form

## Button Functionalities

### Form Actions
- `submitCancellation` - Submit cancellation request
- `calculateRefund` - Calculate refund amount
- `resetForm` - Reset form to initial state
- `backBtn` - Navigate back to course management
- `previewCancellation` - Preview cancellation details

### Course Search
- `searchCourse` - Search for course by ID or name
- `loadCourseInfo` - Load course information

### Validation Actions
- `validateCancellation` - Validate cancellation request
- `checkRefundEligibility` - Check refund eligibility

## CSS Class Names

### Layout Classes
- `.container` - Main page container
- `.header` - Page header section
- `.cancellation-container` - Cancellation form wrapper
- `.form-section` - Individual form sections
- `.form-grid` - Grid layout for form fields
- `.form-group` - Individual form field container
- `.form-actions` - Form action buttons container

### Course Information Classes
- `.course-info` - Course information display
- `.course-details` - Course details container
- `.course-status` - Course status indicator
- `.course-fee-info` - Course fee information

### Cancellation Classes
- `.cancellation-form` - Cancellation form styling
- `.cancellation-reason` - Cancellation reason section
- `.cancellation-details` - Cancellation details section
- `.refund-section` - Refund calculation section
- `.refund-info` - Refund information display

### Form Element Classes
- `.form-input` - Standard input field styling
- `.form-select` - Select dropdown styling
- `.form-textarea` - Textarea styling
- `.form-label` - Form field labels
- `.form-help` - Help text styling
- `.readonly` - Read-only field styling

### Button Classes
- `.btn` - Base button styling
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-danger` - Danger/cancellation button
- `.btn-outline` - Outlined button style

### Validation Classes
- `.error` - Error state styling
- `.success` - Success state styling
- `.warning` - Warning state styling
- `.error-message` - Error message display
- `.required` - Required field indicator

### State Classes
- `.loading` - Loading state styling
- `.spinner` - Loading spinner animation
- `.disabled` - Disabled state styling
- `.hidden` - Hidden element styling

### Status Classes
- `.status-active` - Active course status
- `.status-cancelled` - Cancelled course status
- `.status-pending` - Pending status
- `.refund-eligible` - Refund eligible indicator
- `.refund-ineligible` - Refund ineligible indicator

## Dynamic Elements (Data Attributes)

- `data-course-id` - Course identifier for dynamic elements
- `data-student-id` - Student identifier for dynamic elements
- `data-refund-amount` - Calculated refund amount
- `data-cancellation-fee` - Cancellation fee amount

## JavaScript Manager Class

- `CourseCancellationManager` - Main class managing the cancellation form
- `courseCancellationManager` - Global instance variable

### Key Methods
- `init()` - Initialize the cancellation form
- `loadCourseData()` - Load course information
- `calculateRefund()` - Calculate refund amount
- `validateCancellation()` - Validate cancellation request
- `handleSubmit()` - Process cancellation submission
- `displayCourseInfo()` - Display course information
- `setupEventListeners()` - Set up form event handlers
- `showNotification()` - Display notification messages
- `resetForm()` - Reset form to initial state