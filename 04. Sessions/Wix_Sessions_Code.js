/**
 * Wix Sessions Management Dashboard - Complete Code Implementation
 * 
 * This file contains all the Velo code needed to implement the Sessions Management Dashboard
 * including session scheduling, calendar integration, attendance tracking, and reporting.
 * 
 * USAGE INSTRUCTIONS:
 * 1. Copy the frontend code to your Wix page's code panel
 * 2. Copy the backend code to appropriate backend files
 * 3. Configure database collections as specified
 * 4. Set up calendar integration and email services
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
import { timeline } from 'wix-animations';

// Global variables
let currentUser = null;
let sessionsData = {
    sessions: [],
    students: [],
    mentors: [],
    subjects: [],
    statistics: {},
    filters: {
        search: '',
        dateRange: null,
        status: 'all',
        mentor: 'all',
        subject: 'all',
        sessionType: 'all'
    },
    currentView: 'calendar', // calendar, list
    selectedDate: new Date()
};

// Calendar configuration
let calendarConfig = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDate: new Date(),
    viewMode: 'month' // month, week, day
};

// ==========================================
// PAGE INITIALIZATION
// ==========================================

$w.onReady(function () {
    console.log('Sessions Management Dashboard initializing...');
    
    // Check user authentication
    checkUserAuthentication();
    
    // Initialize page
    initializePage();
    
    // Set up event handlers
    setupEventHandlers();
    
    // Load initial data
    loadSessionsData();
    
    // Initialize calendar
    initializeCalendar();
    
    // Set up responsive design
    setupResponsiveDesign();
    
    console.log('Sessions Management Dashboard initialized successfully');
});

// ==========================================
// AUTHENTICATION AND INITIALIZATION
// ==========================================

function checkUserAuthentication() {
    if (wixUsers.currentUser.loggedIn) {
        currentUser = wixUsers.currentUser;
        checkUserPermissions();
    } else {
        wixLocation.to('/login');
    }
}

function checkUserPermissions() {
    wixUsers.currentUser.getRoles()
        .then((roles) => {
            const hasAccess = roles.some(role => 
                ['admin', 'mentor', 'staff', 'scheduler'].includes(role.title.toLowerCase())
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
    $w('#pageTitle').text = 'Sessions Management';
    
    // Initialize date filters
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    $w('#startDatePicker').value = firstDayOfMonth;
    $w('#endDatePicker').value = lastDayOfMonth;
    
    // Hide loading indicators
    $w('#loadingSpinner').hide();
    
    // Initialize view controls
    switchView('calendar');
    
    // Set initial calendar date
    calendarConfig.selectedDate = today;
    sessionsData.selectedDate = today;
}

function setupEventHandlers() {
    // View controls
    $w('#calendarViewBtn').onClick(() => switchView('calendar'));
    $w('#listViewBtn').onClick(() => switchView('list'));
    $w('#refreshBtn').onClick(() => refreshData());
    
    // Calendar navigation
    $w('#prevMonthBtn').onClick(() => navigateCalendar('prev'));
    $w('#nextMonthBtn').onClick(() => navigateCalendar('next'));
    $w('#todayBtn').onClick(() => goToToday());
    $w('#monthViewBtn').onClick(() => setCalendarView('month'));
    $w('#weekViewBtn').onClick(() => setCalendarView('week'));
    $w('#dayViewBtn').onClick(() => setCalendarView('day'));
    
    // Action buttons
    $w('#addSessionBtn').onClick(() => openSessionForm());
    $w('#importSessionsBtn').onClick(() => openImportDialog());
    $w('#exportSessionsBtn').onClick(() => exportSessionsData());
    $w('#bulkActionsBtn').onClick(() => openBulkActionsMenu());
    
    // Search and filter controls
    $w('#searchInput').onInput(() => applySearch());
    $w('#statusFilter').onChange(() => applyStatusFilter());
    $w('#mentorFilter').onChange(() => applyMentorFilter());
    $w('#subjectFilter').onChange(() => applySubjectFilter());
    $w('#sessionTypeFilter').onChange(() => applySessionTypeFilter());
    $w('#startDatePicker').onChange(() => applyDateFilter());
    $w('#endDatePicker').onChange(() => applyDateFilter());
    $w('#clearFiltersBtn').onClick(() => clearAllFilters());
    
    // Session interactions
    $w('#sessionsTable').onRowSelect((event) => handleSessionSelection(event));
    $w('#sessionsRepeater').onItemReady(($item, itemData) => {
        setupSessionItem($item, itemData);
    });
    
    // Calendar interactions
    $w('#calendarGrid').onItemReady(($item, itemData) => {
        setupCalendarDay($item, itemData);
    });
    
    // Modal close buttons
    $w('#closeSessionForm').onClick(() => hideAllModals());
    $w('#closeSessionDetails').onClick(() => hideAllModals());
    $w('#closeBulkActions').onClick(() => hideAllModals());
    $w('#closeImportDialog').onClick(() => hideAllModals());
    $w('#closeAttendanceModal').onClick(() => hideAllModals());
    
    // Form submit buttons
    $w('#submitSessionBtn').onClick(() => submitSessionForm());
    $w('#updateSessionBtn').onClick(() => updateSessionForm());
    $w('#deleteSessionBtn').onClick(() => deleteSession());
    $w('#duplicateSessionBtn').onClick(() => duplicateSession());
    
    // Attendance tracking
    $w('#markAttendanceBtn').onClick(() => openAttendanceModal());
    $w('#saveAttendanceBtn').onClick(() => saveAttendance());
    $w('#bulkPresentBtn').onClick(() => markAllPresent());
    $w('#bulkAbsentBtn').onClick(() => markAllAbsent());
    
    // Session actions
    $w('#startSessionBtn').onClick(() => startSession());
    $w('#endSessionBtn').onClick(() => endSession());
    $w('#cancelSessionBtn').onClick(() => cancelSession());
    $w('#rescheduleSessionBtn').onClick(() => rescheduleSession());
    
    // File upload
    $w('#materialsUpload').onChange(() => handleMaterialsUpload());
    $w('#uploadMaterialsBtn').onClick(() => uploadSessionMaterials());
    
    // Recurring sessions
    $w('#recurringCheckbox').onChange(() => toggleRecurringOptions());
    $w('#createRecurringBtn').onClick(() => createRecurringSessions());
    
    // Notifications
    $w('#sendReminderBtn').onClick(() => sendSessionReminder());
    $w('#notifyChangesBtn').onClick(() => notifySessionChanges());
}

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

function loadSessionsData() {
    $w('#loadingSpinner').show();
    
    Promise.all([
        loadSessions(),
        loadStudents(),
        loadMentors(),
        loadSubjects(),
        calculateStatistics()
    ])
    .then(() => {
        updateDashboard();
        $w('#loadingSpinner').hide();
    })
    .catch((error) => {
        console.error('Error loading sessions data:', error);
        showMessage('Error loading sessions data', 'error');
        $w('#loadingSpinner').hide();
    });
}

function loadSessions() {
    const filters = buildQueryFilters();
    
    return wixData.query('Import86')
        .limit(100)
        .descending('scheduledDate')
        .find()
        .then((results) => {
            // 将Import86集合的数据映射为Sessions格式
            sessionsData.sessions = results.items.map(item => ({
                _id: item._id,
                sessionId: item.scheduleId,
                title: item.courseId, // 使用课程名称作为标题
                description: item.agenda || "", // 使用议程作为描述
                adminId: item.instructorId, // 使用讲师ID作为管理员ID
                studentId: "", // Import86没有单个学生ID字段
                students: [], // Import86没有学生列表字段
                courseId: item.courseId,
                subjectId: item.subject, // 使用科目作为科目ID
                sessionType: item.courseType,
                status: item.status,
                scheduledDate: item.scheduledDate,
                startTime: item.startTime,
                endTime: item.endTime,
                actualStartTime: null, // Import86没有实际开始时间字段
                actualEndTime: null, // Import86没有实际结束时间字段
                location: "", // Import86没有地点字段
                meetingLink: item.onlineClassroomLink,
                agenda: item.agenda,
                materials: item.courseMaterials || [],
                homework: "", // Import86没有作业字段
                notes: "", // Import86没有笔记字段
                rating: 0, // Import86没有评分字段
                feedback: "", // Import86没有反馈字段
                cost: 0, // Import86没有费用字段
                paymentStatus: "", // Import86没有支付状态字段
                _createdDate: item._createdDate,
                _updatedDate: item._updatedDate
            }));
            updateSessionsDisplay();
            updateCalendarDisplay();
            return sessionsData.sessions;
        });
}

function loadStudents() {
    return wixData.query('Students')
        .find()
        .then((results) => {
            sessionsData.students = results.items;
            updateStudentFilter();
            return results.items;
        });
}

function loadMentors() {
    return wixData.query('Mentors')
        .find()
        .then((results) => {
            sessionsData.mentors = results.items;
            updateMentorFilter();
            return results.items;
        });
}

function loadSubjects() {
    return wixData.query('Subjects')
        .find()
        .then((results) => {
            sessionsData.subjects = results.items;
            updateSubjectFilter();
            return results.items;
        });
}

function calculateStatistics() {
    const sessions = sessionsData.sessions || [];
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    // Calculate basic statistics
    const totalSessions = sessions.length;
    const todaySessions = sessions.filter(s => {
        const sessionDate = new Date(s.scheduledDate);
        return sessionDate >= startOfDay && sessionDate <= endOfDay;
    }).length;
    
    const upcomingSessions = sessions.filter(s => {
        const sessionDate = new Date(s.scheduledDate);
        return sessionDate > today && s.status === 'scheduled';
    }).length;
    
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    
    // Calculate attendance statistics
    const sessionsWithAttendance = sessions.filter(s => s.attendance && s.attendance.length > 0);
    const totalAttendanceRecords = sessionsWithAttendance.reduce((sum, s) => sum + s.attendance.length, 0);
    const presentRecords = sessionsWithAttendance.reduce((sum, s) => 
        sum + s.attendance.filter(a => a.status === 'present').length, 0
    );
    const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;
    
    sessionsData.statistics = {
        totalSessions,
        todaySessions,
        upcomingSessions,
        completionRate,
        attendanceRate,
        completedSessions
    };
    
    updateStatisticsCards();
}

// ==========================================
// UI UPDATE FUNCTIONS
// ==========================================

function updateDashboard() {
    updateStatisticsCards();
    updateSessionsDisplay();
    updateCalendarDisplay();
    updateFilters();
}

function updateStatisticsCards() {
    const stats = sessionsData.statistics;
    
    // Update total sessions card
    $w('#totalSessionsValue').text = (stats.totalSessions || 0).toString();
    
    // Update today's sessions card
    $w('#todaySessionsValue').text = (stats.todaySessions || 0).toString();
    
    // Update upcoming sessions card
    $w('#upcomingSessionsValue').text = (stats.upcomingSessions || 0).toString();
    
    // Update completion rate card
    $w('#completionRateValue').text = `${(stats.completionRate || 0).toFixed(1)}%`;
    
    // Update attendance rate (if available)
    if ($w('#attendanceRateValue')) {
        $w('#attendanceRateValue').text = `${(stats.attendanceRate || 0).toFixed(1)}%`;
    }
}

function updateSessionsDisplay() {
    if (sessionsData.currentView === 'list') {
        updateSessionsList();
    } else {
        updateCalendarDisplay();
    }
}

function updateSessionsList() {
    const tableData = sessionsData.sessions.map(session => ({
        _id: session._id,
        sessionId: session.sessionId,
        title: session.title,
        student: getStudentNameById(session.studentId),
        mentor: getMentorNameById(session.mentorId),
        subject: getSubjectNameById(session.subjectId),
        date: formatDate(session.scheduledDate),
        time: formatTime(session.startTime, session.endTime),
        status: session.status,
        type: session.sessionType,
        location: session.location || 'Virtual'
    }));
    
    $w('#sessionsTable').rows = tableData;
    
    // Update repeater for card view
    $w('#sessionsRepeater').data = sessionsData.sessions;
}

function setupSessionItem($item, itemData) {
    // Set session title
    $item('#sessionTitle').text = itemData.title;
    
    // Set session details
    $item('#sessionStudent').text = getStudentNameById(itemData.studentId);
    $item('#sessionMentor').text = getMentorNameById(itemData.mentorId);
    $item('#sessionSubject').text = getSubjectNameById(itemData.subjectId);
    
    // Set date and time
    $item('#sessionDate').text = formatDate(itemData.scheduledDate);
    $item('#sessionTime').text = formatTime(itemData.startTime, itemData.endTime);
    
    // Set status with styling
    $item('#sessionStatus').text = itemData.status;
    $item('#sessionStatus').style.backgroundColor = getStatusColor(itemData.status);
    
    // Set session type
    $item('#sessionType').text = itemData.sessionType;
    
    // Set location
    $item('#sessionLocation').text = itemData.location || 'Virtual';
    
    // Set up action buttons
    $item('#viewSessionBtn').onClick(() => openSessionDetails(itemData._id));
    $item('#editSessionBtn').onClick(() => editSession(itemData._id));
    $item('#deleteSessionBtn').onClick(() => confirmDeleteSession(itemData._id));
    $item('#attendanceBtn').onClick(() => openAttendanceModal(itemData._id));
    
    // Show/hide buttons based on status
    if (itemData.status === 'scheduled') {
        $item('#startSessionBtn').show();
        $item('#startSessionBtn').onClick(() => startSession(itemData._id));
    } else {
        $item('#startSessionBtn').hide();
    }
    
    if (itemData.status === 'in-progress') {
        $item('#endSessionBtn').show();
        $item('#endSessionBtn').onClick(() => endSession(itemData._id));
    } else {
        $item('#endSessionBtn').hide();
    }
}

// ==========================================
// CALENDAR FUNCTIONS
// ==========================================

function initializeCalendar() {
    generateCalendarGrid();
    updateCalendarHeader();
    updateCalendarDisplay();
}

function generateCalendarGrid() {
    const year = calendarConfig.currentYear;
    const month = calendarConfig.currentMonth;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Generate calendar data
    const calendarData = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarData.push({
            date: null,
            isCurrentMonth: false,
            sessions: []
        });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const daySessions = getSessionsForDate(currentDate);
        
        calendarData.push({
            date: currentDate,
            day: day,
            isCurrentMonth: true,
            isToday: isToday(currentDate),
            isSelected: isSameDate(currentDate, calendarConfig.selectedDate),
            sessions: daySessions
        });
    }
    
    // Fill remaining cells to complete the grid
    while (calendarData.length < 42) {
        calendarData.push({
            date: null,
            isCurrentMonth: false,
            sessions: []
        });
    }
    
    $w('#calendarGrid').data = calendarData;
}

function setupCalendarDay($item, itemData) {
    if (!itemData.isCurrentMonth) {
        $item('#dayNumber').hide();
        $item('#dayContainer').style.backgroundColor = '#f8f9fa';
        return;
    }
    
    // Set day number
    $item('#dayNumber').text = itemData.day.toString();
    $item('#dayNumber').show();
    
    // Style current day
    if (itemData.isToday) {
        $item('#dayContainer').style.backgroundColor = '#e3f2fd';
        $item('#dayNumber').style.fontWeight = 'bold';
    }
    
    // Style selected day
    if (itemData.isSelected) {
        $item('#dayContainer').style.backgroundColor = '#2196f3';
        $item('#dayNumber').style.color = 'white';
    }
    
    // Display sessions for this day
    if (itemData.sessions.length > 0) {
        $item('#sessionsIndicator').show();
        $item('#sessionCount').text = itemData.sessions.length.toString();
        
        // Show first few sessions
        const displaySessions = itemData.sessions.slice(0, 3);
        $item('#daySessionsRepeater').data = displaySessions;
    } else {
        $item('#sessionsIndicator').hide();
        $item('#daySessionsRepeater').data = [];
    }
    
    // Click handler for day selection
    $item('#dayContainer').onClick(() => {
        selectCalendarDate(itemData.date);
    });
    
    // Double-click to create new session
    $item('#dayContainer').onDblClick(() => {
        openSessionForm(itemData.date);
    });
}

function updateCalendarHeader() {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthYear = `${monthNames[calendarConfig.currentMonth]} ${calendarConfig.currentYear}`;
    $w('#calendarHeader').text = monthYear;
}

function updateCalendarDisplay() {
    if (sessionsData.currentView === 'calendar') {
        generateCalendarGrid();
        updateCalendarHeader();
    }
}

function navigateCalendar(direction) {
    if (direction === 'prev') {
        if (calendarConfig.currentMonth === 0) {
            calendarConfig.currentMonth = 11;
            calendarConfig.currentYear--;
        } else {
            calendarConfig.currentMonth--;
        }
    } else if (direction === 'next') {
        if (calendarConfig.currentMonth === 11) {
            calendarConfig.currentMonth = 0;
            calendarConfig.currentYear++;
        } else {
            calendarConfig.currentMonth++;
        }
    }
    
    updateCalendarDisplay();
}

function goToToday() {
    const today = new Date();
    calendarConfig.currentMonth = today.getMonth();
    calendarConfig.currentYear = today.getFullYear();
    calendarConfig.selectedDate = today;
    
    updateCalendarDisplay();
}

function selectCalendarDate(date) {
    calendarConfig.selectedDate = date;
    sessionsData.selectedDate = date;
    
    // Update calendar display
    generateCalendarGrid();
    
    // Show sessions for selected date
    showSessionsForDate(date);
}

function getSessionsForDate(date) {
    return sessionsData.sessions.filter(session => {
        const sessionDate = new Date(session.scheduledDate);
        return isSameDate(sessionDate, date);
    });
}

function showSessionsForDate(date) {
    const daySessions = getSessionsForDate(date);
    
    if (daySessions.length > 0) {
        $w('#daySessionsList').data = daySessions;
        $w('#daySessionsPanel').show();
        $w('#selectedDateTitle').text = formatDate(date);
    } else {
        $w('#daySessionsPanel').hide();
    }
}

// ==========================================
// SESSION FORM FUNCTIONS
// ==========================================

function openSessionForm(selectedDate = null, sessionId = null) {
    if (sessionId) {
        // Edit mode
        loadSessionForEdit(sessionId);
        $w('#sessionFormTitle').text = 'Edit Session';
        $w('#submitSessionBtn').hide();
        $w('#updateSessionBtn').show();
        $w('#deleteSessionBtn').show();
        $w('#duplicateSessionBtn').show();
    } else {
        // Add mode
        clearSessionForm();
        $w('#sessionFormTitle').text = 'Create New Session';
        $w('#submitSessionBtn').show();
        $w('#updateSessionBtn').hide();
        $w('#deleteSessionBtn').hide();
        $w('#duplicateSessionBtn').hide();
        
        // Pre-fill date if provided
        if (selectedDate) {
            $w('#sessionDatePicker').value = selectedDate;
        }
    }
    
    // Load form dependencies
    loadFormDependencies();
    
    // Show modal
    $w('#sessionFormLightbox').show();
}

function loadFormDependencies() {
    // Populate student dropdown
    const studentOptions = sessionsData.students.map(student => ({
        label: `${student.firstName} ${student.lastName}`,
        value: student._id
    }));
    $w('#studentSelect').options = studentOptions;
    
    // Populate mentor dropdown
    const mentorOptions = sessionsData.mentors.map(mentor => ({
        label: `${mentor.firstName} ${mentor.lastName}`,
        value: mentor._id
    }));
    $w('#mentorSelect').options = mentorOptions;
    
    // Populate subject dropdown
    const subjectOptions = sessionsData.subjects.map(subject => ({
        label: subject.subjectName,
        value: subject._id
    }));
    $w('#subjectSelect').options = subjectOptions;
    
    // Set session type options
    $w('#sessionTypeSelect').options = [
        { label: 'Individual', value: 'individual' },
        { label: 'Group', value: 'group' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Assessment', value: 'assessment' }
    ];
    
    // Set status options
    $w('#statusSelect').options = [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' }
    ];
}

function loadSessionForEdit(sessionId) {
    const session = sessionsData.sessions.find(s => s._id === sessionId);
    
    if (session) {
        // Populate form fields
        $w('#sessionTitleInput').value = session.title || '';
        $w('#sessionDescriptionInput').value = session.description || '';
        $w('#studentSelect').value = session.studentId || '';
        $w('#mentorSelect').value = session.mentorId || '';
        $w('#subjectSelect').value = session.subjectId || '';
        $w('#sessionTypeSelect').value = session.sessionType || 'individual';
        $w('#statusSelect').value = session.status || 'scheduled';
        $w('#sessionDatePicker').value = session.scheduledDate || new Date();
        $w('#startTimePicker').value = session.startTime || '';
        $w('#endTimePicker').value = session.endTime || '';
        $w('#locationInput').value = session.location || '';
        $w('#meetingLinkInput').value = session.meetingLink || '';
        $w('#maxParticipantsInput').value = session.maxParticipants || 1;
        $w('#costInput').value = session.cost || 0;
        $w('#sessionNotesInput').value = session.sessionNotes || '';
        
        // Handle recurring sessions
        if (session.isRecurring) {
            $w('#recurringCheckbox').checked = true;
            $w('#recurrencePatternSelect').value = session.recurrencePattern || 'weekly';
            $w('#recurrenceEndPicker').value = session.recurrenceEnd || null;
            toggleRecurringOptions();
        }
        
        // Store session ID for update
        $w('#sessionFormLightbox').data = { sessionId: sessionId };
    }
}

function clearSessionForm() {
    // Clear all form fields
    $w('#sessionTitleInput').value = '';
    $w('#sessionDescriptionInput').value = '';
    $w('#studentSelect').value = '';
    $w('#mentorSelect').value = '';
    $w('#subjectSelect').value = '';
    $w('#sessionTypeSelect').value = 'individual';
    $w('#statusSelect').value = 'scheduled';
    $w('#sessionDatePicker').value = new Date();
    $w('#startTimePicker').value = '';
    $w('#endTimePicker').value = '';
    $w('#locationInput').value = '';
    $w('#meetingLinkInput').value = '';
    $w('#maxParticipantsInput').value = 1;
    $w('#costInput').value = 0;
    $w('#sessionNotesInput').value = '';
    
    // Clear recurring options
    $w('#recurringCheckbox').checked = false;
    $w('#recurrencePatternSelect').value = 'weekly';
    $w('#recurrenceEndPicker').value = null;
    toggleRecurringOptions();
    
    // Clear stored data
    $w('#sessionFormLightbox').data = null;
}

function submitSessionForm() {
    const sessionData = collectFormData();
    
    if (validateSessionData(sessionData)) {
        // Generate session ID
        sessionData.sessionId = generateSessionId();
        sessionData.createdDate = new Date();
        sessionData.lastModified = new Date();
        sessionData.createdBy = currentUser.email;
        
        // Check for conflicts
        checkSessionConflicts(sessionData)
            .then((hasConflicts) => {
                if (hasConflicts) {
                    const confirmCreate = confirm('There are scheduling conflicts. Do you want to create the session anyway?');
                    if (!confirmCreate) {
                        return;
                    }
                }
                
                return createSession(sessionData);
            })
            .then((result) => {
                if (result) {
                    showMessage('Session created successfully', 'success');
                    hideAllModals();
                    refreshData();
                    
                    // Send notifications
                    sendSessionNotifications(result, 'created');
                }
            })
            .catch((error) => {
                console.error('Error creating session:', error);
                showMessage('Error creating session', 'error');
            });
    }
}

function updateSessionForm() {
    const formData = $w('#sessionFormLightbox').data;
    const sessionData = collectFormData();
    
    if (formData && formData.sessionId && validateSessionData(sessionData)) {
        sessionData.lastModified = new Date();
        
        // 先查询Import86集合中对应的记录
        wixData.query('Import86')
            .eq('scheduleId', formData.sessionId)
            .find()
            .then((results) => {
                if (results.items.length > 0) {
                    const import86Item = results.items[0];
                    
                    // 将Sessions格式的数据转换为Import86格式
                    const import86Data = {
                        _id: import86Item._id,
                        scheduleId: sessionData.sessionId,
                        class_id: sessionData.classId || "",
                        courseId: sessionData.courseId || sessionData.title,
                        subject: sessionData.subjectId,
                        instructorId: sessionData.adminId,
                        scheduledDate: sessionData.scheduledDate,
                        startTime: sessionData.startTime,
                        endTime: sessionData.endTime,
                        duration: calculateDuration(sessionData.startTime, sessionData.endTime),
                        courseType: sessionData.sessionType,
                        maxStudents: sessionData.maxStudents || 1,
                        enrolledStudents: sessionData.students ? sessionData.students.length : 0,
                        status: sessionData.status,
                        onlineClassroomLink: sessionData.meetingLink,
                        courseMaterials: sessionData.materials || [],
                        agenda: sessionData.description || "",
                        _updatedDate: new Date()
                    };
                    
                    return wixData.update('Import86', import86Data);
                } else {
                    // 如果在Import86中找不到对应记录，则创建新记录
                    const import86Data = {
                        scheduleId: sessionData.sessionId,
                        class_id: sessionData.classId || "",
                        courseId: sessionData.courseId || sessionData.title,
                        subject: sessionData.subjectId,
                        instructorId: sessionData.adminId,
                        scheduledDate: sessionData.scheduledDate,
                        startTime: sessionData.startTime,
                        endTime: sessionData.endTime,
                        duration: calculateDuration(sessionData.startTime, sessionData.endTime),
                        courseType: sessionData.sessionType,
                        maxStudents: sessionData.maxStudents || 1,
                        enrolledStudents: sessionData.students ? sessionData.students.length : 0,
                        status: sessionData.status,
                        onlineClassroomLink: sessionData.meetingLink,
                        courseMaterials: sessionData.materials || [],
                        agenda: sessionData.description || "",
                        _createdDate: new Date(),
                        _updatedDate: new Date()
                    };
                    
                    return wixData.insert('Import86', import86Data);
                }
            })
            .then((result) => {
                showMessage('Session updated successfully', 'success');
                hideAllModals();
                refreshData();
                
                // 构建一个与原Sessions格式兼容的结果对象，用于发送通知
                const compatibleResult = {
                    _id: result._id,
                    sessionId: result.scheduleId,
                    title: result.courseId,
                    description: result.agenda,
                    adminId: result.instructorId,
                    subjectId: result.subject,
                    sessionType: result.courseType,
                    status: result.status,
                    scheduledDate: result.scheduledDate,
                    startTime: result.startTime,
                    endTime: result.endTime,
                    meetingLink: result.onlineClassroomLink,
                    materials: result.courseMaterials
                };
                
                // Send update notifications
                sendSessionNotifications(compatibleResult, 'updated');
            })
            .catch((error) => {
                console.error('Error updating session:', error);
                showMessage('Error updating session', 'error');
            });
    }
}

function collectFormData() {
    return {
        title: $w('#sessionTitleInput').value,
        description: $w('#sessionDescriptionInput').value,
        studentId: $w('#studentSelect').value,
        mentorId: $w('#mentorSelect').value,
        subjectId: $w('#subjectSelect').value,
        sessionType: $w('#sessionTypeSelect').value,
        status: $w('#statusSelect').value,
        scheduledDate: $w('#sessionDatePicker').value,
        startTime: $w('#startTimePicker').value,
        endTime: $w('#endTimePicker').value,
        location: $w('#locationInput').value,
        meetingLink: $w('#meetingLinkInput').value,
        maxParticipants: parseInt($w('#maxParticipantsInput').value) || 1,
        cost: parseFloat($w('#costInput').value) || 0,
        sessionNotes: $w('#sessionNotesInput').value,
        isRecurring: $w('#recurringCheckbox').checked,
        recurrencePattern: $w('#recurrencePatternSelect').value,
        recurrenceEnd: $w('#recurrenceEndPicker').value
    };
}

function validateSessionData(data) {
    // Required field validation
    if (!data.title) {
        showMessage('Session title is required', 'error');
        return false;
    }
    
    if (!data.studentId) {
        showMessage('Please select a student', 'error');
        return false;
    }
    
    if (!data.mentorId) {
        showMessage('Please select a mentor', 'error');
        return false;
    }
    
    if (!data.subjectId) {
        showMessage('Please select a subject', 'error');
        return false;
    }
    
    if (!data.scheduledDate) {
        showMessage('Session date is required', 'error');
        return false;
    }
    
    if (!data.startTime || !data.endTime) {
        showMessage('Start time and end time are required', 'error');
        return false;
    }
    
    // Time validation
    const startTime = new Date(`2000-01-01 ${data.startTime}`);
    const endTime = new Date(`2000-01-01 ${data.endTime}`);
    
    if (endTime <= startTime) {
        showMessage('End time must be after start time', 'error');
        return false;
    }
    
    // Recurring session validation
    if (data.isRecurring && !data.recurrenceEnd) {
        showMessage('Please set an end date for recurring sessions', 'error');
        return false;
    }
    
    return true;
}

function createSession(sessionData) {
    if (sessionData.isRecurring) {
        return createRecurringSessions(sessionData);
    } else {
        // 将Sessions格式的数据转换为Import86格式
        const import86Data = {
            scheduleId: sessionData.sessionId,
            class_id: sessionData.classId || "",
            courseId: sessionData.courseId || sessionData.title,
            subject: sessionData.subjectId,
            instructorName: "", // 需要根据instructorId查询获取
            instructorId: sessionData.adminId,
            scheduledDate: sessionData.scheduledDate,
            startTime: sessionData.startTime,
            endTime: sessionData.endTime,
            duration: calculateDuration(sessionData.startTime, sessionData.endTime),
            courseType: sessionData.sessionType,
            maxStudents: sessionData.maxStudents || 1,
            enrolledStudents: sessionData.students ? sessionData.students.length : 0,
            status: sessionData.status,
            onlineClassroomLink: sessionData.meetingLink,
            courseMaterials: sessionData.materials || [],
            agenda: sessionData.description || "",
            prerequisites: [],
            _createdDate: new Date(),
            _updatedDate: new Date()
        };
        return wixData.insert('Import86', import86Data);
    }
}

// 计算课程时长（分钟）
function calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.round((end - start) / 60000); // 转换为分钟
}

function createRecurringSessions(sessionData) {
    const sessions = generateRecurringSessions(sessionData);
    
    const insertPromises = sessions.map(session => {
        // 将Sessions格式的数据转换为Import86格式
        const import86Data = {
            scheduleId: session.sessionId,
            class_id: session.classId || "",
            courseId: session.courseId || session.title,
            subject: session.subjectId,
            instructorName: "", // 需要根据instructorId查询获取
            instructorId: session.adminId,
            scheduledDate: session.scheduledDate,
            startTime: session.startTime,
            endTime: session.endTime,
            duration: calculateDuration(session.startTime, session.endTime),
            courseType: session.sessionType,
            maxStudents: session.maxStudents || 1,
            enrolledStudents: session.students ? session.students.length : 0,
            status: session.status,
            onlineClassroomLink: session.meetingLink,
            courseMaterials: session.materials || [],
            agenda: session.description || "",
            prerequisites: [],
            _createdDate: new Date(),
            _updatedDate: new Date()
        };
        return wixData.insert('Import86', import86Data);
    });
    
    return Promise.all(insertPromises);
}

function generateRecurringSessions(baseSession) {
    const sessions = [];
    const startDate = new Date(baseSession.scheduledDate);
    const endDate = new Date(baseSession.recurrenceEnd);
    const pattern = baseSession.recurrencePattern;
    
    let currentDate = new Date(startDate);
    let sessionCount = 0;
    
    while (currentDate <= endDate && sessionCount < 52) { // Limit to 52 sessions
        const session = { ...baseSession };
        session.scheduledDate = new Date(currentDate);
        session.sessionId = generateSessionId();
        session.createdDate = new Date();
        session.lastModified = new Date();
        
        sessions.push(session);
        sessionCount++;
        
        // Calculate next date based on pattern
        switch (pattern) {
            case 'daily':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'biweekly':
                currentDate.setDate(currentDate.getDate() + 14);
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
            default:
                break;
        }
    }
    
    return sessions;
}

function checkSessionConflicts(sessionData) {
    const sessionDate = new Date(sessionData.scheduledDate);
    const startTime = new Date(`${sessionDate.toDateString()} ${sessionData.startTime}`);
    const endTime = new Date(`${sessionDate.toDateString()} ${sessionData.endTime}`);
    
    return wixData.query('Import86')
        .eq('instructorId', sessionData.mentorId) // 使用instructorId替代mentorId
        .eq('scheduledDate', sessionDate)
        .ne('status', 'cancelled')
        .find()
        .then((results) => {
            const conflicts = results.items.filter(session => {
                const sessionStart = new Date(`${sessionDate.toDateString()} ${session.startTime}`);
                const sessionEnd = new Date(`${sessionDate.toDateString()} ${session.endTime}`);
                
                return (startTime < sessionEnd && endTime > sessionStart);
            });
            
            return conflicts.length > 0;
        });
}

// ==========================================
// ATTENDANCE TRACKING
// ==========================================

function openAttendanceModal(sessionId) {
    const session = sessionsData.sessions.find(s => s._id === sessionId);
    
    if (session) {
        $w('#attendanceSessionTitle').text = session.title;
        $w('#attendanceSessionDate').text = formatDate(session.scheduledDate);
        
        // Load attendance data
        loadAttendanceData(sessionId);
        
        // Store session ID
        $w('#attendanceModal').data = { sessionId: sessionId };
        
        $w('#attendanceModal').show();
    }
}

function loadAttendanceData(sessionId) {
    wixData.query('SessionAttendance')
        .eq('sessionId', sessionId)
        .find()
        .then((results) => {
            const attendanceRecords = results.items;
            
            // Get session participants
            const session = sessionsData.sessions.find(s => s._id === sessionId);
            const participants = getSessionParticipants(session);
            
            // Create attendance list
            const attendanceData = participants.map(participant => {
                const existingRecord = attendanceRecords.find(r => r.studentId === participant._id);
                
                return {
                    studentId: participant._id,
                    studentName: `${participant.firstName} ${participant.lastName}`,
                    status: existingRecord ? existingRecord.attendanceStatus : 'absent',
                    checkInTime: existingRecord ? existingRecord.checkInTime : null,
                    checkOutTime: existingRecord ? existingRecord.checkOutTime : null,
                    notes: existingRecord ? existingRecord.notes : ''
                };
            });
            
            $w('#attendanceRepeater').data = attendanceData;
        })
        .catch((error) => {
            console.error('Error loading attendance data:', error);
        });
}

function getSessionParticipants(session) {
    if (session.sessionType === 'individual') {
        const student = sessionsData.students.find(s => s._id === session.studentId);
        return student ? [student] : [];
    } else {
        // For group sessions, you might have a separate participants field
        // This is a simplified implementation
        return sessionsData.students.filter(s => 
            session.participants && session.participants.includes(s._id)
        );
    }
}

function saveAttendance() {
    const modalData = $w('#attendanceModal').data;
    const attendanceData = $w('#attendanceRepeater').data;
    
    if (!modalData || !modalData.sessionId) {
        showMessage('Session ID not found', 'error');
        return;
    }
    
    const savePromises = attendanceData.map(record => {
        const attendanceRecord = {
            sessionId: modalData.sessionId,
            studentId: record.studentId,
            attendanceStatus: record.status,
            checkInTime: record.checkInTime,
            checkOutTime: record.checkOutTime,
            notes: record.notes,
            recordedBy: currentUser.email,
            timestamp: new Date()
        };
        
        // Check if record exists
        return wixData.query('SessionAttendance')
            .eq('sessionId', modalData.sessionId)
            .eq('studentId', record.studentId)
            .find()
            .then((results) => {
                if (results.items.length > 0) {
                    // Update existing record
                    return wixData.update('SessionAttendance', attendanceRecord, results.items[0]._id);
                } else {
                    // Create new record
                    return wixData.insert('SessionAttendance', attendanceRecord);
                }
            });
    });
    
    Promise.all(savePromises)
        .then(() => {
            showMessage('Attendance saved successfully', 'success');
            $w('#attendanceModal').hide();
            refreshData();
        })
        .catch((error) => {
            console.error('Error saving attendance:', error);
            showMessage('Error saving attendance', 'error');
        });
}

function markAllPresent() {
    const attendanceData = $w('#attendanceRepeater').data;
    const updatedData = attendanceData.map(record => ({
        ...record,
        status: 'present',
        checkInTime: new Date()
    }));
    
    $w('#attendanceRepeater').data = updatedData;
}

function markAllAbsent() {
    const attendanceData = $w('#attendanceRepeater').data;
    const updatedData = attendanceData.map(record => ({
        ...record,
        status: 'absent',
        checkInTime: null,
        checkOutTime: null
    }));
    
    $w('#attendanceRepeater').data = updatedData;
}

// ==========================================
// SESSION ACTIONS
// ==========================================

function startSession(sessionId) {
    // 先查询Import86集合中对应的记录
    wixData.query('Import86')
        .eq('scheduleId', sessionId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const import86Item = results.items[0];
                
                // 更新Import86集合中的记录
                const updateData = {
                    _id: import86Item._id,
                    status: 'in-progress',
                    _updatedDate: new Date()
                };
                
                return wixData.update('Import86', updateData);
            } else {
                throw new Error('Session not found');
            }
        })
        .then(() => {
            showMessage('Session started', 'success');
            refreshData();
            
            // Send notifications
            sendSessionNotifications({ _id: sessionId }, 'started');
        })
        .catch((error) => {
            console.error('Error starting session:', error);
            showMessage('Error starting session', 'error');
        });
}

function endSession(sessionId) {
    // 先查询Import86集合中对应的记录
    wixData.query('Import86')
        .eq('scheduleId', sessionId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const import86Item = results.items[0];
                
                // 更新Import86集合中的记录
                const updateData = {
                    _id: import86Item._id,
                    status: 'completed',
                    _updatedDate: new Date()
                };
                
                return wixData.update('Import86', updateData);
            } else {
                throw new Error('Session not found');
            }
        })
        .then(() => {
            showMessage('Session completed', 'success');
            refreshData();
            
            // Open feedback form
            openFeedbackForm(sessionId);
        })
        .catch((error) => {
            console.error('Error ending session:', error);
            showMessage('Error ending session', 'error');
        });
}

function cancelSession(sessionId) {
    const reason = prompt('Please provide a reason for cancellation:');
    
    if (reason !== null) {
        // 先查询Import86集合中对应的记录
        wixData.query('Import86')
            .eq('scheduleId', sessionId)
            .find()
            .then((results) => {
                if (results.items.length > 0) {
                    const import86Item = results.items[0];
                    
                    // 更新Import86集合中的记录
                    const updateData = {
                        _id: import86Item._id,
                        status: 'cancelled',
                        cancellationReason: reason,
                        cancelledBy: currentUser.email,
                        cancelledDate: new Date(),
                        _updatedDate: new Date()
                    };
                    
                    return wixData.update('Import86', updateData);
                } else {
                    throw new Error('Session not found');
                }
            })
            .then(() => {
                showMessage('Session cancelled', 'success');
                refreshData();
                
                // Send cancellation notifications
                sendSessionNotifications({ _id: sessionId }, 'cancelled');
            })
            .catch((error) => {
                console.error('Error cancelling session:', error);
                showMessage('Error cancelling session', 'error');
            });
    }
}

function rescheduleSession(sessionId) {
    // Open session form in edit mode for rescheduling
    openSessionForm(null, sessionId);
}

function duplicateSession(sessionId) {
    // 先查询Import86集合中对应的记录
    wixData.query('Import86')
        .eq('scheduleId', sessionId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const session = results.items[0];
                
                // 创建新的Import86记录
                const duplicateData = { ...session };
                delete duplicateData._id;
                const newSessionId = generateSessionId();
                duplicateData.scheduleId = newSessionId;
                duplicateData.courseId = `${session.courseId} (Copy)`;
                duplicateData.status = 'scheduled';
                duplicateData._createdDate = new Date();
                duplicateData._updatedDate = new Date();
                
                return wixData.insert('Import86', duplicateData);
            } else {
                throw new Error('Session not found');
            }
        })
        .then(() => {
            showMessage('Session duplicated successfully', 'success');
            refreshData();
        })
        .catch((error) => {
            console.error('Error duplicating session:', error);
            showMessage('Error duplicating session', 'error');
        });
    }


// ==========================================
// SEARCH AND FILTER FUNCTIONS
// ==========================================

function applySearch() {
    const searchTerm = $w('#searchInput').value.toLowerCase();
    sessionsData.filters.search = searchTerm;
    
    applyAllFilters();
}

function applyStatusFilter() {
    const selectedStatus = $w('#statusFilter').value;
    sessionsData.filters.status = selectedStatus;
    
    applyAllFilters();
}

function applyMentorFilter() {
    const selectedMentor = $w('#mentorFilter').value;
    sessionsData.filters.mentor = selectedMentor;
    
    applyAllFilters();
}

function applySubjectFilter() {
    const selectedSubject = $w('#subjectFilter').value;
    sessionsData.filters.subject = selectedSubject;
    
    applyAllFilters();
}

function applySessionTypeFilter() {
    const selectedType = $w('#sessionTypeFilter').value;
    sessionsData.filters.sessionType = selectedType;
    
    applyAllFilters();
}

function applyDateFilter() {
    const startDate = $w('#startDatePicker').value;
    const endDate = $w('#endDatePicker').value;
    
    sessionsData.filters.dateRange = { startDate, endDate };
    
    applyAllFilters();
}

function applyAllFilters() {
    let filteredSessions = [...sessionsData.sessions];
    
    // Apply search filter
    if (sessionsData.filters.search) {
        const searchTerm = sessionsData.filters.search.toLowerCase();
        filteredSessions = filteredSessions.filter(session => 
            session.title.toLowerCase().includes(searchTerm) ||
            session.sessionId.toLowerCase().includes(searchTerm) ||
            getStudentNameById(session.studentId).toLowerCase().includes(searchTerm) ||
            getMentorNameById(session.mentorId).toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply status filter
    if (sessionsData.filters.status && sessionsData.filters.status !== 'all') {
        filteredSessions = filteredSessions.filter(session => 
            session.status === sessionsData.filters.status
        );
    }
    
    // Apply mentor filter
    if (sessionsData.filters.mentor && sessionsData.filters.mentor !== 'all') {
        filteredSessions = filteredSessions.filter(session => 
            session.mentorId === sessionsData.filters.mentor
        );
    }
    
    // Apply subject filter
    if (sessionsData.filters.subject && sessionsData.filters.subject !== 'all') {
        filteredSessions = filteredSessions.filter(session => 
            session.subjectId === sessionsData.filters.subject
        );
    }
    
    // Apply session type filter
    if (sessionsData.filters.sessionType && sessionsData.filters.sessionType !== 'all') {
        filteredSessions = filteredSessions.filter(session => 
            session.sessionType === sessionsData.filters.sessionType
        );
    }
    
    // Apply date range filter
    if (sessionsData.filters.dateRange) {
        const { startDate, endDate } = sessionsData.filters.dateRange;
        if (startDate && endDate) {
            filteredSessions = filteredSessions.filter(session => {
                const sessionDate = new Date(session.scheduledDate);
                return sessionDate >= startDate && sessionDate <= endDate;
            });
        }
    }
    
    displayFilteredSessions(filteredSessions);
}

function displayFilteredSessions(filteredSessions) {
    // Temporarily update sessions data for display
    const originalSessions = sessionsData.sessions;
    sessionsData.sessions = filteredSessions;
    
    updateSessionsDisplay();
    
    // Update result count
    $w('#resultCount').text = `${filteredSessions.length} sessions found`;
    
    // Restore original data
    sessionsData.sessions = originalSessions;
}

function clearAllFilters() {
    // Reset filter values
    $w('#searchInput').value = '';
    $w('#statusFilter').value = 'all';
    $w('#mentorFilter').value = 'all';
    $w('#subjectFilter').value = 'all';
    $w('#sessionTypeFilter').value = 'all';
    
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    $w('#startDatePicker').value = firstDayOfMonth;
    $w('#endDatePicker').value = lastDayOfMonth;
    
    // Reset filter data
    sessionsData.filters = {
        search: '',
        dateRange: null,
        status: 'all',
        mentor: 'all',
        subject: 'all',
        sessionType: 'all'
    };
    
    // Reload data
    loadSessions();
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
}

function formatTime(startTime, endTime) {
    if (!startTime || !endTime) return 'N/A';
    return `${startTime} - ${endTime}`;
}

function generateSessionId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);
    return `SES-${year}${month}-${timestamp}`;
}

function getStudentNameById(studentId) {
    const student = sessionsData.students.find(s => s._id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'N/A';
}

function getMentorNameById(mentorId) {
    const mentor = sessionsData.mentors.find(m => m._id === mentorId);
    return mentor ? `${mentor.firstName} ${mentor.lastName}` : 'N/A';
}

function getSubjectNameById(subjectId) {
    const subject = sessionsData.subjects.find(s => s._id === subjectId);
    return subject ? subject.subjectName : 'N/A';
}

function getStatusColor(status) {
    const colors = {
        'scheduled': '#007bff',
        'in-progress': '#28a745',
        'completed': '#6c757d',
        'cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
}

function isToday(date) {
    const today = new Date();
    return isSameDate(date, today);
}

function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
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
    $w('#sessionFormLightbox').hide();
    $w('#sessionDetailsLightbox').hide();
    $w('#bulkActionsLightbox').hide();
    $w('#importDialog').hide();
    $w('#attendanceModal').hide();
    $w('#feedbackModal').hide();
}

function switchView(viewType) {
    sessionsData.currentView = viewType;
    
    if (viewType === 'calendar') {
        $w('#calendarView').show();
        $w('#listView').hide();
        $w('#calendarViewBtn').style.backgroundColor = '#007bff';
        $w('#listViewBtn').style.backgroundColor = '#f0f0f0';
        updateCalendarDisplay();
    } else {
        $w('#calendarView').hide();
        $w('#listView').show();
        $w('#listViewBtn').style.backgroundColor = '#007bff';
        $w('#calendarViewBtn').style.backgroundColor = '#f0f0f0';
        updateSessionsList();
    }
    
    // Store current view
    local.setItem('sessionsView', viewType);
}

function refreshData() {
    loadSessionsData();
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
    // Switch to list view on mobile
    switchView('list');
    
    // Adjust layout for mobile
    $w('#statisticsGrid').layout = 'singleColumn';
    $w('#actionButtonsContainer').layout = 'vertical';
    $w('#filterContainer').layout = 'vertical';
    
    // Hide some columns in table view
    if ($w('#sessionsTable').columns) {
        $w('#sessionsTable').columns.forEach((column, index) => {
            if (index > 4) { // Hide columns after the 5th one
                column.visible = false;
            }
        });
    }
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
    
    // Show all table columns
    if ($w('#sessionsTable').columns) {
        $w('#sessionsTable').columns.forEach(column => {
            column.visible = true;
        });
    }
}

// ==========================================
// BACKEND CODE (Backend Files)
// ==========================================

/**
 * Backend file: backend/sessions.jsw
 * Handles session-related backend operations
 */

/*
import { ok, badRequest, serverError } from 'wix-http-functions';
import wixData from 'wix-data';
import { sendEmail } from 'backend_email-service';

export function createSession(request) {
    const { sessionData } = request.body;
    
    return validateSessionData(sessionData)
        .then(() => {
            sessionData.sessionId = generateSessionId();
            sessionData.createdDate = new Date();
            
            // 将Sessions格式的数据转换为Import86格式
            const import86Data = {
                scheduleId: sessionData.sessionId,
                class_id: sessionData.classId || "",
                courseId: sessionData.courseId || sessionData.title,
                subject: sessionData.subjectId,
                instructorName: "", // 需要根据instructorId查询获取
                instructorId: sessionData.adminId,
                scheduledDate: sessionData.scheduledDate,
                startTime: sessionData.startTime,
                endTime: sessionData.endTime,
                duration: calculateDuration(sessionData.startTime, sessionData.endTime),
                courseType: sessionData.sessionType,
                maxStudents: sessionData.maxStudents || 1,
                enrolledStudents: sessionData.students ? sessionData.students.length : 0,
                status: sessionData.status,
                onlineClassroomLink: sessionData.meetingLink,
                courseMaterials: sessionData.materials || [],
                agenda: sessionData.description || "",
                prerequisites: [],
                _createdDate: new Date(),
                _updatedDate: new Date()
            };
            
            return wixData.insert('Import86', import86Data);
        })
        .then((result) => {
            // 构建一个与原Sessions格式兼容的结果对象，用于发送通知
            const compatibleResult = {
                _id: result._id,
                sessionId: result.scheduleId,
                title: result.courseId,
                description: result.agenda,
                adminId: result.instructorId,
                subjectId: result.subject,
                sessionType: result.courseType,
                status: result.status,
                scheduledDate: result.scheduledDate,
                startTime: result.startTime,
                endTime: result.endTime,
                meetingLink: result.onlineClassroomLink,
                materials: result.courseMaterials
            };
            
            return sendSessionNotifications(compatibleResult, 'created');
        })
        .then((result) => {
            return ok({ session: result });
        })
        .catch((error) => {
            console.error('Session creation error:', error);
            return serverError({ error: 'Session creation failed' });
        });
}

export function updateSession(request) {
    const { sessionId, sessionData } = request.body;
    
    return validateSessionData(sessionData)
        .then(() => {
            sessionData.lastModified = new Date();
            
            // 先查询Import86集合中对应的记录
            return wixData.query('Import86')
                .eq('scheduleId', sessionId)
                .find()
                .then((results) => {
                    if (results.items.length > 0) {
                        const import86Item = results.items[0];
                        
                        // 将Sessions格式的数据转换为Import86格式
                        const import86Data = {
                            _id: import86Item._id,
                            scheduleId: sessionData.sessionId,
                            class_id: sessionData.classId || "",
                            courseId: sessionData.courseId || sessionData.title,
                            subject: sessionData.subjectId,
                            instructorId: sessionData.adminId,
                            scheduledDate: sessionData.scheduledDate,
                            startTime: sessionData.startTime,
                            endTime: sessionData.endTime,
                            duration: calculateDuration(sessionData.startTime, sessionData.endTime),
                            courseType: sessionData.sessionType,
                            maxStudents: sessionData.maxStudents || 1,
                            enrolledStudents: sessionData.students ? sessionData.students.length : 0,
                            status: sessionData.status,
                            onlineClassroomLink: sessionData.meetingLink,
                            courseMaterials: sessionData.materials || [],
                            agenda: sessionData.description || "",
                            _updatedDate: new Date()
                        };
                        
                        return wixData.update('Import86', import86Data);
                    } else {
                        // 如果在Import86中找不到对应记录，则创建新记录
                        const import86Data = {
                            scheduleId: sessionData.sessionId,
                            class_id: sessionData.classId || "",
                            courseId: sessionData.courseId || sessionData.title,
                            subject: sessionData.subjectId,
                            instructorId: sessionData.adminId,
                            scheduledDate: sessionData.scheduledDate,
                            startTime: sessionData.startTime,
                            endTime: sessionData.endTime,
                            duration: calculateDuration(sessionData.startTime, sessionData.endTime),
                            courseType: sessionData.sessionType,
                            maxStudents: sessionData.maxStudents || 1,
                            enrolledStudents: sessionData.students ? sessionData.students.length : 0,
                            status: sessionData.status,
                            onlineClassroomLink: sessionData.meetingLink,
                            courseMaterials: sessionData.materials || [],
                            agenda: sessionData.description || "",
                            _createdDate: new Date(),
                            _updatedDate: new Date()
                        };
                        
                        return wixData.insert('Import86', import86Data);
                    }
                });
        })
        .then((result) => {
            // 构建一个与原Sessions格式兼容的结果对象，用于发送通知
            const compatibleResult = {
                _id: result._id,
                sessionId: result.scheduleId,
                title: result.courseId,
                description: result.agenda,
                adminId: result.instructorId,
                subjectId: result.subject,
                sessionType: result.courseType,
                status: result.status,
                scheduledDate: result.scheduledDate,
                startTime: result.startTime,
                endTime: result.endTime,
                meetingLink: result.onlineClassroomLink,
                materials: result.courseMaterials
            };
            
            return sendSessionNotifications(compatibleResult, 'updated');
        })
        .then((result) => {
            return ok({ session: result });
        })
        .catch((error) => {
            console.error('Session update error:', error);
            return serverError({ error: 'Session update failed' });
        });
}

export function deleteSession(request) {
    const { sessionId } = request.body;
    
    // 先查询Import86集合中对应的记录
    return wixData.query('Import86')
        .eq('scheduleId', sessionId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const import86Item = results.items[0];
                return wixData.remove('Import86', import86Item._id);
            } else {
                // 如果在Import86中找不到对应记录，返回成功
                return Promise.resolve();
            }
        })
        .then(() => {
            return ok({ message: 'Session deleted successfully' });
        })
        .catch((error) => {
            console.error('Session deletion error:', error);
            return serverError({ error: 'Session deletion failed' });
        });
}

export function checkSessionConflicts(request) {
    const { mentorId, date, startTime, endTime } = request.body;
    
    return wixData.query('Import86')
        .eq('instructorId', mentorId) // 使用instructorId替代mentorId
        .eq('scheduledDate', date)
        .ne('status', 'cancelled')
        .find()
        .then((results) => {
            const conflicts = results.items.filter(session => {
                const sessionStart = new Date(`${date} ${session.startTime}`);
                const sessionEnd = new Date(`${date} ${session.endTime}`);
                const newStart = new Date(`${date} ${startTime}`);
                const newEnd = new Date(`${date} ${endTime}`);
                
                return (newStart < sessionEnd && newEnd > sessionStart);
            });
            
            return ok({ hasConflicts: conflicts.length > 0, conflicts });
        })
        .catch((error) => {
            console.error('Conflict check error:', error);
            return serverError({ error: 'Conflict check failed' });
        });
}

function validateSessionData(sessionData) {
    return new Promise((resolve, reject) => {
        if (!sessionData.title) {
            reject(new Error('Session title is required'));
        }
        
        if (!sessionData.studentId) {
            reject(new Error('Student is required'));
        }
        
        if (!sessionData.mentorId) {
            reject(new Error('Mentor is required'));
        }
        
        if (!sessionData.scheduledDate) {
            reject(new Error('Session date is required'));
        }
        
        resolve();
    });
}

function generateSessionId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);
    return `SES-${year}${month}-${timestamp}`;
}

function sendSessionNotifications(session, action) {
    // Implementation for sending notifications
    return Promise.resolve(session);
}
*/

/**
 * Backend file: backend/email-service.jsw
 * Handles email notifications for sessions
 */

/*
import { sendEmail } from 'wix-crm-backend';

export function sendSessionReminder(sessionId) {
    return getSessionDetails(sessionId)
        .then((session) => {
            const emailData = {
                to: session.studentEmail,
                subject: `Session Reminder: ${session.title}`,
                body: generateReminderEmail(session)
            };
            
            return sendEmail(emailData);
        });
}

export function sendSessionNotification(sessionId, action) {
    return getSessionDetails(sessionId)
        .then((session) => {
            const emailData = {
                to: [session.studentEmail, session.mentorEmail],
                subject: `Session ${action}: ${session.title}`,
                body: generateNotificationEmail(session, action)
            };
            
            return sendEmail(emailData);
        });
}

function generateReminderEmail(session) {
    return `
        <h2>Session Reminder</h2>
        <p>This is a reminder for your upcoming session:</p>
        <ul>
            <li><strong>Title:</strong> ${session.title}</li>
            <li><strong>Date:</strong> ${session.scheduledDate}</li>
            <li><strong>Time:</strong> ${session.startTime} - ${session.endTime}</li>
            <li><strong>Location:</strong> ${session.location || 'Virtual'}</li>
            <li><strong>Mentor:</strong> ${session.mentorName}</li>
        </ul>
        ${session.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${session.meetingLink}">${session.meetingLink}</a></p>` : ''}
        <p>Please be prepared and on time for your session.</p>
    `;
}

function generateNotificationEmail(session, action) {
    return `
        <h2>Session ${action}</h2>
        <p>Your session has been ${action}:</p>
        <ul>
            <li><strong>Title:</strong> ${session.title}</li>
            <li><strong>Date:</strong> ${session.scheduledDate}</li>
            <li><strong>Time:</strong> ${session.startTime} - ${session.endTime}</li>
            <li><strong>Status:</strong> ${session.status}</li>
        </ul>
        <p>For any questions, please contact support.</p>
    `;
}
*/

// ==========================================
// USAGE INSTRUCTIONS
// ==========================================

/**
 * REQUIRED DATABASE COLLECTIONS:
 * 
 * 1. Sessions Collection:
 *    - sessionId (Text)
 *    - title (Text)
 *    - description (Text)
 *    - studentId (Reference to Students)
 *    - adminId (Reference to Admins)
 *    - subjectId (Reference to Subjects)
 *    - sessionType (Text: individual, group, workshop, assessment)
 *    - status (Text: scheduled, in-progress, completed, cancelled)
 *    - scheduledDate (Date)
 *    - startTime (Text)
 *    - endTime (Text)
 *    - actualStartTime (Date)
 *    - actualEndTime (Date)
 *    - location (Text)
 *    - meetingLink (Text)
 *    - maxParticipants (Number)
 *    - cost (Number)
 *    - sessionNotes (Text)
 *    - isRecurring (Boolean)
 *    - recurrencePattern (Text)
 *    - recurrenceEnd (Date)
 *    - createdDate (Date)
 *    - lastModified (Date)
 *    - createdBy (Text)
 * 
 * 2. SessionAttendance Collection:
 *    - sessionId (Reference to Sessions)
 *    - studentId (Reference to Students)
 *    - attendanceStatus (Text: present, absent, late)
 *    - checkInTime (Date)
 *    - checkOutTime (Date)
 *    - notes (Text)
 *    - recordedBy (Text)
 *    - timestamp (Date)
 * 
 * 3. Students Collection:
 *    - firstName (Text)
 *    - lastName (Text)
 *    - email (Text)
 *    - phone (Text)
 *    - status (Text)
 * 
 * 4. Admins Collection:
 *    - firstName (Text)
 *    - lastName (Text)
 *    - email (Text)
 *    - phone (Text)
 *    - department (Text)
 *    - position (Text)
 * 
 * 5. Subjects Collection:
 *    - subjectName (Text)
 *    - description (Text)
 *    - category (Text)
 * 
 * REQUIRED WIX ELEMENTS:
 * 
 * Page Elements:
 * - #pageTitle (Text)
 * - #loadingSpinner (Image)
 * - #messageBar (Container)
 * - #messageText (Text)
 * 
 * Statistics Cards:
 * - #totalSessionsValue (Text)
 * - #todaySessionsValue (Text)
 * - #upcomingSessionsValue (Text)
 * - #completionRateValue (Text)
 * - #attendanceRateValue (Text)
 * 
 * View Controls:
 * - #calendarViewBtn (Button)
 * - #listViewBtn (Button)
 * - #refreshBtn (Button)
 * 
 * Calendar Components:
 * - #calendarView (Container)
 * - #calendarHeader (Text)
 * - #prevMonthBtn (Button)
 * - #nextMonthBtn (Button)
 * - #todayBtn (Button)
 * - #monthViewBtn (Button)
 * - #weekViewBtn (Button)
 * - #dayViewBtn (Button)
 * - #calendarGrid (Repeater)
 * 
 * List View Components:
 * - #listView (Container)
 * - #sessionsTable (Table)
 * - #sessionsRepeater (Repeater)
 * 
 * Action Buttons:
 * - #addSessionBtn (Button)
 * - #importSessionsBtn (Button)
 * - #exportSessionsBtn (Button)
 * - #bulkActionsBtn (Button)
 * 
 * Search and Filters:
 * - #searchInput (Input)
 * - #statusFilter (Dropdown)
 * - #adminFilter (Dropdown)
 * - #subjectFilter (Dropdown)
 * - #sessionTypeFilter (Dropdown)
 * - #startDatePicker (DatePicker)
 * - #endDatePicker (DatePicker)
 * - #clearFiltersBtn (Button)
 * 
 * Session Form Modal:
 * - #sessionFormLightbox (Lightbox)
 * - #sessionFormTitle (Text)
 * - #sessionTitleInput (Input)
 * - #sessionDescriptionInput (TextBox)
 * - #studentSelect (Dropdown)
 * - #adminSelect (Dropdown)
 * - #subjectSelect (Dropdown)
 * - #sessionTypeSelect (Dropdown)
 * - #statusSelect (Dropdown)
 * - #sessionDatePicker (DatePicker)
 * - #startTimePicker (TimePicker)
 * - #endTimePicker (TimePicker)
 * - #locationInput (Input)
 * - #meetingLinkInput (Input)
 * - #maxParticipantsInput (Input)
 * - #costInput (Input)
 * - #sessionNotesInput (TextBox)
 * - #recurringCheckbox (Checkbox)
 * - #recurrencePatternSelect (Dropdown)
 * - #recurrenceEndPicker (DatePicker)
 * - #submitSessionBtn (Button)
 * - #updateSessionBtn (Button)
 * - #deleteSessionBtn (Button)
 * - #duplicateSessionBtn (Button)
 * - #closeSessionForm (Button)
 * 
 * Attendance Modal:
 * - #attendanceModal (Lightbox)
 * - #attendanceSessionTitle (Text)
 * - #attendanceSessionDate (Text)
 * - #attendanceRepeater (Repeater)
 * - #markAttendanceBtn (Button)
 * - #saveAttendanceBtn (Button)
 * - #bulkPresentBtn (Button)
 * - #bulkAbsentBtn (Button)
 * - #closeAttendanceModal (Button)
 * 
 * MEMBER PERMISSIONS:
 * - Admin: Full access to all sessions
 * - Admin: Access to assigned sessions
 * - Staff: Read access to all sessions
 * - Scheduler: Create and edit sessions
 * 
 * CALENDAR INTEGRATION:
 * - Configure calendar API for external calendar sync
 * - Set up meeting link generation (Zoom, Teams, etc.)
 * - Enable calendar invitations
 * 
 * EMAIL CONFIGURATION:
 * - Set up email templates for notifications
 * - Configure SMTP settings
 * - Enable automated reminders
 * 
 * SECURITY NOTES:
 * - Validate all user inputs
 * - Implement proper access controls
 * - Sanitize data before database operations
 * - Use HTTPS for all communications
 * - Implement rate limiting for API calls
 * 
 * PERFORMANCE OPTIMIZATION:
 * - Use pagination for large datasets
 * - Implement caching for frequently accessed data
 * - Optimize database queries
 * - Use lazy loading for calendar views
 * - Compress images and assets
 * 
 * TESTING CHECKLIST:
 * - Test session creation and editing
 * - Verify calendar functionality
 * - Test attendance tracking
 * - Check notification system
 * - Validate search and filtering
 * - Test responsive design
 * - Verify data validation
 * - Test error handling
 * - Check performance with large datasets
 * - Validate security measures
 */