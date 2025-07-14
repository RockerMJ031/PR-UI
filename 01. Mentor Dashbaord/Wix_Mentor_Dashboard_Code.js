// Wix 导师仪表盘 - 完整代码实现
// 本文件包含所有前端 Velo 代码和后端集成代码

// ==========================================
// 前端页面代码 (Page Code)
// ==========================================

// 导入所需的 Wix 模块
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { local } from 'wix-storage';

// 页面初始化
$w.onReady(function () {
    console.log('导师仪表盘已加载');
    
    // 初始化页面
    initializePage();
    
    // 设置事件处理器
    setupEventHandlers();
    
    // 加载初始数据
    loadInitialData();
    
    // 设置响应式设计
    setupResponsiveDesign();
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
            $w('#coursesDataset').setData(results.items);
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
            $w('#studentsDataset').setData(results.items);
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
            $w('#apStudentsDataset').setData(results.items);
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
            $w('#pricingDataset').setData(results.items);
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
    wixData.insert("Students", studentData)
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
            
            // 发送到 Lark
            sendToLark({
                action: 'register_ap_student',
                student: apStudentData
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

// 处理文件上传
function handleFileUpload() {
    const uploadButton = $w('#ehcpFileUpload');
    
    if (uploadButton.value.length > 0) {
        const file = uploadButton.value[0];
        
        // 验证文件大小（5MB 限制）
        if (file.size > 5 * 1024 * 1024) {
            showErrorMessage('文件大小必须小于 5MB');
            uploadButton.reset();
            return;
        }
        
        // 验证文件类型
        const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.png'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        
        if (!allowedTypes.includes(fileExtension)) {
            showErrorMessage('请仅上传 PDF、DOC、DOCX、JPG 或 PNG 文件');
            uploadButton.reset();
            return;
        }
        
        // 显示文件信息
        $w('#fileUploadMessage').text = `文件已上传: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        $w('#fileUploadMessage').show();
        
        console.log('文件上传成功:', file.name);
    }
}

// 发送数据到 Lark
function sendToLark(data) {
    // 调用后端函数发送到 Lark
    import('backend/larkIntegration')
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
    $w('#courseManagementLightbox').hide();      // Wix Lightbox 而非 HTML 模态框
    $w('#studentManagementLightbox').hide();    // Wix Lightbox 而非 HTML 模态框
    $w('#apStudentRegistrationLightbox').hide(); // Wix Lightbox 而非 HTML 模态框
}

// 设置用户信息
function setupUserInfo() {
    // 从本地存储或数据库获取用户信息
    const userInfo = local.getItem('mentorInfo');
    
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
    // 移动端断点处理
    if (window.innerWidth <= 768) {
        $w('#sidebarColumn').hide();
        adjustMobileLayout();
    }
    
    // 平板端断点处理
    if (window.innerWidth > 768 && window.innerWidth <= 1200) {
        adjustTabletLayout();
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
    $w('#sidebarColumn').style.width = '220px';
    
    console.log('平板端布局已应用');
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
                    return wixData.update("Statistics", updatedStats, results.items[0]._id);
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
// import { fetch } from 'wix-fetch';

// Lark webhook URL（替换为您的实际 webhook URL）
// const LARK_WEBHOOK_URL = 'https://open.larksuite.com/open-apis/bot/v2/hook/YOUR_WEBHOOK_TOKEN';

// 发送通知到 Lark
/*
export function sendNotificationToLark(data) {
    const message = formatLarkMessage(data);
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    };
    
    return fetch(LARK_WEBHOOK_URL, options)
        .then(response => response.json())
        .then(result => {
            console.log('Lark 通知发送成功:', result);
            return result;
        })
        .catch(error => {
            console.error('发送 Lark 通知错误:', error);
            throw error;
        });
}
*/

// 为 Lark 格式化消息
/*
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
*/

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

3. 数据库设置：
   - 确保所有数据库集合已按照指南创建
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