// Course Extension Page JavaScript
// Handles course extension form functionality and data management

class CourseExtensionManager {
    constructor() {
        this.selectedCourse = null;
        this.extensionFees = {
            standard: 50,
            extended: 100,
            emergency: 25
        };
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
        this.populateCurrentEndDate();
        this.displayStudents();
    }

    displayCourseInfo() {
        const courseTitle = document.getElementById('courseTitle');
        const courseDetails = document.getElementById('courseDetails');

        courseTitle.textContent = `${this.selectedCourse.id} - ${this.selectedCourse.subject}`;

        courseDetails.innerHTML = `
            <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">
                    <span class="status-badge status-${this.selectedCourse.status.toLowerCase()}">
                        ${this.selectedCourse.status}
                    </span>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Students</div>
                <div class="detail-value">${this.selectedCourse.studentCount} enrolled</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Total Lessons</div>
                <div class="detail-value">${this.selectedCourse.totalLessons} lessons</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Start Date</div>
                <div class="detail-value">${this.formatDate(this.selectedCourse.startDate)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Current End Date</div>
                <div class="detail-value">${this.formatDate(this.selectedCourse.endDate)}</div>
            </div>
        `;
    }

    populateCurrentEndDate() {
        const currentEndDateInput = document.getElementById('currentEndDate');
        currentEndDateInput.value = this.selectedCourse.endDate;
    }

    displayStudents() {
        const studentsList = document.getElementById('studentsList');
        
        studentsList.innerHTML = this.selectedCourse.students.map(student => `
            <div class="student-item">
                <div class="student-name">${student.name}</div>
                <div class="student-lessons">${student.lessons} lessons completed</div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Extension type change
        document.getElementById('extensionType').addEventListener('change', (e) => {
            this.handleExtensionTypeChange(e.target.value);
        });

        // New end date change
        document.getElementById('newEndDate').addEventListener('change', (e) => {
            this.validateNewEndDate(e.target.value);
            this.calculateExtensionFee();
        });

        // Additional lessons change
        document.getElementById('additionalLessons').addEventListener('input', (e) => {
            this.calculateExtensionFee();
        });

        // Extension reason change
        document.getElementById('extensionReason').addEventListener('change', (e) => {
            this.handleReasonChange(e.target.value);
        });

        // Form submission
        document.getElementById('extensionForm').addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });

        // Detailed reason input
        document.getElementById('detailedReason').addEventListener('input', (e) => {
            this.validateDetailedReason(e.target.value);
        });
    }

    setupFormValidation() {
        // Real-time validation for required fields
        const requiredFields = ['extensionType', 'newEndDate', 'extensionReason', 'detailedReason'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    setupDateConstraints() {
        const newEndDateInput = document.getElementById('newEndDate');
        const currentEndDate = new Date(this.selectedCourse.endDate);
        
        // Set minimum date to current end date + 1 day
        const minDate = new Date(currentEndDate);
        minDate.setDate(minDate.getDate() + 1);
        newEndDateInput.min = this.formatDateForInput(minDate);
        
        // Set maximum date to current end date + 6 months
        const maxDate = new Date(currentEndDate);
        maxDate.setMonth(maxDate.getMonth() + 6);
        newEndDateInput.max = this.formatDateForInput(maxDate);
    }

    handleExtensionTypeChange(extensionType) {
        const approvalField = document.getElementById('approvalRequired');
        
        // Set approval requirements based on extension type
        switch (extensionType) {
            case 'standard':
                approvalField.value = 'auto';
                break;
            case 'extended':
                approvalField.value = 'manager';
                break;
            case 'emergency':
                approvalField.value = 'director';
                break;
            default:
                approvalField.value = 'auto';
        }
        
        this.calculateExtensionFee();
    }

    validateNewEndDate(newEndDate) {
        const currentEndDate = new Date(this.selectedCourse.endDate);
        const selectedDate = new Date(newEndDate);
        const maxDate = new Date(currentEndDate);
        maxDate.setMonth(maxDate.getMonth() + 6);
        
        const newEndDateInput = document.getElementById('newEndDate');
        
        if (selectedDate <= currentEndDate) {
            this.showFieldError(newEndDateInput, 'New end date must be after current end date');
            return false;
        }
        
        if (selectedDate > maxDate) {
            this.showFieldError(newEndDateInput, 'Extension cannot exceed 6 months');
            return false;
        }
        
        this.clearFieldError(newEndDateInput);
        return true;
    }

    calculateExtensionFee() {
        const extensionType = document.getElementById('extensionType').value;
        const newEndDate = document.getElementById('newEndDate').value;
        const additionalLessons = parseInt(document.getElementById('additionalLessons').value) || 0;
        const extensionFeeInput = document.getElementById('extensionFee');
        
        if (!extensionType || !newEndDate) {
            extensionFeeInput.value = '£0.00';
            return;
        }
        
        const currentEndDate = new Date(this.selectedCourse.endDate);
        const selectedDate = new Date(newEndDate);
        const monthsDiff = this.getMonthsDifference(currentEndDate, selectedDate);
        
        let baseFee = this.extensionFees[extensionType] || 0;
        let totalFee = baseFee * monthsDiff;
        
        // Add fee for additional lessons (£10 per lesson)
        totalFee += additionalLessons * 10;
        
        extensionFeeInput.value = `£${totalFee.toFixed(2)}`;
    }

    handleReasonChange(reason) {
        const detailedReasonField = document.getElementById('detailedReason');
        
        // Provide helpful placeholder text based on reason
        const placeholders = {
            'student-request': 'Please describe the student\'s specific request and circumstances...',
            'medical': 'Please provide details about the medical situation (no personal health information required)...',
            'academic': 'Please explain the academic performance issues and how extension will help...',
            'scheduling': 'Please describe the scheduling conflicts and proposed resolution...',
            'technical': 'Please detail the technical issues encountered and their impact...',
            'other': 'Please provide a detailed explanation of the circumstances...'
        };
        
        detailedReasonField.placeholder = placeholders[reason] || 'Please provide a detailed explanation...';
    }

    validateDetailedReason(text) {
        const detailedReasonField = document.getElementById('detailedReason');
        
        if (text.length < 50) {
            this.showFieldError(detailedReasonField, `Minimum 50 characters required (${text.length}/50)`);
            return false;
        }
        
        this.clearFieldError(detailedReasonField);
        return true;
    }

    validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = 'var(--danger-color)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = 'var(--danger-color)';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const formData = this.collectFormData();
        this.showConfirmationLightbox(formData);
    }

    validateForm() {
        let isValid = true;
        
        // Validate required fields
        const requiredFields = [
            'extensionType',
            'newEndDate',
            'extensionReason',
            'detailedReason'
        ];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        // Validate new end date
        const newEndDate = document.getElementById('newEndDate').value;
        if (newEndDate && !this.validateNewEndDate(newEndDate)) {
            isValid = false;
        }
        
        // Validate detailed reason length
        const detailedReason = document.getElementById('detailedReason').value;
        if (!this.validateDetailedReason(detailedReason)) {
            isValid = false;
        }
        
        return isValid;
    }

    collectFormData() {
        return {
            courseId: this.selectedCourse.id,
            courseName: `${this.selectedCourse.id} - ${this.selectedCourse.subject}`,
            extensionType: document.getElementById('extensionType').value,
            currentEndDate: document.getElementById('currentEndDate').value,
            newEndDate: document.getElementById('newEndDate').value,
            additionalLessons: parseInt(document.getElementById('additionalLessons').value) || 0,
            extensionReason: document.getElementById('extensionReason').value,
            detailedReason: document.getElementById('detailedReason').value,
            extensionFee: document.getElementById('extensionFee').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            paymentNotes: document.getElementById('paymentNotes').value,
            approvalRequired: document.getElementById('approvalRequired').value,
            notifyStudents: document.getElementById('notifyStudents').checked,
            additionalNotes: document.getElementById('additionalNotes').value,
            submittedAt: new Date().toISOString(),
            submittedBy: 'Admin User' // In real app, get from auth
        };
    }

    submitExtensionRequest(formData) {
        // Show loading state
        const submitButton = document.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            console.log('Extension request submitted:', formData);
            
            // Store submission data for potential use
            sessionStorage.setItem('extensionRequest', JSON.stringify(formData));
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = '../course-management.html';
            }, 2000);
        }, 1500);
    }

    showConfirmationLightbox(formData) {
        // Create confirmation lightbox overlay
        const overlay = document.createElement('div');
        overlay.id = 'confirmationLightbox';
        overlay.className = 'confirmation-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        // Create confirmation modal
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
            text-align: center;
        `;
        
        // Create title element
        const title = document.createElement('h3');
        title.id = 'confirmationTitle';
        title.style.cssText = 'margin: 0 0 15px 0; color: #333;';
        title.textContent = 'Extension Request Submitted';
        
        // Create message element
        const message = document.createElement('p');
        message.id = 'confirmationMessage';
        message.style.cssText = 'margin: 0 0 20px 0; color: #666; line-height: 1.5;';
        message.textContent = 'Thank you for your submission. A ticket has been generated and you will receive email updates on the progress.';
        
        // Create OK button
        const okButton = document.createElement('button');
        okButton.id = 'confirmationOkBtn';
        okButton.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        `;
        okButton.textContent = 'OK';
        
        // Assemble modal content
        modal.appendChild(title);
        modal.appendChild(message);
        modal.appendChild(okButton);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Add event listener for OK button
        okButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            // Close the extension modal and return to main course list view
            const extensionModal = document.getElementById('courseExtensionLightbox');
            if (extensionModal) {
                extensionModal.style.display = 'none';
            }
            // In a real application, this would navigate back to the course list
            console.log('Extension request submitted successfully');
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                // Close the extension modal and return to main course list view
                const extensionModal = document.getElementById('courseExtensionLightbox');
                if (extensionModal) {
                    extensionModal.style.display = 'none';
                }
            }
        });
    }
    
    showSuccessMessage() {
        // Create success alert
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.style.background = '#d4edda';
        alert.style.borderColor = '#c3e6cb';
        alert.style.color = '#155724';
        alert.innerHTML = `
            <strong>Success!</strong> Extension request has been submitted successfully. 
            You will be redirected to the course management page.
        `;
        
        // Insert at top of form
        const form = document.getElementById('extensionForm');
        form.insertBefore(alert, form.firstChild);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    getMonthsDifference(date1, date2) {
        const months = (date2.getFullYear() - date1.getFullYear()) * 12;
        return months - date1.getMonth() + date2.getMonth();
    }
}

// Initialize the course extension manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CourseExtensionManager();
});

// Handle browser back button
window.addEventListener('beforeunload', () => {
    // Clean up any temporary data if needed
});

/*
=== 按钮和元素引用名字 ===

根据 element-references.md 更新的元素 IDs:

Search Section:
- searchInput: 搜索输入框
- searchBtn: 搜索按钮

Course Repeater Section:
- courseRepeater: 课程重复器
- courseContainer: 课程容器
- courseId: 课程ID
- courseName: 课程名称
- courseSubject: 课程科目
- studentCountNumber: 学生数量数字 (加粗)
- studentCountText: 学生数量文字 ("students")
- studentNames: 学生姓名文本字段

Student Repeater Section:
- studentRepeater: 学生重复器
- studentContainer: 学生容器
- studentInfo: 合并的学生信息文本字段
- extendBtn: 延期按钮

Extension Details Panel:
- extensionDetailsPanel: 延期详情面板
- extensionPlaceholder: 延期占位符
- selectedExtensionCourseInfo: 选中的延期课程信息
- extensionCourseHeader: 延期课程标题
- extensionCourseTitle: 延期课程标题
- extensionCourseSubject: 延期课程科目
- extensionStudentsList: 延期学生列表
- extensionStudentInfo: 合并的学生信息文本字段

Extension Form Elements:
- extensionEndDate: 延期结束日期
- updatedFocusArea: 更新的重点领域
- extensionDescription: 延期描述

Button Elements:
- closeBtn: 关闭按钮
- searchBtn: 搜索按钮
- extendBtn: 延期按钮
- clearSelectionBtn: 清除选择按钮
- submitExtensionBtn: 提交延期按钮

Modal/Lightbox Elements:
- courseExtensionLightbox: 课程延期灯箱
- extensionCourseList: 延期课程列表
- extensionSearchInput: 延期搜索输入框

传统表单元素 IDs (保持兼容):
- courseInfo: 课程信息容器
- courseTitle: 课程标题
- courseDetails: 课程详情
- extensionForm: 延期表单
- extensionType: 延期类型选择框
- currentEndDate: 当前结束日期
- newEndDate: 新结束日期
- additionalLessons: 额外课程数量
- extensionReason: 延期原因选择框
- detailedReason: 详细原因文本域
- extensionFee: 延期费用
- paymentMethod: 付款方式选择框
- paymentNotes: 付款备注
- studentsList: 学生列表
- approvalRequired: 需要批准选择框
- notifyStudents: 通知学生复选框
- additionalNotes: 额外备注
*/