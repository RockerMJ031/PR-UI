/**
 * Purple Ruler Academy Finance Dashboard - Complete Code Implementation
 * 
 * This file contains all the JavaScript code needed to implement the Finance Dashboard
 * for Purple Ruler Academy, including curriculum pricing management, student payment tracking,
 * and transaction status monitoring.
 * 
 * USAGE INSTRUCTIONS:
 * 1. Copy this code to your finance page's JavaScript section
 * 2. Configure database collections as specified in the guide
 * 3. Set up payment gateway credentials
 * 4. Test all functionality before going live
 */

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let financialData = {
    transactions: [],
    students: [],
    curriculumPackages: [],
    statistics: {
        totalPaid: 12450,
        outstandingPayments: 2340,
        overduePayments: 890,
        activeStudents: 45
    }
};

let selectedPlan = null;

// Curriculum packages configuration
const curriculumPackages = {
    'core-subjects': {
        name: 'Core Subjects',
        weeklyRate: 135,
        features: [
            'Purple Ruler Academy online school',
            'Individual tutoring sessions',
            'Core subjects support',
            'Personalized learning plans',
            'Progress tracking',
            'Regular assessments'
        ],
        curriculumProvider: 'Purple Ruler'
    },
    'core-plus': {
        name: 'Core Subjects + PSHE Careers + PE and Art',
        weeklyRate: 162,
        features: [
            'Purple Ruler Academy online school',
            'Comprehensive tutoring program',
            'All core subjects',
            'PSHE and Careers guidance',
            'Physical Education support',
            'Art tutoring sessions'
        ],
        curriculumProvider: 'Purple Ruler'
    },
    'all-subjects': {
        name: 'All Subjects + Therapy',
        weeklyRate: 207,
        features: [
            'Purple Ruler Academy online school',
            'Complete tutoring package',
            'All academic subjects',
            'Therapeutic support sessions',
            'Mental health resources',
            'Specialized interventions'
        ],
        curriculumProvider: 'Purple Ruler'
    },
    'blueprint': {
        name: 'Purple Ruler Blueprint',
        hourlyRate: 29.17,
        studentCapacity: '1-6 students per session',
        features: [
            'Uses your school\'s curriculum',
            'Student reintegration support',
            'Curriculum alignment support',
            'Teacher training resources',
            'Progress monitoring tools',
            'Flexible group sessions'
        ],
        curriculumProvider: 'School Curriculum',
        targetAudience: 'Schools'
    }
};

// Sample transaction data
const sampleTransactions = [
    {
        id: 'TXN001',
        date: '2024-01-15',
        studentName: 'Emma Johnson',
        description: 'Biology Tutoring - January',
        amount: 280,
        status: 'paid',
        curriculumType: 'Core Subjects'
    },
    {
        id: 'TXN002',
        date: '2024-01-12',
        studentName: 'James Smith',
        description: 'English & Maths - January',
        amount: 420,
        status: 'pending',
        curriculumType: 'Core Plus'
    },
    {
        id: 'TXN003',
        date: '2024-01-08',
        studentName: 'Sophie Chen',
        description: 'French Tutoring - December',
        amount: 210,
        status: 'overdue',
        curriculumType: 'Core Subjects'
    },
    {
        id: 'TXN004',
        date: '2024-01-05',
        studentName: 'Michael Brown',
        description: 'Physics & Science - January',
        amount: 350,
        status: 'paid',
        curriculumType: 'All Subjects'
    },
    {
        id: 'TXN005',
        date: '2024-01-03',
        studentName: 'Isabella Davis',
        description: 'Mental Health Reading Program',
        amount: 149,
        status: 'paid',
        curriculumType: 'All Subjects + Therapy'
    }
];

// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Purple Ruler Academy Finance Dashboard initializing...');
    
    // Initialize page
    initializePage();
    
    // Set up event handlers
    setupEventHandlers();
    
    // Load initial data
    loadFinancialData();
    
    // Set up responsive design
    setupResponsiveDesign();
    
    console.log('Finance Dashboard initialized successfully');
});

// ==========================================
// INITIALIZATION FUNCTIONS
// ==========================================

function initializePage() {
    // Load sample data
    financialData.transactions = sampleTransactions;
    
    // Update statistics
    updateStatisticsCards();
    
    // Update transactions table
    updateTransactionsTable();
    
    // Initialize pricing plans
    initializePricingPlans();
    
    console.log('Page initialized with sample data');
}

function setupEventHandlers() {
    // Header action buttons
    const generateInvoiceBtn = document.querySelector('.btn-primary');
    const exportReportBtn = document.querySelector('.btn-secondary');
    
    if (generateInvoiceBtn) {
        generateInvoiceBtn.addEventListener('click', generateInvoice);
    }
    
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', exportReport);
    }
    
    // Transaction table view buttons
    const viewButtons = document.querySelectorAll('.table .btn-info');
    viewButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => viewTransactionDetails(index));
    });
    
    console.log('Event handlers set up successfully');
}

function initializePricingPlans() {
    // Add click handlers to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('click', function() {
            const planType = this.getAttribute('onclick')?.match(/selectPlan\('([^']+)'\)/)?.[1];
            if (planType) {
                selectPlan(planType);
            }
        });
    });
}

// ==========================================
// DATA LOADING FUNCTIONS
// ==========================================

function loadFinancialData() {
    // In a real implementation, this would fetch data from the backend
    // For now, we'll use the sample data
    
    Promise.resolve()
        .then(() => {
            updateDashboard();
            console.log('Financial data loaded successfully');
        })
        .catch((error) => {
            console.error('Error loading financial data:', error);
            showNotification('Error loading financial data', 'error');
        });
}

function loadStudents() {
    // Mock function to load students data
    return Promise.resolve([
        { id: 'STU001', name: 'Emma Johnson', email: 'emma@example.com', studentType: 'Full Time', product: 'PRA - All Subject' },
        { id: 'STU002', name: 'James Smith', email: 'james@example.com', studentType: 'Part Time', product: 'Tutoring' },
        { id: 'STU003', name: 'Sophie Chen', email: 'sophie@example.com', studentType: 'Full Time', product: 'PRA - Core Subject' },
        { id: 'STU004', name: 'Michael Brown', email: 'michael@example.com', studentType: 'Part Time', product: 'Tutoring' },
        { id: 'STU005', name: 'Isabella Davis', email: 'isabella@example.com', studentType: 'Full Time', product: 'PRA - All Subject + Therapy' }
    ]);
}

function loadCurriculumPackages() {
    // Return the predefined curriculum packages
    return Promise.resolve(curriculumPackages);
}

// ==========================================
// UI UPDATE FUNCTIONS
// ==========================================

function updateDashboard() {
    updateStatisticsCards();
    updateTransactionsTable();
    updatePricingPlans();
}

function updateStatisticsCards() {
    const stats = financialData.statistics;
    
    // Update statistics cards with current data
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = `£${stats.totalPaid.toLocaleString()}`;
        statNumbers[1].textContent = `£${stats.outstandingPayments.toLocaleString()}`;
        statNumbers[2].textContent = `£${stats.overduePayments.toLocaleString()}`;
        statNumbers[3].textContent = stats.activeStudents.toString();
    }
}

function updateTransactionsTable() {
    // In a real implementation, this would update the table with dynamic data
    // For now, the table is static in HTML
    console.log('Transactions table updated with', financialData.transactions.length, 'transactions');
}

function updatePricingPlans() {
    // Update pricing plan displays if needed
    console.log('Pricing plans updated');
}

// ==========================================
// PLAN SELECTION FUNCTIONS
// ==========================================

function selectPlan(planType) {
    // Remove selected class from all cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    const clickedCard = document.querySelector(`[onclick*="${planType}"]`);
    if (clickedCard) {
        clickedCard.classList.add('selected');
    }
    
    // Update selected plan
    selectedPlan = planType;
    
    // Get plan details
    const planDetails = curriculumPackages[planType];
    if (planDetails) {
        const message = `${planDetails.name} plan selected!`;
        showNotification(message, 'success');
        
        // Log selection for analytics
        console.log('Plan selected:', planType, planDetails);
        
        // In a real implementation, you might want to:
        // - Save the selection to the database
        // - Update the student's curriculum package
        // - Trigger billing calculations
        // - Send confirmation email
    }
}

function getPlanDetails(planType) {
    return curriculumPackages[planType] || null;
}

function calculateWeeklyRate(planType, studentCount = 1) {
    const plan = curriculumPackages[planType];
    if (!plan) return 0;
    
    if (plan.weeklyRate) {
        return plan.weeklyRate * studentCount;
    } else if (plan.hourlyRate) {
        // Assume 5 hours per week for hourly plans
        return plan.hourlyRate * 5 * studentCount;
    }
    
    return 0;
}

// ==========================================
// TRANSACTION MANAGEMENT
// ==========================================

function viewTransactionDetails(transactionIndex) {
    const transaction = financialData.transactions[transactionIndex];
    if (transaction) {
        const details = `
            Transaction Details:
            ID: ${transaction.id}
            Student: ${transaction.studentName}
            Description: ${transaction.description}
            Amount: £${transaction.amount}
            Status: ${transaction.status.toUpperCase()}
            Date: ${transaction.date}
            Curriculum: ${transaction.curriculumType}
        `;
        
        alert(details);
        console.log('Transaction details viewed:', transaction);
    }
}

function updateTransactionStatus(transactionId, newStatus) {
    const transaction = financialData.transactions.find(t => t.id === transactionId);
    if (transaction) {
        transaction.status = newStatus;
        updateDashboard();
        showNotification(`Transaction ${transactionId} status updated to ${newStatus}`, 'success');
    }
}

function addTransaction(transactionData) {
    const newTransaction = {
        id: generateTransactionId(),
        date: new Date().toISOString().split('T')[0],
        ...transactionData
    };
    
    financialData.transactions.unshift(newTransaction);
    updateDashboard();
    showNotification('New transaction added successfully', 'success');
    
    return newTransaction;
}

// ==========================================
// FINANCIAL CALCULATIONS
// ==========================================

function calculateMonthlyRevenue(studentType = null, curriculumType = null, product = null) {
    let transactions = financialData.transactions.filter(t => t.status === 'paid');
    
    if (curriculumType) {
        transactions = transactions.filter(t => t.curriculumType === curriculumType);
    }
    
    if (product) {
        transactions = transactions.filter(t => t.product === product);
    }
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
        .filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);
}

function calculateOutstandingByPlan(planType) {
    return financialData.transactions
        .filter(t => t.status === 'pending' && t.curriculumType.includes(planType))
        .reduce((sum, t) => sum + t.amount, 0);
}

function generateFinancialSummary() {
    const summary = {
        totalRevenue: financialData.transactions
            .filter(t => t.status === 'paid')
            .reduce((sum, t) => sum + t.amount, 0),
        
        pendingPayments: financialData.transactions
            .filter(t => t.status === 'pending')
            .reduce((sum, t) => sum + t.amount, 0),
        
        overduePayments: financialData.transactions
            .filter(t => t.status === 'overdue')
            .reduce((sum, t) => sum + t.amount, 0),
        
        transactionsByPlan: {},
        
        monthlyTrend: calculateMonthlyTrend()
    };
    
    // Calculate revenue by curriculum plan
    Object.keys(curriculumPackages).forEach(planType => {
        const planName = curriculumPackages[planType].name;
        summary.transactionsByPlan[planName] = financialData.transactions
            .filter(t => t.curriculumType.includes(planName))
            .reduce((sum, t) => sum + t.amount, 0);
    });
    
    return summary;
}

function calculateMonthlyTrend() {
    // Calculate last 6 months trend
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        const monthlyRevenue = financialData.transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate.getMonth() === date.getMonth() && 
                       transactionDate.getFullYear() === date.getFullYear() &&
                       t.status === 'paid';
            })
            .reduce((sum, t) => sum + t.amount, 0);
        
        months.push({ month: monthName, revenue: monthlyRevenue });
    }
    
    return months;
}

// ==========================================
// ACTION FUNCTIONS
// ==========================================

function generateInvoice() {
    if (!selectedPlan) {
        showNotification('Please select a curriculum plan first', 'warning');
        return;
    }
    
    const planDetails = curriculumPackages[selectedPlan];
    const invoiceData = {
        planType: selectedPlan,
        planName: planDetails.name,
        amount: planDetails.weeklyRate || planDetails.hourlyRate,
        generatedDate: new Date().toISOString(),
        status: 'draft'
    };
    
    console.log('Generating invoice for:', invoiceData);
    showNotification(`Invoice generated for ${planDetails.name}`, 'success');
    
    // In a real implementation, this would:
    // - Create invoice record in database
    // - Generate PDF invoice
    // - Send email to student/parent
    // - Update financial records
}

function exportReport() {
    const summary = generateFinancialSummary();
    const reportData = {
        generatedDate: new Date().toISOString(),
        summary: summary,
        transactions: financialData.transactions,
        curriculumPackages: curriculumPackages
    };
    
    // Convert to CSV format
    const csvContent = convertToCSV(financialData.transactions);
    downloadCSV(csvContent, 'financial-report.csv');
    
    showNotification('Financial report exported successfully', 'success');
    console.log('Report exported:', reportData);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TXN${timestamp}${random}`;
}

function formatCurrency(amount) {
    return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

function convertToCSV(transactions) {
    const headers = ['Date', 'Student', 'Description', 'Amount', 'Status', 'Curriculum Type'];
    const csvRows = [headers.join(',')];
    
    transactions.forEach(transaction => {
        const row = [
            transaction.date,
            `"${transaction.studentName}"`,
            `"${transaction.description}"`,
            transaction.amount,
            transaction.status,
            `"${transaction.curriculumType}"`
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
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
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; margin-left: 10px; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles
    const bgColor = getNotificationColor(type);
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    // Add animation keyframes if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || '#17a2b8';
}

// ==========================================
// RESPONSIVE DESIGN
// ==========================================

function setupResponsiveDesign() {
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Initial responsive setup
    handleResize();
}

function handleResize() {
    const width = window.innerWidth;
    
    if (width < 768) {
        // Mobile layout adjustments
        adjustForMobile();
    } else if (width < 1200) {
        // Tablet layout adjustments
        adjustForTablet();
    } else {
        // Desktop layout adjustments
        adjustForDesktop();
    }
}

function adjustForMobile() {
    // Mobile-specific adjustments
    console.log('Adjusting for mobile layout');
}

function adjustForTablet() {
    // Tablet-specific adjustments
    console.log('Adjusting for tablet layout');
}

function adjustForDesktop() {
    // Desktop-specific adjustments
    console.log('Adjusting for desktop layout');
}

// ==========================================
// INTEGRATION FUNCTIONS
// ==========================================

function syncWithStudentManagement() {
    // Sync financial data with student management system
    console.log('Syncing with student management system');
}

function syncWithAdminDashboard() {
    // Sync financial data with admin dashboard
    console.log('Syncing with admin dashboard');
}

function updateSessionBookingPricing() {
    // Update session booking system with current pricing
    console.log('Updating session booking pricing');
}

// ==========================================
// EXPORT FOR TESTING
// ==========================================

// Export functions for testing (if in development environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        selectPlan,
        calculateWeeklyRate,
        generateFinancialSummary,
        formatCurrency,
        convertToCSV,
        curriculumPackages
    };
}

console.log('Purple Ruler Academy Finance Dashboard code loaded successfully');