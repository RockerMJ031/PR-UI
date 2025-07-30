class StudentManagementSystem {
    constructor() {
        this.students = [];
        this.filteredStudents = [];
        this.currentPage = 1;
        this.studentsPerPage = 12;
        this.searchTerm = '';
        this.statusFilter = '';
        this.courseFilter = '';
        this.init();
    }

    init() {
        this.generateSampleData();
        this.setupEventListeners();
        this.populateCourseFilter();
        this.updateDisplay();
        this.hideLoadingState();
    }

    generateSampleData() {
        const firstNames = [
            'Emma', 'James', 'Sophie', 'Michael', 'Olivia', 'William', 'Ava', 'Alexander',
            'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Charlotte', 'Henry', 'Amelia',
            'Daniel', 'Harper', 'Matthew', 'Evelyn', 'Jackson', 'Abigail', 'Sebastian',
            'Emily', 'Jack', 'Elizabeth', 'Aiden', 'Sofia', 'Owen', 'Avery', 'Samuel'
        ];

        const lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
            'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
            'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
            'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
        ];

        const courses = [
            'Mathematics A-Level', 'Physics A-Level', 'Chemistry A-Level', 'Biology A-Level',
            'English Literature', 'History A-Level', 'Geography A-Level', 'Economics A-Level',
            'Computer Science', 'Psychology A-Level', 'Art & Design', 'French Language',
            'Spanish Language', 'German Language', 'Business Studies', 'Sociology A-Level'
        ];

        const statuses = ['active', 'pending', 'inactive', 'graduated'];
        const statusWeights = [0.6, 0.15, 0.1, 0.15]; // 60% active, 15% pending, 10% inactive, 15% graduated

        // Generate 150 sample students
        for (let i = 0; i < 150; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const studentId = `STU${String(i + 1).padStart(4, '0')}`;
            
            // Weighted random status selection
            const statusRandom = Math.random();
            let cumulativeWeight = 0;
            let selectedStatus = statuses[0];
            
            for (let j = 0; j < statuses.length; j++) {
                cumulativeWeight += statusWeights[j];
                if (statusRandom <= cumulativeWeight) {
                    selectedStatus = statuses[j];
                    break;
                }
            }

            // Generate random courses (1-4 courses per student)
            const numCourses = Math.floor(Math.random() * 4) + 1;
            const studentCourses = [];
            const shuffledCourses = [...courses].sort(() => 0.5 - Math.random());
            
            for (let j = 0; j < numCourses; j++) {
                studentCourses.push(shuffledCourses[j]);
            }

            const enrollmentDate = this.getRandomDate('2023-01-01', '2024-12-01');
            const lastActivity = this.getRandomDate(enrollmentDate, '2024-12-15');

            this.students.push({
                id: studentId,
                firstName: firstName,
                lastName: lastName,
                fullName: `${firstName} ${lastName}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
                phone: this.generatePhoneNumber(),
                status: selectedStatus,
                enrollmentDate: enrollmentDate,
                lastActivity: lastActivity,
                courses: studentCourses,
                grade: this.getRandomGrade(),
                gpa: this.getRandomGPA(),
                totalCredits: Math.floor(Math.random() * 120) + 30,
                completedCredits: Math.floor(Math.random() * 100) + 20,
                parentContact: Math.random() > 0.3 ? `parent.${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com` : null,
                emergencyContact: this.generatePhoneNumber(),
                address: this.generateAddress(),
                dateOfBirth: this.getRandomDate('2000-01-01', '2008-12-31'),
                notes: this.generateNotes(selectedStatus)
            });
        }

        this.filteredStudents = [...this.students];
    }

    getRandomDate(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
        return new Date(randomTime).toISOString().split('T')[0];
    }

    generatePhoneNumber() {
        return `+44 ${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    }

    getRandomGrade() {
        const grades = ['Year 12', 'Year 13', 'Foundation', 'Retake'];
        return grades[Math.floor(Math.random() * grades.length)];
    }

    getRandomGPA() {
        return (Math.random() * 3 + 1).toFixed(2); // GPA between 1.00 and 4.00
    }

    generateAddress() {
        const streets = ['High Street', 'Church Lane', 'Victoria Road', 'King Street', 'Queen Avenue'];
        const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Bristol'];
        const street = streets[Math.floor(Math.random() * streets.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const number = Math.floor(Math.random() * 200) + 1;
        const postcode = this.generatePostcode();
        
        return `${number} ${street}, ${city} ${postcode}`;
    }

    generatePostcode() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        return `${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]} ${numbers[Math.floor(Math.random() * numbers.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
    }

    generateNotes(status) {
        const notes = {
            active: [
                'Excellent academic performance',
                'Regular attendance, good progress',
                'Participates actively in class discussions',
                'Consistent homework submission',
                'Shows strong potential for university'
            ],
            pending: [
                'Awaiting document verification',
                'Payment pending confirmation',
                'Enrollment application under review',
                'Waiting for course placement test results',
                'Transfer student - documents in process'
            ],
            inactive: [
                'Extended leave of absence',
                'Medical leave - expected return next term',
                'Temporary suspension - academic review',
                'Family circumstances - on hold',
                'Deferred enrollment to next academic year'
            ],
            graduated: [
                'Successfully completed all requirements',
                'Graduated with honors - excellent results',
                'Accepted to top university programs',
                'Outstanding academic achievement',
                'Completed early - accelerated program'
            ]
        };
        
        const statusNotes = notes[status] || notes.active;
        return statusNotes[Math.floor(Math.random() * statusNotes.length)];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // Status filter
        const statusFilter = document.getElementById('statusFilter');
        statusFilter.addEventListener('change', (e) => {
            this.statusFilter = e.target.value;
            this.applyFilters();
        });

        // Course filter
        const courseFilter = document.getElementById('courseFilter');
        courseFilter.addEventListener('change', (e) => {
            this.courseFilter = e.target.value;
            this.applyFilters();
        });

        // Header action buttons
        document.getElementById('addStudentBtn').addEventListener('click', () => {
            this.showAddStudentModal();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportStudentData();
        });

        document.getElementById('bulkActionsBtn').addEventListener('click', () => {
            this.showBulkActionsModal();
        });

        // Pagination
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateDisplay();
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredStudents.length / this.studentsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.updateDisplay();
            }
        });
    }

    populateCourseFilter() {
        const courseFilter = document.getElementById('courseFilter');
        const allCourses = [...new Set(this.students.flatMap(student => student.courses))].sort();
        
        // Clear existing options except "All Courses"
        courseFilter.innerHTML = '<option value="">All Courses</option>';
        
        allCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseFilter.appendChild(option);
        });
    }

    applyFilters() {
        this.filteredStudents = this.students.filter(student => {
            // Search filter
            const matchesSearch = !this.searchTerm || 
                student.fullName.toLowerCase().includes(this.searchTerm) ||
                student.email.toLowerCase().includes(this.searchTerm) ||
                student.id.toLowerCase().includes(this.searchTerm) ||
                student.courses.some(course => course.toLowerCase().includes(this.searchTerm));

            // Status filter
            const matchesStatus = !this.statusFilter || student.status === this.statusFilter;

            // Course filter
            const matchesCourse = !this.courseFilter || student.courses.includes(this.courseFilter);

            return matchesSearch && matchesStatus && matchesCourse;
        });

        this.currentPage = 1; // Reset to first page when filters change
        this.updateDisplay();
    }

    updateDisplay() {
        this.updateStatistics();
        this.updateStudentsList();
        this.updatePagination();
        this.updateResultsInfo();
    }

    updateStatistics() {
        const total = this.students.length;
        const active = this.students.filter(s => s.status === 'active').length;
        const pending = this.students.filter(s => s.status === 'pending').length;
        const inactive = this.students.filter(s => s.status === 'inactive').length;

        document.getElementById('totalStudents').textContent = total;
        document.getElementById('activeStudents').textContent = active;
        document.getElementById('pendingStudents').textContent = pending;
        document.getElementById('inactiveStudents').textContent = inactive;
    }

    updateStudentsList() {
        const studentsList = document.getElementById('studentsList');
        const emptyState = document.getElementById('emptyState');
        
        if (this.filteredStudents.length === 0) {
            studentsList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        studentsList.style.display = 'grid';

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.studentsPerPage;
        const endIndex = startIndex + this.studentsPerPage;
        const studentsToShow = this.filteredStudents.slice(startIndex, endIndex);

        // Generate student cards
        studentsList.innerHTML = studentsToShow.map(student => this.createStudentCard(student)).join('');

        // Add event listeners to action buttons
        this.attachStudentActionListeners();
    }

    createStudentCard(student) {
        const courseTags = student.courses.map(course => 
            `<span class="course-tag">${course}</span>`
        ).join('');

        return `
            <div class="student-card" data-student-id="${student.id}">
                <div class="student-header">
                    <div>
                        <div class="student-name">${student.fullName}</div>
                        <div class="student-id">${student.id}</div>
                    </div>
                    <span class="status-badge status-${student.status}">${student.status}</span>
                </div>
                
                <div class="student-details">
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${student.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${student.phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Grade:</span>
                        <span class="detail-value">${student.grade}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">GPA:</span>
                        <span class="detail-value">${student.gpa}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Enrolled:</span>
                        <span class="detail-value">${this.formatDate(student.enrollmentDate)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Last Activity:</span>
                        <span class="detail-value">${this.formatDate(student.lastActivity)}</span>
                    </div>
                </div>
                
                <div class="student-courses">
                    <div class="courses-label">Enrolled Courses</div>
                    <div class="course-tags">${courseTags}</div>
                </div>
                
                <div class="student-actions">
                    <button class="btn btn-sm btn-outline btn-outline-primary" onclick="studentManager.viewStudent('${student.id}')">
                        👁️ View
                    </button>
                    <button class="btn btn-sm btn-outline btn-outline-info" onclick="studentManager.editStudent('${student.id}')">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-sm btn-outline btn-outline-warning" onclick="studentManager.contactStudent('${student.id}')">
                        📧 Contact
                    </button>
                </div>
            </div>
        `;
    }

    attachStudentActionListeners() {
        // Event listeners are handled via onclick attributes in the HTML
        // This method can be used for additional event binding if needed
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredStudents.length / this.studentsPerPage);
        const pagination = document.getElementById('pagination');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const paginationInfo = document.getElementById('paginationInfo');

        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
        
        paginationInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
    }

    updateResultsInfo() {
        const resultsInfo = document.getElementById('resultsInfo');
        const total = this.filteredStudents.length;
        const startIndex = (this.currentPage - 1) * this.studentsPerPage + 1;
        const endIndex = Math.min(startIndex + this.studentsPerPage - 1, total);
        
        if (total === 0) {
            resultsInfo.textContent = 'No students found';
        } else {
            resultsInfo.textContent = `Showing ${startIndex}-${endIndex} of ${total} students`;
        }
    }

    hideLoadingState() {
        const loadingState = document.getElementById('loadingState');
        const studentsList = document.getElementById('studentsList');
        
        setTimeout(() => {
            loadingState.style.display = 'none';
            studentsList.style.display = 'grid';
        }, 1000); // Simulate loading time
    }

    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    }

    // Student action methods
    viewStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            this.showStudentDetailsModal(student);
        }
    }

    editStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            this.showEditStudentModal(student);
        }
    }

    contactStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            this.showContactStudentModal(student);
        }
    }

    showStudentDetailsModal(student) {
        const modalContent = `
            <div style="max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                <h2 style="margin-bottom: 20px; color: var(--primary-color);">Student Details - ${student.fullName}</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div><strong>Student ID:</strong> ${student.id}</div>
                    <div><strong>Status:</strong> <span class="status-badge status-${student.status}">${student.status}</span></div>
                    <div><strong>Email:</strong> ${student.email}</div>
                    <div><strong>Phone:</strong> ${student.phone}</div>
                    <div><strong>Grade:</strong> ${student.grade}</div>
                    <div><strong>GPA:</strong> ${student.gpa}</div>
                    <div><strong>Date of Birth:</strong> ${this.formatDate(student.dateOfBirth)}</div>
                    <div><strong>Enrollment Date:</strong> ${this.formatDate(student.enrollmentDate)}</div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong>Address:</strong><br>
                    ${student.address}
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong>Emergency Contact:</strong> ${student.emergencyContact}<br>
                    ${student.parentContact ? `<strong>Parent Contact:</strong> ${student.parentContact}` : ''}
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong>Enrolled Courses:</strong><br>
                    ${student.courses.map(course => `<span class="course-tag" style="margin: 2px;">${course}</span>`).join('')}
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong>Academic Progress:</strong><br>
                    Credits: ${student.completedCredits}/${student.totalCredits} completed
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong>Notes:</strong><br>
                    ${student.notes}
                </div>
                
                <div style="text-align: center;">
                    <button onclick="this.parentNode.parentNode.remove()" style="padding: 10px 20px; background: var(--secondary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
    }

    showEditStudentModal(student) {
        alert(`Edit functionality for ${student.fullName} would be implemented here.\n\nThis would open a comprehensive form to edit student details including:\n- Personal information\n- Contact details\n- Course enrollments\n- Academic status\n- Notes and comments`);
    }

    showContactStudentModal(student) {
        const modalContent = `
            <div style="max-width: 500px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
                <h2 style="margin-bottom: 20px; color: var(--primary-color);">Contact ${student.fullName}</h2>
                
                <div style="margin-bottom: 15px;">
                    <strong>Email:</strong> <a href="mailto:${student.email}">${student.email}</a>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>Phone:</strong> <a href="tel:${student.phone}">${student.phone}</a>
                </div>
                
                ${student.parentContact ? `
                <div style="margin-bottom: 15px;">
                    <strong>Parent Email:</strong> <a href="mailto:${student.parentContact}">${student.parentContact}</a>
                </div>
                ` : ''}
                
                <div style="margin-bottom: 20px;">
                    <strong>Emergency Contact:</strong> <a href="tel:${student.emergencyContact}">${student.emergencyContact}</a>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Quick Message:</label>
                    <textarea style="width: 100%; height: 100px; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px;" placeholder="Type your message here..."></textarea>
                </div>
                
                <div style="text-align: center; display: flex; gap: 10px; justify-content: center;">
                    <button onclick="alert('Message sent to ${student.fullName}!')" style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Send Message</button>
                    <button onclick="this.parentNode.parentNode.parentNode.remove()" style="padding: 10px 20px; background: var(--secondary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
    }

    showAddStudentModal() {
        alert('Add Student functionality would be implemented here.\n\nThis would open a comprehensive form to add a new student with:\n- Personal information\n- Contact details\n- Course selection\n- Initial status\n- Emergency contacts');
    }

    showBulkActionsModal() {
        alert('Bulk Actions functionality would be implemented here.\n\nThis would allow:\n- Bulk status updates\n- Bulk course enrollment\n- Bulk communication\n- Bulk data export\n- Bulk deletion (with confirmation)');
    }

    exportStudentData() {
        // Create CSV content
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Grade', 'GPA', 'Enrollment Date', 'Courses'];
        const csvContent = [
            headers.join(','),
            ...this.filteredStudents.map(student => [
                student.id,
                `"${student.fullName}"`,
                student.email,
                student.phone,
                student.status,
                student.grade,
                student.gpa,
                student.enrollmentDate,
                `"${student.courses.join('; ')}"`
            ].join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        alert(`Exported ${this.filteredStudents.length} student records to CSV file.`);
    }

    showModal(content) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
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
            box-sizing: border-box;
        `;
        
        overlay.innerHTML = content;
        
        // Close modal when clicking overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        document.body.appendChild(overlay);
    }
}

// Initialize the student management system
let studentManager;

document.addEventListener('DOMContentLoaded', () => {
    studentManager = new StudentManagementSystem();
});

// Add CSS for modal styling
const style = document.createElement('style');
style.textContent = `
    .modal-overlay {
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
        box-sizing: border-box;
    }
    
    .modal-content {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
    }
`;
document.head.appendChild(style);

/*
=== 按钮和元素引用名字 ===

主要操作按钮 IDs:
- addStudentBtn: 添加学生按钮
- exportBtn: 导出按钮
- bulkActionsBtn: 批量操作按钮

搜索和筛选元素 IDs:
- searchInput: 搜索输入框
- statusFilter: 状态筛选下拉框
- courseFilter: 课程筛选下拉框

统计信息元素 IDs:
- statsSection: 统计部分
- totalStudents: 总学生数
- activeStudents: 活跃学生数
- pendingStudents: 待处理学生数
- inactiveStudents: 非活跃学生数

学生列表和分页元素 IDs:
- resultsInfo: 结果信息
- studentsContainer: 学生容器
- loadingState: 加载状态
- studentsList: 学生列表
- emptyState: 空状态
- pagination: 分页
- prevBtn: 上一页按钮
- paginationInfo: 分页信息
- nextBtn: 下一页按钮

动态生成的元素 (data attributes):
- data-student-id: 学生ID数据属性
- .student-card: 学生卡片

按钮功能:
- viewStudent(studentId): 查看学生详情
- editStudent(studentId): 编辑学生信息
- contactStudent(studentId): 联系学生
- showAddStudentModal(): 显示添加学生模态框
- showBulkActionsModal(): 显示批量操作模态框
- exportStudentData(): 导出学生数据
- applyFilters(): 应用筛选
- updateDisplay(): 更新显示
- updatePagination(): 更新分页

CSS类名:
- .btn: 按钮基础样式
- .btn-success: 成功按钮
- .btn-info: 信息按钮
- .btn-primary: 主要按钮
- .btn-sm: 小按钮
- .btn-outline: 轮廓按钮
- .btn-outline-primary: 主要轮廓按钮
- .btn-outline-info: 信息轮廓按钮
- .btn-outline-warning: 警告轮廓按钮
- .filter-select: 筛选选择框
- .stats-section: 统计部分
- .stat-number: 统计数字
- .results-info: 结果信息
- .students-container: 学生容器
- .loading-state: 加载状态
- .students-list: 学生列表
- .empty-state: 空状态
- .pagination: 分页
- .pagination-btn: 分页按钮
- .pagination-info: 分页信息
- .student-card: 学生卡片
- .modal-overlay: 模态框覆盖层
- .modal-content: 模态框内容

数据结构:
- students: 学生数组
- filteredStudents: 筛选后的学生数组
- currentPage: 当前页码
- studentsPerPage: 每页学生数
*/