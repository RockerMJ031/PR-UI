// Wix 导师仪表盘 - 完整代码实现
// 本文件包含所有前端 Velo 代码和后端集成代码

// ==========================================
// 前端页面代码 (Page Code)
// ==========================================

// 导入所需的 Wix 模块
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import wixWindow from 'wix-window';
import { local } from 'wix-storage';

// 页面初始化
$w.onReady(function () {
    console.log('导师仪表盘已加载');
    
    // 检查用户权限
    checkUserPermissions()
        .then((hasPermission) => {
            if (!hasPermission) {
                showErrorMessage('您没有访问此页面的权限');
                wixLocation.to('/unauthorized');
                return;
            }
            
            // 初始化页面
            initializePage();
            
            // 设置事件处理器
            setupEventHandlers();
            
            // 加载初始数据
            loadInitialData();
            
            // 设置响应式设计
            setupResponsiveDesign();
        })
        .catch((error) => {
            console.error('权限检查失败:', error);
            showErrorMessage('权限验证失败，请重新登录');
        });
});

// 初始化页面函数
function initializePage() {
    // 设置用户信息
    setupUserInfo();
    
    // 初始隐藏所有模态框
    hideAllModals();
    
    // 设置默认状态
    $w('#studentModalStates').changeState('addStudent');
    
    console.log('页面初始化成功');
}

// 设置事件处理器
function setupEventHandlers() {
    // 导航按钮
    $w('#dashboardNavBtn').onClick(() => handleNavigation('dashboard'));
    $w('#studentsNavBtn').onClick(() => handleNavigation('students'));
    $w('#sessionsNavBtn').onClick(() => handleNavigation('sessions'));
    $w('#reportsNavBtn').onClick(() => handleNavigation('reports'));
    $w('#financeNavBtn').onClick(() => handleNavigation('finance'));
    $w('#settingsNavBtn').onClick(() => handleNavigation('settings'));
    
    // 操作卡片按钮
    $w('#manageCourseBtn').onClick(() => openCourseModal());
    $w('#addStudentBtn').onClick(() => openStudentModal('add'));
    $w('#removeStudentBtn').onClick(() => openStudentModal('remove'));
    $w('#addAPStudentBtn').onClick(() => openAPStudentModal());
    $w('#removeAPStudentBtn').onClick(() => openRemoveAPModal());
    $w('#submitTicketBtn').onClick(() => handleTicketSubmission());
    $w('#checkStatusBtn').onClick(() => handleStatusCheck());
    
    // 模态框关闭按钮
    $w('#closeCourseModalBtn').onClick(() => $w('#courseManagementLightbox').hide());
    $w('#closeStudentModalBtn').onClick(() => $w('#studentManagementLightbox').hide());
    $w('#closeAPModalBtn').onClick(() => $w('#apStudentRegistrationLightbox').hide());
    
    // 表单提交按钮
    $w('#submitAddStudentBtn').onClick(() => submitAddStudent());
    $w('#registerAPStudentBtn').onClick(() => registerAPStudent());
    
    // 标签页导航
    $w('#addStudentTabBtn').onClick(() => switchStudentModalTab('add'));
    $w('#removeStudentTabBtn').onClick(() => switchStudentModalTab('remove'));
    
    // 搜索功能
    $w('#courseSearchInput').onInput(() => filterCourses());
    
    // 文件上传
    $w('#ehcpFileUpload').onChange(() => handleFileUpload());
    
    console.log('事件处理器设置完成');
}

// 加载初始数据
function loadInitialData() {
    loadStatistics();
    loadCourses();
    loadStudents();
    loadAPStudents();
    loadPricingPlans();
    
    console.log('初始数据加载开始');
}

// 加载统计数据
function loadStatistics() {
    wixData.query("Statistics")
        .limit(1)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const stats = results.items[0];
                updateStatisticsDisplay(stats);
            } else {
                createDefaultStatistics();
            }
        })
        .catch((error) => {
            console.error('加载统计数据错误:', error);
            showErrorMessage('加载统计数据失败');
        });
}

// 更新统计显示
function updateStatisticsDisplay(stats) {
    $w('#totalStudentsValue').text = stats.totalStudents.toString();
    $w('#activeStudentsValue').text = stats.activeStudents.toString();
    $w('#securityAlertsValue').text = stats.securityAlerts.toString();
    $w('#pendingInvoicesValue').text = stats.pendingInvoices.toString();
    
    console.log('统计数据已更新:', stats);
}

// 创建默认统计数据（如果不存在）
function createDefaultStatistics() {
    const defaultStats = {
        totalStudents: 0,
        activeStudents: 0,
        securityAlerts: 0,
        pendingInvoices: 0,
        lastUpdated: new Date()
    };
    
    wixData.insert("Statistics", defaultStats)
        .then((result) => {
            updateStatisticsDisplay(defaultStats);
            console.log('默认统计数据已创建');
        })
        .catch((error) => {
            console.error('创建默认统计数据错误:', error);
        });
}

// 加载课程数据
function loadCourses() {
    wixData.query("Courses")
        .find()
        .then((results) => {
            // 设置课程数据集 - 修复 Dataset 使用方式
            $w('#coursesDataset').setFilter(wixData.filter());
            $w('#coursesDataset').onReady(() => {
                // Dataset 会自动加载数据
            });
            populateCourseDropdowns(results.items);
            console.log('课程已加载:', results.items.length);
        })
        .catch((error) => {
            console.error('加载课程错误:', error);
        });
}

// 填充课程下拉菜单
function populateCourseDropdowns(courses) {
    const options = courses.map(course => ({
        label: course.title,
        value: course._id
    }));
    
    $w('#studentCourseDropdown').options = options;
    $w('#removeFromCourseDropdown').options = options;
}

// 加载学生数据
function loadStudents() {
    wixData.query("Students")
        .find()
        .then((results) => {
            // 设置数据集数据 - 修复 Dataset 使用方式
            $w('#studentsDataset').setFilter(wixData.filter());
            $w('#studentsDataset').onReady(() => {
                // Dataset 会自动加载数据，无需手动 setData
            });
            populateStudentDropdowns(results.items);
            updateAPStudentCount(results.items);
            console.log('学生已加载:', results.items.length);
        })
        .catch((error) => {
            console.error('加载学生错误:', error);
        });
}

// 填充学生下拉菜单
function populateStudentDropdowns(students) {
    const options = students.map(student => ({
        label: student.name,
        value: student._id
    }));
    
    $w('#removeStudentDropdown').options = options;
}

// 更新 AP 学生计数
function updateAPStudentCount(students) {
    const apStudents = students.filter(student => student.isAP === true);
    console.log('AP 学生数量:', apStudents.length);
}

// 加载 AP 学生数据
function loadAPStudents() {
    wixData.query("Students")
        .eq("isAP", true)
        .find()
        .then((results) => {
            // 设置 AP 学生数据集 - 修复 Dataset 使用方式
            $w('#apStudentsDataset').setFilter(wixData.filter().eq('isAP', true));
            $w('#apStudentsDataset').onReady(() => {
                // Dataset 会自动加载数据
            });
            console.log('AP 学生已加载:', results.items.length);
        })
        .catch((error) => {
            console.error('加载 AP 学生错误:', error);
        });
}

// 加载价格方案
function loadPricingPlans() {
    wixData.query("PricingPlans")
        .ascending("displayOrder")
        .find()
        .then((results) => {
            // 设置价格数据集 - 修复 Dataset 使用方式
            $w('#pricingDataset').setFilter(wixData.filter());
            $w('#pricingDataset').onReady(() => {
                // Dataset 会自动加载数据
            });
            console.log('价格方案已加载:', results.items.length);
        })
        .catch((error) => {
            console.error('加载价格方案错误:', error);
        });
}

// 处理导航
function handleNavigation(section) {
    // 移除所有活跃状态
    $w('#dashboardNavBtn').style.backgroundColor = 'transparent';
    $w('#studentsNavBtn').style.backgroundColor = 'transparent';
    $w('#sessionsNavBtn').style.backgroundColor = 'transparent';
    $w('#reportsNavBtn').style.backgroundColor = 'transparent';
    $w('#financeNavBtn').style.backgroundColor = 'transparent';
    $w('#settingsNavBtn').style.backgroundColor = 'transparent';
    
    // 设置活跃状态
    $w(`#${section}NavBtn`).style.backgroundColor = '#007bff';
    $w(`#${section}NavBtn`).style.color = '#ffffff';
    
    console.log('导航到:', section);
}

// 打开课程模态框（替换原始 HTML 文件中的 openCourseModal 函数）
// 原始: function openCourseModal(action) { document.getElementById('courseModal').style.display = 'block'; }
function openCourseModal() {
    $w('#courseManagementLightbox').show();      // Wix Lightbox 而非 HTML 模态框
    console.log('课程管理模态框已打开');
}

// 打开学生模态框（替换原始 HTML 文件中的 openStudentModal 函数）
// 原始: function openStudentModal() { document.getElementById('studentModal').style.display = 'block'; }
function openStudentModal(action = 'add') {
    $w('#studentManagementLightbox').show();     // Wix Lightbox 而非 HTML 模态框
    switchStudentModalTab(action);
    console.log('学生管理模态框已打开:', action);
}

// 切换学生模态框标签页
function switchStudentModalTab(tab) {
    if (tab === 'add') {
        $w('#studentModalStates').changeState('addStudent');
        $w('#addStudentTabBtn').style.backgroundColor = '#007bff';
        $w('#removeStudentTabBtn').style.backgroundColor = 'transparent';
    } else if (tab === 'remove') {
        $w('#studentModalStates').changeState('removeStudent');
        $w('#removeStudentTabBtn').style.backgroundColor = '#007bff';
        $w('#addStudentTabBtn').style.backgroundColor = 'transparent';
    }
    
    console.log('学生模态框标签页切换到:', tab);
}

// 打开 AP 学生模态框（替换原始 HTML 文件中的 openAPStudentModal 函数）
// 原始: function openAPStudentModal() { document.getElementById('apStudentModal').style.display = 'block'; }
function openAPStudentModal() {
    $w('#apStudentRegistrationLightbox').show(); // Wix Lightbox 而非 HTML 模态框
    console.log('AP 学生注册模态框已打开');
}

// 打开删除 AP 学生模态框
function openRemoveAPModal() {
    // 实现删除 AP 学生逻辑
    console.log('删除 AP 学生模态框已打开');
}

// 提交添加学生
function submitAddStudent() {
    // 检查权限
    checkUserPermissions('add_student')
        .then((hasPermission) => {
            if (!hasPermission) {
                showErrorMessage('您没有添加学生的权限');
                return Promise.reject('权限不足');
            }
            
            // 获取表单数据
            const studentData = {
                name: $w('#studentNameInput').value,
                email: $w('#studentEmailInput').value,
                phone: $w('#studentPhoneInput').value,
                status: $w('#studentStatusDropdown').value,
                courses: [$w('#studentCourseDropdown').value],
                isAP: false,
                dateAdded: new Date(),
                lastActive: new Date()
            };
            
            // 验证表单数据
            if (!validateStudentData(studentData)) {
                return;
            }
            
            // 保存到数据库
            return wixData.insert("Students", studentData);
        })
        .then((result) => {
            showSuccessMessage('学生添加成功！');
            clearAddStudentForm();
            loadStudents();
            updateStatistics();
            
            // 发送到 Lark
            sendToLark({
                action: 'add_student',
                student: studentData
            });
            
            console.log('学生已添加:', result);
        })
        .catch((error) => {
            console.error('添加学生错误:', error);
            showErrorMessage('添加学生失败。请重试。');
        });
}

// 验证学生数据
function validateStudentData(data) {
    if (!data.name || data.name.trim() === '') {
        showErrorMessage('请输入学生姓名');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showErrorMessage('请输入有效的邮箱地址');
        return false;
    }
    
    if (!data.phone || data.phone.trim() === '') {
        showErrorMessage('请输入电话号码');
        return false;
    }
    
    if (!data.status) {
        showErrorMessage('请选择学生状态');
        return false;
    }
    
    return true;
}

// 验证邮箱格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 注册 AP 学生
function registerAPStudent() {
    // 检查权限
    checkUserPermissions('register_ap_student')
        .then((hasPermission) => {
            if (!hasPermission) {
                showErrorMessage('您没有注册 AP 学生的权限');
                return Promise.reject('权限不足');
            }
            
            return processAPStudentRegistration();
        })
        .catch((error) => {
            console.error('权限检查失败:', error);
            showErrorMessage('权限验证失败');
        });
}

// 处理 AP 学生注册流程
function processAPStudentRegistration() {
    // 获取EHCP文件信息
    const uploadButton = $w('#ehcpFileUpload');
    let ehcpFileData = {
        document: null,
        url: '',
        fileName: '',
        fileSize: 0,
        uploadDate: null,
        status: 'none'
    };
    
    // 检查并获取文件URL
    if (uploadButton.value.length > 0 && uploadButton.value[0].url) {
        const file = uploadButton.value[0];
        ehcpFileData = {
            document: file, // 完整的 Document 对象
            url: file.url,
            fileName: file.name,
            fileSize: file.size,
            uploadDate: new Date(),
            status: 'uploaded'
        };
    }
    
    // 获取表单数据
    const apStudentData = {
        name: $w('#apStudentNameInput').value,
        age: parseInt($w('#apStudentAgeInput').value),
        sendStatus: $w('#sendStatusDropdown').value,
        guardianName: $w('#guardianNameInput').value,
        guardianPhone: $w('#guardianPhoneInput').value,
        guardianEmail: $w('#guardianEmailInput').value,
        medicalInfo: $w('#medicalInfoTextarea').value,
        educationBackground: $w('#educationBackgroundTextarea').value,
        educationPlan: $w('#educationPlanDropdown').value,
        
        // EHCP文件相关字段
        ehcpFile: ehcpFileData.document, // Document 字段
        ehcpFileUrl: ehcpFileData.url,
        ehcpFileName: ehcpFileData.fileName,
        ehcpFileSize: ehcpFileData.fileSize,
        ehcpUploadDate: ehcpFileData.uploadDate,
        ehcpFileStatus: ehcpFileData.status,
        
        isAP: true,
        status: 'active',
        dateAdded: new Date(),
        lastActive: new Date()
    };
    
    // 验证表单数据
    if (!validateAPStudentData(apStudentData)) {
        return;
    }
    
    // 保存到数据库
    wixData.insert("Students", apStudentData)
        .then((result) => {
            showSuccessMessage('AP 学生注册成功！');
            clearAPStudentForm();
            loadStudents();
            loadAPStudents();
            updateStatistics();
            
            // 如果有文件，发送到后端进行安全验证
            if (ehcpFileData.url) {
                verifyUploadedFile(result._id, ehcpFileData);
            }
            
            // 发送到 Lark - 使用环境变量管理 Webhook URL
            sendLarkNotification({
                type: 'ap_student_registration',
                studentName: apStudentData.name,
                studentEmail: apStudentData.guardianEmail,
                studentPhone: apStudentData.guardianPhone,
                hasEHCPFile: ehcpFileData.status === 'uploaded'
            });
            
            console.log('AP 学生已注册:', result);
        })
        .catch((error) => {
            console.error('注册 AP 学生错误:', error);
            showErrorMessage('注册 AP 学生失败。请重试。');
        });
}

// 验证 AP 学生数据
function validateAPStudentData(data) {
    if (!data.name || data.name.trim() === '') {
        showErrorMessage('请输入学生姓名');
        return false;
    }
    
    if (!data.age || data.age < 1 || data.age > 100) {
        showErrorMessage('请输入有效年龄');
        return false;
    }
    
    if (!data.sendStatus) {
        showErrorMessage('请选择 SEND 状态');
        return false;
    }
    
    if (!data.guardianName || data.guardianName.trim() === '') {
        showErrorMessage('请输入监护人姓名');
        return false;
    }
    
    if (!data.guardianPhone || data.guardianPhone.trim() === '') {
        showErrorMessage('请输入监护人电话');
        return false;
    }
    
    if (!data.guardianEmail || !isValidEmail(data.guardianEmail)) {
        showErrorMessage('请输入有效的监护人邮箱');
        return false;
    }
    
    if (!data.educationPlan) {
        showErrorMessage('请选择教育计划');
        return false;
    }
    
    return true;
}

// 清空添加学生表单
function clearAddStudentForm() {
    $w('#studentNameInput').value = '';
    $w('#studentEmailInput').value = '';
    $w('#studentPhoneInput').value = '';
    $w('#studentStatusDropdown').selectedIndex = 0;
    $w('#studentCourseDropdown').selectedIndex = 0;
    $w('#addStudentMessage').hide();
}

// 清空 AP 学生表单
function clearAPStudentForm() {
    $w('#apStudentNameInput').value = '';
    $w('#apStudentAgeInput').value = '';
    $w('#sendStatusDropdown').selectedIndex = 0;
    $w('#guardianNameInput').value = '';
    $w('#guardianPhoneInput').value = '';
    $w('#guardianEmailInput').value = '';
    $w('#medicalInfoTextarea').value = '';
    $w('#educationBackgroundTextarea').value = '';
    $w('#educationPlanDropdown').selectedIndex = 0;
    $w('#apRegistrationMessage').hide();
    $w('#fileUploadMessage').hide();
}

// 文件上传状态管理
let fileUploadStatus = {
    isUploading: false,
    isComplete: false,
    fileData: null
};

// 处理文件上传
function handleFileUpload() {
    const uploadButton = $w('#ehcpFileUpload');
    
    if (uploadButton.value.length > 0) {
        const file = uploadButton.value[0];
        
        // 检查文件大小（5MB 限制）
        if (file.size > 5 * 1024 * 1024) {
            showErrorMessage('文件大小必须小于 5MB');
            uploadButton.reset();
            return;
        }
        
        // 检查文件类型
        const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.png'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        
        if (!allowedTypes.includes(fileExtension)) {
            showErrorMessage('请仅上传 PDF、DOC、DOCX、JPG 或 PNG 文件');
            uploadButton.reset();
            return;
        }
        
        // 设置上传状态
        fileUploadStatus.isUploading = true;
        fileUploadStatus.isComplete = false;
        fileUploadStatus.fileData = file;
        
        // 禁用提交按钮，防止过早提交
        updateSubmitButtonState();
        
        // 显示上传进度
        $w('#fileUploadMessage').text = `正在上传文件: ${file.name}...`;
        $w('#fileUploadMessage').show();
        
        // 监控上传完成状态
        monitorFileUploadStatus(file);
        
        console.log('文件上传开始:', file.name);
    }
}

// 监控文件上传状态
function monitorFileUploadStatus(file) {
    const checkInterval = setInterval(() => {
        const uploadButton = $w('#ehcpFileUpload');
        
        if (uploadButton.value.length > 0 && uploadButton.value[0].url) {
            // 上传完成
            clearInterval(checkInterval);
            
            fileUploadStatus.isUploading = false;
            fileUploadStatus.isComplete = true;
            fileUploadStatus.fileData = uploadButton.value[0];
            
            $w('#fileUploadMessage').text = `文件上传成功: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
            updateSubmitButtonState(); // 重新启用提交按钮
            
            console.log('文件上传完成，URL:', uploadButton.value[0].url);
        }
    }, 500); // 每500ms检查一次
    
    // 30秒超时保护
    setTimeout(() => {
        clearInterval(checkInterval);
        if (!$w('#ehcpFileUpload').value[0]?.url) {
            fileUploadStatus.isUploading = false;
            fileUploadStatus.isComplete = false;
            showErrorMessage('文件上传超时，请重试');
            updateSubmitButtonState();
        }
    }, 30000);
}

// 更新提交按钮状态
function updateSubmitButtonState() {
    const submitBtn = $w('#registerAPStudentBtn');
    if (fileUploadStatus.isUploading) {
        submitBtn.disable();
        submitBtn.label = "文件上传中...";
    } else {
        submitBtn.enable();
        submitBtn.label = "注册学生";
    }
}

// 调用后端文件验证
function verifyUploadedFile(studentId, fileData) {
    import('backend_fileVerification')
        .then((fileModule) => {
            return fileModule.verifyUploadedFile(studentId, fileData);
        })
        .then((result) => {
            if (result.success) {
                console.log('文件验证成功');
                // 可以在这里更新UI显示验证状态
            } else {
                console.error('文件验证失败:', result.error);
                showUserFriendlyError({ code: 'VERIFICATION_FAILED' });
            }
        })
        .catch((error) => {
            console.error('调用文件验证错误:', error);
            showUserFriendlyError({ code: 'VERIFICATION_FAILED' });
        });
}

// 用户友好的错误提示
function showUserFriendlyError(error) {
    const errorMessages = {
        'FILE_TOO_LARGE': '文件大小不能超过 5MB',
        'INVALID_FILE_TYPE': '请上传 PDF、Word 文档或图片文件',
        'UPLOAD_FAILED': '文件上传失败，请重试',
        'VERIFICATION_FAILED': '文件验证失败，请检查文件格式',
        'PERMISSION_DENIED': '没有权限执行此操作',
        'NETWORK_ERROR': '网络连接错误，请检查网络后重试'
    };
    
    const message = errorMessages[error.code] || '操作失败，请重试';
    showErrorMessage(message);
}

// 增强的文件安全验证
function validateFileSecurely(file) {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
    ];
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        throw new Error('INVALID_FILE_TYPE');
    }
    
    if (file.size > maxSize) {
        throw new Error('FILE_TOO_LARGE');
    }
    
    return true;
}

// 发送数据到 Lark
function sendToLark(data) {
    // 调用后端函数发送到 Lark
    import('backend_larkIntegration')
        .then((larkModule) => {
            return larkModule.sendNotificationToLark(data);
        })
        .then((result) => {
            console.log('Lark 通知已发送:', result);
        })
        .catch((error) => {
            console.error('发送到 Lark 错误:', error);
        });
}

// 发送 Lark 通知的简化函数
function sendLarkNotification(data) {
    import('backend_larkIntegration')
        .then((larkModule) => {
            return larkModule.sendLarkNotification(data);
        })
        .then((result) => {
            console.log('Lark 通知发送成功:', result);
        })
        .catch((error) => {
            console.error('Lark 通知发送失败:', error);
        });
}

// 显示成功消息
function showSuccessMessage(message) {
    console.log('成功:', message);
    
    // 在添加学生消息区域显示
    if ($w('#addStudentMessage')) {
        $w('#addStudentMessage').text = message;
        $w('#addStudentMessage').style.color = '#27ae60';
        $w('#addStudentMessage').show();
        
        // 3 秒后隐藏
        setTimeout(() => {
            $w('#addStudentMessage').hide();
        }, 3000);
    }
}

// 显示错误消息
function showErrorMessage(message) {
    console.error('错误:', message);
    
    // 在添加学生消息区域显示
    if ($w('#addStudentMessage')) {
        $w('#addStudentMessage').text = message;
        $w('#addStudentMessage').style.color = '#e74c3c';
        $w('#addStudentMessage').show();
        
        // 5 秒后隐藏
        setTimeout(() => {
            $w('#addStudentMessage').hide();
        }, 5000);
    }
}

// 隐藏所有模态框（替换 HTML 模态框隐藏功能）
// 原始: 对每个模态框使用 modal.style.display = 'none'
function hideAllModals() {
    // 检查元素是否存在再隐藏
    if ($w('#courseManagementLightbox')) {
        $w('#courseManagementLightbox').hide();      // Wix Lightbox 而非 HTML 模态框
    }
    if ($w('#studentManagementLightbox')) {
        $w('#studentManagementLightbox').hide();    // Wix Lightbox 而非 HTML 模态框
    }
    if ($w('#apStudentRegistrationLightbox')) {
        $w('#apStudentRegistrationLightbox').hide(); // Wix Lightbox 而非 HTML 模态框
    }
}

// 检查用户权限
function checkUserPermissions(action = null) {
    // 使用已导入的 wixUsers 模块
    if (!wixUsers.currentUser.loggedIn) {
        return Promise.resolve(false);
    }
    
    return Promise.resolve(true)
        .then(() => {
            // 继续权限检查逻辑
            
            // 获取当前用户角色
            return wixData.query('UserRoles')
                .eq('userId', wixUsers.currentUser.id)
                .find()
                .then((results) => {
                    if (results.items.length === 0) {
                        return false;
                    }
                    
                    const userRole = results.items[0];
                    
                    // 检查特定操作权限
                    if (action) {
                        return checkActionPermission(userRole.role, action);
                    }
                    
                    // 检查基本访问权限
                    return ['admin', 'supervisor'].includes(userRole.role);
                });
        })
        .catch((error) => {
            console.error('权限检查错误:', error);
            return false;
        });
}

// 检查操作权限
function checkActionPermission(userRole, action) {
    const permissions = {
        'admin': ['add_student', 'remove_student', 'register_ap_student', 'manage_courses', 'view_reports'],
        'supervisor': ['add_student', 'register_ap_student', 'view_reports'],
        'admin': ['add_student', 'view_reports', 'manage_users', 'system_config']
    };
    
    return permissions[userRole] && permissions[userRole].includes(action);
}

// 设置用户信息
function setupUserInfo() {
    // 从本地存储或数据库获取用户信息
    const userInfo = local.getItem('adminInfo');
    
    if (userInfo) {
        const user = JSON.parse(userInfo);
        $w('#userName').text = user.name || '导师姓名';
        $w('#userRole').text = user.role || '高级导师';
        
        if (user.avatar) {
            $w('#userAvatar').src = user.avatar;
        }
    }
}

// 设置响应式设计
function setupResponsiveDesign() {
    // 使用 Wix FormFactor API 进行响应式设计
    try {
        // 获取当前设备类型并应用相应布局
        const currentFormFactor = wixWindow.formFactor;
        switch (currentFormFactor) {
            case 'Mobile':
                adjustMobileLayout();
                break;
            case 'Tablet':
                adjustTabletLayout();
                break;
            case 'Desktop':
                adjustDesktopLayout();
                break;
            default:
                adjustDesktopLayout();
                break;
        }
        
        console.log('响应式设计已应用，当前设备类型:', currentFormFactor);
    } catch (error) {
        console.warn('FormFactor API 不可用，使用降级方法:', error);
        // 降级到传统方法
        if (window.innerWidth <= 768) {
            adjustMobileLayout();
        } else if (window.innerWidth > 768 && window.innerWidth <= 1200) {
            adjustTabletLayout();
        } else {
            adjustDesktopLayout();
        }
    }
}

// 调整移动端布局
function adjustMobileLayout() {
    // 为移动端调整网格布局
    $w('#statisticsGrid').layout = 'grid';
    $w('#actionCardsGrid').layout = 'grid';
    $w('#pricingGrid').layout = 'grid';
    
    console.log('移动端布局已应用');
}

// 调整平板端布局
function adjustTabletLayout() {
    // 为平板视图调整
    if ($w('#sidebarColumn')) {
        $w('#sidebarColumn').style.width = '220px';
    }
    
    console.log('平板端布局已应用');
}

// 调整桌面端布局
function adjustDesktopLayout() {
    // 为桌面视图调整
    if ($w('#sidebarColumn')) {
        $w('#sidebarColumn').show();
        $w('#sidebarColumn').style.width = '250px';
    }
    
    console.log('桌面端布局已应用');
}

// 更新统计数据
function updateStatistics() {
    // 重新计算统计数据
    Promise.all([
        wixData.query("Students").count(),
        wixData.query("Students").eq("status", "active").count()
    ])
    .then(([totalCount, activeCount]) => {
        const updatedStats = {
            totalStudents: totalCount,
            activeStudents: activeCount,
            securityAlerts: 0, // 根据需要更新
            pendingInvoices: 0, // 根据需要更新
            lastUpdated: new Date()
        };
        
        // 在数据库中更新
        wixData.query("Statistics")
            .limit(1)
            .find()
            .then((results) => {
                if (results.items.length > 0) {
                    updatedStats._id = results.items[0]._id;
                    return wixData.update("Statistics", updatedStats);
                } else {
                    return wixData.insert("Statistics", updatedStats);
                }
            })
            .then(() => {
                updateStatisticsDisplay(updatedStats);
                console.log('统计数据更新成功');
            });
    })
    .catch((error) => {
        console.error('更新统计数据错误:', error);
    });
}

// 过滤课程
function filterCourses() {
    const searchTerm = $w('#courseSearchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        $w('#coursesDataset').setFilter(wixData.filter());
    } else {
        $w('#coursesDataset').setFilter(
            wixData.filter()
                .contains('title', searchTerm)
                .or(wixData.filter().contains('subject', searchTerm))
        );
    }
}

// 处理工单提交
function handleTicketSubmission() {
    // 实现工单提交逻辑
    console.log('工单提交已点击');
    // 可以打开另一个模态框或重定向到工单表单
}

// 处理状态检查
function handleStatusCheck() {
    // 实现状态检查逻辑
    console.log('状态检查已点击');
    // 可以打开另一个模态框或重定向到状态页面
}

// ==========================================
// 后端集成代码 (Backend Code)
// ==========================================

// backend/larkIntegration.js
// 从 wix-fetch 导入 fetch
import { fetch } from 'wix-fetch';
import { getSecret } from 'wix-secrets-backend';

// 从环境变量获取 Lark webhook URL
const getLarkWebhookUrl = () => {
    return getSecret('LARK_WEBHOOK_URL')
        .then(url => {
            if (!url) {
                throw new Error('LARK_WEBHOOK_URL 环境变量未设置');
            }
            return url;
        });
};

// 发送通知到 Lark
export function sendNotificationToLark(data) {
    return getLarkWebhookUrl()
        .then(webhookUrl => {
            const message = formatLarkMessage(data);
            
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            };
            
            return fetch(webhookUrl, options);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Lark 通知发送成功:', result);
            return { success: true, result };
        })
        .catch(error => {
            console.error('发送 Lark 通知错误:', error);
            return { success: false, error: error.message };
        });
}

// 简化的 Lark 通知发送函数
export function sendLarkNotification(data) {
    return getLarkWebhookUrl()
        .then(webhookUrl => {
            const message = formatSimpleLarkMessage(data);
            
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            };
            
            return fetch(webhookUrl, options);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Lark 通知发送成功:', result);
            return { success: true, result };
        })
        .catch(error => {
            console.error('发送 Lark 通知错误:', error);
            return { success: false, error: error.message };
        });
}

// 为 Lark 格式化消息
function formatLarkMessage(data) {
    let messageText = '';
    
    switch (data.action) {
        case 'add_student':
            messageText = `🎓 新学生已添加\n\n` +
                        `姓名: ${data.student.name}\n` +
                        `邮箱: ${data.student.email}\n` +
                        `电话: ${data.student.phone}\n` +
                        `状态: ${data.student.status}\n` +
                        `日期: ${new Date().toLocaleString()}`;
            break;
            
        case 'register_ap_student':
            messageText = `⭐ 新 AP 学生已注册\n\n` +
                        `姓名: ${data.student.name}\n` +
                        `年龄: ${data.student.age}\n` +
                        `监护人: ${data.student.guardianName}\n` +
                        `教育计划: ${data.student.educationPlan}\n` +
                        `日期: ${new Date().toLocaleString()}`;
            break;
            
        default:
            messageText = `📊 仪表盘更新\n\n${JSON.stringify(data, null, 2)}`;
    }
    
    return {
        msg_type: 'text',
        content: {
            text: messageText
        }
    };
}

// 简化的消息格式化函数
function formatSimpleLarkMessage(data) {
    let messageText = '';
    
    switch (data.type) {
        case 'ap_student_registration':
            messageText = `⭐ 新 AP 学生注册\n\n` +
                        `姓名: ${data.studentName}\n` +
                        `邮箱: ${data.studentEmail}\n` +
                        `电话: ${data.studentPhone}\n` +
                        `EHCP 文件: ${data.hasEHCPFile ? '已上传' : '未上传'}\n` +
                        `时间: ${new Date().toLocaleString()}`;
            break;
            
        case 'student_added':
            messageText = `🎓 新学生添加\n\n` +
                        `姓名: ${data.studentName}\n` +
                        `邮箱: ${data.studentEmail}\n` +
                        `时间: ${new Date().toLocaleString()}`;
            break;
            
        default:
            messageText = `📊 系统通知\n\n${JSON.stringify(data, null, 2)}`;
    }
    
    return {
        msg_type: 'text',
        content: {
            text: messageText
        }
    };
}

// ==========================================
// 使用说明
// ==========================================

/*
使用此代码文件的步骤：

1. 前端代码部分：
   - 复制所有前端代码到 Wix 页面的代码面板中
   - 确保所有元素 ID 与代码中的 ID 匹配
   - 测试所有功能是否正常工作

2. 后端代码部分：
   - 在 Wix 编辑器中创建新的后端文件：backend/larkIntegration.js
   - 取消注释后端代码部分并复制到该文件中
   - 替换 LARK_WEBHOOK_URL 为您的实际 Lark webhook URL
   - 测试 Lark 集成是否正常工作

3. 数据连接：
   - 确保所有数据连接已正确配置
   - 验证字段名称和类型匹配
   - 设置正确的权限

4. 元素 ID 检查：
   - 确保所有 Wix 元素的 ID 与代码中使用的 ID 完全匹配
   - 特别注意 Lightbox、输入字段和按钮的 ID

5. 测试：
   - 在预览模式下测试所有功能
   - 验证表单提交和数据库操作
   - 测试响应式设计
   - 验证 Lark 通知

注意事项：
- 此代码使用 Wix Velo 语法，不是标准 JavaScript
- 确保您的 Wix 计划支持数据库功能
- 在生产环境中使用前，请彻底测试所有功能
- 定期备份您的数据库和代码
*/