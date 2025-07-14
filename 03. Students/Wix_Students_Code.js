/**
 * Wix Students Management Dashboard - Complete Code Implementation
 * 
 * This file contains all the Velo code needed to implement the Students Management Dashboard
 * including student registration, progress tracking, communication, and reporting.
 * 
 * USAGE INSTRUCTIONS:
 * 1. Copy the frontend code to your Wix page's code panel
 * 2. Copy the backend code to appropriate backend files
 * 3. Configure database collections as specified
 * 4. Set up member permissions and roles
 * 5. Test all functionality before going live
 */

// ==========================================
// FRONTEND CODE (Page Code)
// ==========================================

import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { local } from 'wix-storage';
import wixWindow from 'wix-window';
import wixUsers from 'wix-users';

// Global variables
let currentUser = null;
let currentStudentType = 'alternative'; // 'alternative' or 'tutoring'
let studentsData = {
    students: [],
    courses: [],
    mentors: [],
    statistics: {},
    filters: {
        search: '',
        status: 'all',
        course: 'all',
        dateRange: null,
        studentType: 'alternative'
    }
};

// Subject/Curriculum options
const subjectOptions = {
    tutoring: [
        "Mathematics",
        "English", 
        "Science",
        "History",
        "Geography",
        "Art",
        "Physics",
        "Chemistry",
        "Biology"
    ],
    alternative: [
        "Core Subjects",
        "Core Subjects + PSHE Careers + PE and Art",
        "All Subjects + Therapy",
        "Purple Ruler Blueprint"
    ]
};

// ==========================================
// PAGE INITIALIZATION
// ==========================================

$w.onReady(function () {
    console.log('Students Management Dashboard initializing...');
    
    // Check user authentication
    checkUserAuthentication();
    
    // Initialize page
    initializePage();
    
    // Set up event handlers
    setupEventHandlers();
    
    // Load initial data
    loadStudentsData();
    
    // Set up responsive design
    setupResponsiveDesign();
    
    console.log('Students Management Dashboard initialized successfully');
});

// ==========================================
// AUTHENTICATION AND INITIALIZATION
// ==========================================

function checkUserAuthentication() {
    if (wixUsers.currentUser.loggedIn) {
        currentUser = wixUsers.currentUser;
        // Check user role and permissions
        checkUserPermissions();
    } else {
        // Redirect to login page
        wixLocation.to('/login');
    }
}

function checkUserPermissions() {
    // Implement role-based access control
    wixUsers.currentUser.getRoles()
        .then((roles) => {
            const hasAccess = roles.some(role => 
                ['admin', 'mentor', 'staff'].includes(role.title.toLowerCase())
            );
            
            if (!hasAccess) {
                showMessage('Access denied. Insufficient permissions.', 'error');
                wixLocation.to('/dashboard');
            }
        })
        .catch((error) => {
            console.error('Error checking user permissions:', error);
        });
}

function initializePage() {
    // Set page title
    $w('#pageTitle').text = 'Students Management';
    
    // Initialize student type toggle
    switchStudentType('alternative');
    
    // Initialize date filters
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    $w('#startDatePicker').value = firstDayOfMonth;
    $w('#endDatePicker').value = today;
    
    // Hide loading indicators
    $w('#loadingSpinner').hide();
    
    // Initialize filter dropdowns
    initializeFilters();
    
    // Initialize subject/curriculum options
    updateFormSubjectOptions();
    
    // Set initial view
    switchView('table');
}

function setupEventHandlers() {
    // Student type toggle buttons
    $w('#tutoringStudentsBtn').onClick(() => switchStudentType('tutoring'));
    $w('#apStudentsBtn').onClick(() => switchStudentType('alternative'));
    
    // Navigation and view controls
    $w('#gridViewBtn').onClick(() => switchView('grid'));
    $w('#tableViewBtn').onClick(() => switchView('table'));
    $w('#refreshBtn').onClick(() => refreshData());
    
    // Action buttons
    $w('#addStudentBtn').onClick(() => openAddStudentForm());
    $w('#importStudentsBtn').onClick(() => openImportDialog());
    $w('#exportDataBtn').onClick(() => exportStudentsData());
    $w('#bulkActionsBtn').onClick(() => openBulkActionsMenu());
    
    // Search and filter controls
    $w('#searchInput').onInput(() => applySearch());
    $w('#statusFilter').onChange(() => applyStatusFilter());
    $w('#courseFilter').onChange(() => applyCourseFilter());
    $w('#startDatePicker').onChange(() => applyDateFilter());
    $w('#endDatePicker').onChange(() => applyDateFilter());
    $w('#clearFiltersBtn').onClick(() => clearAllFilters());
    
    // Table/Grid interactions
    $w('#studentsTable').onRowSelect((event) => handleStudentSelection(event));
    $w('#studentsRepeater').onItemReady(($item, itemData) => {
        setupRepeaterItem($item, itemData);
    });
    
    // Modal close buttons
    $w('#closeStudentForm').onClick(() => hideAllModals());
    $w('#closeStudentDetails').onClick(() => hideAllModals());
    $w('#closeBulkActions').onClick(() => hideAllModals());
    $w('#closeImportDialog').onClick(() => hideAllModals());
    
    // Form submit buttons
    $w('#submitStudentBtn').onClick(() => submitStudentForm());
    $w('#updateStudentBtn').onClick(() => updateStudentForm());
    $w('#deleteStudentBtn').onClick(() => deleteStudent());
    $w('#sendMessageBtn').onClick(() => sendStudentMessage());
    
    // Bulk action buttons
    $w('#bulkDeleteBtn').onClick(() => performBulkDelete());
    $w('#bulkStatusUpdateBtn').onClick(() => performBulkStatusUpdate());
    $w('#bulkExportBtn').onClick(() => performBulkExport());
    $w('#bulkMessageBtn').onClick(() => performBulkMessage());
    
    // Import functionality
    $w('#importFileUpload').onChange(() => handleFileImport());
    $w('#processImportBtn').onClick(() => processImportedData());
    
    // Pagination controls
    $w('#prevPageBtn').onClick(() => navigatePage('prev'));
    $w('#nextPageBtn').onClick(() => navigatePage('next'));
    $w('#pageSizeSelect').onChange(() => changePageSize());
}

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

function loadStudentsData() {
    $w('#loadingSpinner').show();
    
    Promise.all([
        loadStudents(),
        loadCourses(),
        loadMentors(),
        calculateStatistics()
    ])
    .then(() => {
        updateDashboard();
        $w('#loadingSpinner').hide();
    })
    .catch((error) => {
        console.error('Error loading students data:', error);
        showMessage('Error loading students data', 'error');
        $w('#loadingSpinner').hide();
    });
}

// ==========================================
// STUDENT TYPE MANAGEMENT
// ==========================================

function switchStudentType(type) {
    currentStudentType = type;
    studentsData.filters.studentType = type;
    
    // Update button states
    if (type === 'tutoring') {
        $w('#tutoringStudentsBtn').style.backgroundColor = '#17a2b8';
        $w('#tutoringStudentsBtn').style.color = '#ffffff';
        $w('#apStudentsBtn').style.backgroundColor = '#ffffff';
        $w('#apStudentsBtn').style.color = '#17a2b8';
        
        // Update table header
        $w('#subjectColumnHeader').text = 'Subject';
    } else {
        $w('#apStudentsBtn').style.backgroundColor = '#663399';
        $w('#apStudentsBtn').style.color = '#ffffff';
        $w('#tutoringStudentsBtn').style.backgroundColor = '#ffffff';
        $w('#tutoringStudentsBtn').style.color = '#663399';
        
        // Update table header
        $w('#subjectColumnHeader').text = 'Curriculum';
    }
    
    // Update form subject options
    updateFormSubjectOptions();
    
    // Reload data with new filter
    loadStudentsData();
    
    // Update statistics
    updateStatistics();
}

function updateFormSubjectOptions() {
    const options = subjectOptions[currentStudentType];
    
    // Clear existing options
    $w('#subjectDropdown').options = [];
    
    // Add new options
    const dropdownOptions = options.map(option => ({
        label: option,
        value: option
    }));
    
    $w('#subjectDropdown').options = dropdownOptions;
    
    // Update form labels
    if (currentStudentType === 'alternative') {
        $w('#subjectLabel').text = 'Curriculum';
        $w('#subjectDescription').text = 'Select the curriculum package for this AP student';
    } else {
        $w('#subjectLabel').text = 'Subject';
        $w('#subjectDescription').text = 'Select the primary subject for tutoring';
    }
}

function updateStatistics() {
    const filteredStudents = studentsData.students.filter(student => 
        student.studentType === currentStudentType
    );
    
    const totalStudents = filteredStudents.length;
    const activeStudents = filteredStudents.filter(s => s.status === 'active').length;
    const pendingApproval = filteredStudents.filter(s => s.status === 'pending').length;
    const needAttention = filteredStudents.filter(s => s.status === 'attention').length;
    
    // Update statistics cards
    $w('#totalStudentsValue').text = totalStudents.toString();
    $w('#activeStudentsValue').text = activeStudents.toString();
    $w('#pendingApprovalValue').text = pendingApproval.toString();
    $w('#needAttentionValue').text = needAttention.toString();
    
    // Update student list count
    const studentTypeLabel = currentStudentType === 'alternative' ? 
        'alternative provision students' : 'tutoring students';
    $w('#studentListCount').text = `${totalStudents} ${studentTypeLabel} total`;
}

function loadStudents() {
    const filters = buildQueryFilters();
    
    return wixData.query('Students')
        .eq('studentType', currentStudentType)
        .limit(50)
        .descending('enrollmentDate')
        .find()
        .then((results) => {
            studentsData.students = results.items;
            updateStudentsDisplay();
            updatePagination(results);
            return results.items;
        });
}

function loadCourses() {
    return wixData.query('Courses')
        .find()
        .then((results) => {
            studentsData.courses = results.items;
            updateCourseFilter();
            return results.items;
        });
}

function loadMentors() {
    return wixData.query('Mentors')
        .find()
        .then((results) => {
            studentsData.mentors = results.items;
            return results.items;
        });
}

function calculateStatistics() {
    const students = studentsData.students || [];
    
    // Calculate basic statistics
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const inactiveStudents = students.filter(s => s.status === 'inactive').length;
    const graduatedStudents = students.filter(s => s.status === 'graduated').length;
    
    // Calculate enrollment trends
    const thisMonth = new Date();
    const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1, 1);
    const newEnrollments = students.filter(s => 
        new Date(s.enrollmentDate) >= lastMonth
    ).length;
    
    // Calculate completion rates
    const completedCourses = students.filter(s => s.status === 'graduated').length;
    const completionRate = totalStudents > 0 ? (completedCourses / totalStudents) * 100 : 0;
    
    studentsData.statistics = {
        totalStudents,
        activeStudents,
        inactiveStudents,
        graduatedStudents,
        newEnrollments,
        completionRate
    };
    
    updateStatisticsCards();
}

// ==========================================
// UI UPDATE FUNCTIONS
// ==========================================

function updateDashboard() {
    updateStatisticsCards();
    updateStudentsDisplay();
    updateFilters();
}

function updateStatisticsCards() {
    const stats = studentsData.statistics;
    
    // Update total students card
    $w('#totalStudentsValue').text = (stats.totalStudents || 0).toString();
    
    // Update active students card
    $w('#activeStudentsValue').text = (stats.activeStudents || 0).toString();
    
    // Update new enrollments card
    $w('#newEnrollmentsValue').text = (stats.newEnrollments || 0).toString();
    
    // Update completion rate card
    $w('#completionRateValue').text = `${(stats.completionRate || 0).toFixed(1)}%`;
    
    // Update status breakdown
    updateStatusBreakdown(stats);
}

function updateStatusBreakdown(stats) {
    const total = stats.totalStudents || 1; // Avoid division by zero
    
    // Calculate percentages
    const activePercentage = (stats.activeStudents / total) * 100;
    const inactivePercentage = (stats.inactiveStudents / total) * 100;
    const graduatedPercentage = (stats.graduatedStudents / total) * 100;
    
    // Update progress bars or charts
    if ($w('#activeProgressBar')) {
        $w('#activeProgressBar').value = activePercentage;
    }
    if ($w('#inactiveProgressBar')) {
        $w('#inactiveProgressBar').value = inactivePercentage;
    }
    if ($w('#graduatedProgressBar')) {
        $w('#graduatedProgressBar').value = graduatedPercentage;
    }
}

function updateStudentsDisplay() {
    const currentView = getCurrentView();
    
    if (currentView === 'table') {
        updateStudentsTable();
    } else {
        updateStudentsGrid();
    }
}

function updateStudentsTable() {
    const tableData = studentsData.students.map(student => ({
        _id: student._id,
        photo: student.profilePhoto || '/default-avatar.png',
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        subject: student.subject || student.curriculum || 'Not assigned',
        sessions: getStudentSessionCount(student._id),
        status: student.status,
        actions: 'view-edit-delete'
    }));
    
    $w('#studentsTable').rows = tableData;
}

function updateStudentsGrid() {
    $w('#studentsRepeater').data = studentsData.students;
}

function setupRepeaterItem($item, itemData) {
    // Set student photo
    $item('#studentPhoto').src = itemData.profilePhoto || '/default-avatar.png';
    
    // Set student name
    $item('#studentName').text = `${itemData.firstName} ${itemData.lastName}`;
    
    // Set student email
    $item('#studentEmail').text = itemData.email;
    
    // Set course name
    $item('#studentCourse').text = getCourseNameById(itemData.courseId);
    
    // Set status with styling
    $item('#studentStatus').text = itemData.status;
    $item('#studentStatus').style.backgroundColor = getStatusColor(itemData.status);
    
    // Set enrollment date
    $item('#enrollmentDate').text = formatDate(itemData.enrollmentDate);
    
    // Set progress
    const progress = getStudentProgress(itemData._id);
    $item('#progressBar').value = progress;
    $item('#progressText').text = `${progress}%`;
    
    // Set up action buttons
    $item('#viewDetailsBtn').onClick(() => openStudentDetails(itemData._id));
    $item('#editStudentBtn').onClick(() => editStudent(itemData._id));
    $item('#deleteStudentBtn').onClick(() => confirmDeleteStudent(itemData._id));
    $item('#sendMessageBtn').onClick(() => openMessageDialog(itemData._id));
}

// ==========================================
// STUDENT FORM FUNCTIONS
// ==========================================

function openAddStudentForm() {
    // Clear form and set for add mode
    clearStudentForm();
    $w('#studentFormTitle').text = `Add New ${currentStudentType === 'alternative' ? 'AP' : 'Tutoring'} Student`;
    $w('#submitStudentBtn').show();
    $w('#updateStudentBtn').hide();
    
    // Update form subject options based on current type
    updateFormSubjectOptions();
    
    // Show modal
    $w('#studentFormLightbox').show();
}

function openStudentForm(studentId = null) {
    if (studentId) {
        // Edit mode
        loadStudentForEdit(studentId);
        $w('#studentFormTitle').text = 'Edit Student';
        $w('#submitStudentBtn').hide();
        $w('#updateStudentBtn').show();
    } else {
        openAddStudentForm();
        return;
    }
    
    // Load form dependencies
    loadFormDependencies();
    
    // Show modal
    $w('#studentFormLightbox').show();
}

function loadFormDependencies() {
    // Populate course dropdown
    const courseOptions = studentsData.courses.map(course => ({
        label: course.courseName,
        value: course._id
    }));
    $w('#courseSelect').options = courseOptions;
    
    // Populate mentor dropdown
    const mentorOptions = studentsData.mentors.map(mentor => ({
        label: `${mentor.firstName} ${mentor.lastName}`,
        value: mentor._id
    }));
    $w('#mentorSelect').options = mentorOptions;
    
    // Set status options
    $w('#statusSelect').options = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Graduated', value: 'graduated' },
        { label: 'Suspended', value: 'suspended' }
    ];
}

function loadStudentForEdit(studentId) {
    const student = studentsData.students.find(s => s._id === studentId);
    
    if (student) {
        // Populate form fields
        $w('#firstNameInput').value = student.firstName || '';
        $w('#lastNameInput').value = student.lastName || '';
        $w('#emailInput').value = student.email || '';
        $w('#phoneInput').value = student.phone || '';
        $w('#dateOfBirthInput').value = student.dateOfBirth || null;
        $w('#statusSelect').value = student.status || 'active';
        $w('#parentEmailInput').value = student.parentEmail || '';
        $w('#parentPhoneInput').value = student.parentPhone || '';
        $w('#addressInput').value = student.address || '';
        $w('#emergencyContactInput').value = student.emergencyContact || '';
        $w('#academicLevelInput').value = student.academicLevel || '';
        $w('#specialNeedsInput').value = student.specialNeeds || '';
        $w('#notesInput').value = student.notes || '';
        
        // Set subject/curriculum based on student type
        if (student.studentType === 'alternative') {
            $w('#subjectDropdown').value = student.subject || student.curriculum || '';
        } else {
            $w('#subjectDropdown').value = student.subject || '';
        }
        
        // Update form options for this student's type
        const studentType = student.studentType || currentStudentType;
        if (studentType !== currentStudentType) {
            // Temporarily switch to student's type for form
            const tempType = currentStudentType;
            currentStudentType = studentType;
            updateFormSubjectOptions();
            currentStudentType = tempType;
        }
        
        // Set profile photo if exists
        if (student.profilePhoto) {
            $w('#profilePhotoPreview').src = student.profilePhoto;
            $w('#profilePhotoPreview').show();
        }
        
        // Store student ID for update
        $w('#studentFormLightbox').data = { studentId: studentId };
    }
}

function clearStudentForm() {
    // Clear all form fields
    $w('#firstNameInput').value = '';
    $w('#lastNameInput').value = '';
    $w('#emailInput').value = '';
    $w('#phoneInput').value = '';
    $w('#dateOfBirthInput').value = null;
    $w('#statusSelect').value = 'active';
    $w('#parentEmailInput').value = '';
    $w('#parentPhoneInput').value = '';
    $w('#addressInput').value = '';
    $w('#emergencyContactInput').value = '';
    $w('#academicLevelInput').value = '';
    $w('#specialNeedsInput').value = '';
    $w('#notesInput').value = '';
    $w('#subjectDropdown').value = '';
    
    // Clear profile photo
    $w('#profilePhotoUpload').value = '';
    $w('#profilePhotoPreview').hide();
    
    // Clear stored data
    $w('#studentFormLightbox').data = null;
}

// ==========================================
// STUDENT FORM SUBMISSION
// ==========================================

function submitStudentForm() {
    if (!validateStudentForm()) {
        return;
    }
    
    const studentData = collectFormData();
    
    $w('#submitStudentBtn').disable();
    $w('#submitStudentBtn').label = 'Adding...';
    
    wixData.save('Students', studentData)
        .then((result) => {
            showMessage('Student added successfully', 'success');
            $w('#studentFormLightbox').hide();
            loadStudentsData();
        })
        .catch((error) => {
            console.error('Error adding student:', error);
            showMessage('Error adding student', 'error');
        })
        .finally(() => {
            $w('#submitStudentBtn').enable();
            $w('#submitStudentBtn').label = 'Add Student';
        });
}

function updateStudentForm() {
    if (!validateStudentForm()) {
        return;
    }
    
    const formData = $w('#studentFormLightbox').data;
    if (!formData || !formData.studentId) {
        showMessage('Error: Student ID not found', 'error');
        return;
    }
    
    const studentData = collectFormData();
    studentData._id = formData.studentId;
    
    $w('#updateStudentBtn').disable();
    $w('#updateStudentBtn').label = 'Updating...';
    
    wixData.update('Students', studentData)
        .then((result) => {
            showMessage('Student updated successfully', 'success');
            $w('#studentFormLightbox').hide();
            loadStudentsData();
        })
        .catch((error) => {
            console.error('Error updating student:', error);
            showMessage('Error updating student', 'error');
        })
        .finally(() => {
            $w('#updateStudentBtn').enable();
            $w('#updateStudentBtn').label = 'Update Student';
        });
}

function collectFormData() {
    return {
        firstName: $w('#firstNameInput').value,
        lastName: $w('#lastNameInput').value,
        email: $w('#emailInput').value,
        phone: $w('#phoneInput').value,
        dateOfBirth: $w('#dateOfBirthInput').value,
        status: $w('#statusSelect').value,
        parentEmail: $w('#parentEmailInput').value,
        parentPhone: $w('#parentPhoneInput').value,
        address: $w('#addressInput').value,
        emergencyContact: $w('#emergencyContactInput').value,
        academicLevel: $w('#academicLevelInput').value,
        specialNeeds: $w('#specialNeedsInput').value,
        notes: $w('#notesInput').value,
        subject: $w('#subjectDropdown').value,
        studentType: currentStudentType,
        enrollmentDate: new Date(),
        lastUpdated: new Date()
    };
}

function validateStudentForm() {
    const firstName = $w('#firstNameInput').value;
    const lastName = $w('#lastNameInput').value;
    const email = $w('#emailInput').value;
    const subject = $w('#subjectDropdown').value;
    
    if (!firstName.trim()) {
        showMessage('First name is required', 'error');
        $w('#firstNameInput').focus();
        return false;
    }
    
    if (!lastName.trim()) {
        showMessage('Last name is required', 'error');
        $w('#lastNameInput').focus();
        return false;
    }
    
    if (!email.trim()) {
        showMessage('Email is required', 'error');
        $w('#emailInput').focus();
        return false;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        $w('#emailInput').focus();
        return false;
    }
    
    if (!subject) {
        const fieldName = currentStudentType === 'alternative' ? 'Curriculum' : 'Subject';
        showMessage(`${fieldName} is required`, 'error');
        $w('#subjectDropdown').focus();
        return false;
    }
    
    return true;
}

function submitStudentForm() {
    const studentData = collectFormData();
    
    if (validateStudentData(studentData)) {
        // Generate student ID
        studentData.studentId = generateStudentId();
        studentData.createdDate = new Date();
        studentData.lastModified = new Date();
        
        wixData.insert('Students', studentData)
            .then((result) => {
                showMessage('Student added successfully', 'success');
                hideAllModals();
                refreshData();
                
                // Send welcome email
                sendWelcomeEmail(result);
            })
            .catch((error) => {
                console.error('Error adding student:', error);
                showMessage('Error adding student', 'error');
            });
    }
}

function updateStudentForm() {
    const formData = $w('#studentFormLightbox').data;
    const studentData = collectFormData();
    
    if (formData && formData.studentId && validateStudentData(studentData)) {
        studentData.lastModified = new Date();
        
        wixData.update('Students', studentData, formData.studentId)
            .then((result) => {
                showMessage('Student updated successfully', 'success');
                hideAllModals();
                refreshData();
            })
            .catch((error) => {
                console.error('Error updating student:', error);
                showMessage('Error updating student', 'error');
            });
    }
}

function collectFormData() {
    return {
        firstName: $w('#firstNameInput').value,
        lastName: $w('#lastNameInput').value,
        email: $w('#emailInput').value,
        phone: $w('#phoneInput').value,
        dateOfBirth: $w('#dateOfBirthInput').value,
        enrollmentDate: $w('#enrollmentDateInput').value,
        courseId: $w('#courseSelect').value,
        mentorId: $w('#mentorSelect').value,
        status: $w('#statusSelect').value,
        parentEmail: $w('#parentEmailInput').value,
        parentPhone: $w('#parentPhoneInput').value,
        address: $w('#addressInput').value,
        emergencyContact: $w('#emergencyContactInput').value,
        academicLevel: $w('#academicLevelInput').value,
        specialNeeds: $w('#specialNeedsInput').value,
        notes: $w('#notesInput').value,
        profilePhoto: $w('#profilePhotoUpload').value
    };
}

function validateStudentData(data) {
    // Required field validation
    if (!data.firstName || !data.lastName) {
        showMessage('First name and last name are required', 'error');
        return false;
    }
    
    if (!data.email) {
        showMessage('Email address is required', 'error');
        return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }
    
    // Phone validation
    if (data.phone && !/^[\+]?[1-9][\d\s\-\(\)]{7,}$/.test(data.phone)) {
        showMessage('Please enter a valid phone number', 'error');
        return false;
    }
    
    // Date validation
    if (!data.enrollmentDate) {
        showMessage('Enrollment date is required', 'error');
        return false;
    }
    
    if (!data.courseId) {
        showMessage('Please select a course', 'error');
        return false;
    }
    
    return true;
}

// ==========================================
// SEARCH AND FILTER FUNCTIONS
// ==========================================

function applySearch() {
    const searchTerm = $w('#searchInput').value.toLowerCase();
    studentsData.filters.search = searchTerm;
    
    if (searchTerm === '') {
        loadStudents();
    } else {
        const filteredStudents = studentsData.students.filter(student => 
            student.firstName.toLowerCase().includes(searchTerm) ||
            student.lastName.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.studentId.toLowerCase().includes(searchTerm)
        );
        
        displayFilteredStudents(filteredStudents);
    }
}

function applyStatusFilter() {
    const selectedStatus = $w('#statusFilter').value;
    studentsData.filters.status = selectedStatus;
    
    applyAllFilters();
}

function applyCourseFilter() {
    const selectedCourse = $w('#courseFilter').value;
    studentsData.filters.course = selectedCourse;
    
    applyAllFilters();
}

function applyDateFilter() {
    const startDate = $w('#startDatePicker').value;
    const endDate = $w('#endDatePicker').value;
    
    studentsData.filters.dateRange = { startDate, endDate };
    
    applyAllFilters();
}

function applyAllFilters() {
    let filteredStudents = [...studentsData.students];
    
    // Apply search filter
    if (studentsData.filters.search) {
        const searchTerm = studentsData.filters.search.toLowerCase();
        filteredStudents = filteredStudents.filter(student => 
            student.firstName.toLowerCase().includes(searchTerm) ||
            student.lastName.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.studentId.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply status filter
    if (studentsData.filters.status && studentsData.filters.status !== 'all') {
        filteredStudents = filteredStudents.filter(student => 
            student.status === studentsData.filters.status
        );
    }
    
    // Apply course filter
    if (studentsData.filters.course && studentsData.filters.course !== 'all') {
        filteredStudents = filteredStudents.filter(student => 
            student.courseId === studentsData.filters.course
        );
    }
    
    // Apply date range filter
    if (studentsData.filters.dateRange) {
        const { startDate, endDate } = studentsData.filters.dateRange;
        if (startDate && endDate) {
            filteredStudents = filteredStudents.filter(student => {
                const enrollmentDate = new Date(student.enrollmentDate);
                return enrollmentDate >= startDate && enrollmentDate <= endDate;
            });
        }
    }
    
    displayFilteredStudents(filteredStudents);
}

function displayFilteredStudents(filteredStudents) {
    // Temporarily update students data for display
    const originalStudents = studentsData.students;
    studentsData.students = filteredStudents;
    
    updateStudentsDisplay();
    
    // Update result count
    $w('#resultCount').text = `${filteredStudents.length} students found`;
    
    // Restore original data
    studentsData.students = originalStudents;
}

function clearAllFilters() {
    // Reset filter values
    $w('#searchInput').value = '';
    $w('#statusFilter').value = 'all';
    $w('#courseFilter').value = 'all';
    $w('#startDatePicker').value = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    $w('#endDatePicker').value = new Date();
    
    // Reset filter data
    studentsData.filters = {
        search: '',
        status: 'all',
        course: 'all',
        dateRange: null
    };
    
    // Reload data
    loadStudents();
}

// ==========================================
// STUDENT DETAILS AND ACTIONS
// ==========================================

function openStudentDetails(studentId) {
    const student = studentsData.students.find(s => s._id === studentId);
    
    if (student) {
        // Populate student details modal
        populateStudentDetails(student);
        
        // Load additional data
        loadStudentProgress(studentId);
        loadStudentCommunication(studentId);
        
        // Show modal
        $w('#studentDetailsLightbox').show();
    }
}

function populateStudentDetails(student) {
    // Basic information
    $w('#detailStudentName').text = `${student.firstName} ${student.lastName}`;
    $w('#detailStudentEmail').text = student.email;
    $w('#detailStudentPhone').text = student.phone || 'N/A';
    $w('#detailStudentId').text = student.studentId;
    $w('#detailEnrollmentDate').text = formatDate(student.enrollmentDate);
    $w('#detailStatus').text = student.status;
    $w('#detailCourse').text = getCourseNameById(student.courseId);
    $w('#detailMentor').text = getMentorNameById(student.mentorId);
    
    // Contact information
    $w('#detailParentEmail').text = student.parentEmail || 'N/A';
    $w('#detailParentPhone').text = student.parentPhone || 'N/A';
    $w('#detailAddress').text = student.address || 'N/A';
    $w('#detailEmergencyContact').text = student.emergencyContact || 'N/A';
    
    // Academic information
    $w('#detailAcademicLevel').text = student.academicLevel || 'N/A';
    $w('#detailSpecialNeeds').text = student.specialNeeds || 'None';
    $w('#detailNotes').text = student.notes || 'No notes';
    
    // Profile photo
    if (student.profilePhoto) {
        $w('#detailProfilePhoto').src = student.profilePhoto;
    } else {
        $w('#detailProfilePhoto').src = '/default-avatar.png';
    }
    
    // Set up action buttons
    $w('#editStudentDetailsBtn').onClick(() => {
        hideAllModals();
        openStudentForm(student._id);
    });
    
    $w('#deleteStudentDetailsBtn').onClick(() => {
        confirmDeleteStudent(student._id);
    });
    
    $w('#sendMessageDetailsBtn').onClick(() => {
        openMessageDialog(student._id);
    });
}

function loadStudentProgress(studentId) {
    wixData.query('StudentProgress')
        .eq('studentId', studentId)
        .find()
        .then((results) => {
            displayStudentProgress(results.items);
        })
        .catch((error) => {
            console.error('Error loading student progress:', error);
        });
}

function displayStudentProgress(progressData) {
    if (progressData.length > 0) {
        // Calculate overall progress
        const totalProgress = progressData.reduce((sum, item) => 
            sum + (item.completionPercentage || 0), 0
        );
        const averageProgress = totalProgress / progressData.length;
        
        $w('#overallProgress').value = averageProgress;
        $w('#overallProgressText').text = `${averageProgress.toFixed(1)}%`;
        
        // Display progress details
        $w('#progressRepeater').data = progressData;
    } else {
        $w('#overallProgress').value = 0;
        $w('#overallProgressText').text = '0%';
        $w('#progressRepeater').data = [];
    }
}

function loadStudentCommunication(studentId) {
    wixData.query('StudentCommunication')
        .eq('studentId', studentId)
        .descending('timestamp')
        .limit(10)
        .find()
        .then((results) => {
            displayCommunicationHistory(results.items);
        })
        .catch((error) => {
            console.error('Error loading communication history:', error);
        });
}

function displayCommunicationHistory(communications) {
    $w('#communicationRepeater').data = communications;
}

// ==========================================
// BULK OPERATIONS
// ==========================================

function openBulkActionsMenu() {
    const selectedStudents = getSelectedStudents();
    
    if (selectedStudents.length === 0) {
        showMessage('Please select students first', 'warning');
        return;
    }
    
    $w('#selectedCount').text = `${selectedStudents.length} students selected`;
    $w('#bulkActionsLightbox').show();
}

function getSelectedStudents() {
    // Get selected rows from table or grid
    const selectedRows = $w('#studentsTable').selectedRowIndexes;
    return selectedRows.map(index => studentsData.students[index]);
}

function performBulkDelete() {
    const selectedStudents = getSelectedStudents();
    
    if (selectedStudents.length === 0) {
        showMessage('No students selected', 'warning');
        return;
    }
    
    // Confirm deletion
    const confirmMessage = `Are you sure you want to delete ${selectedStudents.length} students? This action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
        const deletePromises = selectedStudents.map(student => 
            wixData.remove('Students', student._id)
        );
        
        Promise.all(deletePromises)
            .then(() => {
                showMessage(`${selectedStudents.length} students deleted successfully`, 'success');
                hideAllModals();
                refreshData();
            })
            .catch((error) => {
                console.error('Error deleting students:', error);
                showMessage('Error deleting students', 'error');
            });
    }
}

function performBulkStatusUpdate() {
    const selectedStudents = getSelectedStudents();
    const newStatus = $w('#bulkStatusSelect').value;
    
    if (selectedStudents.length === 0 || !newStatus) {
        showMessage('Please select students and status', 'warning');
        return;
    }
    
    const updatePromises = selectedStudents.map(student => 
        wixData.update('Students', { status: newStatus, lastModified: new Date() }, student._id)
    );
    
    Promise.all(updatePromises)
        .then(() => {
            showMessage(`Status updated for ${selectedStudents.length} students`, 'success');
            hideAllModals();
            refreshData();
        })
        .catch((error) => {
            console.error('Error updating student status:', error);
            showMessage('Error updating student status', 'error');
        });
}

function performBulkExport() {
    const selectedStudents = getSelectedStudents();
    
    if (selectedStudents.length === 0) {
        showMessage('No students selected', 'warning');
        return;
    }
    
    exportStudentsToCSV(selectedStudents);
    hideAllModals();
}

function performBulkMessage() {
    const selectedStudents = getSelectedStudents();
    const message = $w('#bulkMessageText').value;
    
    if (selectedStudents.length === 0 || !message) {
        showMessage('Please select students and enter a message', 'warning');
        return;
    }
    
    sendBulkMessage(selectedStudents, message);
}

// ==========================================
// COMMUNICATION FUNCTIONS
// ==========================================

function openMessageDialog(studentId) {
    const student = studentsData.students.find(s => s._id === studentId);
    
    if (student) {
        $w('#messageRecipient').text = `${student.firstName} ${student.lastName}`;
        $w('#messageSubject').value = '';
        $w('#messageContent').value = '';
        
        // Store student ID
        $w('#messageDialog').data = { studentId: studentId };
        
        $w('#messageDialog').show();
    }
}

function sendStudentMessage() {
    const dialogData = $w('#messageDialog').data;
    const subject = $w('#messageSubject').value;
    const content = $w('#messageContent').value;
    
    if (!dialogData || !dialogData.studentId || !subject || !content) {
        showMessage('Please fill in all message fields', 'warning');
        return;
    }
    
    const messageData = {
        studentId: dialogData.studentId,
        type: 'email',
        subject: subject,
        message: content,
        sender: currentUser.email,
        timestamp: new Date(),
        status: 'sent'
    };
    
    // Save message to database
    wixData.insert('StudentCommunication', messageData)
        .then(() => {
            // Send actual email
            return sendEmailToStudent(dialogData.studentId, subject, content);
        })
        .then(() => {
            showMessage('Message sent successfully', 'success');
            $w('#messageDialog').hide();
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            showMessage('Error sending message', 'error');
        });
}

function sendBulkMessage(students, message) {
    const messagePromises = students.map(student => {
        const messageData = {
            studentId: student._id,
            type: 'email',
            subject: 'Bulk Message',
            message: message,
            sender: currentUser.email,
            timestamp: new Date(),
            status: 'sent'
        };
        
        return wixData.insert('StudentCommunication', messageData)
            .then(() => sendEmailToStudent(student._id, 'Bulk Message', message));
    });
    
    Promise.all(messagePromises)
        .then(() => {
            showMessage(`Message sent to ${students.length} students`, 'success');
            hideAllModals();
        })
        .catch((error) => {
            console.error('Error sending bulk message:', error);
            showMessage('Error sending bulk message', 'error');
        });
}

// ==========================================
// IMPORT/EXPORT FUNCTIONS
// ==========================================

function openImportDialog() {
    $w('#importFileUpload').value = '';
    $w('#importPreview').hide();
    $w('#processImportBtn').hide();
    $w('#importDialog').show();
}

function handleFileImport() {
    const file = $w('#importFileUpload').value;
    
    if (file) {
        // Process CSV file
        processCSVFile(file)
            .then((data) => {
                displayImportPreview(data);
                $w('#importPreview').show();
                $w('#processImportBtn').show();
            })
            .catch((error) => {
                console.error('Error processing import file:', error);
                showMessage('Error processing import file', 'error');
            });
    }
}

function processImportedData() {
    const importData = $w('#importDialog').data;
    
    if (!importData || !importData.students) {
        showMessage('No import data available', 'error');
        return;
    }
    
    const students = importData.students;
    const insertPromises = students.map(student => {
        student.studentId = generateStudentId();
        student.createdDate = new Date();
        student.lastModified = new Date();
        return wixData.insert('Students', student);
    });
    
    Promise.all(insertPromises)
        .then(() => {
            showMessage(`${students.length} students imported successfully`, 'success');
            hideAllModals();
            refreshData();
        })
        .catch((error) => {
            console.error('Error importing students:', error);
            showMessage('Error importing students', 'error');
        });
}

function exportStudentsData() {
    const students = studentsData.students;
    exportStudentsToCSV(students);
}

function exportStudentsToCSV(students) {
    const csvData = convertToCSV(students);
    downloadCSV(csvData, 'students-export.csv');
}

function convertToCSV(students) {
    const headers = [
        'Student ID', 'First Name', 'Last Name', 'Email', 'Phone',
        'Date of Birth', 'Enrollment Date', 'Status', 'Course',
        'Mentor', 'Parent Email', 'Parent Phone', 'Address',
        'Emergency Contact', 'Academic Level', 'Special Needs', 'Notes'
    ];
    
    const rows = students.map(student => [
        student.studentId,
        student.firstName,
        student.lastName,
        student.email,
        student.phone || '',
        formatDate(student.dateOfBirth),
        formatDate(student.enrollmentDate),
        student.status,
        getCourseNameById(student.courseId),
        getMentorNameById(student.mentorId),
        student.parentEmail || '',
        student.parentPhone || '',
        student.address || '',
        student.emergencyContact || '',
        student.academicLevel || '',
        student.specialNeeds || '',
        student.notes || ''
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return csvContent;
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
}

function generateStudentId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);
    return `STU-${year}${month}-${timestamp}`;
}

// ==========================================
// ADDITIONAL UTILITY FUNCTIONS
// ==========================================

function getStudentSessionCount(studentId) {
    // This would typically query SessionAttendance collection
    // For now, return a random count
    return Math.floor(Math.random() * 20) + 1;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function buildQueryFilters() {
    const filters = studentsData.filters;
    let query = wixData.query('Students');
    
    // Apply student type filter
    query = query.eq('studentType', currentStudentType);
    
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
    }
    
    // Apply search filter
    if (filters.search) {
        query = query.or(
            wixData.query('Students').contains('firstName', filters.search),
            wixData.query('Students').contains('lastName', filters.search),
            wixData.query('Students').contains('email', filters.search)
        );
    }
    
    return query;
}

function initializeFilters() {
    // Set up status filter
    $w('#statusFilter').options = [
        { label: 'All Status', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Pending', value: 'pending' },
        { label: 'Attention', value: 'attention' },
        { label: 'Inactive', value: 'inactive' }
    ];
    
    // Set up subject filter based on current student type
    updateSubjectFilter();
    
    // Set up search functionality
    $w('#searchInput').onInput(() => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            studentsData.filters.search = $w('#searchInput').value;
            loadStudentsData();
        }, 500);
    });
    
    // Set up filter change handlers
    $w('#statusFilter').onChange(() => {
        studentsData.filters.status = $w('#statusFilter').value;
        loadStudentsData();
    });
}

function updateSubjectFilter() {
    const options = [{ label: 'All Subjects', value: 'all' }];
    const subjectList = subjectOptions[currentStudentType];
    
    subjectList.forEach(subject => {
        options.push({ label: subject, value: subject });
    });
    
    if ($w('#subjectFilter')) {
        $w('#subjectFilter').options = options;
    }
}

let searchTimeout;

// Form event handlers
function setupFormEventHandlers() {
    $w('#submitStudentBtn').onClick(() => submitStudentForm());
    $w('#updateStudentBtn').onClick(() => updateStudentForm());
    $w('#cancelFormBtn').onClick(() => $w('#studentFormLightbox').hide());
    
    // Profile photo upload
    if ($w('#profilePhotoUpload')) {
        $w('#profilePhotoUpload').onChange(() => {
            const file = $w('#profilePhotoUpload').value[0];
            if (file) {
                $w('#profilePhotoPreview').src = file.url;
                $w('#profilePhotoPreview').show();
            }
        });
    }
}

// Student actions
function openStudentDetails(studentId) {
    const student = studentsData.students.find(s => s._id === studentId);
    if (student) {
        // Populate student details modal
        $w('#detailsStudentName').text = `${student.firstName} ${student.lastName}`;
        $w('#detailsStudentEmail').text = student.email;
        $w('#detailsStudentPhone').text = student.phone || 'N/A';
        $w('#detailsStudentStatus').text = student.status;
        $w('#detailsStudentSubject').text = student.subject || 'N/A';
        $w('#detailsEnrollmentDate').text = formatDate(student.enrollmentDate);
        
        // Show modal
        $w('#studentDetailsLightbox').show();
    }
}

function editStudent(studentId) {
    openStudentForm(studentId);
}

function confirmDeleteStudent(studentId) {
    const student = studentsData.students.find(s => s._id === studentId);
    if (student) {
        const confirmMessage = `Are you sure you want to delete ${student.firstName} ${student.lastName}?`;
        
        if (confirm(confirmMessage)) {
            deleteStudent(studentId);
        }
    }
}

function deleteStudent(studentId) {
    wixData.remove('Students', studentId)
        .then(() => {
            showMessage('Student deleted successfully', 'success');
            loadStudentsData();
        })
        .catch((error) => {
            console.error('Error deleting student:', error);
            showMessage('Error deleting student', 'error');
        });
}

function openMessageDialog(studentId) {
    const student = studentsData.students.find(s => s._id === studentId);
    if (student) {
        $w('#messageStudentName').text = `${student.firstName} ${student.lastName}`;
        $w('#messageStudentEmail').text = student.email;
        $w('#messageSubject').value = '';
        $w('#messageContent').value = '';
        
        $w('#messageDialog').data = { studentId: studentId };
        $w('#messageDialog').show();
    }
}

// Import/Export functions
function openImportDialog() {
    $w('#importDialog').show();
}

function exportStudentsData() {
    const csvData = convertToCSV(studentsData.students);
    downloadCSV(csvData, `students_${currentStudentType}_${new Date().toISOString().split('T')[0]}.csv`);
}

function convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Subject/Curriculum', 'Status', 'Enrollment Date'];
    const csvContent = [headers.join(',')];
    
    data.forEach(student => {
        const row = [
            student.firstName || '',
            student.lastName || '',
            student.email || '',
            student.phone || '',
            student.subject || '',
            student.status || '',
            formatDate(student.enrollmentDate)
        ];
        csvContent.push(row.join(','));
    });
    
    return csvContent.join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Bulk actions
function openBulkActionsMenu() {
    $w('#bulkActionsLightbox').show();
}

// Pagination
function navigatePage(direction) {
    // Implementation for pagination
    console.log(`Navigate ${direction}`);
}

function changePageSize() {
    // Implementation for changing page size
    console.log('Change page size');
}

// Update filters
function updateFilters() {
    updateSubjectFilter();
}

function getCourseNameById(courseId) {
    const course = studentsData.courses.find(c => c._id === courseId);
    return course ? course.courseName : 'N/A';
}

function getMentorNameById(mentorId) {
    const mentor = studentsData.mentors.find(m => m._id === mentorId);
    return mentor ? `${mentor.firstName} ${mentor.lastName}` : 'N/A';
}

function getStudentProgress(studentId) {
    // This would typically fetch from StudentProgress collection
    // For now, return a random progress value
    return Math.floor(Math.random() * 100);
}

function getStatusColor(status) {
    const colors = {
        'active': '#28a745',
        'inactive': '#6c757d',
        'graduated': '#007bff',
        'suspended': '#dc3545'
    };
    return colors[status] || '#6c757d';
}

function showMessage(message, type = 'info') {
    $w('#messageText').text = message;
    $w('#messageBar').style.backgroundColor = getMessageColor(type);
    $w('#messageBar').show();
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        $w('#messageBar').hide();
    }, 3000);
}

function getMessageColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    return colors[type] || colors.info;
}

function hideAllModals() {
    $w('#studentFormLightbox').hide();
    $w('#studentDetailsLightbox').hide();
    $w('#bulkActionsLightbox').hide();
    $w('#importDialog').hide();
    $w('#messageDialog').hide();
}

function switchView(viewType) {
    if (viewType === 'table') {
        $w('#studentsTable').show();
        $w('#studentsRepeater').hide();
        $w('#tableViewBtn').style.backgroundColor = '#007bff';
        $w('#gridViewBtn').style.backgroundColor = '#f0f0f0';
    } else {
        $w('#studentsTable').hide();
        $w('#studentsRepeater').show();
        $w('#gridViewBtn').style.backgroundColor = '#007bff';
        $w('#tableViewBtn').style.backgroundColor = '#f0f0f0';
    }
    
    // Store current view
    local.setItem('studentsView', viewType);
}

function getCurrentView() {
    return local.getItem('studentsView') || 'grid';
}

function refreshData() {
    loadStudentsData();
}

// ==========================================
// RESPONSIVE DESIGN
// ==========================================

function setupResponsiveDesign() {
    wixWindow.viewportEnter('mobile', () => {
        adjustForMobile();
    });
    
    wixWindow.viewportEnter('tablet', () => {
        adjustForTablet();
    });
    
    wixWindow.viewportEnter('desktop', () => {
        adjustForDesktop();
    });
}

function adjustForMobile() {
    // Switch to grid view on mobile
    switchView('grid');
    
    // Adjust layout for mobile
    $w('#statisticsGrid').layout = 'singleColumn';
    $w('#actionButtonsContainer').layout = 'vertical';
    $w('#filterContainer').layout = 'vertical';
}

function adjustForTablet() {
    // Adjust layout for tablet
    $w('#statisticsGrid').layout = 'twoColumns';
    $w('#actionButtonsContainer').layout = 'horizontal';
    $w('#filterContainer').layout = 'horizontal';
}

function adjustForDesktop() {
    // Adjust layout for desktop
    $w('#statisticsGrid').layout = 'fourColumns';
    $w('#actionButtonsContainer').layout = 'horizontal';
    $w('#filterContainer').layout = 'horizontal';
}

// ==========================================
// BACKEND CODE (Backend Files)
// ==========================================

/**
 * Backend file: backend/students.jsw
 * Handles student-related backend operations
 */

/*
import { ok, badRequest, serverError } from 'wix-http-functions';
import wixData from 'wix-data';
import { sendEmail } from 'backend/email-service';

export function createStudent(request) {
    const { studentData } = request.body;
    
    return validateStudentData(studentData)
        .then(() => {
            studentData.studentId = generateStudentId();
            studentData.createdDate = new Date();
            return wixData.insert('Students', studentData);
        })
        .then((result) => {
            return sendWelcomeEmail(result);
        })
        .then((result) => {
            return ok({ student: result });
        })
        .catch((error) => {
            console.error('Student creation error:', error);
            return serverError({ error: 'Student creation failed' });
        });
}

export function updateStudent(request) {
    const { studentId, studentData } = request.body;
    
    return validateStudentData(studentData)
        .then(() => {
            studentData.lastModified = new Date();
            return wixData.update('Students', studentData, studentId);
        })
        .then((result) => {
            return ok({ student: result });
        })
        .catch((error) => {
            console.error('Student update error:', error);
            return serverError({ error: 'Student update failed' });
        });
}

export function deleteStudent(request) {
    const { studentId } = request.body;
    
    return wixData.remove('Students', studentId)
        .then(() => {
            return ok({ message: 'Student deleted successfully' });
        })
        .catch((error) => {
            console.error('Student deletion error:', error);
            return serverError({ error: 'Student deletion failed' });
        });
}

function validateStudentData(studentData) {
    return new Promise((resolve, reject) => {
        if (!studentData.firstName || !studentData.lastName) {
            reject(new Error('First name and last name are required'));
        }
        
        if (!studentData.email) {
            reject(new Error('Email is required'));
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(studentData.email)) {
            reject(new Error('Invalid email format'));
        }
        
        resolve();
    });
}

function generateStudentId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);
    return `STU-${year}${month}-${timestamp}`;
}

function sendWelcomeEmail(student) {
    const emailData = {
        to: student.email,
        subject: 'Welcome to Our Program',
        body: generateWelcomeEmailBody(student)
    };
    
    return sendEmail(emailData)
        .then(() => student)
        .catch((error) => {
            console.error('Welcome email error:', error);
            return student; // Don't fail student creation if email fails
        });
}

function generateWelcomeEmailBody(student) {
    return `
        <h2>Welcome ${student.firstName}!</h2>
        <p>We're excited to have you join our program.</p>
        <p>Your student ID is: ${student.studentId}</p>
        <p>Please keep this information for your records.</p>
    `;
}
*/

/**
 * Backend file: backend/communication.jsw
 * Handles student communication
 */

/*
import { ok, serverError } from 'wix-http-functions';
import wixData from 'wix-data';
import { sendEmail } from 'backend/email-service';

export function sendStudentMessage(request) {
    const { studentId, subject, message } = request.body;
    
    return wixData.get('Students', studentId)
        .then((student) => {
            const messageData = {
                studentId: studentId,
                type: 'email',
                subject: subject,
                message: message,
                timestamp: new Date(),
                status: 'sent'
            };
            
            return Promise.all([
                wixData.insert('StudentCommunication', messageData),
                sendEmail({
                    to: student.email,
                    subject: subject,
                    body: message
                })
            ]);
        })
        .then(() => {
            return ok({ message: 'Message sent successfully' });
        })
        .catch((error) => {
            console.error('Message sending error:', error);
            return serverError({ error: 'Failed to send message' });
        });
}

export function sendBulkMessage(request) {
    const { studentIds, subject, message } = request.body;
    
    const messagePromises = studentIds.map(studentId => {
        return sendStudentMessage({ body: { studentId, subject, message } });
    });
    
    return Promise.all(messagePromises)
        .then(() => {
            return ok({ message: `Message sent to ${studentIds.length} students` });
        })
        .catch((error) => {
            console.error('Bulk message error:', error);
            return serverError({ error: 'Failed to send bulk message' });
        });
}
*/

console.log('Wix Students Management Dashboard code loaded successfully');

/**
 * IMPLEMENTATION NOTES:
 * 
 * 1. Database Collections Required:
 *    - Students: Complete student information
 *    - StudentProgress: Academic progress tracking
 *    - StudentCommunication: Message history
 *    - Courses: Available courses
 *    - Mentors: Assigned mentors
 * 
 * 2. Required Wix Elements:
 *    - Statistics cards with appropriate IDs
 *    - Students table/repeater for data display
 *    - Form elements for student registration
 *    - Modal/lightbox components
 *    - Search and filter controls
 *    - Action buttons and navigation
 * 
 * 3. Member Permissions:
 *    - Set up role-based access control
 *    - Configure database permissions
 *    - Implement user authentication
 * 
 * 4. File Upload Configuration:
 *    - Configure media manager
 *    - Set file size limits
 *    - Implement file validation
 * 
 * 5. Email Integration:
 *    - Set up triggered emails
 *    - Configure email templates
 *    - Implement email tracking
 * 
 * 6. Security Considerations:
 *    - Validate all user inputs
 *    - Implement proper access controls
 *    - Protect sensitive student data
 *    - Use HTTPS for all communications
 * 
 * 7. Performance Optimization:
 *    - Implement pagination for large datasets
 *    - Use database indexes for search fields
 *    - Optimize image loading
 *    - Cache frequently accessed data
 * 
 * 8. Testing Requirements:
 *    - Test all CRUD operations
 *    - Verify search and filter functionality
 *    - Test responsive design
 *    - Validate form submissions
 *    - Test bulk operations
 *    - Verify communication features
 */