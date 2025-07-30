class APStudentRegistrationManager {
    constructor() {
        this.formData = {};
        this.uploadedFiles = [];
        this.validationRules = {
            studentFirstName: { required: true, minLength: 2 },
            studentLastName: { required: true, minLength: 2 },
            studentDateOfBirth: { required: true },
            studentEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            classStartDate: { required: true },
            ehcpStatus: { required: true },
            caseworkerName: { required: true, minLength: 2 },
            caseworkerEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            guardianName: { required: true, minLength: 2 },
            guardianEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            guardianPhone: { required: true, pattern: /^\+?[1-9]\d{1,14}$/ },
            emergencyContact: { required: true, minLength: 2 },
            emergencyName: { required: true, minLength: 2 },
            homeAddress: { required: true, minLength: 10 },
            previousEducation: { required: true },
            selectedPlan: { required: true },
            homeLessonsWithoutSupervision: { required: true },
            supportLongerThanFourWeeks: { required: true }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFileUpload();
        this.setupFormValidation();
    }

    setupEventListeners() {
        const form = document.getElementById('apRegistrationForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Educational Plan validation
        const educationalPlanSelect = document.getElementById('selectedPlan');
        if (educationalPlanSelect) {
            educationalPlanSelect.addEventListener('change', () => this.validateEducationalPlan());
        }


    }

    setupFileUpload() {
        const fileUpload = document.getElementById('fileUpload');
        const fileInput = document.getElementById('documentUpload');
        const uploadedFilesContainer = document.getElementById('uploadedFiles');

        // Click to upload
        fileUpload.addEventListener('click', () => fileInput.click());

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Drag and drop
        fileUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUpload.classList.add('dragover');
        });

        fileUpload.addEventListener('dragleave', () => {
            fileUpload.classList.remove('dragover');
        });

        fileUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUpload.classList.remove('dragover');
            this.handleFileUpload(e.dataTransfer.files);
        });
    }

    handleFileUpload(files) {
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        Array.from(files).forEach(file => {
            // Validate file size
            if (file.size > maxFileSize) {
                this.showNotification('File size must be less than 10MB', 'error');
                return;
            }

            // Validate file type
            if (!allowedTypes.includes(file.type)) {
                this.showNotification('Only PDF, JPG, and PNG files are allowed', 'error');
                return;
            }

            // Check for duplicates
            if (this.uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
                this.showNotification('File already uploaded', 'warning');
                return;
            }

            // Add file to uploaded files
            const fileData = {
                id: Date.now() + Math.random(),
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date()
            };

            this.uploadedFiles.push(fileData);
            this.displayUploadedFile(fileData);
            this.showNotification(`File "${file.name}" uploaded successfully`, 'success');
        });

        // Clear the input
        document.getElementById('documentUpload').value = '';
    }

    displayUploadedFile(fileData) {
        const container = document.getElementById('uploadedFiles');
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        fileElement.dataset.fileId = fileData.id;

        const fileIcon = this.getFileIcon(fileData.type);
        const fileSize = this.formatFileSize(fileData.size);

        fileElement.innerHTML = `
            <div class="file-info">
                <span style="font-size: 20px;">${fileIcon}</span>
                <div>
                    <div style="font-weight: 500;">${fileData.name}</div>
                    <div style="font-size: 12px; color: var(--text-secondary);">${fileSize} • ${fileData.type}</div>
                </div>
            </div>
            <button type="button" class="file-remove" onclick="apRegistrationManager.removeFile('${fileData.id}')">
                Remove
            </button>
        `;

        container.appendChild(fileElement);
    }

    removeFile(fileId) {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id != fileId);
        const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
        if (fileElement) {
            fileElement.remove();
        }
        this.showNotification('File removed', 'info');
    }

    getFileIcon(fileType) {
        if (fileType === 'application/pdf') return '📄';
        if (fileType.startsWith('image/')) return '🖼️';
        return '📁';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        const fieldName = field.name || field.id;
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;

        const formGroup = field.closest('.form-group');
        let isValid = true;
        let errorMessage = '';

        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Required validation
        if (rules.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Pattern validation
        if (isValid && rules.pattern && field.value && !rules.pattern.test(field.value)) {
            isValid = false;
            if (fieldName === 'email') {
                errorMessage = 'Please enter a valid email address';
            } else if (fieldName === 'phone' || fieldName === 'emergencyPhone') {
                errorMessage = 'Please enter a valid phone number';
            } else {
                errorMessage = 'Invalid format';
            }
        }

        // Minimum length validation
        if (isValid && rules.minLength && field.value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Minimum ${rules.minLength} characters required`;
        }

        // Age validation for date of birth
        if (isValid && fieldName === 'dateOfBirth' && field.value) {
            const birthDate = new Date(field.value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (age < 14 || age > 25) {
                isValid = false;
                errorMessage = 'Student must be between 14 and 25 years old';
            }
        }

        // Update field styling
        formGroup.classList.remove('error', 'success');
        if (!isValid) {
            formGroup.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            formGroup.appendChild(errorDiv);
        } else if (field.value.trim()) {
            formGroup.classList.add('success');
        }

        return isValid;
    }

    validateEducationalPlan() {
        const select = document.getElementById('selectedPlan');
        const container = select.closest('.form-group');
        
        // Remove existing error message
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        container.classList.remove('error', 'success');

        if (!select.value) {
            container.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Please select an educational plan';
            container.appendChild(errorDiv);
            return false;
        } else {
            container.classList.add('success');
            return true;
        }
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
        const form = document.getElementById('apRegistrationForm');
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

        // Validate all required fields
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Validate educational plan
        if (!this.validateEducationalPlan()) {
            isValid = false;
        }

        // Validate file uploads
        if (this.uploadedFiles.length === 0) {
            this.showNotification('Please upload at least one required document', 'error');
            isValid = false;
        }

        return isValid;
    }

    collectFormData() {
        const formData = new FormData(document.getElementById('apRegistrationForm'));
        const data = {
            // Student Information
            studentFirstName: formData.get('studentFirstName'),
            studentLastName: formData.get('studentLastName'),
            studentDateOfBirth: formData.get('studentDateOfBirth'),
            studentEmail: formData.get('studentEmail'),
            classStartDate: formData.get('classStartDate'),
            
            // EHCP Documentation
            ehcpStatus: formData.getAll('ehcpStatus'),
            ehcpFile: formData.get('ehcpFile'),
            ehcpDetails: formData.get('ehcpDetails'),
            
            // Caseworker Information
            caseworkerName: formData.get('caseworkerName'),
            caseworkerEmail: formData.get('caseworkerEmail'),
            
            // Guardian/Parent Information
            guardianName: formData.get('guardianName'),
            guardianEmail: formData.get('guardianEmail'),
            guardianPhone: formData.get('guardianPhone'),
            
            // Emergency Contact
            emergencyContact: formData.get('emergencyContact'),
            emergencyName: formData.get('emergencyName'),
            
            // Educational Background
            homeAddress: formData.get('homeAddress'),
            previousEducation: formData.get('previousEducation'),
            
            // Educational Plan Selection
            selectedPlan: formData.get('selectedPlan'),
            
            // Additional Questions
            homeLessonsWithoutSupervision: formData.get('homeLessonsWithoutSupervision'),
            supportLongerThanFourWeeks: formData.get('supportLongerThanFourWeeks'),
            
            // Files
            uploadedFiles: this.uploadedFiles.map(f => ({
                name: f.name,
                size: f.size,
                type: f.type,
                uploadDate: f.uploadDate
            })),
            
            // Metadata
            studentId: this.generateStudentId(),
            submissionDate: new Date().toISOString(),
            status: 'pending'
        };
        
        return data;
    }

    generateStudentId() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `AP${year}${random}`;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showNotification('Please correct the errors before submitting', 'error');
            this.scrollToFirstError();
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
        submitBtn.classList.add('loading');

        try {
            const formData = this.collectFormData();
            
            // Simulate API call
            await this.simulateSubmission(formData);
            
            // Success
            this.showNotification('Registration submitted successfully!', 'success');
            this.clearDraftData();
            
            // Show success modal
            this.showSuccessModal(formData);
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showNotification('Failed to submit registration. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
        }
    }

    async simulateSubmission(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random failure (10% chance)
        if (Math.random() < 0.1) {
            throw new Error('Network error');
        }
        
        // Store in localStorage for demo purposes
        const submissions = JSON.parse(localStorage.getItem('apRegistrations') || '[]');
        submissions.push(data);
        localStorage.setItem('apRegistrations', JSON.stringify(submissions));
        
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

        modal.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 30px; max-width: 500px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                <h2 style="color: var(--success-color); margin-bottom: 15px;">Registration Successful!</h2>
                <p style="margin-bottom: 20px; color: var(--text-secondary);">Alternative Provision student registration has been submitted successfully.</p>
                <div style="background: var(--background-color); padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <strong>Student ID:</strong> ${data.studentId}<br>
                    <strong>Educational Plan:</strong> ${data.selectedPlan}<br>
                    <strong>Status:</strong> Pending Review
                </div>
                <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;">
                    You will receive a confirmation email shortly. The registration will be reviewed within 2-3 business days.
                </p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); window.history.back();" 
                            style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Return to Dashboard
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); location.reload();" 
                            style="padding: 10px 20px; background: var(--secondary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Submit Another
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











    resetForm() {
        if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
            document.getElementById('apRegistrationForm').reset();
            this.uploadedFiles = [];
            document.getElementById('uploadedFiles').innerHTML = '';
            
            // Clear validation states
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error', 'success');
                const errorMsg = group.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
            
            this.clearDraftData();
            this.showNotification('Form reset successfully', 'info');
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

// Global functions for HTML onclick handlers
function resetForm() {
    apRegistrationManager.resetForm();
}

function closeAPStudentModal() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        // In a real application, this would close the modal or navigate back
        window.history.back();
    }
}

function registerAPStudent() {
    const form = document.getElementById('apRegistrationForm');
    if (form) {
        // Trigger form submission
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
}

// Initialize the registration manager
let apRegistrationManager;

document.addEventListener('DOMContentLoaded', () => {
    apRegistrationManager = new APStudentRegistrationManager();
});

/*
=== 按钮和元素引用名字 ===

表单元素 IDs:
- apRegistrationForm: 主表单
- studentFirstName: 学生名字输入框
- studentLastName: 学生姓氏输入框
- studentDateOfBirth: 学生出生日期
- studentEmail: 学生邮箱
- classStartDate: 开课日期
- ehcpStatus: EHCP状态多选框
- documentUpload: 文档上传输入框
- fileUpload: 文件上传区域
- uploadedFiles: 已上传文件容器
- ehcpDetails: EHCP详情文本域
- caseworkerName: 案例工作者姓名
- caseworkerEmail: 案例工作者邮箱
- guardianName: 监护人姓名
- guardianEmail: 监护人邮箱
- guardianPhone: 监护人电话
- emergencyContact: 紧急联系人
- emergencyName: 紧急联系人姓名
- homeAddress: 家庭地址
- previousEducation: 之前教育背景
- selectedPlan: 选择的教育计划
- homeLessonsWithoutSupervision: 家庭课程无监督
- supportLongerThanFourWeeks: 支持超过四周
- submitBtn: 提交按钮

按钮功能:
- closeAPStudentModal(): 取消/关闭模态框
- registerAPStudent(): 注册AP学生
- resetForm(): 重置表单

CSS类名:
- .form-container: 表单容器
- .form-section: 表单部分
- .form-group: 表单组
- .form-input: 表单输入框
- .form-textarea: 表单文本域
- .form-label: 表单标签
- .btn: 按钮基础样式
- .btn-primary: 主要按钮
- .btn-secondary: 次要按钮
- .btn-success: 成功按钮
- .file-upload: 文件上传区域
- .uploaded-files: 已上传文件
- .section-title: 部分标题
- .section-icon: 部分图标
- .progress-indicator: 进度指示器
- .form-actions: 表单操作区域
*/