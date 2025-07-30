# Course Extension Page - Element References

## Form Element IDs

### Course Information Section
- `courseInfo` - Course information display container
- `courseId` - Course ID input/display field
- `courseName` - Course name display field
- `currentStartDate` - Current course start date display
- `currentEndDate` - Current course end date display
- `courseInstructor` - Course instructor display field
- `courseFee` - Original course fee display field
- `courseStatus` - Course status display field

### Extension Details Section
- `extensionForm` - Extension form container
- `extensionReason` - Extension reason select dropdown
- `extensionDetails` - Additional extension details textarea
- `newEndDate` - New course end date input
- `extensionDuration` - Extension duration in weeks input
- `extensionStartDate` - Extension start date input

### Student Information Section
- `studentId` - Student ID input field
- `studentName` - Student name display field
- `studentEmail` - Student email display field
- `guardianName` - Guardian name display field
- `guardianEmail` - Guardian email display field

### Fee Calculation Section
- `extensionFee` - Extension fee input/display field
- `totalFee` - Total fee after extension display
- `feeBreakdown` - Fee breakdown display container
- `paymentMethod` - Payment method select dropdown
- `paymentDueDate` - Payment due date display

### Administrative Section
- `adminNotes` - Administrative notes textarea
- `approvalRequired` - Approval required checkbox
- `approverName` - Approver name input field
- `extensionApproved` - Extension approval status

### Form Container
- `courseExtensionForm` - Main extension form

## Button Functionalities

### Form Actions
- `submitExtension` - Submit extension request
- `calculateFees` - Calculate extension fees
- `resetForm` - Reset form to initial state
- `backBtn` - Navigate back to course management
- `previewExtension` - Preview extension details

### Course Search
- `searchCourse` - Search for course by ID or name
- `loadCourseInfo` - Load course information

### Date Calculation
- `calculateEndDate` - Calculate new end date based on duration
- `validateDates` - Validate extension dates

### Fee Management
- `applyDiscount` - Apply discount to extension fee
- `updatePaymentInfo` - Update payment information

## CSS Class Names

### Layout Classes
- `.container` - Main page container
- `.header` - Page header section
- `.extension-container` - Extension form wrapper
- `.form-section` - Individual form sections
- `.form-grid` - Grid layout for form fields
- `.form-group` - Individual form field container
- `.form-actions` - Form action buttons container

### Course Information Classes
- `.course-info` - Course information display
- `.course-details` - Course details container
- `.course-status` - Course status indicator
- `.course-timeline` - Course timeline display
- `.course-fee-info` - Course fee information

### Extension Classes
- `.extension-form` - Extension form styling
- `.extension-reason` - Extension reason section
- `.extension-details` - Extension details section
- `.extension-timeline` - Extension timeline display
- `.extension-summary` - Extension summary section

### Fee Classes
- `.fee-section` - Fee calculation section
- `.fee-breakdown` - Fee breakdown display
- `.fee-total` - Total fee display
- `.fee-calculator` - Fee calculator container
- `.payment-info` - Payment information section

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
- `.btn-success` - Success/approval button
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
- `.approved` - Approved state styling
- `.pending` - Pending approval styling

### Status Classes
- `.status-active` - Active course status
- `.status-extended` - Extended course status
- `.status-pending` - Pending extension status
- `.extension-eligible` - Extension eligible indicator
- `.extension-ineligible` - Extension ineligible indicator

## Dynamic Elements (Data Attributes)

- `data-course-id` - Course identifier for dynamic elements
- `data-student-id` - Student identifier for dynamic elements
- `data-extension-fee` - Calculated extension fee
- `data-original-end-date` - Original course end date
- `data-new-end-date` - New course end date
- `data-extension-weeks` - Number of extension weeks

## JavaScript Manager Class

- `CourseExtensionManager` - Main class managing the extension form
- `courseExtensionManager` - Global instance variable

### Key Methods
- `init()` - Initialize the extension form
- `loadCourseData()` - Load course information
- `calculateExtensionFee()` - Calculate extension fees
- `validateExtension()` - Validate extension request
- `handleSubmit()` - Process extension submission
- `displayCourseInfo()` - Display course information
- `setupEventListeners()` - Set up form event handlers
- `calculateNewEndDate()` - Calculate new end date
- `showNotification()` - Display notification messages
- `resetForm()` - Reset form to initial state