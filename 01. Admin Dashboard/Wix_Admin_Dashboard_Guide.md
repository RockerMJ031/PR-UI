# Wix Admin Dashboard Implementation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Required Wix Elements](#required-wix-elements)

4. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
5. [Deployment and Maintenance](#deployment-and-maintenance)

## Project Overview

This guide will help you create a comprehensive admin dashboard in Wix with the following features:
- **Enhanced Course Management**: Multi-student course display, extension and cancellation with group class support (up to 6 students per course)
- **Advanced Course Extension System**: Dedicated extension request modal with detailed form fields including extension date, updated focus areas, and comprehensive description
- **Improved Course Cancellation**: Enhanced cancellation process with two-week notice warnings, detailed course selection, and cancellation reason documentation
- **Tutoring Student Management**: Course enrollment, add and remove tutoring students
- **Alternative Provision (AP) Student Management**: Specialized AP student enrollment with curriculum selection and EHCP file upload
- **Ticket Management**: Support ticket submission and tracking
- **Statistics Display**: Real-time student counts and metrics
- **Pricing Plans**: Four-tier curriculum selection for AP students
- **Lark Integration**: External form integration for course enrollment and tickets
- **Advanced Search & Filtering**: Multi-criteria search for courses by Class ID, Subject, or Student Name

**Important Note:** In Wix, popups will be implemented using **Wix Lightbox components** instead of traditional HTML modals. This provides better integration with Wix's responsive design system and built-in functionality.

**Key Implementation Differences:**
- Use Wix **Lightbox** elements for all popup windows
- Apply Wix built-in lightbox styles and custom modifications
- Configure lightbox show/hide behavior through Wix element properties

**Estimated Time:** 4-6 hours
**Difficulty Level:** Intermediate
**Required Wix Plan:** Business and eCommerce (for CMS database functionality)

## Database Schema

### Students Collection
- Contains all student information including personal details, guardian information, and EHCP file data
- Includes fields for tracking student status and activity

### FileActivityLogs Collection (New)
- Tracks all file-related activities for monitoring purposes
- Records user actions and timestamps

### FileCleanupReports Collection (New)
- Stores reports from file cleanup operations
- Tracks file management status

## Required Wix Elements

### Layout Elements (Total: 15)
- **3 Strips** (header, main content, footer)
- **2 Columns** (sidebar, main content)
- **4 Grids** (action cards, statistics, pricing, navigation)
- **6 Containers** (card containers)

### Navigation Elements (Total: 8)
- **6 Buttons** (dashboard, students, sessions, reports, finance, settings)
- **1 Image** (user avatar)
- **1 Text** (username)

### Action Buttons (Total: 14)
- **3 Buttons** (courses: register, extend, cancel)
- **2 Buttons** (students: add, remove)
- **2 Buttons** (AP students: add, remove)
- **2 Buttons** (tickets: submit, check status)
- **5 Buttons** (modal close buttons)

### Display Elements (Total: 16)
- **8 Text Elements** (statistics labels and values)
- **4 Text Elements** (card titles)
- **4 Text Elements** (card descriptions)

### Form Elements (Total: 20)
- **8 Input Fields** (name, email, phone, age, etc.)
- **4 Dropdown Menus** (status, courses, education plan)
- **2 Text Areas** (medical info, education background)
- **1 Upload Button** (EHCP file)
- **5 Submit Buttons** (form submissions)

### Modal Elements (Total: 5)
- **5 Lightboxes** (course, student, AP student, delete, plan)

### Data Elements (Total: 6)
- **6 Datasets** (students, courses, statistics, pricing, tickets, AP students)

**Total Element Count: Approximately 84 elements**



## Step-by-Step Implementation Guide

### Phase 1: Page Setup (30 minutes)

#### Step 1.1: Create New Page
1. **Open Wix Editor**
2. **Click:** "Add Page" → "Blank Page"
3. **Page Name:** "Admin Dashboard"
4. **Page URL:** `/admin-dashboard`
5. **Set as:** Homepage (optional)

#### Step 1.2: Configure Page Settings
1. **Click:** Page Settings (gear icon)
2. **SEO Title:** "Admin Dashboard - Student Management System"
3. **Meta Description:** "Comprehensive admin dashboard for managing students, courses, and educational programs"
4. **Page Background:** Set to `#f8f9fa`

### Phase 2: Layout Structure (45 minutes)

#### Step 2.1: Add Header Strip
1. **Click:** Add Elements → Layout → Strip
2. **Strip Name:** `headerStrip`
3. **Position:** Top of page
4. **Height:** 80px
5. **Background Color:** `#ffffff`
6. **Bottom Border:** 1px solid `#e9ecef`

#### Step 2.2: Add Main Content Strip
1. **Click:** Add Elements → Layout → Strip
2. **Strip Name:** `mainContentStrip`
3. **Position:** Below header
4. **Height:** Fill remaining space
5. **Background Color:** `#f8f9fa`
6. **Padding:** 20px all around

#### Step 2.3: Add Sidebar Column
1. **Inside main content strip add:** Add Elements → Layout → Column
2. **Column Name:** `sidebarColumn`
3. **Width:** 250px
4. **Background Color:** `#ffffff`
5. **Right Border:** 1px solid `#e9ecef`
6. **Padding:** 20px

#### Step 2.4: Add Main Content Column
1. **Add second column:** `mainColumn`
2. **Width:** Fill remaining space
3. **Padding:** 20px

### Phase 3: Navigation Setup (30 minutes)

#### Step 3.1: Add User Info Area
1. **Click:** Add Elements → User → Member Profile
2. **Configure Member Profile:**
   - **Position:** Top of sidebar
   - **Layout:** Vertical (avatar above text)
   - **Avatar Size:** 60x60px, circular
   - **Display Fields:**
     - Username (Font: 16px, bold)
     - Role (Font: 14px, color: #6c757d)
   - **Connect to:** Current logged-in user

#### Step 3.2: Add Navigation Buttons
1. **Below user info add navigation buttons:**
   - `dashboardNavBtn` - "Dashboard"
   - `studentsNavBtn` - "Students"
   - `sessionsNavBtn` - "Sessions"
   - `reportsNavBtn` - "Reports"
   - `financeNavBtn` - "Finance"
   - `settingsNavBtn` - "Settings"

2. **Button Styling:**
   - Width: 100%
   - Height: 40px
   - Margin: 5px 0
   - Background: Transparent
   - Hover: `#f8f9fa`
   - Active: `#007bff` (white text)



### Phase 4: Add Statistics Cards
Create dynamic statistics cards that update based on student type:

1. **Total Students Card:**
   - Container: `totalStudentsCard`
   - Value Text: `totalStudentsValue` (Font: 48px, bold)
   - Label Text: `totalStudentsLabel` ("Total Students")

2. **Active Students Card:**
   - Container: `activeStudentsCard`
   - Value Text: `activeStudentsValue` (Font: 48px, bold)
   - Label Text: `activeStudentsLabel` ("Active Students")

3. **Pending Approval Card:**
   - Container: `pendingApprovalCard`
   - Value Text: `pendingApprovalValue` (Font: 48px, bold)
   - Label Text: `pendingApprovalLabel` ("Pending Approval")

4. **Need Attention Card:**
   - Container: `needAttentionCard`
   - Value Text: `needAttentionValue` (Font: 48px, bold)
   - Label Text: `needAttentionLabel` ("Need Attention")

### Phase 4.1: Action Cards (45 minutes)

#### Step 4.1.1: Create Action Grid
1. **Below statistics grid add:** Add Elements → Layout → Grid
2. **Grid Name:** `actionCardsGrid`
3. **Columns:** 3
4. **Spacing:** 20px
5. **Height:** Auto

#### Step 4.1.2: Add Action Cards

1. **Course Management Card:**
   - Container: `courseManagementCard`
   - Title: "Course Management"
   - Description: "Manage course extensions, cancellations and new courses"
   - Buttons:
     - `courseExtensionBtn` ("Course Extension")
     - `cancelCourseBtn` ("Cancel Course")

2. **Tutoring Student Management Card:**
   - Container: `tutoringStudentCard`
   - Title: "Tutoring Student"
   - Description: "Manage tutoring student enrollment and sessions"
   - Buttons:
     - `courseEnrollmentBtn` ("Course Enrolment") - Links to Lark form
     - `addTutoringStudentBtn` ("Add Tutoring Student")
     - `removeTutoringStudentBtn` ("Remove Student")

3. **Alternative Provision Card:**
   - Container: `apStudentCard`
   - Title: "Alternative Provision"
   - Description: "Manage AP students and specialized educational provision"
   - AP Student Counter: `apStudentCount` (displays "10")
   - Buttons:
     - `addAPStudentBtn` ("Add AP Student")
     - `removeAPStudentBtn` ("Remove Student")

4. **Ticket Management Card:**
   - Container: `ticketManagementCard`
   - Title: "Ticket Management"
   - Description: "Submit support tickets and check status"
   - Open Tickets Counter: `openTicketsValue` (displays "3")
   - Buttons:
     - `submitTicketBtn` ("Submit Ticket") - Links to Lark form
     - `checkTicketStatusBtn` ("Check Status")



### Phase 4.2: Pricing Plans (30 minutes)

#### Step 4.2.1: Create Pricing Grid
1. **Below action cards add:** Add Elements → Layout → Grid
2. **Grid Name:** `pricingGrid`
3. **Columns:** 3
4. **Spacing:** 20px

#### Step 4.2.2: Add Pricing Cards
Create three pricing plan cards, each containing:
- Plan name
- Price
- Feature list
- "Select Plan" button

### Phase 5: Dataset Connections (30 minutes)

#### Step 5.1: Add Datasets
1. **Click:** Add Elements → Database → Dataset
2. **Add the following datasets:**
   - `studentsDataset` → Students collection
   - `coursesDataset` → Courses collection
   - `statisticsDataset` → Statistics collection
   - `pricingDataset` → PricingPlans collection
   - `ticketsDataset` → Tickets collection
   - `apStudentsDataset` → Students collection (filter isAP = true)

#### Step 5.2: Dataset Field Configuration
Create the following datasets to support dashboard functionality:

1. **Students** - Store tutoring student information
   - Fields: firstName, lastName, dateOfBirth, email, startDate, courseGroup, gradeLevel, sendStatus, examBoard, homeAddress

2. **Courses** - Store course information (grouped by class with multiple students)
   - Fields: classId, subject, students (array of student objects with name and qtyLessons), status
   - Student object structure: { name: string, qtyLessons: number }
   - Note: Each course can contain up to 6 students for group classes

3. **APStudents** - Store AP student information
   - Fields: firstName, lastName, dateOfBirth, email, startDate, sendStatus, sendFile, sendDetails, caseworkerName, caseworkerEmail, guardianName, guardianEmail, guardianPhone, emergencyContact, emergencyName, previousEducation, homeAddress, educationPlan, homeLessonsSupervision, supportDuration

4. **Tickets** - Store ticket information
   - Fields: ticketId, title, description, status, priority, createdDate, assignedTo

5. **Statistics** - Store statistical data
   - Fields: totalStudents, activeStudents, safeguardingAlerts, pendingInvoices, apStudentCount, openTickets

#### Step 5.3: Connect Elements to Datasets
1. **Connect statistics values to statisticsDataset**
2. **Connect pricing cards to pricingDataset**
3. **Set dataset permissions to "Admin Only"**

### Phase 6: Modal/Lightbox Creation (60 minutes)

**Important:** Modals from the original HTML file should be replaced with Lightbox components in Wix. Here are the correspondences:
- HTML `courseModal` → Wix `courseManagementLightbox`
- HTML `studentModal` → Wix `studentManagementLightbox`
- HTML `apStudentModal` → Wix `apStudentRegistrationLightbox`

#### Universal Lightbox Configuration Guidelines
**These settings apply to ALL Lightboxes in the dashboard:**

**1. Scrollbar Implementation:**
- **Open Lightbox** in Studio Editor or Editor X
- **Select the Lightbox** (or container inside it)
- **Go to:** Inspector → Layout → Overflow content
- **Set to:** Scroll with direction "Vertical"
- **Set Height:** Fixed height (e.g., 600px) or max-height: 100vh
- **Result:** Browser automatically generates vertical scrollbar when content exceeds height

**Alternative Method:**
- Place a **Container** inside the Lightbox
- Set container's overflow to "Scroll"
- Put all content inside this container

**2. Dropdown Menu Implementation:**
- **Add:** Elements → User Input → Dropdown
- **Position:** Inside Lightbox content area
- **Configuration:**
  - Set dropdown options via "Manage Options" in Inspector
  - Connect to dataset if dynamic options needed
  - Style to match Lightbox theme

**3. Mobile Responsiveness:**
- **Repeat overflow-scroll settings** in mobile layout
- **Lock page scroll** so only Lightbox scrolls
- **Test on mobile devices** to ensure proper functionality

**4. Optional Styling:**
- Install **Scrollbar app** from Wix App Market for custom scrollbar styling
- Maintain consistent styling across all Lightboxes

**Key Points:**
- Scrollbar is NOT a widget - it's generated automatically
- Set "Overflow content = Scroll" when content exceeds element height
- Apply these settings to ALL dashboard Lightboxes for consistency

**Course Data Structure Update:**
The course management system has been updated to support multiple students per course (up to 6 students). The new data structure groups students by class ID and subject, allowing for more efficient management of group classes.

#### Step 6.0: Main Course Management Modal
**Primary Implementation:** Course Management System
1. **Add:** Elements → Popups & Lightboxes → Lightbox
2. **Lightbox ID:** `courseManagementLightbox`
3. **Title:** "Course Management"
4. **Lightbox Configuration:**
   - **Size:** 800px width × 600px height
   - **Overflow:** Set to "Scroll" with "Vertical" direction
   - **Background:** White with subtle shadow
5. **Content Structure:**
   - **Modal Header:**
     - Title: "Course Management"
     - Close button (×) in top-right corner
   - **Modal Body:**
     - **Search Bar Section:**
       - **Add:** Elements → User Input → Text Input
       - **Input ID:** `courseSearchInput`
       - **Placeholder:** "Search by Student Name, Subject, or Class ID..."
       - **Position:** Top of modal body
       - **Search Logic:** Real-time filtering using `onInput` event
       - **Filter Function:** Searches through course ID, subject, and student names
       - **Implementation:** Hide/show course items based on search term match
     - **Filter Dropdown Section:**
       - **Add:** Elements → User Input → Dropdown
       - **Dropdown ID:** `courseFilterDropdown`
       - **Options:** "All Courses", "Active", "Pending", "Cancelled"
       - **Position:** Next to search bar
     - **Course List Container:**
       - **Container ID:** `courseListContainer`
       - **Content:** Dynamic course list populated from dataset
       - **Display Format:** Course cards showing Class ID, subject, student count, and action buttons
       - **Actions:** Each course includes "Extend" and "Cancel" buttons
       - **Scrolling:** Automatic vertical scroll when content exceeds container height
   - **Action Buttons:**
     - Close button: `closeCourseModalBtn` (secondary style)

#### Step 6.1: Course Extension Modal
**New Implementation:** Enhanced Course Extension Request System
1. **Add:** Elements → Popups & Lightboxes → Lightbox
2. **Lightbox ID:** `courseExtensionLightbox`
3. **Title:** "Course Extension Request"
4. **Lightbox Configuration:**
   - **Size:** 600px width × 500px height
   - **Overflow:** Set to "Scroll" with "Vertical" direction
   - **Background:** White with subtle shadow
5. **Content Structure:**
   - **Modal Header:**
     - Title: "Course Extension Request"
     - Close button (×) in top-right corner
   - **Modal Body:**
     - **Course Information Section:** `extensionCourseInfo`
       - Dynamically populated with selected course details
       - Shows course ID, subject, and student information
     - **Extension Form Section:**
       - **Extension Type Dropdown:**
         - **Add:** Elements → User Input → Dropdown
         - **Dropdown ID:** `extensionTypeDropdown`
         - **Options:** "1 Week", "2 Weeks", "1 Month", "Custom"
       - **Extend Until Date:** Date input field with label "Extend Course Until:"
         - Input ID: `extensionEndDate`
         - Required field with date validation
         - Info note: "Please select the new end date for the course extension."
       - **Updated Focus Area:** Textarea field
         - Input ID: `updatedFocusArea`
         - Placeholder: "Please describe the updated focus areas or learning objectives for the extended period..."
         - Required field
       - **Detailed Description:** Large textarea field
         - Input ID: `extensionDescription`
         - Placeholder: "Please provide a detailed description of your course extension, including reasons for extension, specific goals, and any additional requirements..."
         - Required field
   - **Action Buttons:**
     - Cancel button: `closeExtensionModalBtn2` (secondary style)
     - Submit button: `submitExtensionBtn` (success style with paper plane icon)

#### Step 6.2: Course Cancellation Modal
**Enhanced Implementation:** Course cancellation with detailed information
1. **Add:** Elements → Popups & Lightboxes → Lightbox
2. **Lightbox ID:** `courseCancellationLightbox`
3. **Title:** "Course Cancellation"
4. **Lightbox Configuration:**
   - **Size:** 700px width × 650px height
   - **Overflow:** Set to "Scroll" with "Vertical" direction
   - **Background:** White with subtle shadow
5. **Content Structure:**
   - **Modal Header:**
     - Title: "Course Cancellation"
     - Close button (×) in top-right corner
   - **Modal Body:**
     - **Warning Section:**
       - Two-week notice requirement warning
       - Important notice styling with alert icon
     - **Course Selection:**
       - **Add:** Elements → User Input → Dropdown
       - **Dropdown ID:** `courseSelectionDropdown`
       - Dropdown menu showing "Class ID - Subject (X students)" format
       - Real-time course details display upon selection
     - **Selected Course Details:**
       - Course ID, subject, and student count
       - Complete list of all students with remaining lesson counts
       - Multi-column layout for courses with multiple students
       - **Scrollable container** for long student lists
     - **Cancellation Form:**
       - **Cancellation Date:** Date input with label "Cancel From:"
       - **Cancellation Reason:** Dropdown with predefined options
         - **Add:** Elements → User Input → Dropdown
         - **Dropdown ID:** `cancellationReasonDropdown`
         - **Options:** "Student Request", "Instructor Unavailable", "Low Enrollment", "Technical Issues", "Other"
       - **Additional Details:** Textarea field
         - **Add:** Elements → User Input → Text Box
         - **Text Area ID:** `cancellationDetailsTextArea`
         - Placeholder: "Please provide additional details about the cancellation..."
         - Required field for documentation
   - **Action Buttons:**
     - Cancel button (secondary style)
     - Confirm Cancellation button (danger style)

#### Step 6.3: Student Management Modal
**Replaces:** `studentModal` from original HTML file
1. **Add:** Elements → Popups & Lightboxes → Lightbox
2. **Lightbox ID:** `studentManagementLightbox`
3. **Title:** "Student Management"
4. **Lightbox Configuration:**
   - **Size:** 900px width × 700px height
   - **Overflow:** Set to "Scroll" with "Vertical" direction
   - **Background:** White with subtle shadow
5. **Content Structure:**
   - **Modal Header:**
     - Title: "Student Management"
     - Close button (×) in top-right corner
   - **Modal Body:**
     - **Search and Filter Section:**
       - **Search Bar:**
         - **Add:** Elements → User Input → Text Input
         - **Input ID:** `studentSearchInput`
         - **Placeholder:** "Search by Student Name or Email..."
         - **Position:** Top left of filter section
       - **Status Filter Dropdown:**
         - **Add:** Elements → User Input → Dropdown
         - **Dropdown ID:** `studentStatusDropdown`
         - **Options:** "All Students", "Active", "Inactive", "Pending"
         - **Position:** Next to search bar
       - **Grade Filter Dropdown:**
         - **Add:** Elements → User Input → Dropdown
         - **Dropdown ID:** `studentGradeDropdown`
         - **Options:** "All Grades", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "College"
         - **Position:** Right side of filter section
       - **Search Logic:** Real-time filtering using `onInput` event
       - **Filter Function:** Searches through student name and email fields
       - **Implementation:** Hide/show student items based on search term match
     - **Student List Container:**
       - **Container ID:** `studentListContainer`
       - **Content:** Dynamic student list using Wix Repeater
       - **Display Format:** Student cards showing name, email, contact info, and action buttons
       - **Actions:** Each student includes "Edit" and "View Details" buttons
       - **Scrolling:** Automatic vertical scroll when content exceeds container height
   - **Action Buttons:**
     - Add New Student button: `addStudentBtn` (primary style)
     - Close button: `closeStudentModalBtn` (secondary style)
6. **Content:** Multi-state container including:
   - Add student form containing basic information, academic information and SEND status
   - Remove student options: remove all courses / remove specific courses
   - Tab navigation

**Important Implementation Note for Student Lists:**
When implementing "Remove all courses for student" and "Remove specific course" functionality, the student and course lists should use **Wix Repeater components** instead of JavaScript-generated dynamic lists:

**Remove All Courses for Student:**
- **Add:** Elements → Lists & Grids → Repeater
- **Repeater ID:** `studentListRepeater`
- **Connect to:** Students Dataset
- **Display Fields:** Student name, email, course count
- **Item Template:** Include "Remove All Courses" button for each student
- **Pagination:** Enable with 10 students per page
- **Search Bar Implementation:**
  - **Add:** Elements → User Input → Text Input
  - **Input ID:** `studentSearchInput`
  - **Placeholder:** "Search student name..."
  - **Position:** Above repeater
  - **Search Logic:** Real-time filtering using `onInput` event
  - **Filter Function:** Searches through student name and email fields
  - **Implementation:** Hide/show repeater items based on search term match

**Remove Specific Course:**
- **Add:** Elements → Lists & Grids → Repeater  
- **Repeater ID:** `courseListRepeater`
- **Connect to:** Courses Dataset
- **Display Fields:** Course ID, subject, student names
- **Item Template:** Include "Cancel Course" button for each course
- **Pagination:** Enable with 10 courses per page
- **Search Bar Implementation:**
  - **Add:** Elements → User Input → Text Input
  - **Input ID:** `courseSearchInput`
  - **Placeholder:** "Search course, student or Class ID..."
  - **Position:** Above repeater
  - **Search Logic:** Multi-field search functionality
  - **Filter Function:** Searches through course ID, subject, and student names
  - **Implementation:** Real-time filtering with case-insensitive text matching

**Repeater Configuration:**
- **Layout:** Vertical list layout
- **Spacing:** 10px between items
- **Animation:** Fade in on load
- **Responsive:** Stack on mobile devices
- **Filtering:** Real-time search functionality
- **Sorting:** Alphabetical by name/course ID

#### Step 6.4: AP Student Registration Modal
**Replaces:** `apStudentModal` from original HTML file
1. **Add:** Elements → Popups & Lightboxes → Lightbox
2. **Lightbox ID:** `apStudentRegistrationLightbox`
3. **Title:** "Alternative Provision Student Registration"
4. **Lightbox Configuration:**
   - **Size:** 1000px width × 800px height
   - **Overflow:** Set to "Scroll" with "Vertical" direction
   - **Background:** White with subtle shadow
5. **Content Structure:**
   - **Progress Indicator:**
     - **Add:** Elements → Media & Content → Progress Bar
     - **Progress Bar ID:** `registrationProgressBar`
     - **Steps:** "Basic Info", "Guardian Info", "Education Background", "Special Needs", "Confirmation"
   - **Multi-Step Form Sections:**
     - **Step 1: Basic Information**
       - Student name, age, date of birth inputs
       - **Gender Selection Dropdown:**
         - **Add:** Elements → User Input → Dropdown
         - **Options:** "Male", "Female", "Other", "Prefer not to say"
     - **Step 2: Guardian Information**
       - Guardian contact details
       - **Relationship Dropdown:**
         - **Add:** Elements → User Input → Dropdown
         - **Options:** "Parent", "Guardian", "Foster Parent", "Social Worker", "Other"
     - **Step 3: Education Background**
       - **Education Plan Dropdown:**
         - **Add:** Elements → User Input → Dropdown
         - **Options:** "Core Subjects", "Core Plus", "All Subjects + Therapy", "Blueprint"
       - **Previous School Type Dropdown:**
         - **Add:** Elements → User Input → Dropdown
         - **Options:** "Mainstream", "Special School", "Home Education", "Alternative Provision", "Other"
     - **Step 4: Special Needs Assessment**
       - **EHCP Status Dropdown:**
         - **Add:** Elements → User Input → Dropdown
         - **Options:** "Yes", "No", "In Progress"
       - **SEND Status Multi-Select:**
         - **Add:** Elements → User Input → Dropdown (Multi-select)
         - **Options:** "SpLD", "SLCN", "SEMH", "ASD", "VI", "HI", "MSI", "PD", "NSA", "OTH", "DS"
       - **Support Duration Dropdown:**
         - **Add:** Elements → User Input → Dropdown
         - **Options:** "Less than 4 weeks", "4-12 weeks", "1-6 months", "6+ months", "Long-term"
       - **Home Supervision Dropdown:**
         - **Add:** Elements → User Input → Dropdown
         - **Options:** "Yes - Adult supervision", "No - Independent study", "Partial supervision"
     - **File Upload Section:**
       - EHCP file upload (PDF, DOC, DOCX, TXT formats)
       - Medical reports upload
     - **Scrollable Content:** All form sections with automatic vertical scroll
   - **Navigation Buttons:**
     - Previous/Next step buttons
     - Save Draft functionality
     - Submit registration button

#### Step 6.5: Remove AP Student Modal
**New Feature:** Remove AP Student functionality
1. **Add:** Elements → Popups & Lightboxes → Lightbox
2. **Lightbox ID:** `removeAPStudentLightbox`
3. **Title:** "Remove AP Student"
4. **Lightbox Configuration:**
   - **Size:** 700px width × 600px height
   - **Overflow:** Set to "Scroll" with "Vertical" direction
   - **Background:** White with subtle shadow
5. **Content Structure:**
   - **Modal Header:**
     - Title: "Remove AP Student"
     - Close button (×) in top-right corner
   - **Instructions Section:**
     - Instructions text: "Select a student to remove:"
     - Warning text: "Click on any student below to remove them from the AP program. This action cannot be undone."
   - **Filter Section:**
     - **Status Filter Dropdown:**
       - **Add:** Elements → User Input → Dropdown
       - **Dropdown ID:** `apStudentStatusFilter`
       - **Options:** "All Students", "Active", "Paused", "Pending"
       - **Position:** Top of student list
     - **Grade Filter Dropdown:**
       - **Add:** Elements → User Input → Dropdown
       - **Dropdown ID:** `apStudentGradeFilter`
       - **Options:** "All Grades", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11"
   - **Student List Container:**
     - **Scrollable container** for long student lists
     - **Automatic vertical scroll** when content exceeds container height

**AP Student List Implementation with Wix Repeater:**
- **Add:** Elements → Lists & Grids → Repeater
- **Repeater ID:** `apStudentListRepeater`
- **Connect to:** Students Dataset (filtered for isAP = true)
- **Display Fields:** Student name, grade, course, status
- **Item Template Structure:**
  - Student Info Section:
    - Student Name: `studentNameText` (Font: 16px, bold)
    - Student Details: `studentDetailsText` (Grade | Course, Font: 14px, color: #666)
  - Student Actions Section:
    - Status Badge: `statusBadge` (Active: green, Paused: orange)
    - Remove Button: `removeStudentButton` (Red background, white text)
- **Pagination:** Enable with 10 students per page
- **Search:** Add search input for filtering by name or course
- **Responsive:** Stack elements on mobile devices
- **Animation:** Fade in/out on item removal

**Repeater Event Handling:**
- **Remove Button Click:** Trigger confirmation dialog
- **Confirmation:** Remove student from dataset and refresh repeater
- **Real-time Updates:** Automatically update student count and list

### Phase 7: Form Creation (90 minutes)

#### Step 7.1: Add Student Form
Create form in Student Management Lightbox:

**Basic Information:**
- `studentFirstNameInput` - 👤 First Name (text input, required)
- `studentLastNameInput` - 👤 Last Name (text input, required)
- `studentDOBInput` - 🎂 Date of Birth (date input, required)
- `studentEmailInput` - 📧 Email Address (email input, required)
- `startLearningDateInput` - 📚 Start Learning Date (date input, required)

**Academic Information:**
- `existingCourseGroupDropdown` - Existing Course Group (dropdown with options: AS-APY-Y9-EL-BIOLOGY, AS-APY-Y9-EL-ENGLISH, AS-APY-Y9-EL-FRENCH, AS-STY-Y7-DG-MATHS)
- `currentGradeLevelInput` - Current Grade/Level (text input)
- `sendStatusMultiSelect` - SEND Status (multi-select dropdown with 11 options: SpLD, SLCN, SEMH, ASD, VI, HI, MSI, PD, NSA, OTH, DS)
- `examBoardDropdown` - Exam Board (dropdown: AQA, Edexcel, OCR, WJEC, CIE)
- `homeAddressTextarea` - 🏠 Home Address (textarea)

**Buttons:**
- `submitAddStudentBtn` - Submit
- `cancelAddStudentBtn` - Cancel

#### Step 7.2: AP Student Registration Form
Create complete form in AP Student Lightbox:

**Student Information (OEAS Framework):**
- `apStudentFirstNameInput` - 👤 First Name (text input, required)
- `apStudentLastNameInput` - 👤 Last Name (text input, required)
- `apStudentDOBInput` - 🎂 Date of Birth (date input, required)
- `apStudentEmailInput` - 📧 Email Address (email input, required)
- `apStartLearningDateInput` - 📚 Start Learning Date (date input, required)
- `apSendStatusMultiSelect` - SEND Status (multi-select, required, 11 options)
- `sendFileUpload` - SEND File Upload (file upload: PDF, DOC, DOCX, TXT, max 10MB)
- `sendDetailsTextarea` - SEND Details (textarea)
- `caseworkerNameInput` - Caseworker Name (text input)
- `caseworkerEmailInput` - Caseworker Email (email input)

**Guardian Information:**
- `apGuardianNameInput` - 👨‍👩‍👧‍👦 Guardian Name (text input, required)
- `apGuardianEmailInput` - 📧 Guardian Email (email input, required)
- `apGuardianPhoneInput` - 📞 Guardian Phone (phone input)
- `emergencyContactInput` - 🚨 Emergency Contact (text input)
- `emergencyNameInput` - 🆘 Emergency Contact Name (text input)

**Other Information:**
- `previousEducationTextarea` - Previous Education Setting (textarea)
- `apHomeAddressTextarea` - 🏠 Home Address (textarea)

**Educational Plan Selection (Required):**
- `educationPlanDropdown` - Education Plan (dropdown, required):
  - Core Subjects
  - Core Subjects + PSHE Careers + PE and Art
  - All Subjects + Therapy
  - Purple Ruler Blueprint

**Additional Questions:**
- `homeLessonsWithoutSupervisionDropdown` - Will your student(s) be accessing the lessons at home without adult supervision most of the time? (Yes/No)
- `supportLongerThanFourWeeksDropdown` - Is Purple Ruler expected to support the learner longer than four weeks? (Yes/No)

**Buttons:**
- `registerAPStudentBtn` - Register
- `cancelAPRegistrationBtn` - Cancel

### Phase 7.5: Course Management Enhancement (45 minutes)

#### Step 7.5.1: Multi-Student Course Display Implementation
**Enhanced Course List Functionality:**

1. **Course Item Structure:**
   - Course Header: Displays Class ID, Subject, and Student Count
   - Student List: Shows all students with names and remaining lessons
   - Responsive Layout: Automatically switches to multi-column for 4+ students

2. **CSS Styling for Multi-Student Display:**
   ```css
   .course-header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 10px;
   }
   
   .students-list {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
     gap: 10px;
   }
   
   .student-item {
     display: flex;
     justify-content: space-between;
     align-items: center;
     padding: 8px;
     background: #f8f9fa;
     border-radius: 4px;
   }
   ```

3. **Course Cancellation Enhancement:**
   - Dropdown shows "Class ID - Subject (X students)" format
   - Selection displays all student details with remaining lessons
   - Confirmation shows impact on all students in the course

4. **Search Functionality:**
   - Filter by Class ID, Subject, or Student Name
   - Real-time filtering as user types
   - Highlights matching terms in results

#### Step 7.5.2: CSS Styling for Course Extension Modal
**Enhanced Modal Styling:**

1. **Extension Modal Specific Styles:**
   ```css
   .extension-modal {
     max-width: 600px;
     width: 90%;
   }
   
   .extension-course-info {
     background: #f8f9fa;
     padding: 15px;
     border-radius: 8px;
     margin-bottom: 20px;
     border-left: 4px solid #007bff;
   }
   
   .extension-form .form-group {
     margin-bottom: 20px;
   }
   
   .extension-date-input {
     width: 100%;
     padding: 10px;
     border: 1px solid #ddd;
     border-radius: 4px;
     font-size: 14px;
   }
   
   .focus-area-textarea {
     width: 100%;
     min-height: 80px;
     padding: 10px;
     border: 1px solid #ddd;
     border-radius: 4px;
     resize: vertical;
   }
   
   .extension-description-textarea {
     width: 100%;
     min-height: 120px;
     padding: 10px;
     border: 1px solid #ddd;
     border-radius: 4px;
     resize: vertical;
   }
   
   .form-note {
     display: flex;
     align-items: center;
     margin-top: 5px;
     font-size: 12px;
     color: #6c757d;
   }
   
   .form-note i {
     margin-right: 5px;
     color: #17a2b8;
   }
   
   .extension-actions {
     display: flex;
     justify-content: flex-end;
     gap: 10px;
     margin-top: 20px;
   }
   ```

2. **Cancellation Modal Specific Styles:**
   ```css
   .cancellation-date {
     width: 100%;
     padding: 10px;
     border: 1px solid #ddd;
     border-radius: 4px;
     font-size: 14px;
   }
   
   .cancellation-warning {
     background: #fff3cd;
     border: 1px solid #ffeaa7;
     color: #856404;
     padding: 15px;
     border-radius: 4px;
     margin-bottom: 20px;
   }
   ```

#### Step 7.5.3: JavaScript Implementation Notes
**Key Functions for Wix Velo:**

1. **openCourseExtensionModal()** - Opens extension modal and populates course info
2. **closeExtensionModal()** - Closes extension modal and resets form
3. **submitExtensionRequest()** - Handles extension form submission
4. **openCourseCancellationModal()** - Opens cancellation modal
5. **handleCourseAction()** - Manages course action routing
6. **createCourseItem()** - Updated to handle multiple students
7. **loadCancellableCourses()** - Enhanced dropdown with student counts
8. **Course selection handler** - Shows detailed student information
9. **filterCourses()** - Multi-criteria search functionality

### Phase 8: Remove AP Student Setup (30 minutes)

#### Step 8.1: Prepare Student Data Structure
**Set up data connection for AP students:**

**Note:** The system will use common UK student names to reflect the target demographic.

1. **Connect to Database Collection:**
   - Go to Database Manager in Wix
   - Create or connect to "Students" collection
   - Ensure fields include: id, name, grade, course, status
   - Add sample data with UK student names:
     - Oliver Thompson (Year 9, Core Subjects, Active)
     - Emily Johnson (Year 8, Core + Arts, Active)
     - Harry Williams (Year 10, All Subjects + Therapy, Paused)
     - Sophie Brown (Year 7, Core Subjects, Active)
     - Jack Davies (Year 9, Core + Arts, Active)
     - Charlotte Wilson (Year 11, All Subjects, Active)
     - George Evans (Year 8, Core + PSHE, Paused)
     - Amelia Taylor (Year 10, Core + Career, Active)
     - Thomas Anderson (Year 9, All Subjects + Therapy, Active)
     - Isabella Clark (Year 7, Core Subjects, Active)

#### Step 8.2: Configure Remove AP Student Button
**Set up the Remove AP Student button functionality:**

1. **Select the Remove AP Student Button:**
   - Click on the "Remove AP Student" button in the AP Student card
   - Go to Properties Panel → Events
   - Add onClick event
   - Name the event: `removeAPStudentBtn_click`

2. **Button Behavior Setup:**
   - The button should open the Remove AP Student lightbox
   - The lightbox should populate with current AP students from database
   - Each student should display with their information and status

#### Step 8.3: Design Student List Display
**Configure how students appear in the removal modal:**

1. **Student List Container:**
   - Add a container element inside the lightbox
   - Name it: `apStudentsListContainer`
   - Set it to display students in a vertical list format

2. **Student Item Layout:**
   - Each student should display in a card format
   - Left side: Student name and details (Grade | Course)
   - Right side: Status badge and Remove button
   - Use consistent spacing and styling

3. **Status Badge Styling:**
   - Active status: Green background (#28a745)
   - Paused status: Orange background (#ffc107)
   - White text, small font size, rounded corners

4. **Remove Button Styling:**
   - Red background (#dc3545)
   - White text
   - Small size, rounded corners
   - "Remove" text label

#### Step 8.4: Set Up Removal Confirmation
**Configure the student removal process:**

1. **Confirmation Dialog:**
   - When Remove button is clicked, show confirmation message
   - Message should include student name
   - Include warning that action cannot be undone
   - Provide Cancel and Confirm options

2. **Post-Removal Actions:**
   - Remove student from the displayed list
   - Update the AP student counter
   - Show success message with student name
   - If no students remain, close the modal automatically

#### Step 8.5: Configure Student Count Updates
**Set up automatic counter updates:**

1. **AP Student Counter:**
   - Connect the counter display to show current number of AP students
   - Update automatically when students are removed
   - Display should reflect real-time changes

2. **Statistics Integration:**
   - Ensure removal updates the main statistics cards
   - Total students count should decrease accordingly
   - Active/Paused counts should update based on removed student status

#### Step 8.6: Modal Close Functionality
**Configure lightbox closing behavior:**

1. **Close Button Setup:**
   - Add close button (X) in modal header
   - Configure to hide the lightbox when clicked
   - Ensure modal can be closed without making changes

2. **Auto-Close Conditions:**
   - Modal should close automatically when all students are removed
   - Show final confirmation message before closing

---

## Important Implementation Notes

### Universal Lightbox Requirements Summary
**These configurations MUST be applied to ALL Lightboxes in the dashboard:**

1. **Scrollbar Configuration:**
   - Set "Overflow content" to "Scroll" with "Vertical" direction
   - Define fixed height or max-height for automatic scrollbar generation
   - Apply same settings to mobile layout for cross-device compatibility

2. **Dropdown Menu Implementation:**
   - Use consistent dropdown styling across all modals
   - Implement proper option management and data binding
   - Ensure dropdowns are accessible and responsive

3. **Content Organization:**
   - Structure content in scrollable containers when needed
   - Maintain consistent spacing and layout patterns
   - Implement proper form validation and user feedback

4. **Mobile Responsiveness:**
   - Test all Lightboxes on mobile devices
   - Ensure touch-friendly interface elements
   - Verify scrolling behavior on different screen sizes

**Key Benefits:**
- Consistent user experience across all dashboard modals
- Improved accessibility and usability
- Professional appearance with proper content management
- Seamless functionality on all devices

**Remember:** The scrollbar is automatically generated by the browser when content exceeds the container height - no additional components needed!

### Phase 9: EHCP File Upload Implementation (60 minutes)

#### Step 9.1: File Upload Security Configuration
1. **Configure File Upload Settings in Wix**
   - Go to Database Manager → File Upload Settings
   - Set allowed file types: PDF, DOC, DOCX
   - Set maximum file size: 10MB
   - Enable file validation in upload element properties
   - Configure user access permissions for file uploads

#### Step 9.2: File Upload Elements Setup
1. **Add File Upload Elements to AP Student Form**
   - Add Upload Button: `ehcpFileUpload`
     - Position: Below education plan dropdown
     - Label: "Upload EHCP File"
     - Accepted file types: PDF, DOC, DOCX
   - Add Status Text: `fileUploadStatus`
     - Position: Below upload button
     - Initial text: "No file selected"
   - Add Progress Bar: `fileUploadProgress`
     - Position: Below status text
     - Initially hidden
   - Add File Name Display: `uploadedFileName`
     - Position: Below progress bar
     - Initially hidden

#### Step 9.3: Database Collection Updates
1. **Update Students Collection Fields**
   - Go to Database Manager → Students Collection
   - Add new fields:
     - `ehcpFileUrl` (URL field)
     - `ehcpFileName` (Text field)
     - `ehcpFileSize` (Number field)
     - `ehcpUploadDate` (Date field)
     - `ehcpFileStatus` (Text field)
   - Set field permissions to "Admin only"

#### Step 9.4: Additional Information Fields
1. **Update Students Collection with Additional Fields**
   - Add `homeLessonsWithoutSupervision` field (text) - Whether student can have home lessons without supervision (Yes/No)
   - Add `supportLongerThanFourWeeks` field (text) - Whether student needs support longer than four weeks (Yes/No)

2. **Configure Field Properties**
   - Set appropriate field types and validations
   - Configure search indexing for relevant fields
   - Set up field permissions

### Phase 10: Responsive Design (45 minutes)

#### Step 10.1: Mobile Layout
1. **Switch to mobile view**
2. **Hide sidebar**
3. **Adjust grid to single column**
4. **Adjust font sizes and spacing**
5. **Optimize file upload for mobile**

#### Step 10.2: Tablet Layout
1. **Switch to tablet view**
2. **Adjust sidebar width to 200px**
3. **Adjust grid to 2 columns**
4. **Optimize touch interactions**
5. **Test file upload on tablet devices**

## Deployment and Maintenance

### Step 11: Course Management Enhancement Testing (35 minutes)

#### Step 11.1: Course Extension Modal Testing
1. **Test Extension Modal Display**
   - Click "Course Extension" button
   - Verify `courseExtensionLightbox` opens correctly
   - Check modal header displays "Course Extension Request" title
   - Verify close button (×) is functional

2. **Test Extension Form Fields**
   - **Course Information Section:**
     - Verify `extensionCourseInfo` populates with selected course details
     - Check course ID, subject, and student information display
   - **Extension Date Field:**
     - Test `extensionEndDate` input field
     - Verify date validation (required field)
     - Check info note displays correctly
   - **Focus Area Field:**
     - Test `updatedFocusArea` textarea
     - Verify placeholder text and required validation
   - **Description Field:**
     - Test `extensionDescription` textarea
     - Verify placeholder text and required validation

3. **Test Extension Form Submission**
   - Fill all required fields
   - Click "Submit Extension Request" button (`submitExtensionBtn`)
   - Verify form validation works for empty fields
   - Test successful submission process
   - Check modal closes after successful submission

4. **Test Extension Modal Actions**
   - Test "Cancel" button (`closeExtensionModalBtn2`)
   - Verify modal closes without saving changes
   - Test clicking outside modal to close
   - Verify form resets when modal reopens

#### Step 11.2: Course Cancellation Enhancement Testing
1. **Test Cancellation Modal Display**
   - Open course cancellation modal
   - Verify warning section displays two-week notice
   - Check alert icon and styling
   - Verify dropdown shows "Class ID - Subject (X students)" format

2. **Test Course Selection and Details**
   - Select a course from dropdown
   - Verify detailed student information displays
   - Check that all students' remaining lessons are shown
   - Test multi-column layout for courses with multiple students

3. **Test Cancellation Form**
   - Test "Cancel From" date input (`cancellation-date`)
   - Verify cancellation reason textarea
   - Test form validation for required fields
   - Test cancellation confirmation with multiple students

#### Step 11.3: Event Handler Configuration Testing
1. **Test Button Event Handlers**
   - Verify `courseExtensionBtn` opens extension modal
   - Test `closeExtensionModalBtn` and `closeExtensionModalBtn2` close modal
   - Check `submitExtensionBtn` triggers form submission
   - Test modal backdrop click closes modal

2. **Test JavaScript Function Integration**
   - Verify `openCourseExtensionModal()` function
   - Test `closeExtensionModal()` function
   - Check `submitExtensionRequest()` function
   - Test `handleCourseAction()` routing function

### Step 12: Remove AP Student Testing (20 minutes)

#### Step 12.1: Remove AP Student Modal Testing
1. **Test Modal Display**
   - Click "Remove AP Student" button
   - Verify lightbox opens correctly
   - Check student list displays with proper formatting
   - Verify status badges show correct colors (Active: green, Paused: orange)

2. **Test Student List Functionality**
   - Verify all 10 sample students are displayed
   - Check student information is correctly formatted (Name, Grade | Course)
   - Verify Remove buttons are functional
   - Test modal close functionality

#### Step 12.2: Student Removal Process Testing
1. **Test Removal Confirmation**
   - Click Remove button for any student
   - Verify confirmation dialog appears with correct student name
   - Test "Cancel" option (student should remain)
   - Test "OK" option (student should be removed)

2. **Test Post-Removal Updates**
   - Verify student is removed from the list
   - Check AP student count is updated correctly
   - Verify success message is displayed
   - Test removing all students (modal should close automatically)

3. **Test Edge Cases**
   - Test removing the last student
   - Verify "All AP students have been removed" message
   - Test reopening modal after all students removed

### Step 13: EHCP File Management Testing (30 minutes)

#### Step 13.1: File Upload Testing
1. **Test Valid File Types**
   - Upload PDF files
   - Upload DOC/DOCX files
   - Verify successful uploads

2. **Test File Validation**
   - Test invalid file types (should be rejected)
   - Test oversized files (should be rejected)
   - Test empty files (should be rejected)

3. **Test File Security**
   - Verify file access permissions
   - Test unauthorized access attempts
   - Check file activity tracking

#### Step 13.2: Database Integration Testing
1. **Verify Data Persistence**
   - Check file URL saving to database
   - Verify file metadata storage
   - Test file status updates

2. **Test File Lifecycle**
   - Test file upload process
   - Test file access and download
   - Test file deletion (if implemented)

### Step 14: Pre-Deployment Checklist

#### Content Review
- [ ] All text content is accurate and professional
- [ ] All images are optimized and properly sized
- [ ] All links and buttons work correctly
- [ ] Form validation works properly
- [ ] Database connections are secure

#### Technical Review
- [ ] All elements are properly named and organized
- [ ] Form validation is implemented
- [ ] All interactions work correctly
- [ ] Page performance is optimized
- [ ] User permissions are configured

#### Testing Review
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] All user flows tested
- [ ] Database operations tested
- [ ] Third-party integrations tested

### Step 15: Deployment Process

1. **Final Testing:**
   - Test in Wix preview mode
   - Test all forms and interactions
   - Verify database operations
   - Test Lark integration

2. **Publish Website:**
   - Click "Publish" in Wix Editor
   - Choose domain (custom or Wix subdomain)
   - Configure SSL certificate
   - Set up analytics tracking

3. **Post-Deployment Testing:**
   - Test live website functionality
   - Verify database operations in production
   - Test form submissions
   - Monitor error logs

### Step 16: Ongoing Maintenance

#### EHCP File Management Tasks
**Daily Tasks:**
- Monitor file upload activities
- Check file storage usage
- Review file access logs

**Weekly Tasks:**
- Clean up orphaned files
- Review file security reports
- Check file backup status

**Monthly Tasks:**
- Generate file activity reports
- Review and update file retention policies
- Review file access permissions
- Optimize file storage

#### General Maintenance Tasks

#### Daily Tasks
- Monitor website performance
- Check error logs
- Review form submissions
- Monitor database usage

#### Weekly Tasks
- Review analytics data
- Update content as needed
- Check for broken links
- Review user feedback

#### Monthly Tasks
- Database cleanup and optimization
- Security updates
- Performance optimization
- Feature updates based on user feedback

#### Quarterly Tasks
- Complete system review
- Complete backup of website and database
- Review and update documentation
- Plan new features and improvements

## Conclusion

This comprehensive guide provides everything needed to create a fully functional admin dashboard in Wix. The implementation includes:

- **Complete UI/UX Design:** Professional, responsive interface
- **Enhanced Course Management:** Multi-student course display with group class support (up to 6 students per course)
- **Advanced Course Extension System:** Dedicated extension request modal with comprehensive form fields:
  - Extension end date selection with validation
  - Updated focus area description
  - Detailed extension description and requirements
  - Professional form styling with info notes and icons
- **Improved Course Cancellation Process:** Enhanced cancellation workflow featuring:
  - Two-week notice requirement warnings
  - Detailed course selection with student count display
  - Comprehensive cancellation reason documentation
  - Multi-student impact visualization
- **Database Integration:** Robust data management system with updated course data structure
- **Form Processing:** Comprehensive validation and submission with enhanced error handling
- **Advanced Course Operations:** Enhanced course cancellation and extension with detailed student information
- **Remove AP Student Functionality:** Dynamic student list with removal confirmation and real-time updates
- **Third-party Integration:** Lark notification system
- **Responsive Design:** Mobile, tablet, and desktop optimization with multi-column layouts
- **Form Validation:** Comprehensive input validation with real-time feedback
- **Performance Optimization:** Fast, efficient operations with improved search functionality
- **Enhanced Event Handling:** Comprehensive JavaScript event management for modal interactions

**Estimated Total Implementation Time:** 8-10 hours (including enhanced course management features)
**Maintenance Time:** 2-4 hours per month

**Next Steps:**
1. Follow the step-by-step implementation guide
2. Conduct thorough testing before deployment
3. Train team members on system usage
4. Plan ongoing maintenance and updates
5. Gather user feedback for future improvements

For additional support or custom requirements, please refer to Wix documentation or consult with Wix development experts.