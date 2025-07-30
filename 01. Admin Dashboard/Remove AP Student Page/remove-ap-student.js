class RemoveAPStudentManager {
    constructor() {
        this.studentData = null;
        this.selectedCourses = new Set();
        this.financialData = {
            totalPaid: 0,
            refundEligible: 0,
            adminFee: 0,
            netRefund: 0
        };
        this.init();
    }

    init() {
        this.loadStudentData();
        this.setupEventListeners();
        this.setupFormValidation();
        this.setMinimumDates();
    }

    loadStudentData() {
        // Try to get student data from sessionStorage first
        const sessionData = sessionStorage.getItem('selectedStudent');
        
        if (sessionData) {
            try {
                this.studentData = JSON.parse(sessionData);
            } catch (error) {
                console.error('Error parsing session data:', error);
                this.studentData = this.generateSampleStudentData();
            }
        } else {
            // Use sample data if no session data
            this.studentData = this.generateSampleStudentData();
        }

        this.displayStudentInfo();
        this.generateCourseSelection();
        this.calculateFinancialImpact();
    }

    generateSampleStudentData() {
        return {
            id: 'AP2024001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            dateOfBirth: '2006-03-15',
            registrationDate: '2024-01-15',
            status: 'active',
            currentSchool: 'Lincoln High School',
            gradeLevel: '11th Grade',
            gpa: 3.8,
            apCourses: [
                {
                    id: 'ap_calc_bc',
                    name: 'AP Calculus BC',
                    fee: 1200,
                    startDate: '2024-02-01',
                    endDate: '2024-05-15',
                    progress: 65
                },
                {
                    id: 'ap_physics_c',
                    name: 'AP Physics C: Mechanics',
                    fee: 1100,
                    startDate: '2024-02-01',
                    endDate: '2024-05-15',
                    progress: 58
                },
                {
                    id: 'ap_comp_sci_a',
                    name: 'AP Computer Science A',
                    fee: 1000,
                    startDate: '2024-02-01',
                    endDate: '2024-05-15',
                    progress: 72
                }
            ],
            paymentHistory: [
                {
                    date: '2024-01-15',
                    amount: 3300,
                    method: 'Credit Card',
                    status: 'completed'
                }
            ]
        };
    }

    displayStudentInfo() {
        const student = this.studentData;
        
        // Update basic info
        document.getElementById('studentName').textContent = `${student.firstName} ${student.lastName}`;
        document.getElementById('studentId').textContent = `Student ID: ${student.id}`;
        document.getElementById('studentEmail').textContent = student.email;
        document.getElementById('studentPhone').textContent = student.phone;
        document.getElementById('studentDOB').textContent = new Date(student.dateOfBirth).toLocaleDateString();
        document.getElementById('registrationDate').textContent = new Date(student.registrationDate).toLocaleDateString();
        document.getElementById('currentSchool').textContent = student.currentSchool;
        document.getElementById('gradeLevel').textContent = student.gradeLevel;
        document.getElementById('studentGPA').textContent = student.gpa.toFixed(1);
        document.getElementById('totalAPCourses').textContent = student.apCourses.length;

        // Update avatar
        const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
        document.getElementById('studentAvatar').textContent = initials;

        // Update status
        const statusElement = document.getElementById('studentStatus');
        statusElement.textContent = student.status.charAt(0).toUpperCase() + student.status.slice(1);
        statusElement.className = `student-status status-${student.status}`;

        // Display AP courses
        this.displayAPCourses();
    }

    displayAPCourses() {
        const coursesGrid = document.getElementById('apCoursesGrid');
        coursesGrid.innerHTML = '';

        this.studentData.apCourses.forEach(course => {
            const courseTag = document.createElement('div');
            courseTag.className = 'ap-course-tag';
            courseTag.textContent = course.name;
            coursesGrid.appendChild(courseTag);
        });
    }

    generateCourseSelection() {
        const courseList = document.getElementById('courseSelectionList');
        courseList.innerHTML = '';

        this.studentData.apCourses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.style.cssText = `
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 12px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                margin-bottom: 8px;
                background: var(--surface-color);
            `;

            courseItem.innerHTML = `
                <input type="checkbox" id="course_${course.id}" name="selectedCourses" 
                       value="${course.id}" class="course-checkbox" 
                       style="margin-top: 2px;">
                <div style="flex: 1;">
                    <label for="course_${course.id}" style="font-weight: 500; cursor: pointer;">
                        ${course.name}
                    </label>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                        Fee: $${course.fee.toLocaleString()} • Progress: ${course.progress}% • 
                        Duration: ${new Date(course.startDate).toLocaleDateString()} - ${new Date(course.endDate).toLocaleDateString()}
                    </div>
                </div>
            `;

            courseList.appendChild(courseItem);
        });

        // Add event listeners to checkboxes
        document.querySelectorAll('.course-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleCourseSelection());
        });
    }

    handleCourseSelection() {
        this.selectedCourses.clear();
        
        document.querySelectorAll('.course-checkbox:checked').forEach(checkbox => {
            this.selectedCourses.add(checkbox.value);
        });

        this.calculateFinancialImpact();
        this.validateForm();
    }

    calculateFinancialImpact() {
        let totalPaid = 0;
        let refundEligible = 0;
        let adminFee = 0;

        // Calculate total paid amount for selected courses
        this.studentData.apCourses.forEach(course => {
            if (this.selectedCourses.has(course.id)) {
                totalPaid += course.fee;
                
                // Calculate refund based on progress and policy
                const refundPercentage = this.calculateRefundPercentage(course.progress);
                refundEligible += course.fee * (refundPercentage / 100);
            }
        });

        // Calculate administrative fee (5% of refund eligible amount, minimum $50)
        if (refundEligible > 0) {
            adminFee = Math.max(refundEligible * 0.05, 50);
        }

        const netRefund = Math.max(refundEligible - adminFee, 0);

        // Update financial data
        this.financialData = {
            totalPaid,
            refundEligible,
            adminFee,
            netRefund
        };

        // Update UI
        document.getElementById('totalPaidAmount').textContent = `$${totalPaid.toLocaleString()}`;
        document.getElementById('refundEligibleAmount').textContent = `$${refundEligible.toLocaleString()}`;
        document.getElementById('adminFee').textContent = `$${adminFee.toLocaleString()}`;
        document.getElementById('netRefundAmount').textContent = `$${netRefund.toLocaleString()}`;

        // Update refund amount color
        const netRefundElement = document.getElementById('netRefundAmount');
        netRefundElement.className = netRefund > 0 ? 'impact-value' : 'impact-value danger';
    }

    calculateRefundPercentage(progress) {
        // Refund policy based on course progress
        if (progress <= 10) return 90;  // 90% refund if less than 10% complete
        if (progress <= 25) return 75;  // 75% refund if less than 25% complete
        if (progress <= 50) return 50;  // 50% refund if less than 50% complete
        if (progress <= 75) return 25;  // 25% refund if less than 75% complete
        return 0;                       // No refund if more than 75% complete
    }

    setupEventListeners() {
        const form = document.getElementById('removalForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Confirmation checkbox
        const confirmCheckbox = document.getElementById('confirmRemoval');
        confirmCheckbox.addEventListener('change', () => this.validateForm());

        // Form field validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });

        // Reason selection
        const reasonSelect = document.getElementById('removalReason');
        reasonSelect.addEventListener('change', () => this.handleReasonChange());

        // Explanation textarea
        const explanationTextarea = document.getElementById('removalExplanation');
        explanationTextarea.addEventListener('input', () => this.validateExplanation());
    }

    handleReasonChange() {
        const reason = document.getElementById('removalReason').value;
        const explanationField = document.getElementById('removalExplanation');
        
        // Provide helpful placeholder text based on reason
        const placeholders = {
            'student_request': 'Please provide details about the student\'s request and any supporting documentation...',
            'academic_performance': 'Describe the specific academic performance issues and interventions attempted...',
            'attendance_issues': 'Detail the attendance problems and any warnings or interventions provided...',
            'behavioral_issues': 'Explain the behavioral concerns and disciplinary actions taken...',
            'financial_reasons': 'Describe the financial circumstances and any payment assistance offered...',
            'schedule_conflict': 'Explain the scheduling conflicts and attempts to resolve them...',
            'medical_reasons': 'Provide details about medical circumstances (maintain confidentiality)...',
            'family_relocation': 'Describe the relocation circumstances and timeline...',
            'course_difficulty': 'Explain the academic challenges and support measures attempted...',
            'other': 'Please provide a detailed explanation of the circumstances...'
        };

        if (placeholders[reason]) {
            explanationField.placeholder = placeholders[reason];
        }
    }

    validateExplanation() {
        const explanationField = document.getElementById('removalExplanation');
        const minLength = 50;
        
        if (explanationField.value.length < minLength && explanationField.value.length > 0) {
            this.showFieldError(explanationField, `Minimum ${minLength} characters required (${explanationField.value.length}/${minLength})`);
            return false;
        } else {
            this.clearFieldError(explanationField);
            return true;
        }
    }

    setupFormValidation() {
        // Add validation styling
        const style = document.createElement('style');
        style.textContent = `
            .form-group.error .form-input,
            .form-group.error .form-select,
            .form-group.error .form-textarea {
                border-color: var(--danger-color);
                box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
            }
            
            .form-group.success .form-input,
            .form-group.success .form-select,
            .form-group.success .form-textarea {
                border-color: var(--success-color);
                box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    validateField(field) {
        const formGroup = field.closest('.form-group');
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Required validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Date validation
        if (isValid && field.type === 'date' && field.value) {
            const selectedDate = new Date(field.value);
            const today = new Date();
            
            if (field.id === 'effectiveDate') {
                // Effective date should not be in the past
                if (selectedDate < today) {
                    isValid = false;
                    errorMessage = 'Effective date cannot be in the past';
                }
            } else if (field.id === 'lastAttendanceDate') {
                // Last attendance should not be in the future
                if (selectedDate > today) {
                    isValid = false;
                    errorMessage = 'Last attendance date cannot be in the future';
                }
            }
        }

        // Update field styling
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else if (field.value.trim()) {
            formGroup.classList.add('success');
        }

        return isValid;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    validateForm() {
        let isValid = true;
        
        // Check required fields
        const requiredFields = document.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Check course selection
        if (this.selectedCourses.size === 0) {
            isValid = false;
        }

        // Check explanation length
        if (!this.validateExplanation()) {
            isValid = false;
        }

        // Check confirmation
        const confirmCheckbox = document.getElementById('confirmRemoval');
        if (!confirmCheckbox.checked) {
            isValid = false;
        }

        // Update submit button
        const submitBtn = document.getElementById('removeStudentBtn');
        submitBtn.disabled = !isValid;
        
        return isValid;
    }

    setMinimumDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('effectiveDate').min = today;
        
        // Set default effective date to today
        document.getElementById('effectiveDate').value = today;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showNotification('Please correct the errors before submitting', 'error');
            this.scrollToFirstError();
            return;
        }

        const submitBtn = document.getElementById('removeStudentBtn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Processing Removal...';
        submitBtn.classList.add('loading');

        try {
            const formData = this.collectFormData();
            
            // Simulate API call
            await this.simulateRemoval(formData);
            
            // Success
            this.showSuccessModal(formData);
            
        } catch (error) {
            console.error('Removal error:', error);
            this.showNotification('Failed to process removal. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
        }
    }

    collectFormData() {
        const form = document.getElementById('removalForm');
        const formData = new FormData(form);
        const data = {};

        // Collect regular form fields
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Add selected courses
        data.selectedCourses = Array.from(this.selectedCourses);
        
        // Add student information
        data.studentId = this.studentData.id;
        data.studentName = `${this.studentData.firstName} ${this.studentData.lastName}`;
        data.studentEmail = this.studentData.email;
        
        // Add financial information
        data.financialImpact = this.financialData;
        
        // Add metadata
        data.removalDate = new Date().toISOString();
        data.processedBy = 'Admin User'; // This would come from session
        data.removalId = this.generateRemovalId();
        
        return data;
    }

    generateRemovalId() {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `REM${year}${month}${day}${random}`;
    }

    async simulateRemoval(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Simulate random failure (5% chance)
        if (Math.random() < 0.05) {
            throw new Error('Network error');
        }
        
        // Store in localStorage for demo purposes
        const removals = JSON.parse(localStorage.getItem('studentRemovals') || '[]');
        removals.push(data);
        localStorage.setItem('studentRemovals', JSON.stringify(removals));
        
        return data;
    }

    showSuccessModal(data) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;

        const courseNames = data.selectedCourses.map(courseId => {
            const course = this.studentData.apCourses.find(c => c.id === courseId);
            return course ? course.name : courseId;
        }).join(', ');

        modal.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 30px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                    <h2 style="color: var(--success-color); margin-bottom: 10px;">Student Removal Processed</h2>
                    <p style="color: var(--text-secondary);">The student has been successfully removed from the selected AP courses.</p>
                </div>
                
                <div style="background: var(--background-color); padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                    <h3 style="margin-bottom: 15px;">Removal Summary</h3>
                    <div style="margin-bottom: 10px;"><strong>Removal ID:</strong> ${data.removalId}</div>
                    <div style="margin-bottom: 10px;"><strong>Student:</strong> ${data.studentName}</div>
                    <div style="margin-bottom: 10px;"><strong>Courses Removed:</strong> ${courseNames}</div>
                    <div style="margin-bottom: 10px;"><strong>Effective Date:</strong> ${new Date(data.effectiveDate).toLocaleDateString()}</div>
                    <div style="margin-bottom: 10px;"><strong>Reason:</strong> ${data.removalReason.replace('_', ' ').toUpperCase()}</div>
                    ${data.financialImpact.netRefund > 0 ? `<div><strong>Refund Amount:</strong> $${data.financialImpact.netRefund.toLocaleString()}</div>` : ''}
                </div>
                
                <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <h4 style="color: #92400e; margin-bottom: 10px;">Next Steps</h4>
                    <ul style="color: #92400e; font-size: 14px; margin-left: 20px;">
                        <li>Student notification will be sent via ${data.notifyStudent}</li>
                        <li>Academic records will be updated within 24 hours</li>
                        ${data.financialImpact.netRefund > 0 ? '<li>Refund processing will begin within 3-5 business days</li>' : ''}
                        <li>Follow-up: ${data.followUpRequired || 'None required'}</li>
                    </ul>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); window.history.back();" 
                            style="padding: 12px 24px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">
                        Return to Student Management
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); location.reload();" 
                            style="padding: 12px 24px; background: var(--secondary-color); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Process Another Removal
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    scrollToFirstError() {
        const firstError = document.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--danger-color)',
            warning: 'var(--warning-color)',
            info: 'var(--primary-color)'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize the removal manager
let removeAPStudentManager;

document.addEventListener('DOMContentLoaded', () => {
    removeAPStudentManager = new RemoveAPStudentManager();
});

/*
=== 按钮和元素引用名字 ===

学生信息显示元素 IDs:
- studentAvatar: 学生头像
- studentName: 学生姓名
- studentId: 学生ID
- studentStatus: 学生状态
- studentEmail: 学生邮箱
- studentPhone: 学生电话
- studentDOB: 学生出生日期
- registrationDate: 注册日期
- currentSchool: 当前学校
- gradeLevel: 年级水平
- studentGPA: 学生GPA
- totalAPCourses: AP课程总数
- apCoursesGrid: AP课程网格

表单元素 IDs:
- removalForm: 移除表单
- removalReason: 移除原因选择
- removalExplanation: 移除说明文本框
- effectiveDate: 生效日期
- lastAttendanceDate: 最后出勤日期
- courseSelectionList: 课程选择列表
- financialImpact: 财务影响分析
- totalPaidAmount: 总支付金额
- refundEligibleAmount: 可退款金额
- adminFee: 管理费
- netRefundAmount: 净退款金额
- refundMethod: 退款方式
- refundNotes: 退款备注
- notifyStudent: 通知学生选择
- notificationMessage: 通知消息
- internalNotes: 内部备注
- followUpRequired: 需要跟进
- confirmRemoval: 确认移除复选框
- removeStudentBtn: 移除学生按钮

动态生成的元素:
- course_${course.id}: 课程复选框 (动态生成)

按钮功能:
- handleSubmit(e): 处理表单提交
- validateForm(): 验证表单
- calculateFinancialImpact(): 计算财务影响
- handleCourseSelection(): 处理课程选择
- handleReasonChange(): 处理原因变更
- showSuccessModal(data): 显示成功模态框
- window.history.back(): 返回上一页

CSS类名:
- .student-avatar: 学生头像
- .student-status: 学生状态
- .status-active: 活跃状态
- .form-select: 表单选择框
- .form-textarea: 表单文本区域
- .form-input: 表单输入框
- .checkbox-input: 复选框输入
- .impact-analysis: 影响分析
- .impact-value: 影响值
- .warning: 警告样式
- .btn: 按钮基础样式
- .btn-secondary: 次要按钮
- .btn-danger: 危险按钮
- .removal-form: 移除表单
- .ap-courses-grid: AP课程网格
*/