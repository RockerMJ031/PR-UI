// Wix Reports Dashboard - Complete Implementation
// Frontend Velo Code for Reports Management

import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { local, session } from 'wix-storage';
import wixWindow from 'wix-window';
import { authentication } from 'wix-members';
import wixCrm from 'wix-crm';

// Page initialization
$w.onReady(function () {
    initializePage();
    setupEventHandlers();
    loadInitialData();
});

// Initialize page components
function initializePage() {
    console.log('Initializing Reports Dashboard...');
    
    // Set up user authentication
    authentication.getCurrentUser()
        .then((user) => {
            if (user.loggedIn) {
                setupUserInterface(user);
            } else {
                redirectToLogin();
            }
        })
        .catch((error) => {
            console.error('Authentication error:', error);
            showErrorMessage('Authentication failed. Please try again.');
        });
    
    // Initialize date pickers with default values
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    $w('#startDatePicker').value = lastMonth;
    $w('#endDatePicker').value = today;
    
    // Set up responsive design
    setupResponsiveDesign();
}

// Set up event handlers
function setupEventHandlers() {
    // Navigation buttons
    $w('#btnPerformanceReports').onClick(() => switchReportView('performance'));
    $w('#btnFinancialReports').onClick(() => switchReportView('financial'));
    $w('#btnAttendanceReports').onClick(() => switchReportView('attendance'));
    $w('#btnCustomReports').onClick(() => switchReportView('custom'));
    
    // Report generation buttons
    $w('#btnGenerateReport').onClick(generateReport);
    $w('#btnScheduleReport').onClick(openScheduleModal);
    $w('#btnExportReport').onClick(exportReport);
    
    // Filter and search
    $w('#searchInput').onInput(handleSearch);
    $w('#filterDropdown').onChange(handleFilter);
    $w('#dateRangeButton').onClick(openDateRangeModal);
    
    // Modal controls
    $w('#btnCloseModal').onClick(closeModal);
    $w('#btnSaveReport').onClick(saveReport);
    $w('#btnCancelModal').onClick(closeModal);
    
    // Export options
    $w('#btnExportPDF').onClick(() => exportReport('pdf'));
    $w('#btnExportExcel').onClick(() => exportReport('excel'));
    $w('#btnExportCSV').onClick(() => exportReport('csv'));
    
    // Scheduled reports management
    $w('#btnViewScheduled').onClick(viewScheduledReports);
    $w('#btnDeleteSchedule').onClick(deleteScheduledReport);
    
    // Chart interactions
    setupChartEventHandlers();
}

// Load initial data
function loadInitialData() {
    Promise.all([
        loadReportStatistics(),
        loadRecentReports(),
        loadScheduledReports(),
        loadReportTemplates()
    ]).then(() => {
        hideLoadingIndicator();
        console.log('Initial data loaded successfully');
    }).catch((error) => {
        console.error('Error loading initial data:', error);
        showErrorMessage('Failed to load dashboard data. Please refresh the page.');
    });
}

// Load report statistics
function loadReportStatistics() {
    return wixData.query('Reports')
        .limit(1000)
        .find()
        .then((results) => {
            const reports = results.items;
            
            // Calculate statistics
            const totalReports = reports.length;
            const scheduledReports = reports.filter(r => r.isScheduled).length;
            const recentReports = reports.filter(r => {
                const reportDate = new Date(r._createdDate);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return reportDate > weekAgo;
            }).length;
            
            // Update statistics cards
            updateStatisticsCards({
                total: totalReports,
                scheduled: scheduledReports,
                recent: recentReports,
                active: reports.filter(r => r.isActive).length
            });
            
            return reports;
        });
}

// Update statistics cards
function updateStatisticsCards(stats) {
    $w('#totalReportsText').text = stats.total.toString();
    $w('#scheduledReportsText').text = stats.scheduled.toString();
    $w('#recentReportsText').text = stats.recent.toString();
    $w('#activeReportsText').text = stats.active.toString();
    
    // Update progress indicators if available
    if ($w('#totalReportsProgress')) {
        $w('#totalReportsProgress').value = Math.min(stats.total / 100 * 100, 100);
    }
}

// Load recent reports
function loadRecentReports() {
    return wixData.query('Reports')
        .descending('_createdDate')
        .limit(10)
        .find()
        .then((results) => {
            updateRecentReportsList(results.items);
            return results.items;
        });
}

// Update recent reports list
function updateRecentReportsList(reports) {
    const listHtml = reports.map(report => `
        <div class="report-item" data-report-id="${report._id}">
            <div class="report-info">
                <h4>${report.reportName}</h4>
                <p>Type: ${report.reportType} | Created: ${formatDate(report._createdDate)}</p>
                <p>Status: ${report.status || 'Completed'}</p>
            </div>
            <div class="report-actions">
                <button class="btn-view" onclick="viewReport('${report._id}')">View</button>
                <button class="btn-export" onclick="exportReport('pdf', '${report._id}')">Export</button>
            </div>
        </div>
    `).join('');
    
    $w('#recentReportsList').html = listHtml;
}

// Switch report view
function switchReportView(reportType) {
    // Update active navigation
    $w('#btnPerformanceReports').style.backgroundColor = reportType === 'performance' ? '#4CAF50' : '#f0f0f0';
    $w('#btnFinancialReports').style.backgroundColor = reportType === 'financial' ? '#4CAF50' : '#f0f0f0';
    $w('#btnAttendanceReports').style.backgroundColor = reportType === 'attendance' ? '#4CAF50' : '#f0f0f0';
    $w('#btnCustomReports').style.backgroundColor = reportType === 'custom' ? '#4CAF50' : '#f0f0f0';
    
    // Store current report type
    session.setItem('currentReportType', reportType);
    
    // Load report type specific data
    loadReportTypeData(reportType);
    
    // Update UI based on report type
    updateReportTypeUI(reportType);
}

// Load report type specific data
function loadReportTypeData(reportType) {
    showLoadingIndicator();
    
    const queryPromise = wixData.query('Reports')
        .eq('reportType', reportType)
        .descending('_createdDate')
        .find();
    
    queryPromise.then((results) => {
        updateReportsList(results.items);
        generateReportCharts(results.items, reportType);
        hideLoadingIndicator();
    }).catch((error) => {
        console.error('Error loading report data:', error);
        showErrorMessage('Failed to load report data.');
        hideLoadingIndicator();
    });
}

// Update reports list
function updateReportsList(reports) {
    if (reports.length === 0) {
        $w('#reportsTable').html = '<p>No reports found for the selected criteria.</p>';
        return;
    }
    
    const tableHtml = `
        <table class="reports-table">
            <thead>
                <tr>
                    <th>Report Name</th>
                    <th>Type</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${reports.map(report => `
                    <tr>
                        <td>${report.reportName}</td>
                        <td>${report.reportType}</td>
                        <td>${formatDate(report._createdDate)}</td>
                        <td><span class="status ${report.status}">${report.status || 'Completed'}</span></td>
                        <td>
                            <button onclick="viewReport('${report._id}')">View</button>
                            <button onclick="editReport('${report._id}')">Edit</button>
                            <button onclick="exportReport('pdf', '${report._id}')">Export</button>
                            <button onclick="deleteReport('${report._id}')">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    $w('#reportsTable').html = tableHtml;
}

// Generate report
function generateReport() {
    const reportType = session.getItem('currentReportType') || 'performance';
    const startDate = $w('#startDatePicker').value;
    const endDate = $w('#endDatePicker').value;
    
    if (!startDate || !endDate) {
        showErrorMessage('Please select both start and end dates.');
        return;
    }
    
    if (startDate > endDate) {
        showErrorMessage('Start date cannot be after end date.');
        return;
    }
    
    showLoadingIndicator('Generating report...');
    
    const reportData = {
        reportName: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${formatDate(new Date())}`,
        reportType: reportType,
        parameters: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            filters: getActiveFilters()
        },
        status: 'generating',
        isActive: true
    };
    
    // Save report configuration
    wixData.save('Reports', reportData)
        .then((result) => {
            const reportId = result._id;
            
            // Generate report data based on type
            return generateReportData(reportType, reportData.parameters, reportId);
        })
        .then((generatedReport) => {
            hideLoadingIndicator();
            showSuccessMessage('Report generated successfully!');
            
            // Refresh the reports list
            loadReportTypeData(reportType);
            
            // Open the generated report
            viewReport(generatedReport._id);
        })
        .catch((error) => {
            console.error('Error generating report:', error);
            hideLoadingIndicator();
            showErrorMessage('Failed to generate report. Please try again.');
        });
}

// Generate report data based on type
function generateReportData(reportType, parameters, reportId) {
    switch (reportType) {
        case 'performance':
            return generatePerformanceReport(parameters, reportId);
        case 'financial':
            return generateFinancialReport(parameters, reportId);
        case 'attendance':
            return generateAttendanceReport(parameters, reportId);
        case 'custom':
            return generateCustomReport(parameters, reportId);
        default:
            throw new Error('Unknown report type');
    }
}

// Generate performance report
function generatePerformanceReport(parameters, reportId) {
    const startDate = new Date(parameters.startDate);
    const endDate = new Date(parameters.endDate);
    
    return Promise.all([
        wixData.query('Students').find(),
        wixData.query('Sessions')
            .between('sessionDate', startDate, endDate)
            .find(),
        wixData.query('SessionAttendance')
            .between('attendanceDate', startDate, endDate)
            .find()
    ]).then(([studentsResult, sessionsResult, attendanceResult]) => {
        const students = studentsResult.items;
        const sessions = sessionsResult.items;
        const attendance = attendanceResult.items;
        
        // Calculate performance metrics
        const performanceData = students.map(student => {
            const studentSessions = sessions.filter(s => s.studentId === student._id);
            const studentAttendance = attendance.filter(a => a.studentId === student._id);
            
            const totalSessions = studentSessions.length;
            const attendedSessions = studentAttendance.filter(a => a.status === 'present').length;
            const attendanceRate = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;
            
            // Calculate average performance score
            const performanceScores = studentAttendance
                .filter(a => a.performanceScore)
                .map(a => a.performanceScore);
            const avgPerformance = performanceScores.length > 0 
                ? performanceScores.reduce((sum, score) => sum + score, 0) / performanceScores.length 
                : 0;
            
            return {
                studentId: student._id,
                studentName: `${student.firstName} ${student.lastName}`,
                totalSessions,
                attendedSessions,
                attendanceRate: Math.round(attendanceRate * 100) / 100,
                averagePerformance: Math.round(avgPerformance * 100) / 100,
                grade: student.grade,
                subject: student.subject
            };
        });
        
        // Update report with generated data
        return wixData.update('Reports', {
            _id: reportId,
            reportData: {
                summary: {
                    totalStudents: students.length,
                    totalSessions: sessions.length,
                    averageAttendance: Math.round(
                        performanceData.reduce((sum, p) => sum + p.attendanceRate, 0) / performanceData.length * 100
                    ) / 100,
                    averagePerformance: Math.round(
                        performanceData.reduce((sum, p) => sum + p.averagePerformance, 0) / performanceData.length * 100
                    ) / 100
                },
                details: performanceData,
                charts: generatePerformanceCharts(performanceData)
            },
            status: 'completed',
            generatedDate: new Date()
        });
    });
}

// Generate financial report
function generateFinancialReport(parameters, reportId) {
    const startDate = new Date(parameters.startDate);
    const endDate = new Date(parameters.endDate);
    
    return Promise.all([
        wixData.query('Invoices')
            .between('invoiceDate', startDate, endDate)
            .find(),
        wixData.query('Payments')
            .between('paymentDate', startDate, endDate)
            .find(),
        wixData.query('Students').find()
    ]).then(([invoicesResult, paymentsResult, studentsResult]) => {
        const invoices = invoicesResult.items;
        const payments = paymentsResult.items;
        const students = studentsResult.items;
        
        // Calculate financial metrics
        const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
        const totalPaid = payments.reduce((sum, pay) => sum + (pay.amount || 0), 0);
        const totalOutstanding = totalInvoiced - totalPaid;
        
        // Monthly breakdown
        const monthlyData = {};
        invoices.forEach(invoice => {
            const month = new Date(invoice.invoiceDate).toISOString().substring(0, 7);
            if (!monthlyData[month]) {
                monthlyData[month] = { invoiced: 0, paid: 0 };
            }
            monthlyData[month].invoiced += invoice.amount || 0;
        });
        
        payments.forEach(payment => {
            const month = new Date(payment.paymentDate).toISOString().substring(0, 7);
            if (!monthlyData[month]) {
                monthlyData[month] = { invoiced: 0, paid: 0 };
            }
            monthlyData[month].paid += payment.amount || 0;
        });
        
        // Student payment status
        const studentPaymentStatus = students.map(student => {
            const studentInvoices = invoices.filter(inv => inv.studentId === student._id);
            const studentPayments = payments.filter(pay => pay.studentId === student._id);
            
            const totalInvoiced = studentInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
            const totalPaid = studentPayments.reduce((sum, pay) => sum + (pay.amount || 0), 0);
            
            return {
                studentId: student._id,
                studentName: `${student.firstName} ${student.lastName}`,
                totalInvoiced,
                totalPaid,
                outstanding: totalInvoiced - totalPaid,
                paymentStatus: totalInvoiced <= totalPaid ? 'Paid' : 'Outstanding'
            };
        });
        
        // Update report with generated data
        return wixData.update('Reports', {
            _id: reportId,
            reportData: {
                summary: {
                    totalInvoiced: Math.round(totalInvoiced * 100) / 100,
                    totalPaid: Math.round(totalPaid * 100) / 100,
                    totalOutstanding: Math.round(totalOutstanding * 100) / 100,
                    collectionRate: totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 10000) / 100 : 0
                },
                monthlyBreakdown: Object.keys(monthlyData).map(month => ({
                    month,
                    invoiced: Math.round(monthlyData[month].invoiced * 100) / 100,
                    paid: Math.round(monthlyData[month].paid * 100) / 100
                })),
                studentPaymentStatus,
                charts: generateFinancialCharts(monthlyData, studentPaymentStatus)
            },
            status: 'completed',
            generatedDate: new Date()
        });
    });
}

// Generate attendance report
function generateAttendanceReport(parameters, reportId) {
    const startDate = new Date(parameters.startDate);
    const endDate = new Date(parameters.endDate);
    
    return Promise.all([
        wixData.query('SessionAttendance')
            .between('attendanceDate', startDate, endDate)
            .find(),
        wixData.query('Sessions')
            .between('sessionDate', startDate, endDate)
            .find(),
        wixData.query('Students').find()
    ]).then(([attendanceResult, sessionsResult, studentsResult]) => {
        const attendance = attendanceResult.items;
        const sessions = sessionsResult.items;
        const students = studentsResult.items;
        
        // Calculate attendance metrics
        const totalSessions = sessions.length;
        const totalAttendanceRecords = attendance.length;
        const presentCount = attendance.filter(a => a.status === 'present').length;
        const absentCount = attendance.filter(a => a.status === 'absent').length;
        const lateCount = attendance.filter(a => a.status === 'late').length;
        
        const overallAttendanceRate = totalAttendanceRecords > 0 
            ? (presentCount / totalAttendanceRecords) * 100 
            : 0;
        
        // Student attendance breakdown
        const studentAttendance = students.map(student => {
            const studentRecords = attendance.filter(a => a.studentId === student._id);
            const studentSessions = sessions.filter(s => s.studentId === student._id);
            
            const present = studentRecords.filter(a => a.status === 'present').length;
            const absent = studentRecords.filter(a => a.status === 'absent').length;
            const late = studentRecords.filter(a => a.status === 'late').length;
            const total = studentSessions.length;
            
            return {
                studentId: student._id,
                studentName: `${student.firstName} ${student.lastName}`,
                totalSessions: total,
                present,
                absent,
                late,
                attendanceRate: total > 0 ? Math.round((present / total) * 10000) / 100 : 0,
                grade: student.grade,
                subject: student.subject
            };
        });
        
        // Daily attendance trends
        const dailyAttendance = {};
        attendance.forEach(record => {
            const date = new Date(record.attendanceDate).toISOString().substring(0, 10);
            if (!dailyAttendance[date]) {
                dailyAttendance[date] = { present: 0, absent: 0, late: 0 };
            }
            dailyAttendance[date][record.status]++;
        });
        
        // Update report with generated data
        return wixData.update('Reports', {
            _id: reportId,
            reportData: {
                summary: {
                    totalSessions,
                    totalStudents: students.length,
                    overallAttendanceRate: Math.round(overallAttendanceRate * 100) / 100,
                    presentCount,
                    absentCount,
                    lateCount
                },
                studentAttendance,
                dailyTrends: Object.keys(dailyAttendance).map(date => ({
                    date,
                    ...dailyAttendance[date],
                    total: dailyAttendance[date].present + dailyAttendance[date].absent + dailyAttendance[date].late
                })),
                charts: generateAttendanceCharts(studentAttendance, dailyAttendance)
            },
            status: 'completed',
            generatedDate: new Date()
        });
    });
}

// Generate custom report
function generateCustomReport(parameters, reportId) {
    // Custom report logic based on user-defined parameters
    const customFilters = parameters.filters || {};
    
    // Build dynamic query based on custom parameters
    let query = wixData.query('Students');
    
    if (customFilters.grade) {
        query = query.eq('grade', customFilters.grade);
    }
    
    if (customFilters.subject) {
        query = query.eq('subject', customFilters.subject);
    }
    
    return query.find()
        .then((studentsResult) => {
            const students = studentsResult.items;
            
            // Generate custom report data based on selected metrics
            const customData = students.map(student => ({
                studentId: student._id,
                studentName: `${student.firstName} ${student.lastName}`,
                grade: student.grade,
                subject: student.subject,
                enrollmentDate: student.enrollmentDate,
                status: student.status
            }));
            
            // Update report with generated data
            return wixData.update('Reports', {
                _id: reportId,
                reportData: {
                    summary: {
                        totalRecords: students.length,
                        filters: customFilters
                    },
                    details: customData,
                    charts: generateCustomCharts(customData)
                },
                status: 'completed',
                generatedDate: new Date()
            });
        });
}

// Export report
function exportReport(format = 'pdf', reportId = null) {
    if (!reportId) {
        showErrorMessage('Please select a report to export.');
        return;
    }
    
    showLoadingIndicator('Preparing export...');
    
    wixData.get('Reports', reportId)
        .then((report) => {
            if (!report.reportData) {
                throw new Error('Report data not available');
            }
            
            switch (format.toLowerCase()) {
                case 'pdf':
                    return exportToPDF(report);
                case 'excel':
                    return exportToExcel(report);
                case 'csv':
                    return exportToCSV(report);
                default:
                    throw new Error('Unsupported export format');
            }
        })
        .then((exportResult) => {
            hideLoadingIndicator();
            showSuccessMessage(`Report exported successfully as ${format.toUpperCase()}!`);
            
            // Trigger download
            if (exportResult.downloadUrl) {
                wixWindow.openLightbox('downloadLightbox', { url: exportResult.downloadUrl });
            }
        })
        .catch((error) => {
            console.error('Export error:', error);
            hideLoadingIndicator();
            showErrorMessage('Failed to export report. Please try again.');
        });
}

// Export to PDF
function exportToPDF(report) {
    // Implementation would use a PDF generation service
    // This is a placeholder for the actual PDF generation logic
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                downloadUrl: `https://example.com/reports/${report._id}.pdf`,
                filename: `${report.reportName}.pdf`
            });
        }, 2000);
    });
}

// Export to Excel
function exportToExcel(report) {
    // Implementation would use an Excel generation service
    // This is a placeholder for the actual Excel generation logic
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                downloadUrl: `https://example.com/reports/${report._id}.xlsx`,
                filename: `${report.reportName}.xlsx`
            });
        }, 1500);
    });
}

// Export to CSV
function exportToCSV(report) {
    const csvData = convertReportToCSV(report);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    return Promise.resolve({
        downloadUrl: url,
        filename: `${report.reportName}.csv`
    });
}

// Convert report data to CSV format
function convertReportToCSV(report) {
    const data = report.reportData.details || [];
    if (data.length === 0) return '';
    
    // Get headers from first data item
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Escape commas and quotes in values
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');
    
    return csvContent;
}

// Schedule report
function openScheduleModal() {
    $w('#scheduleModal').show();
    
    // Initialize schedule form
    $w('#scheduleFrequency').value = 'weekly';
    $w('#scheduleTime').value = '09:00';
    $w('#scheduleEmail').value = '';
    
    // Set up schedule form handlers
    $w('#btnSaveSchedule').onClick(saveScheduledReport);
}

// Save scheduled report
function saveScheduledReport() {
    const frequency = $w('#scheduleFrequency').value;
    const time = $w('#scheduleTime').value;
    const email = $w('#scheduleEmail').value;
    const reportType = session.getItem('currentReportType') || 'performance';
    
    if (!email) {
        showErrorMessage('Please enter an email address for the scheduled report.');
        return;
    }
    
    const scheduleData = {
        reportType,
        frequency,
        time,
        email,
        isActive: true,
        nextRunDate: calculateNextRunDate(frequency, time),
        parameters: {
            startDate: $w('#startDatePicker').value?.toISOString(),
            endDate: $w('#endDatePicker').value?.toISOString(),
            filters: getActiveFilters()
        }
    };
    
    wixData.save('ScheduledReports', scheduleData)
        .then((result) => {
            closeModal();
            showSuccessMessage('Report scheduled successfully!');
            loadScheduledReports();
        })
        .catch((error) => {
            console.error('Error scheduling report:', error);
            showErrorMessage('Failed to schedule report. Please try again.');
        });
}

// Calculate next run date for scheduled report
function calculateNextRunDate(frequency, time) {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    let nextRun = new Date(now);
    nextRun.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, move to next occurrence
    if (nextRun <= now) {
        switch (frequency) {
            case 'daily':
                nextRun.setDate(nextRun.getDate() + 1);
                break;
            case 'weekly':
                nextRun.setDate(nextRun.getDate() + 7);
                break;
            case 'monthly':
                nextRun.setMonth(nextRun.getMonth() + 1);
                break;
        }
    }
    
    return nextRun;
}

// Load scheduled reports
function loadScheduledReports() {
    return wixData.query('ScheduledReports')
        .eq('isActive', true)
        .find()
        .then((results) => {
            updateScheduledReportsList(results.items);
            return results.items;
        });
}

// Update scheduled reports list
function updateScheduledReportsList(scheduledReports) {
    if (scheduledReports.length === 0) {
        $w('#scheduledReportsList').html = '<p>No scheduled reports found.</p>';
        return;
    }
    
    const listHtml = scheduledReports.map(schedule => `
        <div class="scheduled-report-item" data-schedule-id="${schedule._id}">
            <div class="schedule-info">
                <h4>${schedule.reportType.charAt(0).toUpperCase() + schedule.reportType.slice(1)} Report</h4>
                <p>Frequency: ${schedule.frequency} at ${schedule.time}</p>
                <p>Email: ${schedule.email}</p>
                <p>Next Run: ${formatDate(schedule.nextRunDate)}</p>
            </div>
            <div class="schedule-actions">
                <button onclick="editSchedule('${schedule._id}')">Edit</button>
                <button onclick="deleteSchedule('${schedule._id}')">Delete</button>
            </div>
        </div>
    `).join('');
    
    $w('#scheduledReportsList').html = listHtml;
}

// Handle search
function handleSearch() {
    const searchTerm = $w('#searchInput').value.toLowerCase();
    const reportType = session.getItem('currentReportType') || 'performance';
    
    if (searchTerm.length < 2) {
        loadReportTypeData(reportType);
        return;
    }
    
    wixData.query('Reports')
        .eq('reportType', reportType)
        .contains('reportName', searchTerm)
        .find()
        .then((results) => {
            updateReportsList(results.items);
        })
        .catch((error) => {
            console.error('Search error:', error);
            showErrorMessage('Search failed. Please try again.');
        });
}

// Handle filter
function handleFilter() {
    const filterValue = $w('#filterDropdown').value;
    const reportType = session.getItem('currentReportType') || 'performance';
    
    let query = wixData.query('Reports').eq('reportType', reportType);
    
    if (filterValue && filterValue !== 'all') {
        query = query.eq('status', filterValue);
    }
    
    query.find()
        .then((results) => {
            updateReportsList(results.items);
        })
        .catch((error) => {
            console.error('Filter error:', error);
            showErrorMessage('Filter failed. Please try again.');
        });
}

// Get active filters
function getActiveFilters() {
    return {
        search: $w('#searchInput').value,
        status: $w('#filterDropdown').value,
        dateRange: {
            start: $w('#startDatePicker').value,
            end: $w('#endDatePicker').value
        }
    };
}

// Generate charts for different report types
function generateReportCharts(reports, reportType) {
    switch (reportType) {
        case 'performance':
            generatePerformanceCharts(reports);
            break;
        case 'financial':
            generateFinancialCharts(reports);
            break;
        case 'attendance':
            generateAttendanceCharts(reports);
            break;
        case 'custom':
            generateCustomCharts(reports);
            break;
    }
}

// Generate performance charts
function generatePerformanceCharts(data) {
    // This would integrate with a charting library like Chart.js or similar
    // Placeholder implementation
    console.log('Generating performance charts with data:', data);
    
    // Update chart containers with generated charts
    if ($w('#performanceChart')) {
        $w('#performanceChart').html = '<div>Performance Chart Placeholder</div>';
    }
}

// Generate financial charts
function generateFinancialCharts(monthlyData, studentData) {
    console.log('Generating financial charts with data:', { monthlyData, studentData });
    
    if ($w('#financialChart')) {
        $w('#financialChart').html = '<div>Financial Chart Placeholder</div>';
    }
}

// Generate attendance charts
function generateAttendanceCharts(studentData, dailyData) {
    console.log('Generating attendance charts with data:', { studentData, dailyData });
    
    if ($w('#attendanceChart')) {
        $w('#attendanceChart').html = '<div>Attendance Chart Placeholder</div>';
    }
}

// Generate custom charts
function generateCustomCharts(data) {
    console.log('Generating custom charts with data:', data);
    
    if ($w('#customChart')) {
        $w('#customChart').html = '<div>Custom Chart Placeholder</div>';
    }
}

// Setup chart event handlers
function setupChartEventHandlers() {
    // Chart interaction handlers would go here
    // This depends on the specific charting library used
}

// Utility functions
function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount || 0);
}

function formatPercentage(value) {
    return `${Math.round((value || 0) * 100) / 100}%`;
}

// UI helper functions
function showLoadingIndicator(message = 'Loading...') {
    if ($w('#loadingIndicator')) {
        $w('#loadingIndicator').text = message;
        $w('#loadingIndicator').show();
    }
}

function hideLoadingIndicator() {
    if ($w('#loadingIndicator')) {
        $w('#loadingIndicator').hide();
    }
}

function showSuccessMessage(message) {
    if ($w('#successMessage')) {
        $w('#successMessage').text = message;
        $w('#successMessage').show();
        setTimeout(() => $w('#successMessage').hide(), 5000);
    }
}

function showErrorMessage(message) {
    if ($w('#errorMessage')) {
        $w('#errorMessage').text = message;
        $w('#errorMessage').show();
        setTimeout(() => $w('#errorMessage').hide(), 5000);
    }
}

function closeModal() {
    $w('#scheduleModal').hide();
    $w('#reportModal').hide();
    $w('#dateRangeModal').hide();
}

// Setup user interface based on user role
function setupUserInterface(user) {
    // Customize UI based on user permissions
    const userRole = user.role || 'viewer';
    
    if (userRole === 'admin') {
        // Show all features for admin users
        $w('#btnScheduleReport').show();
        $w('#btnDeleteReport').show();
    } else {
        // Hide admin-only features for regular users
        $w('#btnScheduleReport').hide();
        $w('#btnDeleteReport').hide();
    }
}

// Redirect to login if not authenticated
function redirectToLogin() {
    wixLocation.to('/login');
}

// Setup responsive design
function setupResponsiveDesign() {
    // Responsive design logic
    const handleResize = () => {
        const screenWidth = wixWindow.viewMode === 'mobile' ? 'mobile' : 'desktop';
        
        if (screenWidth === 'mobile') {
            // Mobile-specific adjustments
            $w('#reportsTable').style.fontSize = '12px';
            $w('#statisticsContainer').style.flexDirection = 'column';
        } else {
            // Desktop-specific adjustments
            $w('#reportsTable').style.fontSize = '14px';
            $w('#statisticsContainer').style.flexDirection = 'row';
        }
    };
    
    // Initial setup
    handleResize();
    
    // Listen for viewport changes
    wixWindow.onViewportEnter('mobile', handleResize);
    wixWindow.onViewportLeave('mobile', handleResize);
}

// Global functions for HTML onclick handlers
export function viewReport(reportId) {
    wixData.get('Reports', reportId)
        .then((report) => {
            // Open report in modal or new page
            session.setItem('currentReport', JSON.stringify(report));
            wixLocation.to(`/report-view?id=${reportId}`);
        })
        .catch((error) => {
            console.error('Error viewing report:', error);
            showErrorMessage('Failed to load report.');
        });
}

export function editReport(reportId) {
    // Implementation for editing reports
    session.setItem('editingReportId', reportId);
    wixLocation.to(`/report-edit?id=${reportId}`);
}

export function deleteReport(reportId) {
    if (confirm('Are you sure you want to delete this report?')) {
        wixData.remove('Reports', reportId)
            .then(() => {
                showSuccessMessage('Report deleted successfully.');
                const currentReportType = session.getItem('currentReportType') || 'performance';
                loadReportTypeData(currentReportType);
            })
            .catch((error) => {
                console.error('Error deleting report:', error);
                showErrorMessage('Failed to delete report.');
            });
    }
}

export function editSchedule(scheduleId) {
    // Implementation for editing scheduled reports
    session.setItem('editingScheduleId', scheduleId);
    openScheduleModal();
    
    // Load existing schedule data
    wixData.get('ScheduledReports', scheduleId)
        .then((schedule) => {
            $w('#scheduleFrequency').value = schedule.frequency;
            $w('#scheduleTime').value = schedule.time;
            $w('#scheduleEmail').value = schedule.email;
        });
}

export function deleteSchedule(scheduleId) {
    if (confirm('Are you sure you want to delete this scheduled report?')) {
        wixData.remove('ScheduledReports', scheduleId)
            .then(() => {
                showSuccessMessage('Scheduled report deleted successfully.');
                loadScheduledReports();
            })
            .catch((error) => {
                console.error('Error deleting schedule:', error);
                showErrorMessage('Failed to delete scheduled report.');
            });
    }
}

// Backend Code (to be placed in backend files)

/* 
=== BACKEND CODE ===
Place the following code in appropriate backend files:

// backend/reports.jsw
import { ok, badRequest, serverError } from 'wix-http-functions';
import wixData from 'wix-data';
import { sendEmail } from 'backend/email-service';

// Generate and send scheduled reports
export async function processScheduledReports() {
    try {
        const now = new Date();
        
        // Find scheduled reports that need to run
        const scheduledReports = await wixData.query('ScheduledReports')
            .eq('isActive', true)
            .le('nextRunDate', now)
            .find();
        
        for (const schedule of scheduledReports.items) {
            try {
                // Generate the report
                const reportData = await generateScheduledReport(schedule);
                
                // Send email with report
                await sendReportEmail(schedule.email, reportData, schedule.reportType);
                
                // Update next run date
                const nextRunDate = calculateNextRunDate(schedule.frequency, schedule.time);
                await wixData.update('ScheduledReports', {
                    _id: schedule._id,
                    nextRunDate,
                    lastRunDate: now
                });
                
                console.log(`Scheduled report sent successfully: ${schedule._id}`);
            } catch (error) {
                console.error(`Error processing scheduled report ${schedule._id}:`, error);
            }
        }
        
        return ok({ processed: scheduledReports.items.length });
    } catch (error) {
        console.error('Error processing scheduled reports:', error);
        return serverError({ error: 'Failed to process scheduled reports' });
    }
}

// Generate report data for scheduled reports
async function generateScheduledReport(schedule) {
    const { reportType, parameters } = schedule;
    
    switch (reportType) {
        case 'performance':
            return await generatePerformanceReportData(parameters);
        case 'financial':
            return await generateFinancialReportData(parameters);
        case 'attendance':
            return await generateAttendanceReportData(parameters);
        default:
            throw new Error(`Unknown report type: ${reportType}`);
    }
}

// backend/email-service.jsw
import { sendEmail } from 'wix-crm';

// Send report via email
export async function sendReportEmail(email, reportData, reportType) {
    const subject = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${new Date().toLocaleDateString()}`;
    
    const htmlContent = generateReportEmailHTML(reportData, reportType);
    
    return await sendEmail({
        to: email,
        subject,
        htmlContent
    });
}

// Generate HTML content for report email
function generateReportEmailHTML(reportData, reportType) {
    return `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .summary { background-color: #f5f5f5; padding: 15px; margin: 20px 0; }
                .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .data-table th, .data-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .data-table th { background-color: #4CAF50; color: white; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h1>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">
                <div class="summary">
                    <h2>Summary</h2>
                    ${generateSummaryHTML(reportData.summary)}
                </div>
                <div class="details">
                    <h2>Detailed Data</h2>
                    ${generateDetailsHTML(reportData.details)}
                </div>
            </div>
        </body>
        </html>
    `;
}

function generateSummaryHTML(summary) {
    return Object.keys(summary).map(key => 
        `<p><strong>${key}:</strong> ${summary[key]}</p>`
    ).join('');
}

function generateDetailsHTML(details) {
    if (!details || details.length === 0) {
        return '<p>No detailed data available.</p>';
    }
    
    const headers = Object.keys(details[0]);
    
    return `
        <table class="data-table">
            <thead>
                <tr>
                    ${headers.map(header => `<th>${header}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${details.map(row => `
                    <tr>
                        ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}
*/

// Usage Instructions and Configuration

/*
=== USAGE INSTRUCTIONS ===

1. Required Database Collections:
   - Reports: Store generated reports
     Fields: reportName (Text), reportType (Text), reportData (Object), status (Text), 
             parameters (Object), isActive (Boolean), isScheduled (Boolean)
   
   - ScheduledReports: Store scheduled report configurations
     Fields: reportType (Text), frequency (Text), time (Text), email (Text), 
             nextRunDate (Date), lastRunDate (Date), isActive (Boolean), parameters (Object)
   
   - Students: Student information
   - Sessions: Session records
   - SessionAttendance: Attendance tracking
   - Invoices: Financial invoices
   - Payments: Payment records

2. Required Wix Elements:
   Page Elements:
   - #loadingIndicator (Text)
   - #successMessage (Text)
   - #errorMessage (Text)
   
   Statistics Cards:
   - #totalReportsText (Text)
   - #scheduledReportsText (Text)
   - #recentReportsText (Text)
   - #activeReportsText (Text)
   
   Navigation:
   - #btnPerformanceReports (Button)
   - #btnFinancialReports (Button)
   - #btnAttendanceReports (Button)
   - #btnCustomReports (Button)
   
   Report Controls:
   - #btnGenerateReport (Button)
   - #btnScheduleReport (Button)
   - #btnExportReport (Button)
   - #btnViewScheduled (Button)
   
   Filters and Search:
   - #searchInput (TextInput)
   - #filterDropdown (Dropdown)
   - #startDatePicker (DatePicker)
   - #endDatePicker (DatePicker)
   - #dateRangeButton (Button)
   
   Data Display:
   - #reportsTable (HtmlComponent)
   - #recentReportsList (HtmlComponent)
   - #scheduledReportsList (HtmlComponent)
   
   Charts:
   - #performanceChart (HtmlComponent)
   - #financialChart (HtmlComponent)
   - #attendanceChart (HtmlComponent)
   - #customChart (HtmlComponent)
   
   Modals:
   - #scheduleModal (Container)
   - #reportModal (Container)
   - #dateRangeModal (Container)
   
   Schedule Form:
   - #scheduleFrequency (Dropdown)
   - #scheduleTime (TimePicker)
   - #scheduleEmail (TextInput)
   - #btnSaveSchedule (Button)
   - #btnCancelModal (Button)
   
   Export Buttons:
   - #btnExportPDF (Button)
   - #btnExportExcel (Button)
   - #btnExportCSV (Button)

3. Member Permissions:
   - Admin: Full access to all features
   - Manager: Can generate and view reports, limited scheduling
   - Viewer: Can only view existing reports

4. Email Service Configuration:
   - Configure Wix CRM email service
   - Set up email templates for scheduled reports
   - Configure SMTP settings if using external email service

5. Chart Integration:
   - Install Chart.js or similar charting library
   - Configure chart containers in HTML components
   - Customize chart styles and interactions

6. Security Considerations:
   - Implement proper user authentication
   - Validate all user inputs
   - Sanitize data before database operations
   - Use HTTPS for all communications
   - Implement rate limiting for report generation

7. Performance Optimization:
   - Index database collections for faster queries
   - Implement caching for frequently accessed data
   - Use pagination for large datasets
   - Optimize chart rendering for large data sets
   - Implement lazy loading for report lists

8. Testing Checklist:
   - Test all report types with various data sets
   - Verify export functionality for all formats
   - Test scheduled report generation and email delivery
   - Validate responsive design on different devices
   - Test error handling and edge cases
   - Verify user permission controls
   - Test performance with large datasets
   - Validate data accuracy in generated reports

9. Deployment Steps:
   - Set up all required database collections
   - Configure member permissions
   - Set up email service integration
   - Install and configure charting library
   - Test all functionality in preview mode
   - Deploy to live site
   - Monitor performance and error logs

10. Maintenance:
    - Regular database cleanup and optimization
    - Monitor scheduled report execution
    - Update chart library and dependencies
    - Review and optimize performance metrics
    - Backup report data regularly
    - Update security configurations as needed
*/