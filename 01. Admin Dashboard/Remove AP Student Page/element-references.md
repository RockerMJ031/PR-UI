# Remove AP Student Page - Element References

## Form Element IDs

### Student Search Section
- `studentSearch` - Student search input field
- `searchBtn` - Search student button
- `studentId` - Student ID input field
- `studentEmail` - Student email input field
- `searchResults` - Search results container

### Student Information Display
- `studentInfo` - Student information display container
- `studentName` - Student name display field
- `studentFullName` - Student full name display
- `studentDateOfBirth` - Student date of birth display
- `studentEmailDisplay` - Student email display
- `studentPhone` - Student phone display
- `enrollmentDate` - Enrollment date display
- `studentStatus` - Student status display
- `currentCourses` - Current courses list
- `completedCourses` - Completed courses list

### Guardian Information Display
- `guardianInfo` - Guardian information container
- `guardianName` - Guardian name display
- `guardianEmail` - Guardian email display
- `guardianPhone` - Guardian phone display
- `emergencyContact` - Emergency contact display

### Removal Details Section
- `removalForm` - Student removal form
- `removalReason` - Removal reason select dropdown
- `removalDetails` - Additional removal details textarea
- `removalDate` - Removal effective date input
- `finalGrades` - Final grades input section
- `certificateIssued` - Certificate issued checkbox
- `recordsTransfer` - Records transfer checkbox

### Administrative Section
- `adminNotes` - Administrative notes textarea
- `approvalRequired` - Approval required checkbox
- `approverName` - Approver name input field
- `removalApproved` - Removal approval status
- `notificationSent` - Notification sent checkbox

### Refund Section
- `refundSection` - Refund calculation section
- `refundEligible` - Refund eligibility checkbox
- `refundAmount` - Refund amount input/display
- `refundMethod` - Refund method select dropdown
- `refundProcessed` - Refund processed checkbox

### Form Container
- `removeStudentForm` - Main student removal form

## Button Functionalities

### Search Actions
- `searchStudent` - Search for student
- `clearSearch` - Clear search results
- `loadStudentInfo` - Load student information
- `refreshStudentData` - Refresh student data

### Form Actions
- `submitRemoval` - Submit removal request
- `resetForm` - Reset form to initial state
- `backBtn` - Navigate back to student management
- `previewRemoval` - Preview removal details
- `saveAsDraft` - Save removal as draft

### Administrative Actions
- `approveRemoval` - Approve removal request
- `rejectRemoval` - Reject removal request
- `sendNotification` - Send removal notification
- `generateReport` - Generate removal report

### Record Management
- `exportRecords` - Export student records
- `transferRecords` - Transfer records to new institution
- `archiveRecords` - Archive student records

## CSS Class Names

### Layout Classes
- `.container` - Main page container
- `.header` - Page header section
- `.removal-container` - Removal form wrapper
- `.form-section` - Individual form sections
- `.form-grid` - Grid layout for form fields
- `.form-group` - Individual form field container
- `.form-actions` - Form action buttons container

### Student Information Classes
- `.student-info` - Student information display
- `.student-details` - Student details container
- `.student-status` - Student status indicator
- `.student-courses` - Student courses section
- `.student-records` - Student records section
- `.guardian-info` - Guardian information display

### Search Classes
- `.search-section` - Search section container
- `.search-input` - Search input styling
- `.search-results` - Search results container
- `.search-item` - Individual search result item
- `.no-results` - No results message styling

### Removal Classes
- `.removal-form` - Removal form styling
- `.removal-reason` - Removal reason section
- `.removal-details` - Removal details section
- `.removal-summary` - Removal summary section
- `.removal-confirmation` - Removal confirmation section

### Administrative Classes
- `.admin-section` - Administrative section
- `.admin-notes` - Administrative notes styling
- `.approval-section` - Approval section styling
- `.approval-status` - Approval status indicator

### Refund Classes
- `.refund-section` - Refund section styling
- `.refund-calculation` - Refund calculation display
- `.refund-details` - Refund details container
- `.refund-status` - Refund status indicator

### Form Element Classes
- `.form-input` - Standard input field styling
- `.form-select` - Select dropdown styling
- `.form-textarea` - Textarea styling
- `.form-label` - Form field labels
- `.form-help` - Help text styling
- `.readonly` - Read-only field styling
- `.calculated` - Calculated field styling

### Button Classes
- `.btn` - Base button styling
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-danger` - Danger/removal button
- `.btn-success` - Success/approval button
- `.btn-warning` - Warning button
- `.btn-outline` - Outlined button style

### Status Classes
- `.status-active` - Active student status
- `.status-inactive` - Inactive student status
- `.status-removed` - Removed student status
- `.status-pending` - Pending removal status
- `.status-approved` - Approved removal status
- `.status-rejected` - Rejected removal status

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
- `.confirmed` - Confirmed action styling
- `.pending-approval` - Pending approval styling

### Record Classes
- `.records-section` - Records section styling
- `.record-item` - Individual record item
- `.record-status` - Record status indicator
- `.transfer-info` - Transfer information display
- `.archive-info` - Archive information display

## Dynamic Elements (Data Attributes)

- `data-student-id` - Student identifier for dynamic elements
- `data-course-id` - Course identifier for student courses
- `data-removal-id` - Removal request identifier
- `data-refund-amount` - Calculated refund amount
- `data-approval-status` - Approval status
- `data-notification-sent` - Notification sent status

## JavaScript Manager Class

- `RemoveAPStudentManager` - Main class managing the student removal process
- `removeStudentManager` - Global instance variable

### Key Methods
- `init()` - Initialize the removal form
- `searchStudent()` - Search for student by ID or email
- `loadStudentData()` - Load student information
- `displayStudentInfo()` - Display student information
- `validateRemoval()` - Validate removal request
- `calculateRefund()` - Calculate refund amount
- `handleSubmit()` - Process removal submission
- `approveRemoval()` - Approve removal request
- `sendNotifications()` - Send removal notifications
- `exportRecords()` - Export student records
- `setupEventListeners()` - Set up form event handlers
- `showNotification()` - Display notification messages
- `resetForm()` - Reset form to initial state

### Data Structures
- `studentData` - Current student information
- `removalData` - Removal request data
- `courseHistory` - Student course history
- `refundCalculation` - Refund calculation details