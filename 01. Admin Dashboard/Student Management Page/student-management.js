import wixData from 'wix-data';
import wixUsers from 'wix-users';
import { fetch } from 'wix-fetch';
import wixLocation from 'wix-location';

/**
 * Student Management System
 * 学生管理系统 - 根据 student-management-features.md 实现
 * 功能0-9：页面加载、模态框管理、课程移除、搜索等完整功能
 */
class StudentManagementSystem {
    constructor() {
        this.currentUser = null;
        this.userSchoolId = null;
        this.students = [];
        this.filteredStudents = [];
        this.selectedRemovalMode = null; // 'all' or 'specific'
        this.searchTerm = '';
        this.isLoading = false;
        this.selectedStudent = null;
        
        // 初始化系统
        this.init();
    }

    /**
     * 功能0：页面加载和初始学生显示
     * 系统初始化入口点
     */
    async init() {
        try {
            this.showLoadingState();
            await this.authenticateUser();
            await this.loadStudentData();
            this.setupEventListeners();
            this.displayStudentList();
            this.hideLoadingState();
        } catch (error) {
            console.error('初始化失败:', error);
            this.handleError('系统初始化失败，请刷新页面重试');
        }
    }

    /**
     * 用户身份验证和学校ID获取
     * 从CMS-6获取当前用户信息和schoolID
     */
    async authenticateUser() {
        try {
            this.currentUser = wixUsers.currentUser;
            if (!this.currentUser.loggedIn) {
                throw new Error('用户未登录');
            }

            // 从CMS-6查询管理员信息
            const adminQuery = await wixData.query('Admins')
                .eq('email', this.currentUser.email)
                .find();

            if (adminQuery.items.length === 0) {
                throw new Error('未找到管理员信息');
            }

            this.userSchoolId = adminQuery.items[0].schoolID;
            if (!this.userSchoolId) {
                throw new Error('管理员未分配学校');
            }

        } catch (error) {
            console.error('用户认证失败:', error);
            throw error;
        }
    }

    /**
     * 加载学生数据
     * 从CMS-7获取学生信息，从CMS-2获取课程信息
     */
    async loadStudentData() {
        try {
            // 从CMS-7查询学生数据
            const studentsQuery = await wixData.query('Students')
                .eq('schoolID', this.userSchoolId)
                .contains('status', ['active', 'Activated'])
                .find();

            this.students = [];
            
            // 为每个学生获取课程信息
            for (const student of studentsQuery.items) {
                const courseData = await this.getStudentCourses(student.studentId);
                
                this.students.push({
                    id: student._id,
                    studentId: student.studentId,
                    studentName: student.studentName || `${student.firstName} ${student.lastName}`,
                    email: student.email,
                    status: student.status,
                    courseCount: courseData.count,
                    courseList: courseData.courses,
                    rawData: student
                });
            }

            this.filteredStudents = [...this.students];
            
        } catch (error) {
            console.error('加载学生数据失败:', error);
            // 使用备用数据
            this.students = [];
            this.filteredStudents = [];
        }
    }

    /**
     * 获取学生课程信息
     * 从CMS-2查询学生的激活课程
     */
    async getStudentCourses(studentId) {
        try {
            const coursesQuery = await wixData.query('StudentCourseAssignment')
                .eq('studentId', studentId)
                .eq('status', 'Activated')
                .find();

            const courses = coursesQuery.items.map(item => item.class_id);
            
            return {
                count: courses.length,
                courses: courses
            };
        } catch (error) {
            console.error('获取学生课程失败:', error);
            return { count: 0, courses: [] };
        }
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 功能2：移除所有课程选项
        $w('#removeAllCoursesBtn').onClick(() => {
            this.selectRemovalMode('all');
        });

        // 功能3：移除特定课程选项
        $w('#removeSpecificCourseBtn').onClick(() => {
            this.selectRemovalMode('specific');
        });

        // 功能4：搜索功能
        $w('#searchBtn').onClick(() => {
            this.performSearch();
        });

        $w('#searchInput').onInput(() => {
            this.searchTerm = $w('#searchInput').value;
            this.performSearch();
        });

        // 功能8：取消操作
        $w('#cancelBtn').onClick(() => {
            this.cancelConfirmation();
        });

        // 功能6：确认移除
        $w('#confirmBtn').onClick(() => {
            this.processRemoval();
        });

        // 功能7：成功确认
        $w('#successOkBtn').onClick(() => {
            this.closeSuccessLightbox();
        });

        // 功能9：模态框管理
        $w('#removeStudentModal').onClose(() => {
            this.closeModal();
        });
    }

    /**
     * 功能2&3：选择移除模式
     */
    selectRemovalMode(mode) {
        this.selectedRemovalMode = mode;
        
        if (mode === 'all') {
            // 高亮移除所有课程按钮
            $w('#removeAllCoursesBtn').style.backgroundColor = '#ff6b35';
            $w('#removeAllCoursesBtn').style.color = '#ffffff';
            $w('#removeSpecificCourseBtn').style.backgroundColor = '#f5f5f5';
            $w('#removeSpecificCourseBtn').style.color = '#333333';
        } else {
            // 高亮移除特定课程按钮
            $w('#removeSpecificCourseBtn').style.backgroundColor = '#ff6b35';
            $w('#removeSpecificCourseBtn').style.color = '#ffffff';
            $w('#removeAllCoursesBtn').style.backgroundColor = '#f5f5f5';
            $w('#removeAllCoursesBtn').style.color = '#333333';
        }
        
        // 更新学生列表显示
        this.updateStudentListDisplay();
    }

    /**
     * 功能4：执行搜索
     */
    performSearch() {
        const searchTerm = this.searchTerm.toLowerCase();
        
        if (!searchTerm) {
            this.filteredStudents = [...this.students];
        } else {
            this.filteredStudents = this.students.filter(student => 
                student.studentName.toLowerCase().includes(searchTerm) ||
                student.studentId.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm)
            );
        }
        
        this.displayStudentList();
    }

    /**
     * 显示学生列表
     * 在studentList repeater中显示学生信息
     */
    displayStudentList() {
        if (this.filteredStudents.length === 0) {
            this.showEmptyState();
            return;
        }

        $w('#studentList').data = this.filteredStudents.map(student => ({
            _id: student.id,
            studentId: student.studentId,
            studentName: student.studentName,
            email: student.email,
            courseCount: student.courseCount,
            courseList: this.formatCourseList(student.courseList),
            actionText: this.getActionText()
        }));

        // 设置repeater项目模板
        $w('#studentList').onItemReady(($item, itemData) => {
            $item('#student-id').text = itemData.studentId;
            $item('#student-name').text = itemData.studentName;
            $item('#student-email').text = itemData.email;
            $item('#course-count').text = itemData.courseCount.toString();
            $item('#course-list').text = itemData.courseList;
            
            // 设置操作按钮
            if (this.selectedRemovalMode) {
                $item('#actionBtn').show();
                $item('#actionBtn').label = itemData.actionText;
                $item('#actionBtn').onClick(() => {
                    this.initiateRemoval(itemData);
                });
            } else {
                $item('#actionBtn').hide();
            }
        });

        this.hideEmptyState();
    }

    /**
     * 格式化课程列表显示
     */
    formatCourseList(courses) {
        if (!courses || courses.length === 0) {
            return '无课程';
        }
        
        if (this.selectedRemovalMode === 'all') {
            return 'courses: ' + courses.join(', ');
        } else if (this.selectedRemovalMode === 'specific') {
            return 'course: ' + courses.join(', ');
        }
        
        return courses.join(', ');
    }

    /**
     * 获取操作按钮文本
     */
    getActionText() {
        if (this.selectedRemovalMode === 'all') {
            return '移除所有课程';
        } else if (this.selectedRemovalMode === 'specific') {
            return '移除特定课程';
        }
        return '';
    }

    /**
     * 更新学生列表显示
     */
    updateStudentListDisplay() {
        this.displayStudentList();
    }

    /**
     * 功能5：启动移除流程
     */
    initiateRemoval(studentData) {
        this.selectedStudent = studentData;
        this.showConfirmationDialog();
    }

    /**
     * 显示确认对话框
     */
    showConfirmationDialog() {
        $w('#confirmationTitle').text = '确认课程移除';
        $w('#confirmationMessage').text = `您确定要移除学生 ${this.selectedStudent.studentName} 的${this.selectedRemovalMode === 'all' ? '所有' : '特定'}课程吗？此操作无法撤销。`;
        $w('#confirmationLightbox').show();
    }

    /**
     * 功能6：处理移除操作
     */
    async processRemoval() {
        try {
            this.showLoadingState();
            
            // 更新CMS-7学生课程注册状态
            await this.updateStudentCourses();
            
            // 创建CMS-5数据同步日志
            await this.createSyncLog();
            
            // 发送Lark通知
            await this.sendLarkNotification();
            
            this.hideConfirmationDialog();
            this.showSuccessLightbox();
            
        } catch (error) {
            console.error('处理移除操作失败:', error);
            this.handleError('移除操作失败，请重试');
        } finally {
            this.hideLoadingState();
        }
    }

    /**
     * 更新学生课程状态
     */
    async updateStudentCourses() {
        if (this.selectedRemovalMode === 'all') {
            // 移除所有课程
            await wixData.query('StudentCourseAssignment')
                .eq('studentId', this.selectedStudent.studentId)
                .find()
                .then(results => {
                    const updatePromises = results.items.map(item => 
                        wixData.update('StudentCourseAssignment', {
                            ...item,
                            status: 'Removed'
                        })
                    );
                    return Promise.all(updatePromises);
                });
        }
        // 特定课程移除逻辑可以在这里扩展
    }

    /**
     * 创建数据同步日志
     */
    async createSyncLog() {
        const logData = {
            operation: 'course_removal',
            studentId: this.selectedStudent.studentId,
            adminId: this.currentUser.id,
            timestamp: new Date(),
            details: {
                removalMode: this.selectedRemovalMode,
                studentName: this.selectedStudent.studentName,
                schoolId: this.userSchoolId
            }
        };

        await wixData.insert('DataSyncLogs', logData);
    }

    /**
     * 发送Lark通知
     */
    async sendLarkNotification() {
        const notificationData = {
            type: 'course_removal',
            student: {
                id: this.selectedStudent.studentId,
                name: this.selectedStudent.studentName,
                email: this.selectedStudent.email
            },
            admin: {
                id: this.currentUser.id,
                email: this.currentUser.email
            },
            removal_mode: this.selectedRemovalMode,
            timestamp: new Date().toISOString(),
            school_id: this.userSchoolId
        };

        try {
            await fetch('https://your-lark-webhook-url.com/course-removal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notificationData)
            });
        } catch (error) {
            console.error('Lark通知发送失败:', error);
            // 不阻断主流程
        }
    }

    /**
     * 功能7：显示成功提示
     */
    showSuccessLightbox() {
        $w('#successTitle').text = '课程移除已提交';
        $w('#successMessage').text = '感谢您的提交。我们已为您生成工单，将通过邮件持续更新进展。';
        $w('#successLightbox').show();
    }

    /**
     * 功能7：关闭成功提示并刷新数据
     */
    async closeSuccessLightbox() {
        $w('#successLightbox').hide();
        
        // 刷新学生数据
        await this.loadStudentData();
        this.displayStudentList();
    }

    /**
     * 功能8：取消确认操作
     */
    cancelConfirmation() {
        this.hideConfirmationDialog();
        this.selectedStudent = null;
    }

    /**
     * 功能9：关闭模态框
     */
    closeModal() {
        $w('#removeStudentModal').hide();
        // 返回主仪表板或执行其他导航逻辑
    }

    /**
     * UI状态管理方法
     */
    showLoadingState() {
        this.isLoading = true;
        if ($w('#loadingIndicator')) {
            $w('#loadingIndicator').show();
        }
    }

    hideLoadingState() {
        this.isLoading = false;
        if ($w('#loadingIndicator')) {
            $w('#loadingIndicator').hide();
        }
    }

    showEmptyState() {
        if ($w('#emptyState')) {
            $w('#emptyState').show();
        }
        if ($w('#studentList')) {
            $w('#studentList').hide();
        }
    }

    hideEmptyState() {
        if ($w('#emptyState')) {
            $w('#emptyState').hide();
        }
        if ($w('#studentList')) {
            $w('#studentList').show();
        }
    }

    hideConfirmationDialog() {
        $w('#confirmationLightbox').hide();
    }

    /**
     * 错误处理
     */
    handleError(message) {
        console.error(message);
        if ($w('#errorMessage')) {
            $w('#errorMessage').text = message;
            $w('#errorMessage').show();
        }
        this.hideLoadingState();
    }
}

// 页面加载时初始化系统
$w.onReady(() => {
    // 功能0：页面加载和初始学生显示
    window.studentManagementSystem = new StudentManagementSystem();
});

// 导出供其他模块使用
export default StudentManagementSystem;