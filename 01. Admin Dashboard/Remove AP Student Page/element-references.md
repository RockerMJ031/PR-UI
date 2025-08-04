# Remove AP Student Page - Element References

## UI Screenshot-Based Element Analysis

### Modal Structure
- Modal title: "Remove AP Student"
- Close button: "×" button in the top right corner

### Main Content Area
- Title text: "Select a student to remove:"
- Description text: "Click on any student below to remove them from the AP program. This action cannot be undone."

### Student List Elements
Each student entry contains:
- Student name (e.g., Oliver Thompson, Emily Johnson, Harry Williams, Sophie Brown, Jack Davies)
- Student information (grade and course info, e.g., Year 9 | Core Subjects)
- Status labels:
  - ACTIVE (green label)
  - PAUSED (yellow label)
- Remove button (red button with "× Remove" text)

### Possible Element IDs and Class Names

#### Page-Related
- `modalHeader` - Page header
- `modalTitle` - Title text
- `closeBtn` - Close button

#### Student List-Related
- `studentList` - Student list container (Repeater container)
- `studentItem` - Individual student entry (Repeater item)
- `studentName` - Student name
- `studentInfo` - Student information (grade and courses)
- `studentStatus` - Status label container
- `removeBtn` - Remove button
