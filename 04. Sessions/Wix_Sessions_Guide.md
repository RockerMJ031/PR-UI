# Wix Sessions Dashboard - Visual Setup Guide

## What You're Building

You'll create a **Sessions Information Dashboard** for UK school administrators. This is a **display-only page** where administrators can view session information, but cannot add, edit, or cancel sessions. The page shows session data in an organized, easy-to-read format.

### Page Purpose
- **View all tutoring sessions** in a clean list format
- **See session details** (student, tutor, subject, time, status)
- **Filter sessions** by different criteria
- **Switch between different views** (all sessions, by status, by date)

### Device Compatibility
The page will work perfectly on:
- **Desktop computers** (main layout)
- **Tablets** (adapted layout) 
- **Mobile phones** (mobile-friendly layout)

### Important Setup Notes
- Use **exact element names** provided in this guide
- Follow the **step-by-step instructions** carefully
- Only **one HTML component** may be needed (for calendar if required)
- Everything else uses **standard Wix visual elements**

---

## Step-by-Step Page Setup

### Step 1: Create the Page Foundation

1. **Create a new page** in your Wix site
2. **Name the page**: "Sessions"
3. **Set page layout**: Choose a blank template
4. **Page settings**: Ensure the page is responsive (default setting)

### Step 2: Add the Main Header Section

1. **Add a Container** at the top of the page:
   - **Name it**: `pageHeader`
   - **Background**: White with subtle shadow
   - **Layout**: Horizontal
   - **Padding**: 20px all around
   - **Width**: Full width

2. **Add the page title**:
   - Drag a **Text** element into the header container
   - **Text content**: "Session Management Dashboard"
   - **Name it**: `pageTitle`
   - **Style**: Large font (32px), bold, dark blue color (#2c3e50)
   - **Position**: Left side of header

3. **Add a subtitle** (optional):
   - Drag another **Text** element below the title
   - **Text content**: "View and monitor all tutoring sessions"
   - **Name it**: `pageSubtitle`
   - **Style**: Medium font (16px), gray color (#7f8c8d)

### Step 3: Create the Filter and View Section

1. **Add a Container** below the header:
   - **Name it**: `filterSection`
   - **Background**: Light gray (#f8f9fa)
   - **Layout**: Vertical
   - **Padding**: 20px
   - **Margin**: 10px top and bottom

2. **Add view toggle buttons**:
   - Drag a **Container** inside the filter section
   - **Name it**: `viewToggleContainer`
   - **Layout**: Horizontal
   - **Alignment**: Left
   
   Add **4 Buttons** with these exact names and text:
   - **Name**: `allSessionsBtn` | **Text**: "All Sessions"
   - **Name**: `scheduledBtn` | **Text**: "Scheduled"
   - **Name**: `completedBtn` | **Text**: "Completed"
   - **Name**: `cancelledBtn` | **Text**: "Cancelled"
   
   **Button styling**:
   - **Size**: Medium
   - **Style**: Rounded corners
   - **Colors**: Blue background (#3498db), white text
   - **Spacing**: 10px between buttons

3. **Add filter controls**:
   - Drag a **Container** below the toggle buttons
   - **Name it**: `filterControls`
   - **Layout**: Horizontal (will stack on mobile)
   - **Spacing**: 15px between elements
   
   Add these filter elements:
   - **Dropdown**: 
     - **Name**: `studentFilter`
     - **Label**: "Filter by Student"
     - **Placeholder**: "All Students"
   
   - **Dropdown**: 
     - **Name**: `tutorFilter`
     - **Label**: "Filter by Tutor"
     - **Placeholder**: "All Tutors"
   
   - **Dropdown**: 
     - **Name**: `subjectFilter`
     - **Label**: "Filter by Subject"
     - **Placeholder**: "All Subjects"
   
   - **Date Input**: 
     - **Name**: `dateFilter`
     - **Label**: "Filter by Date"
     - **Type**: Date picker

### Step 4: Create the Sessions Display Area

1. **Add the main content container**:
   - Drag a **Container** below the filter section
   - **Name it**: `sessionsContainer`
   - **Background**: White
   - **Layout**: Vertical
   - **Padding**: 20px
   - **Border**: Light gray border (#e1e8ed)

2. **Add a sessions header**:
   - Drag a **Container** inside the sessions container
   - **Name it**: `sessionsHeader`
   - **Layout**: Horizontal
   - **Background**: Light blue (#ecf0f1)
   - **Padding**: 15px
   
   Add **Text** elements for column headers:
   - **Name**: `headerDate` | **Text**: "Date & Time"
   - **Name**: `headerStudent` | **Text**: "Student"
   - **Name**: `headerTutor` | **Text**: "Tutor"
   - **Name**: `headerSubject` | **Text**: "Subject"
   - **Name**: `headerStatus` | **Text**: "Status"
   
   **Header styling**:
   - **Font**: Bold, 14px
   - **Color**: Dark gray (#2c3e50)
   - **Width**: Equal columns (20% each)

3. **Add the sessions list**:
   - Drag a **Repeater** element below the header
   - **Name it**: `sessionsList`
   - **Layout**: Vertical list
   - **Item spacing**: 5px between items

### Step 5: Design the Session Item (Repeater Content)

1. **Set up the repeater item container**:
   - Click on the repeater to edit its content
   - The item should be a **Container**
   - **Name it**: `sessionItem`
   - **Layout**: Horizontal (5 equal columns)
   - **Background**: White with hover effect (light gray on hover)
   - **Border**: Bottom border only (#e1e8ed)
   - **Padding**: 15px

2. **Add session information elements**:
   
   **Column 1 - Date & Time**:
   - **Text** element
   - **Name**: `sessionDateTime`
   - **Content**: Will show date and time
   - **Style**: Regular font, dark text
   
   **Column 2 - Student Name**:
   - **Text** element
   - **Name**: `studentName`
   - **Content**: Will show student name
   - **Style**: Regular font, dark text
   
   **Column 3 - Tutor Name**:
   - **Text** element
   - **Name**: `tutorName`
   - **Content**: Will show tutor name
   - **Style**: Regular font, dark text
   
   **Column 4 - Subject**:
   - **Text** element
   - **Name**: `sessionSubject`
   - **Content**: Will show subject
   - **Style**: Regular font, dark text
   
   **Column 5 - Status**:
   - **Text** element
   - **Name**: `sessionStatus`
   - **Content**: Will show status
   - **Style**: Bold font, colored background:
     - **Scheduled**: Blue background (#3498db)
     - **Completed**: Green background (#27ae60)
     - **Cancelled**: Red background (#e74c3c)
     - **Text**: White for all statuses
   - **Shape**: Rounded corners, padding 5px

### Step 6: Add Pagination (if needed)

1. **Add pagination container**:
   - Drag a **Container** below the sessions list
   - **Name it**: `paginationContainer`
   - **Layout**: Horizontal
   - **Alignment**: Center
   - **Padding**: 20px

2. **Add pagination elements**:
   - **Button**: 
     - **Name**: `prevPageBtn`
     - **Text**: "Previous"
     - **Icon**: Left arrow
   
   - **Text**: 
     - **Name**: `pageInfo`
     - **Content**: "Page 1 of 5" (example)
     - **Style**: Regular font, centered
   
   - **Button**: 
     - **Name**: `nextPageBtn`
     - **Text**: "Next"
     - **Icon**: Right arrow

### Step 7: Add Optional Calendar View

**Only add this if you want a calendar display option**

1. **Add calendar container**:
   - Drag a **Container** (initially hidden)
   - **Name it**: `calendarContainer`
   - **Background**: White
   - **Padding**: 20px

2. **Add HTML Component for calendar**:
   - Drag an **HTML Component** into the calendar container
   - **Name it**: `calendarView`
   - Click "Edit Code" and add this HTML:

```html
<div class="calendar-wrapper">
    <div class="calendar-header">
        <button id="prevMonth">‹</button>
        <h3 id="currentMonth">December 2024</h3>
        <button id="nextMonth">›</button>
    </div>
    <div class="calendar-grid">
        <div class="day-header">Sun</div>
        <div class="day-header">Mon</div>
        <div class="day-header">Tue</div>
        <div class="day-header">Wed</div>
        <div class="day-header">Thu</div>
        <div class="day-header">Fri</div>
        <div class="day-header">Sat</div>
        <!-- Calendar days will be populated by code -->
    </div>
</div>

<style>
.calendar-wrapper {
    font-family: Arial, sans-serif;
    max-width: 100%;
    margin: 0 auto;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 5px;
}

.calendar-header button {
    background: #3498db;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 3px;
    cursor: pointer;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #ddd;
    border: 1px solid #ddd;
}

.day-header {
    background: #34495e;
    color: white;
    padding: 10px;
    text-align: center;
    font-weight: bold;
}

@media (max-width: 768px) {
    .calendar-grid {
        font-size: 12px;
    }
    .day-header {
        padding: 5px;
    }
}
</style>
</div>
```

---

## Mobile and Tablet Responsiveness

### Mobile Layout (Phones - under 768px)

1. **Header adjustments**:
   - **Stack title and subtitle** vertically
   - **Reduce font sizes**: Title to 24px, subtitle to 14px
   - **Increase padding** for touch-friendly spacing

2. **Filter section**:
   - **Stack all filter controls** vertically
   - **Make dropdowns full width**
   - **Stack view toggle buttons** in 2x2 grid
   - **Increase button size** for easier tapping

3. **Sessions list**:
   - **Change to single column** layout
   - **Stack session information** vertically within each item
   - **Larger text** for readability
   - **More padding** between items

4. **Session item mobile layout**:
   - **Student name**: Top, larger font
   - **Date/Time**: Below student name
   - **Tutor and Subject**: On same line, smaller font
   - **Status**: Bottom right, prominent

### Tablet Layout (768px - 1024px)

1. **Keep horizontal layout** but with adjusted spacing
2. **Reduce column widths** slightly
3. **Medium font sizes** between desktop and mobile
4. **Touch-friendly button sizes**

### Responsive Settings in Wix

1. **Select each container** and set responsive behavior:
   - **Desktop**: Fixed layout
   - **Tablet**: Adjust widths, maintain structure
   - **Mobile**: Stack vertically, full width

2. **For text elements**:
   - Set different font sizes for each breakpoint
   - Ensure adequate line spacing

3. **For buttons and interactive elements**:
   - Minimum 44px height on mobile
   - Adequate spacing between clickable areas

---

## Element Naming Checklist

**Critical: All elements must be named exactly as specified**

### Main Structure
- `pageHeader` - Main header container
- `pageTitle` - "Session Management Dashboard" title
- `pageSubtitle` - Subtitle text (optional)
- `filterSection` - Filter and controls container
- `sessionsContainer` - Main sessions display area

### Filter and View Controls
- `viewToggleContainer` - Container for view buttons
- `allSessionsBtn` - All sessions button
- `scheduledBtn` - Scheduled sessions button
- `completedBtn` - Completed sessions button
- `cancelledBtn` - Cancelled sessions button
- `filterControls` - Container for filter dropdowns
- `studentFilter` - Student filter dropdown
- `tutorFilter` - Tutor filter dropdown
- `subjectFilter` - Subject filter dropdown
- `dateFilter` - Date filter input

### Sessions Display
- `sessionsHeader` - Header row container
- `headerDate` - Date/Time column header
- `headerStudent` - Student column header
- `headerTutor` - Tutor column header
- `headerSubject` - Subject column header
- `headerStatus` - Status column header
- `sessionsList` - Sessions repeater
- `sessionItem` - Individual session container (in repeater)
- `sessionDateTime` - Date/time text
- `studentName` - Student name text
- `tutorName` - Tutor name text
- `sessionSubject` - Subject text
- `sessionStatus` - Status badge

### Pagination (if used)
- `paginationContainer` - Pagination container
- `prevPageBtn` - Previous page button
- `pageInfo` - Page information text
- `nextPageBtn` - Next page button

### Calendar (if used)
- `calendarContainer` - Calendar container
- `calendarView` - Calendar HTML component

---

## Final Testing Steps

### 1. Desktop Testing
- **Check layout alignment** - all columns should be evenly spaced
- **Verify text readability** - appropriate font sizes and colors
- **Test button hover effects** - visual feedback on interaction
- **Check spacing consistency** - uniform padding and margins

### 2. Tablet Testing
- **Switch to tablet preview** in Wix editor
- **Verify responsive adjustments** - elements should resize appropriately
- **Check touch targets** - buttons should be easy to tap
- **Test horizontal scrolling** - should be minimal or none

### 3. Mobile Testing
- **Switch to mobile preview** in Wix editor
- **Verify vertical stacking** - elements should stack properly
- **Check text readability** - fonts should be large enough
- **Test touch interactions** - adequate spacing between elements
- **Verify full-width elements** - no horizontal overflow

### 4. Element Name Verification
- **Go through each element** and confirm exact naming
- **Check for typos** - names are case-sensitive
- **Verify container nesting** - elements are in correct containers

### 5. Visual Consistency
- **Color scheme consistency** - blues, grays, and status colors
- **Font consistency** - same font family throughout
- **Spacing consistency** - uniform padding and margins
- **Border and shadow consistency** - subtle, professional appearance

---

## Completion Checklist

✅ **Page created** with correct name "Sessions"

✅ **Header section** with title and subtitle

✅ **Filter section** with view toggles and filter controls

✅ **Sessions display area** with header and repeater

✅ **Session item design** with all required information fields

✅ **Responsive design** tested on desktop, tablet, and mobile

✅ **All elements named** exactly as specified in the checklist

✅ **Visual styling** consistent and professional

✅ **Calendar component** added (if required)

✅ **Pagination** added (if required)

---

## Next Steps

Once you've completed this visual setup:

1. **The developer will connect** the page to the database
2. **Interactive functionality** will be added through code
3. **Data will populate** the repeater and filters
4. **The page will be fully functional** for viewing session information

## Support

If you encounter any issues:

1. **Double-check element names** against the checklist
2. **Verify responsive settings** for all breakpoints
3. **Test on actual devices** if possible
4. **Contact the developer** for technical integration support

**Remember**: This guide focuses on visual layout only. All interactive functionality will be handled by the developer using the named elements you've created.

