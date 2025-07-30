# AP Student Registration Page - Element References

## Form Element IDs

### Student Information Section
- `studentFirstName` - Student's first name input field
- `studentLastName` - Student's last name input field
- `studentDateOfBirth` - Student's date of birth input field
- `studentEmail` - Student's email address input field
- `classStartDate` - Class start date input field
- `ehcpStatus` - EHCP status multi-select dropdown

### EHCP Documentation Section
- `ehcpFile` - EHCP file upload input
- `ehcpDetails` - EHCP details textarea

### Caseworker Information Section
- `caseworkerName` - Caseworker name input field
- `caseworkerEmail` - Caseworker email input field

### Guardian/Parent Information Section
- `guardianName` - Guardian name input field
- `guardianEmail` - Guardian email input field
- `guardianPhone` - Guardian phone input field

### Emergency Contact Section
- `emergencyContact` - Emergency contact input field
- `emergencyName` - Emergency contact name input field

### Educational Background Section
- `homeAddress` - Home address textarea
- `previousEducation` - Previous education textarea

### Educational Plan Selection Section
- `selectedPlan` - Educational plan select dropdown

### Additional Questions Section
- `homeLessonsWithoutSupervision` - Home lessons supervision radio buttons
- `supportLongerThanFourWeeks` - Support duration radio buttons

### File Upload Section
- `fileUpload` - File upload area (click target)
- `documentUpload` - Hidden file input
- `uploadedFiles` - Container for uploaded files display

### Form Container
- `apRegistrationForm` - Main registration form

## Button Functionalities

### Form Actions
- `submitBtn` - Submit registration form
- `resetBtn` - Reset form to initial state
- `backBtn` - Navigate back to previous page

### File Management
- `file-remove` - Remove uploaded file (dynamically generated)
- File upload click area - Trigger file selection dialog

### Modal Actions
- Success modal buttons:
  - Return to Dashboard button
  - Submit Another button

## CSS Class Names

### Layout Classes
- `.container` - Main page container
- `.header` - Page header section
- `.form-container` - Form wrapper container
- `.form-section` - Individual form sections
- `.form-grid` - Grid layout for form fields
- `.form-group` - Individual form field container
- `.form-actions` - Form action buttons container

### Form Element Classes
- `.form-input` - Standard input field styling
- `.form-select` - Select dropdown styling
- `.form-textarea` - Textarea styling
- `.form-label` - Form field labels
- `.form-help` - Help text styling

### Button Classes
- `.btn` - Base button styling
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-outline` - Outlined button style

### File Upload Classes
- `.file-upload` - File upload area styling
- `.file-upload-icon` - Upload icon styling
- `.file-upload-text` - Upload text styling
- `.file-upload-subtext` - Upload subtext styling
- `.file-upload-input` - Hidden file input
- `.uploaded-files` - Uploaded files container
- `.uploaded-file` - Individual uploaded file item
- `.file-info` - File information display
- `.file-remove` - File remove button

### Validation Classes
- `.error` - Error state styling
- `.success` - Success state styling
- `.error-message` - Error message display
- `.required` - Required field indicator

### State Classes
- `.loading` - Loading state styling
- `.spinner` - Loading spinner animation
- `.dragover` - Drag over state for file upload

### Checkbox and Radio Classes
- `.checkbox-group` - Checkbox group container
- `.checkbox-item` - Individual checkbox item
- `.multi-select-container` - Multi-select dropdown container

## Dynamic Elements (Data Attributes)

- `data-file-id` - Unique identifier for uploaded files
- File elements with remove functionality

## JavaScript Manager Class

- `APStudentRegistrationManager` - Main class managing the registration form
- `apRegistrationManager` - Global instance variable

### Key Methods
- `init()` - Initialize the form
- `setupEventListeners()` - Set up form event handlers
- `setupFileUpload()` - Configure file upload functionality
- `handleFileUpload()` - Process uploaded files
- `validateField()` - Validate individual form fields
- `validateForm()` - Validate entire form
- `handleSubmit()` - Process form submission
- `removeFile()` - Remove uploaded file
- `showNotification()` - Display notification messages
- `resetForm()` - Reset form to initial state