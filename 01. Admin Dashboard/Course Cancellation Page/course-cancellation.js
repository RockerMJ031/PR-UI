class CourseCancellationManager {
    constructor() {
        this.courseData = null;
        this.studentsData = [];
        this.init();
    }

    init() {
        this.loadCourseData();
        this.setupEventListeners();
        this.setupFormValidation();
        this.calculateImpact();
    }

    loadCourseData() {
        // Try to get course data from sessionStorage (passed from course management page)
        const storedCourseData = sessionStorage.getItem('selectedCourse');
        
        if (storedCourseData) {
            this.courseData = JSON.parse(storedCourseData);
        } else {
            // Fallback sample data for testing
            this.courseData = {
                id: 'COURSE001',
                title: 'Advanced Mathematics A-Level',
                instructor: 'Dr. Sarah Johnson',
                startDate: '2024-01-15',
                endDate: '2024-06-30',
                status: 'Active',
                enrolledStudents: 15,
                totalLessons: 40,
                completedLessons: 12,
                pricePerStudent: 1200,
                totalRevenue: 18000,
                schedule: 'Mon, Wed, Fri 10:00-11:30'
            };
        }

        // Generate sample students data
        this.generateStudentsData();
        this.displayCourseInfo();
    }

    generateStudentsData() {
        const sampleNames = [
            'Emma Thompson', 'James Wilson', 'Sophie Chen', 'Michael Brown',
            'Olivia Davis', 'William Garcia', 'Ava Martinez', 'Alexander Lee',
            'Isabella Rodriguez', 'Benjamin Taylor', 'Mia Anderson', 'Lucas White',
            'Charlotte Harris', 'Henry Clark', 'Amelia Lewis'
        ];

        this.studentsData = sampleNames.slice(0, this.courseData.enrolledStudents).map((name, index) => {
            const lessonsAttended = Math.floor(Math.random() * (this.courseData.completedLessons + 1));
            const paidAmount = this.courseData.pricePerStudent;
            const refundPercentage = this.calculateRefundPercentage(lessonsAttended);
            
            return {
                id: `STU${String(index + 1).padStart(3, '0')}`,
                name: name,
                email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
                phone: `+44 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                enrollmentDate: this.getRandomDate(this.courseData.startDate, new Date().toISOString().split('T')[0]),
                lessonsAttended: lessonsAttended,
                paidAmount: paidAmount,
                refundPercentage: refundPercentage,
                refundAmount: Math.round(paidAmount * (refundPercentage / 100)),
                status: lessonsAttended > 0 ? 'Active' : 'Enrolled',
                parentContact: Math.random() > 0.3 ? `parent.${name.toLowerCase().replace(' ', '.')}@email.com` : null
            };
        });
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
        const courseTitle = document.getElementById('courseTitle');
        const courseDetails = document.getElementById('courseDetails');

        courseTitle.textContent = this.courseData.title;

        courseDetails.innerHTML = `
            <div class="detail-item">
                <div class="detail-label">Course ID</div>
                <div class="detail-value">${this.courseData.id}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Instructor</div>
                <div class="detail-value">${this.courseData.instructor}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Start Date</div>
                <div class="detail-value">${this.formatDate(this.courseData.startDate)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">End Date</div>
                <div class="detail-value">${this.formatDate(this.courseData.endDate)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">
                    <span class="status-badge status-${this.courseData.status.toLowerCase()}">
                        ${this.courseData.status}
                    </span>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Enrolled Students</div>
                <div class="detail-value">${this.courseData.enrolledStudents}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Progress</div>
                <div class="detail-value">${this.courseData.completedLessons}/${this.courseData.totalLessons} lessons</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Total Revenue</div>
                <div class="detail-value">£${this.courseData.totalRevenue.toLocaleString()}</div>
            </div>
        `;
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
        // Form submission
        const form = document.getElementById('cancellationForm');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Refund policy change
        const refundPolicy = document.getElementById('refundPolicy');
        refundPolicy.addEventListener('change', () => this.updateRefundCalculations());

        // Confirmation checkbox
        const confirmCheckbox = document.getElementById('confirmCancellation');
        const submitButton = document.getElementById('submitButton');
        confirmCheckbox.addEventListener('change', () => {
            submitButton.disabled = !confirmCheckbox.checked;
        });

        // Date validation
        const cancellationDate = document.getElementById('cancellationDate');
        const lastClassDate = document.getElementById('lastClassDate');
        
        cancellationDate.addEventListener('change', () => this.validateDates());
        lastClassDate.addEventListener('change', () => this.validateDates());

        // Set minimum dates
        const today = new Date().toISOString().split('T')[0];
        cancellationDate.min = today;
        lastClassDate.min = today;

        // Character count for detailed reason
        const detailedReason = document.getElementById('detailedReason');
        detailedReason.addEventListener('input', () => this.updateCharacterCount());
    }

    setupFormValidation() {
        const form = document.getElementById('cancellationForm');
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
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

    updateCharacterCount() {
        const detailedReason = document.getElementById('detailedReason');
        const helpText = detailedReason.parentNode.querySelector('.help-text');
        const currentLength = detailedReason.value.length;
        const minLength = 100;
        
        if (currentLength < minLength) {
            helpText.textContent = `Minimum 100 characters required. Current: ${currentLength}/100`;
            helpText.style.color = 'var(--danger-color)';
        } else {
            helpText.textContent = `Character count: ${currentLength}`;
            helpText.style.color = 'var(--text-muted)';
        }
    }

    updateRefundCalculations() {
        const refundPolicy = document.getElementById('refundPolicy').value;
        const totalRefundAmount = document.getElementById('totalRefundAmount');
        
        let totalRefunds = 0;
        
        this.studentsData.forEach(student => {
            switch (refundPolicy) {
                case 'full-refund':
                    student.refundAmount = student.paidAmount;
                    student.refundPercentage = 100;
                    break;
                case 'partial-refund':
                    // Keep original calculation based on lessons attended
                    break;
                case 'credit-only':
                case 'no-refund':
                    student.refundAmount = 0;
                    student.refundPercentage = 0;
                    break;
            }
            totalRefunds += student.refundAmount;
        });
        
        totalRefundAmount.value = `£${totalRefunds.toLocaleString()}`;
        
        // Update display
        this.calculateImpact();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all required fields
        const form = e.target;
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            alert('Please correct the errors in the form before submitting.');
            return;
        }
        
        // Show confirmation dialog
        const confirmSubmit = confirm(
            `Are you absolutely sure you want to cancel this course?\n\n` +
            `Course: ${this.courseData.title}\n` +
            `Students affected: ${this.studentsData.length}\n` +
            `Total refunds: £${this.studentsData.reduce((sum, s) => sum + s.refundAmount, 0).toLocaleString()}\n\n` +
            `This action cannot be undone.`
        );
        
        if (confirmSubmit) {
            this.submitCancellation(form);
        }
    }

    submitCancellation(form) {
        const submitButton = document.getElementById('submitButton');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '⏳ Processing...';
        submitButton.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        const cancellationData = {
            courseId: this.courseData.id,
            courseTitle: this.courseData.title,
            cancellationReason: document.getElementById('cancellationReason').value,
            detailedReason: document.getElementById('detailedReason').value,
            cancellationDate: document.getElementById('cancellationDate').value,
            lastClassDate: document.getElementById('lastClassDate').value,
            refundPolicy: document.getElementById('refundPolicy').value,
            refundMethod: document.getElementById('refundMethod').value,
            totalRefundAmount: document.getElementById('totalRefundAmount').value,
            alternativeCourse: document.getElementById('alternativeCourse').value,
            transferOption: document.getElementById('transferOption').value,
            customMessage: document.getElementById('customMessage').value,
            internalNotes: document.getElementById('internalNotes').value,
            approvedBy: document.getElementById('approvedBy').value,
            approvalDate: document.getElementById('approvalDate').value,
            notifyStudents: document.getElementById('notifyStudents').checked,
            notifyInstructors: document.getElementById('notifyInstructors').checked,
            notifyParents: document.getElementById('notifyParents').checked,
            affectedStudents: this.studentsData,
            submittedAt: new Date().toISOString(),
            submittedBy: 'Admin User' // This would come from authentication
        };
        
        // Simulate API call
        setTimeout(() => {
            console.log('Course cancellation submitted:', cancellationData);
            
            // Show success message
            alert(
                `Course cancellation has been processed successfully!\n\n` +
                `Course "${this.courseData.title}" has been cancelled.\n` +
                `${this.studentsData.length} students will be notified.\n` +
                `Refund processing will begin within 24 hours.`
            );
            
            // Clear session storage
            sessionStorage.removeItem('selectedCourse');
            
            // Redirect back to course management
            window.location.href = '../Course Management Page/course-management.html';
        }, 2000);
    }

    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    }
}

// Initialize the course cancellation manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CourseCancellationManager();
});

// Add CSS for error styling
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