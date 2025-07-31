# Course Cancellation Page - Element References

## Modal/Lightbox Elements
- `courseCancellationLightbox` - Main course cancellation modal
- `closeCancellationModalBtn` - Close button (×) in modal header
- `closeCancellationModalBtn2` - Cancel button in modal footer

## Search Section
- `cancellationSearchInput` - Search input field with placeholder "Search by Student Name, Subject, or Class ID..."

## Course List Section
- `cancellationCourseList` - Container for course items
- Course items use class `course-item` with the following structure:
  - `.course-info` - Course information container
  - `.course-header` - Course header section
  - `.course-id` - Course/Class ID display
  - `.course-subject` - Course subject display
  - `.student-count` - Student count container
  - `.student-number` - Number of students
  - `.student-text` - "students" text
  - `.students-display` - Students display section
  - `.student-names` - Comma-separated student names
  - `.course-actions` - Action buttons container
  - `.action-btn.cancel-btn` - Select button for course

## Cancellation Details Panel (After Course Selection)
- `cancellationDetailsPanel` - Main details panel (hidden by default)
- `cancellationPlaceholder` - Placeholder panel shown when no course selected
- `selectedCancellationCourseTitle` - Selected course title display
- `selectedCancellationCourseSubject` - Selected course subject display
- `selectedCancellationStudentCount` - Selected course student count display
- `selectedCancellationStudentsList` - Selected course students list (comma-separated text)

## Cancellation Form Elements
- `cancellationStartDate` - Date input for cancellation start date
- `cancellationReasonTextarea` - Textarea for cancellation reason

## Button Elements
- `confirmCancellationBtn` - Confirm cancellation button

## CSS Classes
- `.course-item` - Individual course item
- `.course-item.selected` - Selected course item state
- `.details-panel` - Details panel styling
- `.placeholder-panel` - Placeholder panel styling
- `.cancellation-course-info` - Course information section
- `.cancellation-course-header` - Course header section
- `.cancellation-students-list` - Students list container
- `.cancellation-form` - Form section styling
- `.cancellation-actions` - Action buttons container
- `.form-group` - Form group styling
- `.form-note` - Form note/help text styling
- `.reason-textarea` - Reason textarea styling
- `.cancellation-date-input` - Date input styling