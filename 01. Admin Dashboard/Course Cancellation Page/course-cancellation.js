// Course Cancellation Page JavaScript
// Handles course cancellation form functionality and data management

class CourseCancellationManager {
    constructor() {
        this.selectedCourse = null;
        this.studentsData = [];
        this.init();
    }

    init() {
        this.loadCourseData();
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupDateConstraints();
    }

    loadCourseData() {
        // Try to get course data from sessionStorage (from course management page)
        const storedCourse = sessionStorage.getItem('selectedCourse');
        
        if (storedCourse) {
            this.selectedCourse = JSON.parse(storedCourse);
        } else {
            // Fallback sample data if no course selected
            this.selectedCourse = {
                id: 'AS-APY-Y9-EL-BIOLOGY',
                subject: 'Biology',
                name: 'Advanced Biology A-Level',
                status: 'Active',
                studentCount: 3,
                totalLessons: 24,
                startDate: '2024-01-15',
                endDate: '2024-06-15',
                students: [
                    { name: 'Oliver Thompson', lessons: 8 },
                    { name: 'Emma Wilson', lessons: 8 },
                    { name: 'James Brown', lessons: 8 }
                ]
            };
        }

        this.displayCourseInfo();
        this.displayStudents();
    }



    calculateRefundPercentage(lessonsAttended) {
        const totalLessons = this.courseData.totalLessons;
        const completionPercentage = (lessonsAttended / totalLessons) * 100;
        
        if (completionPercentage <= 10) return 100;
        if (completionPercentage <= 25) return 75;
        if (completionPercentage <= 50) return 50;
        if (completionPercentage <= 75) return 25;
        return 0;
    }

    getRandomDate(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
        return new Date(randomTime).toISOString().split('T')[0];
    }

    displayCourseInfo() {
        const extensionCourseTitle = document.getElementById('extensionCourseTitle');
        const extensionCourseSubject = document.getElementById('extensionCourseSubject');

        if (extensionCourseTitle) {
            extensionCourseTitle.textContent = `${this.selectedCourse.id} - ${this.selectedCourse.name}`;
        }
        
        if (extensionCourseSubject) {
            extensionCourseSubject.textContent = this.selectedCourse.subject;
        }
    }

    displayStudents() {
        const studentsDisplay = document.getElementById('students-text-display');
        
        if (studentsDisplay) {
            const studentNames = this.selectedCourse.students.map(student => student.name).join(', ');
            studentsDisplay.textContent = studentNames;
        }
    }

    calculateImpact() {
        const totalStudents = this.studentsData.length;
        const totalRefunds = this.studentsData.reduce((sum, student) => sum + student.refundAmount, 0);
        const averageRefund = totalStudents > 0 ? Math.round(totalRefunds / totalStudents) : 0;
        const studentsWithRefunds = this.studentsData.filter(student => student.refundAmount > 0).length;

        // Update impact summary
        const impactStats = document.getElementById('impactStats');
        impactStats.innerHTML = `
            <div class="impact-stat">
                <span class="impact-number">${totalStudents}</span>
                <span class="impact-label">Students Affected</span>
            </div>
            <div class="impact-stat">
                <span class="impact-number">£${totalRefunds.toLocaleString()}</span>
                <span class="impact-label">Total Refunds</span>
            </div>
            <div class="impact-stat">
                <span class="impact-number">£${averageRefund}</span>
                <span class="impact-label">Average Refund</span>
            </div>
            <div class="impact-stat">
                <span class="impact-number">${studentsWithRefunds}</span>
                <span class="impact-label">Refund Recipients</span>
            </div>
        `;

        // Display students list
        this.displayStudentsList();
    }

    displayStudentsList() {
        const studentsList = document.getElementById('studentsList');
        
        studentsList.innerHTML = this.studentsData.map(student => `
            <div class="student-card">
                <div class="student-name">${student.name}</div>
                <div class="student-details">
                    ID: ${student.id} | Lessons: ${student.lessonsAttended}/${this.courseData.totalLessons}<br>
                    Enrolled: ${this.formatDate(student.enrollmentDate)}
                </div>
                <div class="refund-info">
                    <div class="refund-amount">Refund: £${student.refundAmount} (${student.refundPercentage}%)</div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }

        // Cancel button for course selection
        const cancelBtns = document.querySelectorAll('[id="cancelBtn"]');
        cancelBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleCourseSelection(e));
        });

        // Form submission
        const submitCancellationBtn = document.getElementById('submitCancellationBtn');
        if (submitCancellationBtn) {
            submitCancellationBtn.addEventListener('click', (e) => this.handleFormSubmission(e));
        }

        // Close button
        const closeBtn = document.getElementById('closeBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.handleModalClose());
        }

        // Clear selection button
        const clearSelectionBtn = document.getElementById('clearSelectionBtn');
        if (clearSelectionBtn) {
            clearSelectionBtn.addEventListener('click', () => this.clearSelection());
        }
    }

    setupFormValidation() {
        const cancellationStartDate = document.getElementById('cancellationStartDate');
        const reasonForCancellation = document.getElementById('reasonForCancellation');
        
        if (cancellationStartDate) {
            cancellationStartDate.addEventListener('blur', () => this.validateField(cancellationStartDate));
            cancellationStartDate.addEventListener('input', () => this.clearFieldError(cancellationStartDate));
        }
        
        if (reasonForCancellation) {
            reasonForCancellation.addEventListener('blur', () => this.validateField(reasonForCancellation));
            reasonForCancellation.addEventListener('input', () => this.clearFieldError(reasonForCancellation));
        }
    }

    setupDateConstraints() {
        const cancellationStartDate = document.getElementById('cancellationStartDate');
        if (cancellationStartDate) {
            const today = new Date().toISOString().split('T')[0];
            cancellationStartDate.min = today;
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Validate based on field type
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.id === 'detailedReason' && value.length < 100) {
            isValid = false;
            errorMessage = 'Please provide at least 100 characters';
        } else if (field.type === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Date cannot be in the past';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            errorDiv.style.color = 'var(--danger-color)';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '4px';
            field.parentNode.appendChild(errorDiv);
        }

        return isValid;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    validateDates() {
        const cancellationDate = document.getElementById('cancellationDate');
        const lastClassDate = document.getElementById('lastClassDate');
        
        if (cancellationDate.value && lastClassDate.value) {
            const cancelDate = new Date(cancellationDate.value);
            const lastDate = new Date(lastClassDate.value);
            
            if (lastDate > cancelDate) {
                this.showFieldError(lastClassDate, 'Last class date cannot be after cancellation date');
            }
        }
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--danger-color)';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        field.parentNode.appendChild(errorDiv);
    }





    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        // Filter and display courses based on search term
        // This would typically fetch from CMS-3 (Import86 - Course Information Management Collection)
        console.log('Searching for courses:', searchTerm);
        this.displayCourseRepeater(searchTerm);
    }

    displayCourseRepeater(searchTerm = '') {
        const courseRepeater = document.getElementById('courseRepeater');
        if (!courseRepeater) return;

        // Sample course data - would come from CMS in real implementation
        const sampleCourses = [
            {
                id: 'AS-APY-Y9-EL-BIOLOGY',
                name: 'Advanced Biology',
                subject: 'Biology',
                studentCount: 3,
                students: ['Oliver Thompson', 'Emma Wilson', 'James Brown']
            },
            {
                id: 'AS-APY-Y10-EL-CHEMISTRY',
                name: 'Advanced Chemistry',
                subject: 'Chemistry',
                studentCount: 5,
                students: ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Lee', 'Eva Martinez']
            }
        ];

        const filteredCourses = sampleCourses.filter(course => 
            course.name.toLowerCase().includes(searchTerm) ||
            course.subject.toLowerCase().includes(searchTerm) ||
            course.id.toLowerCase().includes(searchTerm)
        );

        courseRepeater.innerHTML = filteredCourses.map(course => `
            <div class="courseContainer" data-course-id="${course.id}">
                <div id="courseId">${course.id}</div>
                <div id="courseName">${course.name}</div>
                <div id="courseSubject">${course.subject}</div>
                <div><span id="studentCountNumber">${course.studentCount}</span> <span id="studentCountText">students</span></div>
                <div id="studentNames">${course.students.join(', ')}</div>
                <button id="cancelBtn" class="btn btn-danger">Cancel</button>
            </div>
        `).join('');

        // Re-attach event listeners for new cancel buttons
        this.setupEventListeners();
    }

    handleCourseSelection(e) {
        const courseContainer = e.target.closest('.courseContainer');
        const courseId = courseContainer.dataset.courseId;
        
        // Find the selected course data
        // This would typically fetch detailed data from CMS-3, CMS-2, and CMS-7
        this.selectedCourse = {
            id: courseId,
            name: courseContainer.querySelector('#courseName').textContent,
            subject: courseContainer.querySelector('#courseSubject').textContent,
            studentCount: parseInt(courseContainer.querySelector('#studentCountNumber').textContent),
            students: courseContainer.querySelector('#studentNames').textContent.split(', ').map(name => ({ name: name.trim() }))
        };

        this.showCancellationDetails();
    }

    showCancellationDetails() {
        // Hide placeholder and show selected course info
        const extensionPlaceholder = document.getElementById('extensionPlaceholder');
        const selectedExtensionCourseInfo = document.getElementById('selectedExtensionCourseInfo');
        
        if (extensionPlaceholder) {
            extensionPlaceholder.style.display = 'none';
        }
        
        if (selectedExtensionCourseInfo) {
            selectedExtensionCourseInfo.style.display = 'block';
        }

        this.displayCourseInfo();
        this.displayStudents();
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const formData = this.collectFormData();
        this.submitCancellationRequest(formData);
    }

    validateForm() {
        const cancellationStartDate = document.getElementById('cancellationStartDate');
        const reasonForCancellation = document.getElementById('reasonForCancellation');
        
        let isValid = true;
        
        if (!this.validateField(cancellationStartDate)) {
            isValid = false;
        }
        
        if (!this.validateField(reasonForCancellation)) {
            isValid = false;
        }
        
        return isValid;
    }

    collectFormData() {
        const cancellationStartDate = document.getElementById('cancellationStartDate');
        const reasonForCancellation = document.getElementById('reasonForCancellation');
        
        return {
            courseId: this.selectedCourse.id,
            courseName: this.selectedCourse.name,
            courseSubject: this.selectedCourse.subject,
            cancellationStartDate: cancellationStartDate ? cancellationStartDate.value : '',
            reasonForCancellation: reasonForCancellation ? reasonForCancellation.value : '',
            affectedStudents: this.selectedCourse.students,
            studentCount: this.selectedCourse.studentCount,
            submittedAt: new Date().toISOString(),
            submittedBy: 'Admin User'
        };
    }

    submitCancellationRequest(formData) {
        // Show loading state
        const submitBtn = document.getElementById('submitCancellationBtn');
        if (submitBtn) {
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
        }

        // Simulate API call to submit cancellation request
        setTimeout(() => {
            console.log('Cancellation request submitted:', formData);
            
            // Store submission data for reference
            sessionStorage.setItem('cancellationSubmission', JSON.stringify(formData));
            
            // Show confirmation lightbox
            this.showConfirmationLightbox();
            
            // Reset button state
            if (submitBtn) {
                submitBtn.textContent = 'Submit Cancellation';
                submitBtn.disabled = false;
            }
        }, 1500);
    }

    showConfirmationLightbox() {
        // Create confirmation lightbox elements if they don't exist
        let confirmationLightbox = document.getElementById('confirmationLightbox');
        
        if (!confirmationLightbox) {
            confirmationLightbox = document.createElement('div');
            confirmationLightbox.id = 'confirmationLightbox';
            confirmationLightbox.className = 'lightbox-overlay';
            
            confirmationLightbox.innerHTML = `
                <div class="lightbox-content">
                    <h3 id="confirmationTitle">Cancellation Request Submitted</h3>
                    <p id="confirmationMessage">
                        Thank you for your submission. A ticket has been generated and you will be updated on the progress via email.
                    </p>
                    <button id="confirmationOkBtn" class="btn btn-primary">OK</button>
                </div>
            `;
            
            document.body.appendChild(confirmationLightbox);
            
            // Add event listener for OK button
            const okBtn = confirmationLightbox.querySelector('#confirmationOkBtn');
            okBtn.addEventListener('click', () => this.closeConfirmationLightbox());
        }
        
        confirmationLightbox.style.display = 'flex';
    }

    closeConfirmationLightbox() {
        const confirmationLightbox = document.getElementById('confirmationLightbox');
        if (confirmationLightbox) {
            confirmationLightbox.style.display = 'none';
        }
        
        // Return to main course list view
        this.returnToMainView();
    }

    returnToMainView() {
        // Clear current selection
        this.selectedCourse = null;
        
        // Hide course details and show placeholder
        const extensionPlaceholder = document.getElementById('extensionPlaceholder');
        const selectedExtensionCourseInfo = document.getElementById('selectedExtensionCourseInfo');
        
        if (extensionPlaceholder) {
            extensionPlaceholder.style.display = 'block';
        }
        
        if (selectedExtensionCourseInfo) {
            selectedExtensionCourseInfo.style.display = 'none';
        }
        
        // Clear form fields
        this.resetForm();
        
        // Clear search and refresh course list
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.displayCourseRepeater();
    }



    clearSelection() {
        this.returnToMainView();
    }

    handleModalClose() {
        // Handle any modal close functionality
        console.log('Modal close requested');
    }

    // Utility methods for date formatting and validation
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    // Initialize the course cancellation manager when page loads
    initializePage() {
        // Set up initial state
        this.displayCourseRepeater();
        
        // Show placeholder initially
        const extensionPlaceholder = document.getElementById('extensionPlaceholder');
        const selectedExtensionCourseInfo = document.getElementById('selectedExtensionCourseInfo');
        
        if (extensionPlaceholder) {
            extensionPlaceholder.style.display = 'block';
        }
        
        if (selectedExtensionCourseInfo) {
            selectedExtensionCourseInfo.style.display = 'none';
        }
    }

}

// Initialize the course cancellation manager when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const manager = new CourseCancellationManager();
    manager.initializePage();
});

// Add CSS for error styling and lightbox
const style = document.createElement('style');
style.textContent = `
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: var(--danger-color);
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .error-message {
        color: var(--danger-color);
        font-size: 12px;
        margin-top: 4px;
    }
    
    .lightbox-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .lightbox-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .lightbox-content h3 {
        margin-bottom: 1rem;
        color: var(--primary-color);
    }
    
    .lightbox-content p {
        margin-bottom: 1.5rem;
        color: var(--text-color);
    }
`;
document.head.appendChild(style);

/*
=== 按钮和元素引用名字 ===

表单元素 IDs:
- courseInfo: 课程信息容器
- courseTitle: 课程标题
- courseDetails: 课程详情
- cancellationForm: 取消表单
- cancellationReason: 取消原因选择框
- detailedReason: 详细原因文本域
- cancellationDate: 取消日期
- lastClassDate: 最后上课日期
- impactSummary: 影响摘要
- impactStats: 影响统计
- studentsList: 学生列表
- refundPolicy: 退款政策选择框
- refundMethod: 退款方式选择框
- totalRefundAmount: 总退款金额
- refundNotes: 退款备注
- alternativeCourse: 替代课程
- transferOption: 转移选项
- notifyStudents: 通知学生复选框
- notifyInstructors: 通知讲师复选框
- notifyParents: 通知家长复选框
- customMessage: 自定义消息
- internalNotes: 内部备注
- approvedBy: 批准人
- approvalDate: 批准日期
- confirmCancellation: 确认取消复选框
- submitButton: 提交按钮

CSS类名:
- .course-info: 课程信息
- .course-title: 课程标题
- .course-details: 课程详情
- .cancellation-form: 取消表单
- .form-select: 表单选择框
- .form-input: 表单输入框
- .form-textarea: 表单文本域
- .impact-summary: 影响摘要
- .impact-stats: 影响统计
- .students-list: 学生列表
- .btn: 按钮基础样式
- .btn-secondary: 次要按钮
- .btn-danger: 危险按钮
- .back-button: 返回按钮
*/