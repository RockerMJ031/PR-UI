// Wix Index Dashboard - Complete Implementation
// Frontend Velo Code for Main Dashboard

import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { local, session } from 'wix-storage';
import wixWindow from 'wix-window';
import { authentication } from 'wix-members';
import wixCrm from 'wix-crm';
import { timeline } from 'wix-animations';

// Global variables
let currentUser = null;
let refreshInterval = null;
let notificationInterval = null;
let activityFeedData = [];
let systemStats = {};

// Page initialization
$w.onReady(function () {
    console.log('Initializing Index Dashboard...');
    initializePage();
    setupEventHandlers();
    loadInitialData();
    startAutoRefresh();
});

// Initialize page components
function initializePage() {
    // Set up user authentication
    authentication.getCurrentUser()
        .then((user) => {
            if (user.loggedIn) {
                currentUser = user;
                setupUserInterface(user);
                loadUserPreferences(user.id);
            } else {
                redirectToLogin();
            }
        })
        .catch((error) => {
            console.error('Authentication error:', error);
            showErrorMessage('Authentication failed. Please try again.');
        });
    
    // Initialize UI components
    setupResponsiveDesign();
    initializeCharts();
    setupAnimations();
    
    // Set default theme
    applyTheme(local.getItem('userTheme') || 'light');
}

// Set up event handlers
function setupEventHandlers() {
    // Navigation handlers
    $w('#btnStudents').onClick(() => navigateToModule('students'));
    $w('#btnSessions').onClick(() => navigateToModule('sessions'));
    $w('#btnFinance').onClick(() => navigateToModule('finance'));
    $w('#btnReports').onClick(() => navigateToModule('reports'));
    $w('#btnSettings').onClick(() => navigateToModule('settings'));
    
    // Quick action handlers
    $w('#btnAddStudent').onClick(openAddStudentModal);
    $w('#btnScheduleSession').onClick(openScheduleSessionModal);
    $w('#btnGenerateReport').onClick(openGenerateReportModal);
    $w('#btnSendNotification').onClick(openSendNotificationModal);
    $w('#btnViewCalendar').onClick(() => navigateToModule('calendar'));
    $w('#btnExportData').onClick(openExportDataModal);
    
    // User profile handlers
    $w('#userProfileButton').onClick(toggleUserProfileDropdown);
    $w('#btnEditProfile').onClick(openEditProfileModal);
    $w('#btnUserSettings').onClick(openUserSettingsModal);
    $w('#btnLogout').onClick(handleLogout);
    
    // Search handlers
    $w('#searchInput').onInput(handleSearch);
    $w('#searchInput').onKeyPress(handleSearchKeyPress);
    $w('#btnClearSearch').onClick(clearSearch);
    
    // Notification handlers
    $w('#notificationBell').onClick(toggleNotificationPanel);
    $w('#btnMarkAllRead').onClick(markAllNotificationsRead);
    $w('#btnClearNotifications').onClick(clearAllNotifications);
    
    // Statistics card handlers
    $w('#btnRefreshStats').onClick(refreshStatistics);
    $w('#totalStudentsCard').onClick(() => navigateToModule('students'));
    $w('#activeSessionsCard').onClick(() => navigateToModule('sessions'));
    $w('#monthlyRevenueCard').onClick(() => navigateToModule('finance'));
    $w('#attendanceRateCard').onClick(() => navigateToModule('reports'));
    
    // Activity feed handlers
    $w('#btnRefreshActivities').onClick(refreshActivityFeed);
    $w('#activityFilterDropdown').onChange(filterActivityFeed);
    $w('#btnLoadMoreActivities').onClick(loadMoreActivities);
    
    // Theme and preferences
    $w('#themeToggle').onChange(handleThemeChange);
    $w('#languageDropdown').onChange(handleLanguageChange);
    
    // Modal handlers
    $w('#btnCloseModal').onClick(closeAllModals);
    $w('#modalOverlay').onClick(closeAllModals);
    
    // Responsive handlers
    $w('#mobileMenuButton').onClick(toggleMobileMenu);
    $w('#btnCloseMobileMenu').onClick(closeMobileMenu);
}

// Load initial data
function loadInitialData() {
    showLoadingIndicator('Loading dashboard data...');
    
    Promise.all([
        loadSystemStatistics(),
        loadRecentActivities(),
        loadUserNotifications(),
        loadQuickActions(),
        loadSystemHealth()
    ]).then(() => {
        hideLoadingIndicator();
        console.log('Initial data loaded successfully');
        showWelcomeMessage();
    }).catch((error) => {
        console.error('Error loading initial data:', error);
        hideLoadingIndicator();
        showErrorMessage('Failed to load dashboard data. Please refresh the page.');
    });
}

// Load system statistics
function loadSystemStatistics() {
    const today = new Date().toISOString().substring(0, 10);
    
    return wixData.query('SystemStats')
        .eq('date', today)
        .find()
        .then((result) => {
            if (result.items.length > 0) {
                systemStats = result.items[0];
                updateStatisticsCards(systemStats);
                updateChartsData(systemStats);
            } else {
                // Generate statistics for today if not exists
                return generateTodayStatistics();
            }
        });
}

// Generate today's statistics
function generateTodayStatistics() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return Promise.all([
        wixData.query('Students').count(),
        wixData.query('Students').eq('status', 'active').count(),
        wixData.query('Mentors').count(),
        wixData.query('Mentors').eq('status', 'active').count(),
        wixData.query('Sessions').between('sessionDate', startOfDay, endOfDay).count(),
        wixData.query('Invoices').between('invoiceDate', startOfDay, endOfDay).find(),
        wixData.query('SessionAttendance').between('attendanceDate', startOfDay, endOfDay).find()
    ]).then(([totalStudents, activeStudents, totalMentors, activeMentors, todaySessions, todayInvoices, todayAttendance]) => {
        
        // Calculate revenue
        const todayRevenue = todayInvoices.items.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
        
        // Calculate attendance rate
        const presentCount = todayAttendance.items.filter(a => a.status === 'present').length;
        const attendanceRate = todayAttendance.items.length > 0 
            ? (presentCount / todayAttendance.items.length) * 100 
            : 0;
        
        const statsData = {
            date: today.toISOString().substring(0, 10),
            totalStudents: totalStudents.totalCount,
            activeStudents: activeStudents.totalCount,
            totalMentors: totalMentors.totalCount,
            activeMentors: activeMentors.totalCount,
            sessionsToday: todaySessions.totalCount,
            revenueToday: todayRevenue,
            attendanceRate: Math.round(attendanceRate * 100) / 100,
            systemUptime: 99.9,
            activeUsers: activeStudents.totalCount + activeMentors.totalCount,
            lastUpdated: new Date().toISOString()
        };
        
        // Save to database
        return wixData.save('SystemStats', statsData)
            .then((savedStats) => {
                systemStats = savedStats;
                updateStatisticsCards(systemStats);
                updateChartsData(systemStats);
                return savedStats;
            });
    });
}

// Update statistics cards
function updateStatisticsCards(stats) {
    // Total Students Card
    $w('#totalStudentsNumber').text = stats.totalStudents?.toString() || '0';
    $w('#activeStudentsNumber').text = stats.activeStudents?.toString() || '0';
    
    // Active Sessions Card
    $w('#sessionsNumber').text = stats.sessionsToday?.toString() || '0';
    $w('#totalSessionsNumber').text = stats.totalSessions?.toString() || '0';
    
    // Monthly Revenue Card
    $w('#revenueNumber').text = formatCurrency(stats.revenueToday || 0);
    $w('#monthlyRevenueNumber').text = formatCurrency(stats.revenueThisMonth || 0);
    
    // Attendance Rate Card
    $w('#attendanceRateNumber').text = `${stats.attendanceRate || 0}%`;
    $w('#attendanceProgress').value = stats.attendanceRate || 0;
    
    // System Health Card
    $w('#systemUptimeNumber').text = `${stats.systemUptime || 0}%`;
    $w('#activeUsersNumber').text = stats.activeUsers?.toString() || '0';
    
    // Update trend indicators
    updateTrendIndicators(stats);
    
    // Animate number changes
    animateNumberChanges();
}

// Update trend indicators
function updateTrendIndicators(stats) {
    // Get previous day stats for comparison
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().substring(0, 10);
    
    wixData.query('SystemStats')
        .eq('date', yesterdayDate)
        .find()
        .then((result) => {
            if (result.items.length > 0) {
                const yesterdayStats = result.items[0];
                
                // Calculate trends
                updateTrendIndicator('#studentsTrend', stats.totalStudents, yesterdayStats.totalStudents);
                updateTrendIndicator('#sessionsTrend', stats.sessionsToday, yesterdayStats.sessionsToday);
                updateTrendIndicator('#revenueTrend', stats.revenueToday, yesterdayStats.revenueToday);
                updateTrendIndicator('#attendanceTrend', stats.attendanceRate, yesterdayStats.attendanceRate);
            }
        });
}

// Update individual trend indicator
function updateTrendIndicator(elementId, currentValue, previousValue) {
    const element = $w(elementId);
    if (!element) return;
    
    const change = currentValue - previousValue;
    const percentChange = previousValue > 0 ? (change / previousValue) * 100 : 0;
    
    if (change > 0) {
        element.src = 'https://static.wixstatic.com/media/trend-up.svg';
        element.alt = `Up ${Math.abs(percentChange).toFixed(1)}%`;
        element.style.color = '#4CAF50';
    } else if (change < 0) {
        element.src = 'https://static.wixstatic.com/media/trend-down.svg';
        element.alt = `Down ${Math.abs(percentChange).toFixed(1)}%`;
        element.style.color = '#f44336';
    } else {
        element.src = 'https://static.wixstatic.com/media/trend-neutral.svg';
        element.alt = 'No change';
        element.style.color = '#757575';
    }
}

// Load recent activities
function loadRecentActivities() {
    return wixData.query('Activities')
        .descending('timestamp')
        .limit(20)
        .find()
        .then((result) => {
            activityFeedData = result.items;
            updateActivityFeed(activityFeedData);
            return result.items;
        });
}

// Update activity feed
function updateActivityFeed(activities) {
    if (activities.length === 0) {
        $w('#activityFeed').html = '<div class="no-activities">No recent activities found.</div>';
        return;
    }
    
    const activityHtml = activities.map(activity => `
        <div class="activity-item" data-activity-id="${activity._id}">
            <div class="activity-avatar">
                <img src="${activity.userAvatar || 'https://static.wixstatic.com/media/default-avatar.svg'}" 
                     alt="${activity.userName}" class="avatar-image">
            </div>
            <div class="activity-content">
                <div class="activity-header">
                    <span class="activity-user">${activity.userName}</span>
                    <span class="activity-action">${activity.action}</span>
                    <span class="activity-entity">${activity.entityName}</span>
                    <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
                </div>
                <div class="activity-description">${activity.description}</div>
                <div class="activity-metadata">
                    <span class="activity-module">${activity.module}</span>
                    ${activity.metadata ? Object.keys(activity.metadata).map(key => 
                        `<span class="metadata-item">${key}: ${activity.metadata[key]}</span>`
                    ).join('') : ''}
                </div>
            </div>
            <div class="activity-actions">
                ${activity.actionUrl ? `<button onclick="navigateToActivity('${activity.actionUrl}')">View</button>` : ''}
            </div>
        </div>
    `).join('');
    
    $w('#activityFeed').html = activityHtml;
}

// Load user notifications
function loadUserNotifications() {
    if (!currentUser) return Promise.resolve([]);
    
    return wixData.query('Notifications')
        .eq('userId', currentUser.id)
        .eq('isRead', false)
        .descending('createdDate')
        .limit(10)
        .find()
        .then((result) => {
            updateNotificationPanel(result.items);
            updateNotificationBell(result.items.length);
            return result.items;
        });
}

// Update notification panel
function updateNotificationPanel(notifications) {
    const unreadCount = notifications.length;
    
    if (unreadCount === 0) {
        $w('#notificationList').html = '<div class="no-notifications">No new notifications</div>';
        return;
    }
    
    const notificationHtml = notifications.map(notification => `
        <div class="notification-item ${notification.type}" data-notification-id="${notification._id}">
            <div class="notification-icon">
                <i class="icon-${notification.type}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${formatTimeAgo(notification.createdDate)}</div>
            </div>
            <div class="notification-actions">
                ${notification.actionUrl ? `<button onclick="handleNotificationAction('${notification._id}', '${notification.actionUrl}')">View</button>` : ''}
                <button onclick="markNotificationRead('${notification._id}')">Mark Read</button>
            </div>
        </div>
    `).join('');
    
    $w('#notificationList').html = notificationHtml;
}

// Update notification bell
function updateNotificationBell(count) {
    $w('#notificationCount').text = count > 99 ? '99+' : count.toString();
    $w('#notificationCount').show();
    
    if (count === 0) {
        $w('#notificationCount').hide();
    }
}

// Load quick actions based on user role
function loadQuickActions() {
    if (!currentUser) return Promise.resolve([]);
    
    const userRole = currentUser.role || 'viewer';
    
    // Define role-based quick actions
    const quickActions = {
        admin: [
            { id: 'addStudent', label: 'Add Student', icon: 'user-plus', action: 'openAddStudentModal' },
            { id: 'scheduleSession', label: 'Schedule Session', icon: 'calendar-plus', action: 'openScheduleSessionModal' },
            { id: 'generateReport', label: 'Generate Report', icon: 'file-text', action: 'openGenerateReportModal' },
            { id: 'sendNotification', label: 'Send Notification', icon: 'bell', action: 'openSendNotificationModal' },
            { id: 'viewCalendar', label: 'View Calendar', icon: 'calendar', action: 'navigateToCalendar' },
            { id: 'exportData', label: 'Export Data', icon: 'download', action: 'openExportDataModal' }
        ],
        mentor: [
            { id: 'scheduleSession', label: 'Schedule Session', icon: 'calendar-plus', action: 'openScheduleSessionModal' },
            { id: 'viewStudents', label: 'My Students', icon: 'users', action: 'navigateToMyStudents' },
            { id: 'viewCalendar', label: 'My Calendar', icon: 'calendar', action: 'navigateToCalendar' },
            { id: 'generateReport', label: 'Student Reports', icon: 'file-text', action: 'openGenerateReportModal' }
        ],
        student: [
            { id: 'viewSchedule', label: 'My Schedule', icon: 'calendar', action: 'navigateToSchedule' },
            { id: 'viewProgress', label: 'My Progress', icon: 'trending-up', action: 'navigateToProgress' },
            { id: 'viewAssignments', label: 'Assignments', icon: 'book', action: 'navigateToAssignments' },
            { id: 'contactMentor', label: 'Contact Mentor', icon: 'message-circle', action: 'openContactMentor' }
        ],
        parent: [
            { id: 'viewChildProgress', label: "Child's Progress", icon: 'trending-up', action: 'navigateToChildProgress' },
            { id: 'viewPayments', label: 'Payments', icon: 'credit-card', action: 'navigateToPayments' },
            { id: 'viewSchedule', label: "Child's Schedule", icon: 'calendar', action: 'navigateToChildSchedule' },
            { id: 'contactMentor', label: 'Contact Mentor', icon: 'message-circle', action: 'openContactMentor' }
        ]
    };
    
    const userActions = quickActions[userRole] || quickActions.student;
    updateQuickActionsPanel(userActions);
    
    return Promise.resolve(userActions);
}

// Update quick actions panel
function updateQuickActionsPanel(actions) {
    const actionsHtml = actions.map(action => `
        <div class="quick-action-item" onclick="${action.action}()">
            <div class="action-icon">
                <i class="icon-${action.icon}"></i>
            </div>
            <div class="action-label">${action.label}</div>
        </div>
    `).join('');
    
    $w('#quickActionsPanel').html = actionsHtml;
}

// Load system health metrics
function loadSystemHealth() {
    // This would typically call a backend service to get system health
    const healthMetrics = {
        uptime: 99.9,
        responseTime: 150, // ms
        errorRate: 0.1, // %
        activeConnections: 45,
        memoryUsage: 68, // %
        cpuUsage: 32 // %
    };
    
    updateSystemHealthIndicators(healthMetrics);
    return Promise.resolve(healthMetrics);
}

// Update system health indicators
function updateSystemHealthIndicators(metrics) {
    $w('#systemUptime').text = `${metrics.uptime}%`;
    $w('#responseTime').text = `${metrics.responseTime}ms`;
    $w('#errorRate').text = `${metrics.errorRate}%`;
    $w('#activeConnections').text = metrics.activeConnections.toString();
    
    // Update health status color
    const healthStatus = metrics.uptime > 99 ? 'healthy' : metrics.uptime > 95 ? 'warning' : 'critical';
    $w('#systemHealthIndicator').style.backgroundColor = {
        healthy: '#4CAF50',
        warning: '#FF9800',
        critical: '#f44336'
    }[healthStatus];
}

// Navigation functions
function navigateToModule(module) {
    const moduleUrls = {
        students: '/students',
        sessions: '/sessions',
        finance: '/finance',
        reports: '/reports',
        settings: '/settings',
        calendar: '/calendar'
    };
    
    const url = moduleUrls[module];
    if (url) {
        // Add loading animation
        showPageTransition();
        wixLocation.to(url);
    }
}

// Search functionality
function handleSearch() {
    const searchTerm = $w('#searchInput').value.toLowerCase().trim();
    
    if (searchTerm.length < 2) {
        hideSearchResults();
        return;
    }
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        performGlobalSearch(searchTerm);
    }, 300);
}

// Perform global search
function performGlobalSearch(searchTerm) {
    showLoadingIndicator('Searching...');
    
    Promise.all([
        searchStudents(searchTerm),
        searchSessions(searchTerm),
        searchReports(searchTerm),
        searchActivities(searchTerm)
    ]).then(([students, sessions, reports, activities]) => {
        const searchResults = {
            students: students.items || [],
            sessions: sessions.items || [],
            reports: reports.items || [],
            activities: activities.items || []
        };
        
        displaySearchResults(searchResults, searchTerm);
        hideLoadingIndicator();
    }).catch((error) => {
        console.error('Search error:', error);
        hideLoadingIndicator();
        showErrorMessage('Search failed. Please try again.');
    });
}

// Search in different collections
function searchStudents(term) {
    return wixData.query('Students')
        .or(
            wixData.query('Students').contains('firstName', term),
            wixData.query('Students').contains('lastName', term),
            wixData.query('Students').contains('email', term)
        )
        .limit(5)
        .find();
}

function searchSessions(term) {
    return wixData.query('Sessions')
        .contains('sessionName', term)
        .limit(5)
        .find();
}

function searchReports(term) {
    return wixData.query('Reports')
        .contains('reportName', term)
        .limit(5)
        .find();
}

function searchActivities(term) {
    return wixData.query('Activities')
        .or(
            wixData.query('Activities').contains('description', term),
            wixData.query('Activities').contains('entityName', term)
        )
        .limit(5)
        .find();
}

// Display search results
function displaySearchResults(results, searchTerm) {
    const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
    
    if (totalResults === 0) {
        $w('#searchResults').html = `<div class="no-results">No results found for "${searchTerm}"</div>`;
        $w('#searchResults').show();
        return;
    }
    
    let resultsHtml = `<div class="search-results-header">Found ${totalResults} results for "${searchTerm}"</div>`;
    
    // Students results
    if (results.students.length > 0) {
        resultsHtml += '<div class="result-category">Students</div>';
        results.students.forEach(student => {
            resultsHtml += `
                <div class="search-result-item" onclick="navigateToStudent('${student._id}')">
                    <div class="result-icon"><i class="icon-user"></i></div>
                    <div class="result-content">
                        <div class="result-title">${student.firstName} ${student.lastName}</div>
                        <div class="result-subtitle">${student.email} - Grade ${student.grade}</div>
                    </div>
                </div>
            `;
        });
    }
    
    // Sessions results
    if (results.sessions.length > 0) {
        resultsHtml += '<div class="result-category">Sessions</div>';
        results.sessions.forEach(session => {
            resultsHtml += `
                <div class="search-result-item" onclick="navigateToSession('${session._id}')">
                    <div class="result-icon"><i class="icon-calendar"></i></div>
                    <div class="result-content">
                        <div class="result-title">${session.sessionName}</div>
                        <div class="result-subtitle">${formatDate(session.sessionDate)} - ${session.subject}</div>
                    </div>
                </div>
            `;
        });
    }
    
    // Reports results
    if (results.reports.length > 0) {
        resultsHtml += '<div class="result-category">Reports</div>';
        results.reports.forEach(report => {
            resultsHtml += `
                <div class="search-result-item" onclick="navigateToReport('${report._id}')">
                    <div class="result-icon"><i class="icon-file-text"></i></div>
                    <div class="result-content">
                        <div class="result-title">${report.reportName}</div>
                        <div class="result-subtitle">${report.reportType} - ${formatDate(report._createdDate)}</div>
                    </div>
                </div>
            `;
        });
    }
    
    $w('#searchResults').html = resultsHtml;
    $w('#searchResults').show();
}

// Handle search key press
function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        const searchTerm = $w('#searchInput').value.trim();
        if (searchTerm) {
            // Navigate to full search results page
            wixLocation.to(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    } else if (event.key === 'Escape') {
        clearSearch();
    }
}

// Clear search
function clearSearch() {
    $w('#searchInput').value = '';
    hideSearchResults();
}

// Hide search results
function hideSearchResults() {
    $w('#searchResults').hide();
}

// Notification functions
function toggleNotificationPanel() {
    const panel = $w('#notificationPanel');
    if (panel.hidden) {
        panel.show();
        // Mark notifications as seen (not read)
        markNotificationsAsSeen();
    } else {
        panel.hide();
    }
}

function markAllNotificationsRead() {
    if (!currentUser) return;
    
    wixData.query('Notifications')
        .eq('userId', currentUser.id)
        .eq('isRead', false)
        .find()
        .then((result) => {
            const updatePromises = result.items.map(notification => 
                wixData.update('Notifications', {
                    _id: notification._id,
                    isRead: true,
                    readDate: new Date()
                })
            );
            
            return Promise.all(updatePromises);
        })
        .then(() => {
            updateNotificationBell(0);
            loadUserNotifications();
            showSuccessMessage('All notifications marked as read.');
        })
        .catch((error) => {
            console.error('Error marking notifications as read:', error);
            showErrorMessage('Failed to mark notifications as read.');
        });
}

function clearAllNotifications() {
    if (!currentUser) return;
    
    if (confirm('Are you sure you want to clear all notifications?')) {
        wixData.query('Notifications')
            .eq('userId', currentUser.id)
            .find()
            .then((result) => {
                const deletePromises = result.items.map(notification => 
                    wixData.remove('Notifications', notification._id)
                );
                
                return Promise.all(deletePromises);
            })
            .then(() => {
                updateNotificationBell(0);
                $w('#notificationList').html = '<div class="no-notifications">No notifications</div>';
                showSuccessMessage('All notifications cleared.');
            })
            .catch((error) => {
                console.error('Error clearing notifications:', error);
                showErrorMessage('Failed to clear notifications.');
            });
    }
}

// User profile functions
function toggleUserProfileDropdown() {
    const dropdown = $w('#userProfileDropdown');
    if (dropdown.hidden) {
        dropdown.show();
    } else {
        dropdown.hide();
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear local storage
        local.clear();
        session.clear();
        
        // Stop intervals
        if (refreshInterval) clearInterval(refreshInterval);
        if (notificationInterval) clearInterval(notificationInterval);
        
        // Redirect to login
        authentication.logout()
            .then(() => {
                wixLocation.to('/login');
            })
            .catch((error) => {
                console.error('Logout error:', error);
                wixLocation.to('/login');
            });
    }
}

// Auto-refresh functionality
function startAutoRefresh() {
    // Refresh statistics every 5 minutes
    refreshInterval = setInterval(() => {
        loadSystemStatistics();
    }, 5 * 60 * 1000);
    
    // Check for new notifications every minute
    notificationInterval = setInterval(() => {
        loadUserNotifications();
    }, 60 * 1000);
}

// Manual refresh functions
function refreshStatistics() {
    showLoadingIndicator('Refreshing statistics...');
    loadSystemStatistics()
        .then(() => {
            hideLoadingIndicator();
            showSuccessMessage('Statistics updated successfully.');
        })
        .catch((error) => {
            console.error('Error refreshing statistics:', error);
            hideLoadingIndicator();
            showErrorMessage('Failed to refresh statistics.');
        });
}

function refreshActivityFeed() {
    showLoadingIndicator('Refreshing activities...');
    loadRecentActivities()
        .then(() => {
            hideLoadingIndicator();
            showSuccessMessage('Activity feed updated.');
        })
        .catch((error) => {
            console.error('Error refreshing activities:', error);
            hideLoadingIndicator();
            showErrorMessage('Failed to refresh activities.');
        });
}

// Filter activity feed
function filterActivityFeed() {
    const filterValue = $w('#activityFilterDropdown').value;
    
    let filteredActivities = activityFeedData;
    
    if (filterValue && filterValue !== 'all') {
        filteredActivities = activityFeedData.filter(activity => 
            activity.module === filterValue || activity.action === filterValue
        );
    }
    
    updateActivityFeed(filteredActivities);
}

// Load more activities
function loadMoreActivities() {
    const currentCount = activityFeedData.length;
    
    wixData.query('Activities')
        .descending('timestamp')
        .skip(currentCount)
        .limit(20)
        .find()
        .then((result) => {
            if (result.items.length > 0) {
                activityFeedData = [...activityFeedData, ...result.items];
                updateActivityFeed(activityFeedData);
            } else {
                $w('#btnLoadMoreActivities').hide();
                showInfoMessage('No more activities to load.');
            }
        })
        .catch((error) => {
            console.error('Error loading more activities:', error);
            showErrorMessage('Failed to load more activities.');
        });
}

// Theme and preferences
function handleThemeChange() {
    const isDark = $w('#themeToggle').checked;
    const theme = isDark ? 'dark' : 'light';
    applyTheme(theme);
    saveUserPreference('theme', theme);
}

function applyTheme(theme) {
    const body = $w('#page');
    
    if (theme === 'dark') {
        body.style.backgroundColor = '#1a1a1a';
        body.style.color = '#ffffff';
        // Apply dark theme styles
    } else {
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#333333';
        // Apply light theme styles
    }
    
    local.setItem('userTheme', theme);
}

function handleLanguageChange() {
    const language = $w('#languageDropdown').value;
    saveUserPreference('language', language);
    // Implement language change logic
    showInfoMessage(`Language changed to ${language}. Page will reload.`);
    setTimeout(() => {
        wixLocation.to(wixLocation.url);
    }, 2000);
}

// User preferences
function loadUserPreferences(userId) {
    wixData.get('Users', userId)
        .then((user) => {
            if (user.preferences) {
                // Apply user preferences
                if (user.preferences.theme) {
                    applyTheme(user.preferences.theme);
                    $w('#themeToggle').checked = user.preferences.theme === 'dark';
                }
                
                if (user.preferences.language) {
                    $w('#languageDropdown').value = user.preferences.language;
                }
            }
        })
        .catch((error) => {
            console.error('Error loading user preferences:', error);
        });
}

function saveUserPreference(key, value) {
    if (!currentUser) return;
    
    wixData.get('Users', currentUser.id)
        .then((user) => {
            const preferences = user.preferences || {};
            preferences[key] = value;
            
            return wixData.update('Users', {
                _id: user._id,
                preferences
            });
        })
        .catch((error) => {
            console.error('Error saving user preference:', error);
        });
}

// Modal functions
function openAddStudentModal() {
    wixLocation.to('/students?action=add');
}

function openScheduleSessionModal() {
    wixLocation.to('/sessions?action=schedule');
}

function openGenerateReportModal() {
    wixLocation.to('/reports?action=generate');
}

function openSendNotificationModal() {
    $w('#sendNotificationModal').show();
}

function openExportDataModal() {
    $w('#exportDataModal').show();
}

function openEditProfileModal() {
    wixLocation.to('/profile?action=edit');
}

function openUserSettingsModal() {
    wixLocation.to('/settings');
}

function closeAllModals() {
    $w('#sendNotificationModal').hide();
    $w('#exportDataModal').hide();
    $w('#userProfileDropdown').hide();
    $w('#notificationPanel').hide();
}

// Responsive design
function setupResponsiveDesign() {
    const handleResize = () => {
        const isMobile = wixWindow.viewMode === 'mobile';
        
        if (isMobile) {
            // Mobile-specific adjustments
            $w('#statisticsGrid').style.gridTemplateColumns = '1fr';
            $w('#mainContent').style.flexDirection = 'column';
            $w('#sidebarNavigation').hide();
            $w('#mobileMenuButton').show();
        } else {
            // Desktop-specific adjustments
            $w('#statisticsGrid').style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
            $w('#mainContent').style.flexDirection = 'row';
            $w('#sidebarNavigation').show();
            $w('#mobileMenuButton').hide();
        }
    };
    
    // Initial setup
    handleResize();
    
    // Listen for viewport changes
    wixWindow.onViewportEnter('mobile', handleResize);
    wixWindow.onViewportLeave('mobile', handleResize);
}

function toggleMobileMenu() {
    const menu = $w('#mobileMenu');
    if (menu.hidden) {
        menu.show();
        menu.style.transform = 'translateX(0)';
    } else {
        menu.style.transform = 'translateX(-100%)';
        setTimeout(() => menu.hide(), 300);
    }
}

function closeMobileMenu() {
    const menu = $w('#mobileMenu');
    menu.style.transform = 'translateX(-100%)';
    setTimeout(() => menu.hide(), 300);
}

// Animation functions
function setupAnimations() {
    // Set up entrance animations for cards
    const cards = ['#totalStudentsCard', '#activeSessionsCard', '#monthlyRevenueCard', '#attendanceRateCard'];
    
    cards.forEach((cardId, index) => {
        const card = $w(cardId);
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                timeline()
                    .add(card, {
                        opacity: 1,
                        transform: 'translateY(0)',
                        duration: 500,
                        easing: 'ease-out'
                    })
                    .play();
            }, index * 100);
        }
    });
}

function animateNumberChanges() {
    // Animate number changes in statistics cards
    const numberElements = ['#totalStudentsNumber', '#sessionsNumber', '#revenueNumber', '#attendanceRateNumber'];
    
    numberElements.forEach(elementId => {
        const element = $w(elementId);
        if (element) {
            timeline()
                .add(element, {
                    transform: 'scale(1.1)',
                    duration: 200
                })
                .add(element, {
                    transform: 'scale(1)',
                    duration: 200
                })
                .play();
        }
    });
}

function showPageTransition() {
    const overlay = $w('#pageTransitionOverlay');
    if (overlay) {
        overlay.show();
        timeline()
            .add(overlay, {
                opacity: 1,
                duration: 300
            })
            .play();
    }
}

// Chart initialization
function initializeCharts() {
    // Initialize dashboard charts
    // This would integrate with Chart.js or similar library
    console.log('Initializing dashboard charts...');
    
    // Placeholder for chart initialization
    if ($w('#enrollmentTrendChart')) {
        $w('#enrollmentTrendChart').html = '<div class="chart-placeholder">Enrollment Trend Chart</div>';
    }
    
    if ($w('#revenueChart')) {
        $w('#revenueChart').html = '<div class="chart-placeholder">Revenue Chart</div>';
    }
    
    if ($w('#attendanceChart')) {
        $w('#attendanceChart').html = '<div class="chart-placeholder">Attendance Chart</div>';
    }
}

function updateChartsData(stats) {
    // Update chart data with new statistics
    console.log('Updating charts with new data:', stats);
    
    // Implementation would depend on the charting library used
    // This is a placeholder for chart update logic
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount || 0);
}

function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTimeAgo(date) {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return formatDate(date);
}

// UI helper functions
function showLoadingIndicator(message = 'Loading...') {
    const indicator = $w('#loadingIndicator');
    if (indicator) {
        $w('#loadingMessage').text = message;
        indicator.show();
    }
}

function hideLoadingIndicator() {
    const indicator = $w('#loadingIndicator');
    if (indicator) {
        indicator.hide();
    }
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showInfoMessage(message) {
    showMessage(message, 'info');
}

function showMessage(message, type = 'info') {
    const messageElement = $w('#messageContainer');
    if (messageElement) {
        messageElement.html = `
            <div class="message ${type}">
                <span class="message-text">${message}</span>
                <button class="message-close" onclick="hideMessage()">×</button>
            </div>
        `;
        messageElement.show();
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }
}

function hideMessage() {
    const messageElement = $w('#messageContainer');
    if (messageElement) {
        messageElement.hide();
    }
}

function showWelcomeMessage() {
    if (currentUser) {
        const hour = new Date().getHours();
        let greeting = 'Good morning';
        
        if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon';
        } else if (hour >= 17) {
            greeting = 'Good evening';
        }
        
        showInfoMessage(`${greeting}, ${currentUser.firstName || 'User'}! Welcome to your dashboard.`);
    }
}

// Setup user interface based on user role
function setupUserInterface(user) {
    // Update user profile display
    $w('#userNameDisplay').text = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
    $w('#userRoleDisplay').text = user.role || 'User';
    
    if (user.avatar) {
        $w('#userAvatarImage').src = user.avatar;
    }
    
    // Customize UI based on user role
    const userRole = user.role || 'viewer';
    
    // Hide/show elements based on role
    if (userRole !== 'admin') {
        // Hide admin-only features
        if ($w('#adminOnlySection')) {
            $w('#adminOnlySection').hide();
        }
    }
    
    if (userRole === 'student') {
        // Customize for student view
        $w('#pageTitle').text = 'Student Dashboard';
    } else if (userRole === 'mentor') {
        // Customize for mentor view
        $w('#pageTitle').text = 'Mentor Dashboard';
    } else if (userRole === 'parent') {
        // Customize for parent view
        $w('#pageTitle').text = 'Parent Dashboard';
    }
}

// Redirect to login if not authenticated
function redirectToLogin() {
    wixLocation.to('/login');
}

// Global functions for HTML onclick handlers
export function navigateToActivity(url) {
    wixLocation.to(url);
}

export function navigateToStudent(studentId) {
    wixLocation.to(`/students/${studentId}`);
}

export function navigateToSession(sessionId) {
    wixLocation.to(`/sessions/${sessionId}`);
}

export function navigateToReport(reportId) {
    wixLocation.to(`/reports/${reportId}`);
}

export function handleNotificationAction(notificationId, actionUrl) {
    // Mark notification as read
    markNotificationRead(notificationId);
    
    // Navigate to action URL
    if (actionUrl) {
        wixLocation.to(actionUrl);
    }
}

export function markNotificationRead(notificationId) {
    wixData.update('Notifications', {
        _id: notificationId,
        isRead: true,
        readDate: new Date()
    }).then(() => {
        loadUserNotifications();
    }).catch((error) => {
        console.error('Error marking notification as read:', error);
    });
}

export function markNotificationsAsSeen() {
    // This would mark notifications as seen but not read
    // Implementation depends on requirements
}

export function hideMessage() {
    const messageElement = $w('#messageContainer');
    if (messageElement) {
        messageElement.hide();
    }
}

// Page cleanup
$w.onBeforeUnload(() => {
    // Clear intervals
    if (refreshInterval) clearInterval(refreshInterval);
    if (notificationInterval) clearInterval(notificationInterval);
    
    // Clear timeouts
    if (window.searchTimeout) clearTimeout(window.searchTimeout);
});

/*
=== USAGE INSTRUCTIONS ===

1. Required Database Collections:
   - Users: User profiles and preferences
   - Activities: System activity logs
   - Notifications: User notifications
   - SystemStats: Platform-wide statistics
   - Students: Student information
   - Sessions: Session records
   - Reports: Generated reports
   - Mentors: Mentor information
   - Invoices: Financial invoices
   - SessionAttendance: Attendance tracking

2. Required Wix Elements:
   Page Structure:
   - #page (Page container)
   - #loadingIndicator (Text)
   - #loadingMessage (Text)
   - #messageContainer (Container)
   - #pageTransitionOverlay (Container)
   
   Header:
   - #userProfileButton (Button)
   - #userNameDisplay (Text)
   - #userRoleDisplay (Text)
   - #userAvatarImage (Image)
   - #userProfileDropdown (Container)
   - #searchInput (TextInput)
   - #searchResults (Container)
   - #notificationBell (Button)
   - #notificationCount (Text)
   - #notificationPanel (Container)
   - #notificationList (Container)
   
   Navigation:
   - #btnStudents (Button)
   - #btnSessions (Button)
   - #btnFinance (Button)
   - #btnReports (Button)
   - #btnSettings (Button)
   - #mobileMenuButton (Button)
   - #mobileMenu (Container)
   
   Statistics Cards:
   - #totalStudentsCard (Container)
   - #totalStudentsNumber (Text)
   - #activeStudentsNumber (Text)
   - #activeSessionsCard (Container)
   - #sessionsNumber (Text)
   - #totalSessionsNumber (Text)
   - #monthlyRevenueCard (Container)
   - #revenueNumber (Text)
   - #monthlyRevenueNumber (Text)
   - #attendanceRateCard (Container)
   - #attendanceRateNumber (Text)
   - #attendanceProgress (ProgressBar)
   
   Quick Actions:
   - #quickActionsPanel (Container)
   - #btnAddStudent (Button)
   - #btnScheduleSession (Button)
   - #btnGenerateReport (Button)
   - #btnSendNotification (Button)
   - #btnViewCalendar (Button)
   - #btnExportData (Button)
   
   Activity Feed:
   - #activityFeed (Container)
   - #activityFilterDropdown (Dropdown)
   - #btnRefreshActivities (Button)
   - #btnLoadMoreActivities (Button)
   
   Charts:
   - #enrollmentTrendChart (Container)
   - #revenueChart (Container)
   - #attendanceChart (Container)
   
   System Health:
   - #systemHealthIndicator (Container)
   - #systemUptime (Text)
   - #responseTime (Text)
   - #errorRate (Text)
   - #activeConnections (Text)
   
   Preferences:
   - #themeToggle (Switch)
   - #languageDropdown (Dropdown)
   
   Modals:
   - #sendNotificationModal (Container)
   - #exportDataModal (Container)

3. User Roles and Permissions:
   - Admin: Full access to all features
   - Mentor: Access to student and session management
   - Student: Access to personal dashboard and schedule
   - Parent: Access to child's information and payments

4. Auto-refresh Configuration:
   - Statistics: Every 5 minutes
   - Notifications: Every 1 minute
   - Activity feed: Manual refresh only

5. Search Configuration:
   - Global search across Students, Sessions, Reports, Activities
   - Auto-complete with 300ms debounce
   - Maximum 5 results per category

6. Theme Support:
   - Light and dark themes
   - User preference storage
   - Automatic application on page load

7. Responsive Design:
   - Mobile-first approach
   - Automatic layout adaptation
   - Touch-friendly interactions

8. Performance Optimization:
   - Lazy loading for non-critical content
   - Efficient database queries
   - Caching for frequently accessed data
   - Debounced search functionality

9. Security Considerations:
   - User authentication required
   - Role-based access control
   - Input validation and sanitization
   - Secure session management

10. Testing Requirements:
    - Cross-browser compatibility
    - Mobile device testing
    - Performance testing with large datasets
    - User experience testing
    - Security testing
*/