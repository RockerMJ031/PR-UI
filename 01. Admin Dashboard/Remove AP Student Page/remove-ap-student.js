// Wix API imports
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import { fetch } from 'wix-fetch';

class RemoveAPStudentManager {
    constructor() {
        this.currentUser = null;
        this.schoolID = null;
        this.studentsData = [];
        this.selectedStudent = null;
        this.isLoading = false;
        this.init();
    }

    async init() {
        try {
            await this.authenticateUser();
            await this.loadInitialStudentData();
            this.setupEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
            this.handleError('Failed to initialize page. Please refresh and try again.');
        }
    }

    // Feature 0: Page Load and Initial Student Display
    async authenticateUser() {
        try {
            this.showLoadingState(true);
            
            // Get current user from Wix Users API
            this.currentUser = await wixUsers.getCurrentUser();
            
            if (!this.currentUser || !this.currentUser.loggedIn) {
                throw new Error('User not authenticated');
            }

            // Query CMS-6 (Admins Collection) for user authentication and schoolID
            const adminQuery = await wixData.query('Admins')
                .eq('email', this.currentUser.email)
                .find();

            if (adminQuery.items.length === 0) {
                throw new Error('Admin user not found in system');
            }

            const adminData = adminQuery.items[0];
            this.schoolID = adminData.schoolID;
            
            if (!this.schoolID) {
                throw new Error('School ID not found for current user');
            }

            console.log('User authenticated successfully:', {
                email: this.currentUser.email,
                schoolID: this.schoolID
            });

        } catch (error) {
            console.error('Authentication error:', error);
            throw new Error('Authentication failed: ' + error.message);
        }
    }

    async loadInitialStudentData() {
        try {
            this.showLoadingState(true);
            
            // Query CMS-7 (Students Collection) for student data based on schoolID
            const studentsQuery = await wixData.query('Students')
                .eq('schoolID', this.schoolID)
                .eq('status', 'active')
                .ascending('lastName')
                .find();

            this.studentsData = studentsQuery.items;
            
            // Display students in the studentList repeater
            this.displayStudentList();
            
            this.showLoadingState(false);
            
            if (this.studentsData.length === 0) {
                this.showEmptyState();
            }

        } catch (error) {
            console.error('Error loading student data:', error);
            this.showLoadingState(false);
            this.handleError('Failed to load student data. Please try again.');
            // Provide fallback data if no students are found
            this.loadFallbackData();
        }
    }

    displayStudentList() {
        const studentList = $w('#studentList');
        
        if (!studentList) {
            console.error('Student list repeater not found');
            return;
        }

        // Set repeater data
        studentList.data = this.studentsData.map(student => ({
            _id: student._id,
            studentId: student.studentId || student._id,
            studentName: `${student.firstName} ${student.lastName}`,
            apPlan: student.apPlan || 'Standard AP Plan',
            status: student.status || 'ACTIVE'
        }));

        // Configure repeater item display
        studentList.onItemReady(($item, itemData) => {
            // Set student name
            if ($item('#studentName')) {
                $item('#studentName').text = itemData.studentName;
            }
            
            // Set AP plan information
            if ($item('#apPlan')) {
                $item('#apPlan').text = itemData.apPlan;
            }
            
            // Set status label
            if ($item('#studentStatus')) {
                $item('#studentStatus').text = itemData.status;
                // Add status styling
                if (itemData.status === 'ACTIVE') {
                    $item('#studentStatus').style.backgroundColor = '#10B981';
                    $item('#studentStatus').style.color = '#FFFFFF';
                } else {
                    $item('#studentStatus').style.backgroundColor = '#F59E0B';
                    $item('#studentStatus').style.color = '#FFFFFF';
                }
            }
            
            // Set up remove button click handler
            if ($item('#removeBtn')) {
                $item('#removeBtn').onClick(() => {
                    this.handleRemoveButtonClick(itemData);
                });
            }
        });
    }

    loadFallbackData() {
        // Provide sample data if no students are found
        this.studentsData = [
            {
                _id: 'sample_001',
                studentId: 'AP2024001',
                firstName: 'John',
                lastName: 'Doe',
                apPlan: 'Advanced AP Plan',
                status: 'ACTIVE'
            },
            {
                _id: 'sample_002',
                studentId: 'AP2024002',
                firstName: 'Jane',
                lastName: 'Smith',
                apPlan: 'Standard AP Plan',
                status: 'ACTIVE'
            }
        ];
        
        this.displayStudentList();
        this.showNotification('Using sample data. Please check your connection.', 'warning');
    }

    // Feature 2: Remove Button Click
    handleRemoveButtonClick(studentData) {
        this.selectedStudent = studentData;
        this.showConfirmationDialog();
    }

    showConfirmationDialog() {
        const confirmationLightbox = $w('#confirmationLightbox');
        const confirmationTitle = $w('#confirmationTitle');
        const confirmationMessage = $w('#confirmationMessage');
        
        if (confirmationTitle) {
            confirmationTitle.text = 'Confirm Student Removal';
        }
        
        if (confirmationMessage) {
            confirmationMessage.text = `Are you sure you want to remove ${this.selectedStudent.studentName} from the AP program? This action cannot be undone.`;
        }
        
        if (confirmationLightbox) {
            confirmationLightbox.show();
        }
    }

    // Feature 3: Confirmation Action
    async handleConfirmRemoval() {
        try {
            this.showLoadingState(true);
            
            // Update student status in CMS-7 (Students Collection)
            await wixData.update('Students', {
                _id: this.selectedStudent._id,
                status: 'removed',
                removalDate: new Date(),
                removedBy: this.currentUser.email
            });
            
            // Create record in CMS-5 (DataSyncLogs) for tracking
            await wixData.insert('DataSyncLogs', {
                operation: 'student_removal',
                studentId: this.selectedStudent.studentId,
                studentName: this.selectedStudent.studentName,
                schoolID: this.schoolID,
                processedBy: this.currentUser.email,
                timestamp: new Date(),
                status: 'completed'
            });
            
            // Send notification to Lark Anycross
            await this.sendLarkNotification();
            
            this.hideConfirmationDialog();
            this.showSuccessLightbox();
            
        } catch (error) {
            console.error('Error processing removal:', error);
            this.showLoadingState(false);
            this.showNotification('Failed to process removal. Please try again.', 'error');
        }
    }

    async sendLarkNotification() {
        try {
            const notificationData = {
                type: 'student_removal',
                studentId: this.selectedStudent.studentId,
                studentName: this.selectedStudent.studentName,
                schoolID: this.schoolID,
                timestamp: new Date().toISOString(),
                processedBy: this.currentUser.email
            };
            
            // Send to Lark Anycross via HTTP POST
            await fetch('https://your-lark-webhook-url.com/student-removal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notificationData)
            });
            
        } catch (error) {
            console.error('Failed to send Lark notification:', error);
            // Don't throw error as this is not critical for the main operation
        }
    }

    // Feature 4: Success Confirmation
    showSuccessLightbox() {
        const successLightbox = $w('#successLightbox');
        const successTitle = $w('#successTitle');
        const successMessage = $w('#successMessage');
        
        if (successTitle) {
            successTitle.text = 'Student Removal Submitted';
        }
        
        if (successMessage) {
            successMessage.text = 'Thank you for your submission. A ticket has been generated and you will receive email updates on the progress.';
        }
        
        if (successLightbox) {
            successLightbox.show();
        }
        
        this.showLoadingState(false);
    }

    handleSuccessOk() {
        this.hideSuccessLightbox();
        this.hideRemoveStudentModal();
        this.refreshStudentList();
    }

    // Feature 5: Cancel Action
    handleCancelRemoval() {
        this.hideConfirmationDialog();
        this.selectedStudent = null;
    }

    // Feature 6: Modal Management
    hideConfirmationDialog() {
        const confirmationLightbox = $w('#confirmationLightbox');
        if (confirmationLightbox) {
            confirmationLightbox.hide();
        }
    }

    hideSuccessLightbox() {
        const successLightbox = $w('#successLightbox');
        if (successLightbox) {
            successLightbox.hide();
        }
    }

    hideRemoveStudentModal() {
        const removeStudentModal = $w('#removeStudentModal');
        if (removeStudentModal) {
            removeStudentModal.hide();
        }
    }

    async refreshStudentList() {
        try {
            await this.loadInitialStudentData();
        } catch (error) {
            console.error('Error refreshing student list:', error);
            this.showNotification('Failed to refresh student list.', 'error');
        }
    }

    // Utility Methods
    showLoadingState(show) {
        this.isLoading = show;
        const loadingIndicator = $w('#loadingIndicator');
        const studentList = $w('#studentList');
        
        if (loadingIndicator) {
            if (show) {
                loadingIndicator.show();
            } else {
                loadingIndicator.hide();
            }
        }
        
        if (studentList) {
            studentList.enabled = !show;
        }
    }

    showEmptyState() {
        const emptyState = $w('#emptyState');
        const studentList = $w('#studentList');
        
        if (emptyState) {
            emptyState.show();
        }
        
        if (studentList) {
            studentList.hide();
        }
    }

    handleError(message) {
        this.showNotification(message, 'error');
        this.showLoadingState(false);
    }

    showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // You can implement a toast notification system here
        // For now, we'll use console logging and could add UI notifications
        
        const notification = $w('#notification');
        if (notification) {
            notification.text = message;
            notification.show();
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                notification.hide();
            }, 5000);
        }
    }

    setupEventListeners() {
        // Confirmation dialog buttons
        const confirmBtn = $w('#confirmBtn');
        const cancelBtn = $w('#cancelBtn');
        const successOkBtn = $w('#successOkBtn');
        
        if (confirmBtn) {
            confirmBtn.onClick(() => this.handleConfirmRemoval());
        }
        
        if (cancelBtn) {
            cancelBtn.onClick(() => this.handleCancelRemoval());
        }
        
        if (successOkBtn) {
            successOkBtn.onClick(() => this.handleSuccessOk());
        }
        
        // Modal close handlers
        const removeStudentModal = $w('#removeStudentModal');
        if (removeStudentModal) {
            // Handle modal close events if needed
        }
    }
}

// Initialize the manager when page loads
let removeAPStudentManager;

$w.onReady(() => {
    removeAPStudentManager = new RemoveAPStudentManager();
});

// Export for external access if needed
export { RemoveAPStudentManager };