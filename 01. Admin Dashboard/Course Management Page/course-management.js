// Course Management Page JavaScript
// Converted from Wix Lightbox to standalone page

// Sample course data - in production, this would come from a database
const sampleCourses = [
    {
        id: 'AS-APY-Y9-EL-BIOLOGY',
        classId: 'AS-APY-Y9-EL',
        subject: 'Biology',
        status: 'active',
        students: [
            { name: 'Oliver Thompson', lessons: 8 },
            { name: 'Emily Johnson', lessons: 6 },
            { name: 'Harry Williams', lessons: 10 }
        ]
    },
    {
        id: 'AS-APY-Y9-EL-ENGLISH',
        classId: 'AS-APY-Y9-EL',
        subject: 'English',
        status: 'active',
        students: [
            { name: 'Sophie Brown', lessons: 12 },
            { name: 'Jack Davies', lessons: 4 }
        ]
    },
    {
        id: 'AS-APY-Y9-EL-FRENCH',
        classId: 'AS-APY-Y9-EL',
        subject: 'French',
        status: 'pending',
        students: [
            { name: 'Charlotte Wilson', lessons: 15 },
            { name: 'George Evans', lessons: 8 },
            { name: 'Amelia Taylor', lessons: 6 },
            { name: 'Thomas Anderson', lessons: 9 }
        ]
    },
    {
        id: 'AS-STY-Y7-DG-MATHS',
        classId: 'AS-STY-Y7-DG',
        subject: 'Mathematics',
        status: 'active',
        students: [
            { name: 'Isabella Clark', lessons: 7 },
            { name: 'William Smith', lessons: 11 },
            { name: 'Olivia Jones', lessons: 5 },
            { name: 'James Wilson', lessons: 13 },
            { name: 'Emma Davis', lessons: 9 },
            { name: 'Alexander Brown', lessons: 8 }
        ]
    },
    {
        id: 'AS-STY-Y8-DG-SCIENCE',
        classId: 'AS-STY-Y8-DG',
        subject: 'Science',
        status: 'cancelled',
        students: [
            { name: 'Sophia Miller', lessons: 0 }
        ]
    }
];

let filteredCourses = [...sampleCourses];

// DOM Elements
const courseSearchInput = document.getElementById('courseSearchInput');
const courseFilterDropdown = document.getElementById('courseFilterDropdown');
const courseListContainer = document.getElementById('courseListContainer');
const emptyState = document.getElementById('emptyState');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderCourses();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    courseSearchInput.addEventListener('input', handleSearch);
    courseFilterDropdown.addEventListener('change', handleFilter);
}

// Handle search functionality
function handleSearch() {
    const searchTerm = courseSearchInput.value.toLowerCase().trim();
    const selectedFilter = courseFilterDropdown.value;
    
    filteredCourses = sampleCourses.filter(course => {
        const matchesSearch = searchTerm === '' || 
            course.classId.toLowerCase().includes(searchTerm) ||
            course.subject.toLowerCase().includes(searchTerm) ||
            course.students.some(student => student.name.toLowerCase().includes(searchTerm));
        
        const matchesFilter = selectedFilter === 'all' || course.status === selectedFilter;
        
        return matchesSearch && matchesFilter;
    });
    
    renderCourses();
}

// Handle filter functionality
function handleFilter() {
    handleSearch(); // Reuse search logic which includes filtering
}

// Render courses list
function renderCourses() {
    if (filteredCourses.length === 0) {
        courseListContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No courses found</h3>
                <p>Try adjusting your search criteria or filters</p>
            </div>
        `;
        return;
    }
    
    const coursesHTML = filteredCourses.map(course => createCourseItem(course)).join('');
    courseListContainer.innerHTML = coursesHTML;
    
    // Add event listeners to action buttons
    addActionButtonListeners();
}

// Create individual course item HTML
function createCourseItem(course) {
    const statusClass = `status-${course.status}`;
    const statusText = course.status.charAt(0).toUpperCase() + course.status.slice(1);
    const studentCount = course.students.length;
    const totalLessons = course.students.reduce((sum, student) => sum + student.lessons, 0);
    
    const studentsHTML = course.students.map(student => `
        <div class="student-item">
            <span class="student-name">${student.name}</span>
            <span class="student-lessons">${student.lessons} lessons</span>
        </div>
    `).join('');
    
    return `
        <div class="course-item" data-course-id="${course.id}">
            <div class="course-header">
                <div class="course-info">
                    <div class="course-title">${course.classId} - ${course.subject}</div>
                    <div class="course-meta">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <span style="margin-left: 10px;">${studentCount} student${studentCount !== 1 ? 's' : ''}</span>
                        <span style="margin-left: 10px;">${totalLessons} total lessons</span>
                    </div>
                </div>
                <div class="course-actions">
                    <button class="btn btn-primary extend-btn" data-course-id="${course.id}">
                        <i class="fas fa-calendar-plus"></i>
                        Extend
                    </button>
                    <button class="btn btn-warning details-btn" data-course-id="${course.id}">
                        <i class="fas fa-eye"></i>
                        Details
                    </button>
                    <button class="btn btn-danger cancel-btn" data-course-id="${course.id}" ${course.status === 'cancelled' ? 'disabled' : ''}>
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                </div>
            </div>
            <div class="students-list">
                ${studentsHTML}
            </div>
        </div>
    `;
}

// Add event listeners to action buttons
function addActionButtonListeners() {
    // Extend course buttons
    document.querySelectorAll('.extend-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseId = e.target.closest('.extend-btn').dataset.courseId;
            handleCourseExtension(courseId);
        });
    });
    
    // Course details buttons
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseId = e.target.closest('.details-btn').dataset.courseId;
            handleCourseDetails(courseId);
        });
    });
    
    // Cancel course buttons
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const courseId = e.target.closest('.cancel-btn').dataset.courseId;
            handleCourseCancellation(courseId);
        });
    });
}

// Handle course extension
function handleCourseExtension(courseId) {
    const course = sampleCourses.find(c => c.id === courseId);
    if (course) {
        // Store course data for extension page
        sessionStorage.setItem('selectedCourse', JSON.stringify(course));
        // Navigate to course extension page
        window.location.href = '../Course Extension Page/course-extension.html';
    }
}

// Handle course details
function handleCourseDetails(courseId) {
    const course = sampleCourses.find(c => c.id === courseId);
    if (course) {
        alert(`Course Details:\n\nClass ID: ${course.classId}\nSubject: ${course.subject}\nStatus: ${course.status}\nStudents: ${course.students.length}\n\nStudent List:\n${course.students.map(s => `• ${s.name} (${s.lessons} lessons)`).join('\n')}`);
    }
}

// Handle course cancellation
function handleCourseCancellation(courseId) {
    const course = sampleCourses.find(c => c.id === courseId);
    if (course && course.status !== 'cancelled') {
        // Store course data for cancellation page
        sessionStorage.setItem('selectedCourse', JSON.stringify(course));
        // Navigate to course cancellation page
        window.location.href = '../Course Cancellation Page/course-cancellation.html';
    }
}

// Utility function to get course by ID
function getCourseById(courseId) {
    return sampleCourses.find(course => course.id === courseId);
}

// Export functions for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sampleCourses,
        getCourseById,
        handleCourseExtension,
        handleCourseCancellation
    };
}

/*
=== 按钮和元素引用名字 ===

表单元素 IDs:
- courseSearchInput: 课程搜索输入框
- courseFilterDropdown: 课程筛选下拉框
- courseListContainer: 课程列表容器
- emptyState: 空状态显示

动态生成的元素 (data attributes):
- data-course-id: 课程ID数据属性
- .extend-btn: 延期按钮
- .details-btn: 详情按钮
- .cancel-btn: 取消按钮

按钮功能:
- handleCourseExtension(courseId): 处理课程延期
- handleCourseDetails(courseId): 处理课程详情
- handleCourseCancellation(courseId): 处理课程取消
- handleSearch(): 处理搜索
- handleFilter(): 处理筛选

CSS类名:
- .course-list-container: 课程列表容器
- .course-item: 课程项目
- .filter-dropdown: 筛选下拉框
- .empty-state: 空状态
- .btn: 按钮基础样式
- .btn-primary: 主要按钮
- .btn-warning: 警告按钮
- .btn-danger: 危险按钮
- .extend-btn: 延期按钮
- .details-btn: 详情按钮
- .cancel-btn: 取消按钮

数据结构:
- sampleCourses: 示例课程数组
- filteredCourses: 筛选后的课程数组
*/