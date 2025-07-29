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
import { syncFromLark, syncToLark, batchSync, testLarkBaseConnection } from 'backend/larkBaseSync';


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
    
    // 初始化当前用户信息
    initCurrentUser();
    
    console.log('页面初始化成功');
}

// 初始化当前用户信息
async function initCurrentUser() {
    try {
        const currentUser = await wixUsers.currentUser.getHiddenCollectionToken();
        const adminCollection = wixData.collection('Admins');
        const adminQuery = await adminCollection.find({
            filter: wixData.filter().eq('_id', currentUser.id)
        });
        
        if (adminQuery.items.length > 0) {
            // 将管理员信息存储在全局变量中，以便后续使用
            global.currentAdmin = adminQuery.items[0];
            console.log('当前管理员信息已初始化');
        } else {
            console.error('未找到当前管理员信息');
        }
    } catch (error) {
        console.error('初始化当前用户信息错误:', error);
    }
}

// 获取当前用户信息
function getCurrentUser() {
    // 如果全局变量中存在当前管理员信息，则返回
    if (global.currentAdmin) {
        return {
            id: global.currentAdmin._id,
            name: global.currentAdmin.name,
            email: global.currentAdmin.email,
            role: global.currentAdmin.role
        };
    }
    
    // 否则返回默认信息
    return {
        id: 'unknown',
        name: 'Unknown User',
        email: 'unknown@example.com',
        role: 'viewer'
    };
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
    $w('#checkTicketStatusBtn').onClick(() => handleStatusCheck());
    
    // Lark Base 同步按钮
    $w('#syncWithLarkBtn').onClick(() => openLarkSyncModal());
    $w('#testLarkConnectionBtn').onClick(() => testLarkConnection());
    $w('#syncAllStudentsBtn').onClick(() => syncAllStudentsToLark());
    $w('#pullFromLarkBtn').onClick(() => pullStudentsFromLark());
    
    // 课程取消按钮
    $w('#cancelCourseBtn').onClick(() => openCourseCancellationModal());
    
    // 模态框关闭按钮
    $w('#closeCourseModalBtn').onClick(() => $w('#courseManagementLightbox').hide());
    $w('#closeStudentModalBtn').onClick(() => $w('#studentManagementLightbox').hide());
    $w('#closeAPModalBtn').onClick(() => $w('#apStudentRegistrationLightbox').hide());
    
    // 表单提交按钮
    $w('#submitAddStudentBtn').onClick(() => submitAddStudent());
    $w('#registerAPStudentBtn').onClick(() => registerAPStudent());
    
    // 课程取消相关按钮
    $w('#confirmCancellationBtn').onClick(() => confirmCourseCancellation());
    $w('#closeCancellationModalBtn').onClick(() => $w('#courseCancellationLightbox').hide());
    
    // 标签页导航
    $w('#addStudentTabBtn').onClick(() => switchStudentModalTab('add'));
    $w('#removeStudentTabBtn').onClick(() => switchStudentModalTab('remove'));
    
    // 搜索功能
    $w('#courseSearchInput').onInput(() => filterCourses());
    
    // Repeater 搜索功能
    if ($w('#studentSearchInput')) {
        $w('#studentSearchInput').onInput(() => filterStudentRepeater());
    }
    if ($w('#courseSearchInput2')) {
        $w('#courseSearchInput2').onInput(() => filterCourseRepeater());
    }
    if ($w('#apStudentSearchInput')) {
        $w('#apStudentSearchInput').onInput(() => filterAPStudentRepeater());
    }
    
    // 文件上传
    $w('#ehcpFileUpload').onChange(() => handleFileUpload());
    
    // 刷新统计数据按钮
    if ($w('#refreshStatsBtn')) {
        $w('#refreshStatsBtn').onClick(() => refreshStatistics());
    }
    
    console.log('事件处理器设置完成');
}

// 加载初始数据
function loadInitialData() {
    loadStatistics();
    loadCourses();
    loadStudents();
    loadAPStudents();
    loadPricingPlans();
    initTicketSystem();
    
    console.log('初始数据加载开始');
}

// 初始化工单系统
function initTicketSystem() {
    // 初始化工单状态检查模态框
    if ($w('#ticketStatusLightbox')) {
        // 设置工单ID输入框事件
        $w('#ticketIdInput').onInput(() => {
            const ticketId = $w('#ticketIdInput').value;
            $w('#checkTicketBtn').enable(ticketId && ticketId.trim().length > 0);
        });
        
        // 设置检查按钮点击事件
        $w('#checkTicketBtn').onClick(() => {
            const ticketId = $w('#ticketIdInput').value;
            if (ticketId && ticketId.trim().length > 0) {
                checkTicketStatus(ticketId)
                    .then(ticketDetails => {
                        // 关闭状态检查模态框，显示详情模态框
                        $w('#ticketStatusLightbox').hide();
                        showTicketDetails(ticketDetails);
                    })
                    .catch(error => {
                        $w('#ticketStatusError').text = error.message || '查询工单失败';
                        $w('#ticketStatusError').show();
                    });
            }
        });
        
        // 设置关闭按钮点击事件
        $w('#closeTicketStatusBtn').onClick(() => {
            $w('#ticketStatusLightbox').hide();
        });
    }
    
    // 初始化工单详情模态框
    if ($w('#ticketDetailsLightbox')) {
        // 设置关闭按钮点击事件
        $w('#closeTicketDetailsBtn').onClick(() => {
            $w('#ticketDetailsLightbox').hide();
        });
        
        // 设置更新状态按钮点击事件
        $w('#updateTicketStatusBtn').onClick(() => {
            const ticketId = $w('#ticketDetailsId').text;
            const newStatus = $w('#ticketStatusDropdown').value;
            const comments = $w('#ticketCommentsInput').value;
            const resolution = newStatus === 'resolved' ? $w('#ticketResolutionInput').value : '';
            
            updateTicketStatus(ticketId, newStatus, comments, resolution)
                .then(updatedTicket => {
                    // 刷新工单详情
                    showTicketDetails(updatedTicket);
                    $w('#ticketUpdateSuccess').show();
                    setTimeout(() => $w('#ticketUpdateSuccess').hide(), 3000);
                })
                .catch(error => {
                    $w('#ticketUpdateError').text = error.message || '更新工单失败';
                    $w('#ticketUpdateError').show();
                });
        });
    }
}

// 显示工单详情
function showTicketDetails(ticketDetails) {
    if (!$w('#ticketDetailsLightbox')) return;
    
    // 设置工单基本信息
    $w('#ticketDetailsId').text = ticketDetails.ticketId || '';
    $w('#ticketDetailsTitle').text = ticketDetails.title || '';
    $w('#ticketDetailsSubmittedDate').text = formatDate(ticketDetails.submittedDate);
    $w('#ticketDetailsCategory').text = ticketDetails.category || '';
    $w('#ticketDetailsPriority').text = ticketDetails.priority || '';
    $w('#ticketDetailsStatus').text = formatTicketStatus(ticketDetails.status);
    $w('#ticketDetailsDescription').text = ticketDetails.description || '';
    
    // 设置工单评论
    if (ticketDetails.comments && ticketDetails.comments.length > 0) {
        const commentsHtml = ticketDetails.comments.map(comment => {
            return `<div class="ticket-comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.author || '系统'}</span>
                    <span class="comment-date">${formatDate(comment.date)}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>`;
        }).join('');
        
        $w('#ticketCommentsContainer').html = commentsHtml;
        $w('#ticketCommentsContainer').show();
    } else {
        $w('#ticketCommentsContainer').hide();
    }
    
    // 设置解决方案（如果有）
    if (ticketDetails.resolution) {
        $w('#ticketResolutionContainer').show();
        $w('#ticketResolution').text = ticketDetails.resolution;
        $w('#ticketResolvedDate').text = formatDate(ticketDetails.resolvedDate);
    } else {
        $w('#ticketResolutionContainer').hide();
    }
    
    // 设置完成总结（如果有）
    if (ticketDetails.completionSummary) {
        $w('#ticketCompletionContainer').show();
        $w('#ticketCompletionSummary').text = ticketDetails.completionSummary;
    } else {
        $w('#ticketCompletionContainer').hide();
    }
    
    // 设置Lark同步状态
    $w('#ticketLarkSyncStatus').text = formatLarkSyncStatus(ticketDetails.larkSyncStatus);
    $w('#ticketLarkSyncTime').text = ticketDetails.larkSyncTime ? formatDate(ticketDetails.larkSyncTime) : '未同步';
    
    // 根据工单状态启用/禁用更新按钮
    if (ticketDetails.status === 'closed') {
        $w('#updateTicketStatusBtn').disable();
        $w('#ticketStatusDropdown').disable();
        $w('#ticketCommentsInput').disable();
        $w('#ticketResolutionInput').disable();
    } else {
        $w('#updateTicketStatusBtn').enable();
        $w('#ticketStatusDropdown').enable();
        $w('#ticketCommentsInput').enable();
        
        // 只有在状态为已解决时才启用解决方案输入
        if ($w('#ticketStatusDropdown').value === 'resolved') {
            $w('#ticketResolutionInput').enable();
        } else {
            $w('#ticketResolutionInput').disable();
        }
    }
    
    // 显示模态框
    $w('#ticketDetailsLightbox').show();
}

// 格式化工单状态
function formatTicketStatus(status) {
    const statusMap = {
        'open': '待处理',
        'in_progress': '处理中',
        'resolved': '已解决',
        'closed': '已关闭'
    };
    
    return statusMap[status] || status;
}

// 格式化Lark同步状态
function formatLarkSyncStatus(status) {
    const statusMap = {
        'pending': '待同步',
        'synced': '已同步',
        'failed': '同步失败'
    };
    
    return statusMap[status] || status;
}

// 格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 加载统计数据
function loadStatistics() {
    wixData.query("PR-Statistics")
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

// 刷新统计数据
function refreshStatistics() {
    console.log('刷新统计数据');
    
    // 显示加载中提示
    if ($w('#refreshStatsBtn')) {
        $w('#refreshStatsBtn').disable();
        $w('#refreshStatsBtn').label = '加载中...';
    }
    
    // 重新加载统计数据
    loadStatistics();
    
    // 恢复按钮状态
    setTimeout(() => {
        if ($w('#refreshStatsBtn')) {
            $w('#refreshStatsBtn').enable();
            $w('#refreshStatsBtn').label = '刷新统计';
        }
    }, 1000);
}

// 更新统计显示
function updateStatisticsDisplay(stats) {
    $w('#totalStudentsValue').text = stats.totalStudents.toString();
    $w('#activeStudentsValue').text = stats.activeStudents.toString();
    
    // 获取当前年月
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const monthKey = `${currentYear}-${currentMonth}`;
    
    // 获取工单统计数据
    let submittedTickets = 0;
    let resolvedTickets = 0;
    
    if (stats.ticketStats && stats.ticketStats[monthKey]) {
        submittedTickets = stats.ticketStats[monthKey].submitted || 0;
        resolvedTickets = stats.ticketStats[monthKey].resolved || 0;
    }
    
    // 更新统计卡片显示 - 使用安全警报卡片显示提交工单数，使用待处理发票卡片显示已解决工单数
    $w('#securityAlertsValue').text = submittedTickets.toString();
    $w('#pendingInvoicesValue').text = resolvedTickets.toString();
    
    // 更新Open Tickets Counter - 显示当前未解决的工单数量
    if (stats.openTickets !== undefined && $w('#openTicketsValue')) {
        $w('#openTicketsValue').text = stats.openTickets.toString();
    }
    
    // 更新文本标签
    if ($w('#securityAlertsText')) {
        $w('#securityAlertsText').text = '本月提交工单';
    }
    if ($w('#pendingInvoicesText')) {
        $w('#pendingInvoicesText').text = '本月已解决工单';
    }
    
    console.log('统计数据已更新:', stats);
}

// 创建默认统计数据（如果不存在）
function createDefaultStatistics() {
    // 获取当前年月
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const monthKey = `${currentYear}-${currentMonth}`;
    
    // 创建默认统计数据
    const defaultStats = {
        totalStudents: 0,
        activeStudents: 0,
        securityAlerts: 0,  // 保留字段，现在用于显示提交工单数
        pendingInvoices: 0, // 保留字段，现在用于显示已解决工单数
        apStudentCount: 0,  // AP学生数量
        openTickets: 0,     // 当前未解决的工单数量
        lastUpdated: new Date(),
        // 工单统计数据 - 按月份记录工单提交、解决、关闭和查询数量
        ticketStats: {
            [monthKey]: {
                submitted: 0, // 提交的工单数
                resolved: 0, // 已解决的工单数
                closed: 0,   // 已关闭的工单数
                checked: 0   // 查询的工单数
            }
        }
    };
    
    wixData.insert("PR-Statistics", defaultStats)
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
    // 更新UI元素显示AP学生数量
    $w('#apStudentCount').text = apStudents.length.toString();
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
        
        // 当切换到移除学生标签页时，加载学生和课程列表到 Repeater
        loadStudentsToRepeater();
        loadCoursesToRepeater();
    }
    
    console.log('学生模态框标签页切换到:', tab);
}

// 加载学生到 Repeater（用于移除所有课程功能）
function loadStudentsToRepeater() {
    // 设置学生 Repeater 的数据源
    $w('#studentListRepeater').onItemReady(($item, itemData, index) => {
        // 设置学生信息
        $item('#studentNameText').text = `${itemData.firstName} ${itemData.lastName}`;
        $item('#studentEmailText').text = itemData.email;
        $item('#courseCountText').text = `${itemData.courses ? itemData.courses.length : 0} 门课程`;
        
        // 设置移除所有课程按钮事件
        $item('#removeAllCoursesButton').onClick(() => {
            confirmRemoveAllCourses(itemData._id, `${itemData.firstName} ${itemData.lastName}`);
        });
    });
    
    // 查询学生数据
    wixData.query('Students')
        .eq('status', 'active')
        .find()
        .then((results) => {
            $w('#studentListRepeater').data = results.items;
            console.log('学生列表已加载到 Repeater:', results.items.length);
        })
        .catch((error) => {
            console.error('加载学生列表错误:', error);
            showErrorMessage('加载学生列表失败');
        });
}

// 加载课程到 Repeater（用于移除特定课程功能）
function loadCoursesToRepeater() {
    // 设置课程 Repeater 的数据源
    $w('#courseListRepeater').onItemReady(($item, itemData, index) => {
        // 设置课程信息
        $item('#courseIdText').text = itemData.courseId || itemData._id;
        $item('#courseSubjectText').text = itemData.subject;
        $item('#studentNamesText').text = itemData.studentNames || '未分配学生';
        
        // 设置取消课程按钮事件
        $item('#cancelCourseButton').onClick(() => {
            confirmCancelCourse(itemData._id, itemData.subject);
        });
    });
    
    // 查询课程数据
    wixData.query('Courses')
        .eq('status', 'active')
        .find()
        .then((results) => {
            $w('#courseListRepeater').data = results.items;
            console.log('课程列表已加载到 Repeater:', results.items.length);
        })
        .catch((error) => {
            console.error('加载课程列表错误:', error);
            showErrorMessage('加载课程列表失败');
        });
}

// 确认移除学生的所有课程
function confirmRemoveAllCourses(studentId, studentName) {
    const confirmMessage = `确定要移除学生 "${studentName}" 的所有课程吗？此操作无法撤销。`;
    
    wixWindow.openLightbox('confirmationDialog', {
        title: '确认移除所有课程',
        message: confirmMessage,
        studentId: studentId,
        studentName: studentName
    })
    .then((result) => {
        if (result && result.confirmed) {
            removeAllCoursesForStudent(studentId, studentName);
        }
    })
    .catch((error) => {
        console.error('确认对话框错误:', error);
    });
}

// 确认取消特定课程
function confirmCancelCourse(courseId, courseSubject) {
    const confirmMessage = `确定要取消课程 "${courseSubject}" 吗？此操作无法撤销。`;
    
    wixWindow.openLightbox('confirmationDialog', {
        title: '确认取消课程',
        message: confirmMessage,
        courseId: courseId,
        courseSubject: courseSubject
    })
    .then((result) => {
        if (result && result.confirmed) {
            cancelSpecificCourse(courseId, courseSubject);
        }
    })
    .catch((error) => {
        console.error('确认对话框错误:', error);
    });
}

// 移除学生的所有课程
function removeAllCoursesForStudent(studentId, studentName) {
    wixData.get('Students', studentId)
        .then((student) => {
            // 清空学生的课程列表
            student.courses = [];
            student.lastModified = new Date();
            
            return wixData.update('Students', student);
        })
        .then((result) => {
            showSuccessMessage(`已移除学生 "${studentName}" 的所有课程`);
            
            // 重新加载学生列表
            loadStudentsToRepeater();
            
            // 更新统计数据
            updateStatistics();
            
            console.log('学生所有课程已移除:', result);
        })
        .catch((error) => {
            console.error('移除学生所有课程错误:', error);
            showErrorMessage('移除课程失败，请重试');
        });
}

// 取消特定课程
function cancelSpecificCourse(courseId, courseSubject) {
    wixData.get('Courses', courseId)
        .then((course) => {
            // 更新课程状态为已取消
            course.status = 'cancelled';
            course.cancellationDate = new Date();
            course.lastModified = new Date();
            
            return wixData.update('Courses', course);
        })
        .then((result) => {
            showSuccessMessage(`课程 "${courseSubject}" 已取消`);
            
            // 重新加载课程列表
            loadCoursesToRepeater();
            
            // 更新统计数据
            updateStatistics();
            
            console.log('课程已取消:', result);
        })
        .catch((error) => {
            console.error('取消课程错误:', error);
            showErrorMessage('取消课程失败，请重试');
        });
}

// 打开 AP 学生模态框（替换原始 HTML 文件中的 openAPStudentModal 函数）
// 原始: function openAPStudentModal() { document.getElementById('apStudentModal').style.display = 'block'; }
function openAPStudentModal() {
    $w('#apStudentRegistrationLightbox').show(); // Wix Lightbox 而非 HTML 模态框
    console.log('AP 学生注册模态框已打开');
}

// 打开删除 AP 学生模态框
function openRemoveAPModal() {
    // 显示删除 AP 学生模态框
    $w('#removeAPStudentLightbox').show();
    
    // 加载 AP 学生列表到 Repeater
    loadAPStudentsToRepeater();
    
    console.log('删除 AP 学生模态框已打开');
}

// 加载 AP 学生到 Repeater
function loadAPStudentsToRepeater() {
    // 设置 AP 学生 Repeater 的数据源
    $w('#apStudentListRepeater').onItemReady(($item, itemData, index) => {
        // 设置学生信息
        $item('#studentNameText').text = `${itemData.firstName} ${itemData.lastName}`;
        $item('#studentDetailsText').text = `${itemData.grade || 'N/A'} | ${itemData.course || 'N/A'}`;
        
        // 设置状态徽章
        const statusBadge = $item('#statusBadge');
        if (itemData.status === 'active') {
            statusBadge.text = 'Active';
            statusBadge.style.backgroundColor = '#28a745';
        } else {
            statusBadge.text = 'Paused';
            statusBadge.style.backgroundColor = '#ffc107';
        }
        
        // 设置移除按钮事件
        $item('#removeStudentButton').onClick(() => {
            confirmRemoveAPStudent(itemData._id, `${itemData.firstName} ${itemData.lastName}`);
        });
    });
    
    // 连接到 Students 数据集，过滤 AP 学生
    $w('#apStudentListRepeater').data = [];
    
    // 查询 AP 学生数据
    wixData.query('Students')
        .eq('isAP', true)
        .find()
        .then((results) => {
            $w('#apStudentListRepeater').data = results.items;
            console.log('AP 学生列表已加载到 Repeater:', results.items.length);
        })
        .catch((error) => {
            console.error('加载 AP 学生列表错误:', error);
            showErrorMessage('加载 AP 学生列表失败');
        });
}

// 确认移除 AP 学生
function confirmRemoveAPStudent(studentId, studentName) {
    const confirmMessage = `确定要从 AP 项目中移除学生 "${studentName}" 吗？此操作无法撤销。`;
    
    wixWindow.openLightbox('confirmationDialog', {
        title: '确认移除 AP 学生',
        message: confirmMessage,
        studentId: studentId,
        studentName: studentName
    })
    .then((result) => {
        if (result && result.confirmed) {
            removeAPStudent(studentId, studentName);
        }
    })
    .catch((error) => {
        console.error('确认对话框错误:', error);
    });
}

// 移除 AP 学生
function removeAPStudent(studentId, studentName) {
    wixData.get('Students', studentId)
        .then((student) => {
            // 更新学生状态，移除 AP 标识
            student.isAP = false;
            student.apStatus = 'removed';
            student.apRemovalDate = new Date();
            
            return wixData.update('Students', student);
        })
        .then((result) => {
            showSuccessMessage(`学生 "${studentName}" 已从 AP 项目中移除`);
            
            // 重新加载 AP 学生列表
            loadAPStudentsToRepeater();
            
            // 更新统计数据
            updateStatistics();
            
            console.log('AP 学生已移除:', result);
        })
        .catch((error) => {
            console.error('移除 AP 学生错误:', error);
            showErrorMessage('移除 AP 学生失败，请重试');
        });
}

// ==========================================
// Repeater 搜索过滤功能
// ==========================================

// 过滤学生 Repeater
function filterStudentRepeater() {
    const searchTerm = $w('#studentSearchInput').value.toLowerCase();
    
    if (!searchTerm) {
        // 如果搜索框为空，重新加载所有学生
        loadStudentsToRepeater();
        return;
    }
    
    // 查询匹配的学生
    wixData.query('Students')
        .eq('status', 'active')
        .find()
        .then((results) => {
            // 客户端过滤
            const filteredStudents = results.items.filter(student => {
                const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
                const email = (student.email || '').toLowerCase();
                return fullName.includes(searchTerm) || email.includes(searchTerm);
            });
            
            $w('#studentListRepeater').data = filteredStudents;
            console.log('学生搜索结果:', filteredStudents.length);
        })
        .catch((error) => {
            console.error('搜索学生错误:', error);
        });
}

// 过滤课程 Repeater
function filterCourseRepeater() {
    const searchTerm = $w('#courseSearchInput2').value.toLowerCase();
    
    if (!searchTerm) {
        // 如果搜索框为空，重新加载所有课程
        loadCoursesToRepeater();
        return;
    }
    
    // 查询匹配的课程
    wixData.query('Courses')
        .eq('status', 'active')
        .find()
        .then((results) => {
            // 客户端过滤
            const filteredCourses = results.items.filter(course => {
                const subject = (course.subject || '').toLowerCase();
                const courseId = (course.courseId || course._id || '').toLowerCase();
                return subject.includes(searchTerm) || courseId.includes(searchTerm);
            });
            
            $w('#courseListRepeater').data = filteredCourses;
            console.log('课程搜索结果:', filteredCourses.length);
        })
        .catch((error) => {
            console.error('搜索课程错误:', error);
        });
}

// 过滤 AP 学生 Repeater
function filterAPStudentRepeater() {
    const searchTerm = $w('#apStudentSearchInput').value.toLowerCase();
    
    if (!searchTerm) {
        // 如果搜索框为空，重新加载所有 AP 学生
        loadAPStudentsToRepeater();
        return;
    }
    
    // 查询匹配的 AP 学生
    wixData.query('Students')
        .eq('isAP', true)
        .find()
        .then((results) => {
            // 客户端过滤
            const filteredStudents = results.items.filter(student => {
                const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
                const course = (student.course || '').toLowerCase();
                const grade = (student.grade || '').toLowerCase();
                return fullName.includes(searchTerm) || course.includes(searchTerm) || grade.includes(searchTerm);
            });
            
            $w('#apStudentListRepeater').data = filteredStudents;
            console.log('AP 学生搜索结果:', filteredStudents.length);
        })
        .catch((error) => {
            console.error('搜索 AP 学生错误:', error);
        });
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
                firstName: $w('#studentNameInput').value.split(' ')[0] || '',
                lastName: $w('#studentNameInput').value.split(' ')[1] || '',
                email: $w('#studentEmailInput').value,
                phone: $w('#studentPhoneInput').value,
                status: $w('#studentStatusDropdown').value,
                courses: [$w('#studentCourseDropdown').value],
                isAP: false,
                studentType: 'tutoring',
                product: 'Tutoring',
                enrollmentDate: new Date(),
                lastActive: new Date(),
                // Lark 集成字段
                syncStatus: 'pending',
                lastSyncWithLark: null,
                larkSyncData: {
                    lastPullDate: null,
                    lastPushDate: null,
                    syncErrors: []
                }
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
            sendLarkNotification({
                type: 'student_added',
                studentName: `${result.firstName} ${result.lastName}`,
                studentEmail: result.email
            });
            
            // 询问是否同步到 Lark Base
            if (confirm('是否立即同步到 Lark Base？')) {
                // 同步到 Lark Base
                return syncToLark(result._id)
                    .then((syncResult) => {
                        if (syncResult.success) {
                            showSuccessMessage('同步到 Lark Base 成功！');
                            
                            // 更新学生记录
                            return wixData.get('Students', result._id)
                                .then((student) => {
                                    student.syncStatus = 'synced';
                                    student.lastSyncWithLark = new Date();
                                    student.larkBaseRecordId = syncResult.larkRecordId;
                                    return wixData.update('Students', student);
                                });
                        } else {
                            showErrorMessage('同步到 Lark Base 失败: ' + syncResult.error);
                            
                            // 更新学生记录
                            return wixData.get('Students', result._id)
                                .then((student) => {
                                    student.syncStatus = 'error';
                                    student.larkSyncData = student.larkSyncData || {};
                                    student.larkSyncData.syncErrors = student.larkSyncData.syncErrors || [];
                                    student.larkSyncData.syncErrors.push({
                                        date: new Date(),
                                        error: syncResult.error
                                    });
                                    return wixData.update('Students', student);
                                });
                        }
                    });
            }
            
            console.log('学生已添加:', result);
            return result;
        })
        .catch((error) => {
            console.error('添加学生错误:', error);
            showErrorMessage('添加学生失败。请重试。');
        });
}

// 验证学生数据
function validateStudentData(data) {
    if ((!data.firstName || data.firstName.trim() === '') && (!data.lastName || data.lastName.trim() === '')) {
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
    const fullName = $w('#apStudentNameInput').value;
    const nameParts = fullName.split(' ');
    
    const apStudentData = {
        firstName: nameParts[0] || '',
        lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
        age: parseInt($w('#apStudentAgeInput').value),
        send: $w('#sendDropdown').value, // 更新为新的 CMS 字段名称和元素 ID
        guardianName: $w('#guardianNameInput').value,
        guardianPhone: $w('#guardianPhoneInput').value,
        guardianEmail: $w('#guardianEmailInput').value,
        medicalInfo: $w('#medicalInfoTextarea').value,
        educationBackground: $w('#educationBackgroundTextarea').value,
        subjects: $w('#subjectsDropdown').value, // 更新为新的 CMS 字段名称和元素 ID
        
        // EHCP文件相关字段
        ehcpDocument: ehcpFileData.url, // 更新为新的 CMS 字段名称
        ehcpFileName: ehcpFileData.fileName,
        ehcpFileSize: ehcpFileData.fileSize,
        ehcpUploadDate: ehcpFileData.uploadDate,
        ehcpFileStatus: ehcpFileData.status,
        
        // 额外问题字段 - 更新为新的 Additional Information 字段
        homeLessonsWithoutSupervision: $w('#homeLessonsWithoutSupervisionDropdown').value,
        supportLongerThanFourWeeks: $w('#supportLongerThanFourWeeksDropdown').value,
        
        // 学生类型和状态
        isAP: true,
        studentType: 'alternative',
        product: 'PRA - Core Subject',
        status: 'Activated', // 更新为新的状态值
        enrollmentDate: new Date(),
        lastActive: new Date(),
        
        // AP 学生特有字段
        curriculum: $w('#subjectsDropdown').value, // 更新为与 subjects 相同的值
        apCourses: [],
        
        // Lark 集成字段
        syncStatus: 'pending',
        lastSyncWithLark: null,
        larkSyncData: {
            lastPullDate: null,
            lastPushDate: null,
            syncErrors: []
        }
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
                studentName: `${apStudentData.firstName} ${apStudentData.lastName}`,
                studentEmail: apStudentData.guardianEmail,
                studentPhone: apStudentData.guardianPhone,
                hasEHCPFile: ehcpFileData.status === 'uploaded'
            });
            
            // 询问是否同步到 Lark Base
            if (confirm('是否立即同步到 Lark Base？')) {
                // 同步到 Lark Base
                syncToLark(result._id)
                    .then((syncResult) => {
                        if (syncResult.success) {
                            showSuccessMessage('同步到 Lark Base 成功！');
                            
                            // 更新学生记录
                            return wixData.get('Students', result._id)
                                .then((student) => {
                                    student.syncStatus = 'synced';
                                    student.lastSyncWithLark = new Date();
                                    student.larkBaseRecordId = syncResult.larkRecordId;
                                    return wixData.update('Students', student);
                                });
                        } else {
                            showErrorMessage('同步到 Lark Base 失败: ' + syncResult.error);
                            
                            // 更新学生记录
                            return wixData.get('Students', result._id)
                                .then((student) => {
                                    student.syncStatus = 'error';
                                    student.larkSyncData = student.larkSyncData || {};
                                    student.larkSyncData.syncErrors = student.larkSyncData.syncErrors || [];
                                    student.larkSyncData.syncErrors.push({
                                        date: new Date(),
                                        error: syncResult.error
                                    });
                                    return wixData.update('Students', student);
                                });
                        }
                    });
            }
            
            // 关闭模态框
            $w('#apStudentRegistrationLightbox').hide();
            
            return result;
        })
        .catch((error) => {
            console.error('AP 学生注册错误:', error);
            showErrorMessage('AP 学生注册失败。请重试。');
        });
}

// 验证 AP 学生数据
function validateAPStudentData(data) {
    if ((!data.firstName || data.firstName.trim() === '') && (!data.lastName || data.lastName.trim() === '')) {
        showErrorMessage('请输入学生姓名');
        return false;
    }
    
    if (!data.age || data.age < 1 || data.age > 100) {
        showErrorMessage('请输入有效年龄');
        return false;
    }
    
    if (!data.send) {
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
    
    if (!data.subjects) {
        showErrorMessage('请选择学习科目');
        return false;
    }
    
    // 验证额外问题字段
    if (!data.homeLessonsWithoutSupervision) {
        showErrorMessage('请回答是否可以在没有监督的情况下进行家庭课程');
        return false;
    }
    
    if (!data.supportLongerThanFourWeeks) {
        showErrorMessage('请回答是否需要超过四周的支持');
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
    $w('#sendDropdown').selectedIndex = 0;
    $w('#guardianNameInput').value = '';
    $w('#guardianPhoneInput').value = '';
    $w('#guardianEmailInput').value = '';
    $w('#medicalInfoTextarea').value = '';
    $w('#educationBackgroundTextarea').value = '';
    $w('#subjectsDropdown').selectedIndex = 0;
    
    // 清空额外问题字段
    $w('#homeLessonsWithoutSupervisionDropdown').selectedIndex = 0;
    $w('#supportLongerThanFourWeeksDropdown').selectedIndex = 0;
    
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

// 全局错误处理器
class ErrorHandler {
    static errorMessages = {
        'FILE_TOO_LARGE': '文件大小不能超过 10MB',
        'INVALID_FILE_TYPE': '请上传 PDF、Word 文档或图片文件',
        'UPLOAD_FAILED': '文件上传失败，请重试',
        'VERIFICATION_FAILED': '文件验证失败，请检查文件格式',
        'PERMISSION_DENIED': '没有权限执行此操作',
        'NETWORK_ERROR': '网络连接错误，请检查网络后重试',
        'VALIDATION_ERROR': '输入数据验证失败',
        'DATABASE_ERROR': '数据库操作失败',
        'AUTH_ERROR': '身份验证失败',
        'TIMEOUT_ERROR': '操作超时，请重试',
        'UNKNOWN_ERROR': '未知错误，请联系管理员'
    };
    
    static handle(error, context = '') {
        console.error(`错误 [${context}]:`, error);
        
        let errorCode = 'UNKNOWN_ERROR';
        let errorMessage = error.message || '未知错误';
        
        // 根据错误类型确定错误代码
        if (error.type) {
            errorCode = error.type;
        } else if (error.message) {
            if (error.message.includes('网络') || error.message.includes('network')) {
                errorCode = 'NETWORK_ERROR';
            } else if (error.message.includes('权限') || error.message.includes('permission')) {
                errorCode = 'PERMISSION_DENIED';
            } else if (error.message.includes('验证') || error.message.includes('validation')) {
                errorCode = 'VALIDATION_ERROR';
            } else if (error.message.includes('超时') || error.message.includes('timeout')) {
                errorCode = 'TIMEOUT_ERROR';
            }
        }
        
        const userMessage = this.errorMessages[errorCode] || errorMessage;
        this.showError(userMessage, errorCode);
        
        // 记录错误日志
        this.logError({
            code: errorCode,
            message: errorMessage,
            context: context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        
        return { code: errorCode, message: userMessage };
    }
    
    static showError(message, code = '') {
        showErrorMessage(message);
        
        // 如果是严重错误，显示更明显的提示
        if (['DATABASE_ERROR', 'AUTH_ERROR', 'UNKNOWN_ERROR'].includes(code)) {
            console.error('严重错误:', message);
        }
    }
    
    static async logError(errorData) {
        try {
            await wixData.insert('ErrorLogs', {
                ...errorData,
                userId: wixUsers.currentUser.id || 'anonymous',
                page: wixLocation.url
            });
        } catch (logError) {
            console.error('记录错误日志失败:', logError);
        }
    }
}

// 用户友好的错误提示（保持向后兼容）
function showUserFriendlyError(error) {
    ErrorHandler.handle(error, 'User Action');
}

// 数据验证工具类
class DataValidator {
    // 文件验证配置
    static FILE_CONFIG = {
        MAX_SIZE: 10 * 1024 * 1024, // 10MB
        MIN_SIZE: 1024, // 1KB
        ALLOWED_TYPES: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/plain'
        ],
        ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.txt']
    };
    
    // 验证文件
    static validateFile(file) {
        if (!file) {
            throw { type: 'VALIDATION_ERROR', message: '请选择文件' };
        }
        
        // 检查文件大小
        if (file.size > this.FILE_CONFIG.MAX_SIZE) {
            throw { type: 'FILE_TOO_LARGE', message: `文件大小不能超过 ${this.FILE_CONFIG.MAX_SIZE / (1024 * 1024)}MB` };
        }
        
        if (file.size < this.FILE_CONFIG.MIN_SIZE) {
            throw { type: 'VALIDATION_ERROR', message: '文件大小不能小于 1KB' };
        }
        
        // 检查文件类型
        if (!this.FILE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
            throw { type: 'INVALID_FILE_TYPE', message: '不支持的文件类型' };
        }
        
        // 检查文件扩展名
        const fileName = file.name.toLowerCase();
        const hasValidExtension = this.FILE_CONFIG.ALLOWED_EXTENSIONS.some(ext => 
            fileName.endsWith(ext)
        );
        
        if (!hasValidExtension) {
            throw { type: 'INVALID_FILE_TYPE', message: '不支持的文件扩展名' };
        }
        
        // 检查文件名安全性
        if (!/^[a-zA-Z0-9._\-\u4e00-\u9fa5\s]+$/.test(file.name)) {
            throw { type: 'VALIDATION_ERROR', message: '文件名包含非法字符' };
        }
        
        return true;
    }
    
    // 验证字符串输入
    static validateString(value, fieldName, options = {}) {
        const { minLength = 1, maxLength = 255, required = true, pattern = null } = options;
        
        if (required && (!value || value.trim().length === 0)) {
            throw { type: 'VALIDATION_ERROR', message: `${fieldName}不能为空` };
        }
        
        if (value && value.length < minLength) {
            throw { type: 'VALIDATION_ERROR', message: `${fieldName}长度不能少于${minLength}个字符` };
        }
        
        if (value && value.length > maxLength) {
            throw { type: 'VALIDATION_ERROR', message: `${fieldName}长度不能超过${maxLength}个字符` };
        }
        
        if (value && pattern && !pattern.test(value)) {
            throw { type: 'VALIDATION_ERROR', message: `${fieldName}格式不正确` };
        }
        
        return true;
    }
    
    // 验证邮箱
    static validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            throw { type: 'VALIDATION_ERROR', message: '邮箱格式不正确' };
        }
        return true;
    }
    
    // 验证手机号
    static validatePhone(phone) {
        const phonePattern = /^1[3-9]\d{9}$/;
        if (!phonePattern.test(phone)) {
            throw { type: 'VALIDATION_ERROR', message: '手机号格式不正确' };
        }
        return true;
    }
    
    // 验证学生数据
    static validateStudentData(data) {
        this.validateString(data.name, '姓名', { minLength: 2, maxLength: 50 });
        this.validateEmail(data.email);
        
        if (data.phone) {
            this.validatePhone(data.phone);
        }
        
        if (data.studentId) {
            this.validateString(data.studentId, '学号', { minLength: 6, maxLength: 20 });
        }
        
        return true;
    }
}

// 增强的文件安全验证（保持向后兼容）
function validateFileSecurely(file) {
    try {
        return DataValidator.validateFile(file);
    } catch (error) {
        throw new Error(error.type || 'VALIDATION_ERROR');
    }
}

// 性能优化和缓存管理类
class PerformanceManager {
    static cache = new Map();
    static CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
    
    // 缓存数据
    static setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
    
    // 获取缓存数据
    static getCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        // 检查缓存是否过期
        if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }
    
    // 清除缓存
    static clearCache(key = null) {
        if (key) {
            this.cache.delete(key);
        } else {
            this.cache.clear();
        }
    }
    
    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 异步操作管理类
class AsyncManager {
    static pendingRequests = new Map();
    static requestQueue = [];
    static MAX_CONCURRENT = 3;
    static activeRequests = 0;
    
    // 执行异步操作
    static async executeAsync(operation, key = null) {
        try {
            // 如果有相同的请求正在进行，等待其完成
            if (key && this.pendingRequests.has(key)) {
                return await this.pendingRequests.get(key);
            }
            
            const promise = this.processRequest(operation);
            
            if (key) {
                this.pendingRequests.set(key, promise);
                promise.finally(() => {
                    this.pendingRequests.delete(key);
                });
            }
            
            return await promise;
        } catch (error) {
            ErrorHandler.handle(error, 'Async Operation');
            throw error;
        }
    }
    
    // 处理请求队列
    static async processRequest(operation) {
        if (this.activeRequests >= this.MAX_CONCURRENT) {
            return new Promise((resolve, reject) => {
                this.requestQueue.push({ operation, resolve, reject });
            });
        }
        
        this.activeRequests++;
        
        try {
            const result = await operation();
            this.processQueue();
            return result;
        } catch (error) {
            this.processQueue();
            throw error;
        } finally {
            this.activeRequests--;
        }
    }
    
    // 处理队列中的下一个请求
    static processQueue() {
        if (this.requestQueue.length > 0 && this.activeRequests < this.MAX_CONCURRENT) {
            const { operation, resolve, reject } = this.requestQueue.shift();
            this.processRequest(operation).then(resolve).catch(reject);
        }
    }
}

// 发送数据到 Lark（增强版）
function sendToLark(data) {
    try {
        // 验证数据
        if (!data || typeof data !== 'object') {
            throw { type: 'VALIDATION_ERROR', message: '无效的通知数据' };
        }
        
        const operation = async () => {
            const larkModule = await import('backend_larkIntegration');
            return await larkModule.sendNotificationToLark(data);
        };
        
        return AsyncManager.executeAsync(operation, `lark_notification_${JSON.stringify(data).substring(0, 50)}`)
            .then((result) => {
                console.log('Lark 通知已发送:', result);
                return result;
            })
            .catch((error) => {
                ErrorHandler.handle(error, 'Send to Lark');
                throw error;
            });
    } catch (error) {
        ErrorHandler.handle(error, 'Send to Lark Validation');
        return Promise.reject(error);
    }
}

// 发送 Lark 通知的简化函数（增强版）
function sendLarkNotification(data) {
    try {
        // 验证数据
        if (!data || typeof data !== 'object') {
            throw { type: 'VALIDATION_ERROR', message: '无效的通知数据' };
        }
        
        const operation = async () => {
            const larkModule = await import('backend_larkIntegration');
            return await larkModule.sendLarkNotification(data);
        };
        
        return AsyncManager.executeAsync(operation, `lark_simple_${Date.now()}`)
            .then((result) => {
                console.log('Lark 通知发送成功:', result);
                return result;
            })
            .catch((error) => {
                ErrorHandler.handle(error, 'Send Lark Notification');
                throw error;
            });
    } catch (error) {
        ErrorHandler.handle(error, 'Send Lark Notification Validation');
        return Promise.reject(error);
    }
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
    // 工单相关模态框
    if ($w('#ticketStatusLightbox')) {
        $w('#ticketStatusLightbox').hide();
    }
    if ($w('#ticketDetailsLightbox')) {
        $w('#ticketDetailsLightbox').hide();
    }
    if ($w('#ticketSubmissionLightbox')) {
        $w('#ticketSubmissionLightbox').hide();
    }
}

// 权限管理类
class PermissionManager {
    static PERMISSIONS = {
        'admin': {
            actions: ['add_student', 'remove_student', 'register_ap_student', 'manage_courses', 'view_reports', 'manage_users', 'system_config'],
            level: 100
        },
        'supervisor': {
            actions: ['add_student', 'register_ap_student', 'view_reports', 'manage_courses'],
            level: 50
        },
        'teacher': {
            actions: ['view_reports', 'add_student'],
            level: 30
        },
        'assistant': {
            actions: ['view_reports'],
            level: 10
        }
    };
    
    static userRoleCache = new Map();
    
    // 获取用户角色（带缓存）
    static async getUserRole(userId = null) {
        const currentUserId = userId || wixUsers.currentUser.id;
        
        if (!currentUserId) {
            throw { type: 'AUTH_ERROR', message: '用户未登录' };
        }
        
        // 检查缓存
        const cacheKey = `user_role_${currentUserId}`;
        const cached = PerformanceManager.getCache(cacheKey);
        if (cached) {
            return cached;
        }
        
        try {
            const results = await wixData.query('UserRoles')
                .eq('userId', currentUserId)
                .find();
            
            let userRole = 'assistant'; // 默认角色
            
            if (results.items.length > 0) {
                userRole = results.items[0].role;
            }
            
            // 缓存结果
            PerformanceManager.setCache(cacheKey, userRole);
            
            return userRole;
        } catch (error) {
            ErrorHandler.handle(error, 'Get User Role');
            return 'assistant'; // 默认角色
        }
    }
    
    // 检查用户权限
    static async checkPermission(action, userId = null) {
        try {
            if (!wixUsers.currentUser.loggedIn) {
                return false;
            }
            
            const userRole = await this.getUserRole(userId);
            return this.hasPermission(userRole, action);
        } catch (error) {
            ErrorHandler.handle(error, 'Check Permission');
            return false;
        }
    }
    
    // 检查角色是否有特定权限
    static hasPermission(userRole, action) {
        const rolePermissions = this.PERMISSIONS[userRole];
        if (!rolePermissions) {
            return false;
        }
        
        return rolePermissions.actions.includes(action);
    }
    
    // 检查权限级别
    static hasPermissionLevel(userRole, requiredLevel) {
        const rolePermissions = this.PERMISSIONS[userRole];
        if (!rolePermissions) {
            return false;
        }
        
        return rolePermissions.level >= requiredLevel;
    }
    
    // 清除用户权限缓存
    static clearUserCache(userId = null) {
        if (userId) {
            PerformanceManager.clearCache(`user_role_${userId}`);
        } else {
            // 清除所有用户角色缓存
            for (const [key] of PerformanceManager.cache) {
                if (key.startsWith('user_role_')) {
                    PerformanceManager.clearCache(key);
                }
            }
        }
    }
}

// 检查用户权限（保持向后兼容）
function checkUserPermissions(action = null) {
    return PermissionManager.checkPermission(action)
        .catch((error) => {
            ErrorHandler.handle(error, 'Check User Permissions');
            return false;
        });
}

// 检查操作权限（保持向后兼容）
function checkActionPermission(userRole, action) {
    return PermissionManager.hasPermission(userRole, action);
}

// 用户信息管理类
class UserInfoManager {
    static async setupUserInfo() {
        try {
            if (!wixUsers.currentUser.loggedIn) {
                throw { type: 'AUTH_ERROR', message: '用户未登录' };
            }
            
            // 从数据库获取用户信息
            const userRole = await PermissionManager.getUserRole();
            const userInfo = await this.getUserDetails();
            
            // 更新UI显示
            this.updateUserDisplay(userInfo, userRole);
            
            return { userInfo, userRole };
        } catch (error) {
            ErrorHandler.handle(error, 'Setup User Info');
            this.setDefaultUserInfo();
        }
    }
    
    static async getUserDetails() {
        try {
            const results = await wixData.query('UserProfiles')
                .eq('userId', wixUsers.currentUser.id)
                .find();
            
            if (results.items.length > 0) {
                return results.items[0];
            }
            
            // 如果没有找到用户资料，创建默认资料
            return await this.createDefaultProfile();
        } catch (error) {
            ErrorHandler.handle(error, 'Get User Details');
            return this.getDefaultUserInfo();
        }
    }
    
    static async createDefaultProfile() {
        const defaultProfile = {
            userId: wixUsers.currentUser.id,
            name: wixUsers.currentUser.email || '用户',
            email: wixUsers.currentUser.email,
            avatar: '',
            createdAt: new Date(),
            lastLogin: new Date()
        };
        
        try {
            const result = await wixData.insert('UserProfiles', defaultProfile);
            return result;
        } catch (error) {
            ErrorHandler.handle(error, 'Create Default Profile');
            return defaultProfile;
        }
    }
    
    static updateUserDisplay(userInfo, userRole) {
        try {
            // 更新用户名显示
            if ($w('#userName')) {
                $w('#userName').text = userInfo.name || '用户';
            }
            
            // 更新角色显示
            if ($w('#userRole')) {
                const roleNames = {
                    'admin': '系统管理员',
                    'supervisor': '主管',
                    'teacher': '教师',
                    'assistant': '助理'
                };
                $w('#userRole').text = roleNames[userRole] || '用户';
            }
            
            // 更新头像
            if ($w('#userAvatar') && userInfo.avatar) {
                $w('#userAvatar').src = userInfo.avatar;
            }
            
            // 更新最后登录时间
            this.updateLastLogin();
        } catch (error) {
            ErrorHandler.handle(error, 'Update User Display');
        }
    }
    
    static async updateLastLogin() {
        try {
            await wixData.query('UserProfiles')
                .eq('userId', wixUsers.currentUser.id)
                .find()
                .then(results => {
                    if (results.items.length > 0) {
                        const profile = results.items[0];
                        profile.lastLogin = new Date();
                        return wixData.update('UserProfiles', profile);
                    }
                });
        } catch (error) {
            ErrorHandler.handle(error, 'Update Last Login');
        }
    }
    
    static setDefaultUserInfo() {
        try {
            if ($w('#userName')) {
                $w('#userName').text = '用户';
            }
            if ($w('#userRole')) {
                $w('#userRole').text = '访客';
            }
        } catch (error) {
            console.error('设置默认用户信息失败:', error);
        }
    }
    
    static getDefaultUserInfo() {
        return {
            name: '用户',
            email: '',
            avatar: '',
            createdAt: new Date()
        };
    }
}

// 设置用户信息（保持向后兼容）
function setupUserInfo() {
    return UserInfoManager.setupUserInfo();
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

// 统计数据管理类
class StatisticsManager {
    static CACHE_KEY = 'dashboard_statistics';
    static UPDATE_INTERVAL = 30000; // 30秒更新间隔
    static updateTimer = null;
    
    // 更新统计数据
    static async updateStatistics(forceUpdate = false) {
        try {
            // 检查缓存
            if (!forceUpdate) {
                const cached = PerformanceManager.getCache(this.CACHE_KEY);
                if (cached) {
                    this.updateStatisticsDisplay(cached);
                    return cached;
                }
            }
            
            // 并行获取统计数据
            const [studentStats, courseStats, systemStats] = await Promise.all([
                this.getStudentStatistics(),
                this.getCourseStatistics(),
                this.getSystemStatistics()
            ]);
            
            const updatedStats = {
                ...studentStats,
                ...courseStats,
                ...systemStats,
                lastUpdated: new Date()
            };
            
            // 保存到数据库
            await this.saveStatistics(updatedStats);
            
            // 缓存结果
            PerformanceManager.setCache(this.CACHE_KEY, updatedStats);
            
            // 更新显示
            this.updateStatisticsDisplay(updatedStats);
            
            console.log('统计数据更新成功:', updatedStats);
            return updatedStats;
        } catch (error) {
            ErrorHandler.handle(error, 'Update Statistics');
            throw error;
        }
    }
    
    // 获取学生统计数据
    static async getStudentStatistics() {
        try {
            const [totalCount, activeCount, pendingCount] = await Promise.all([
                wixData.query('Students').count(),
                wixData.query('Students').eq('status', 'active').count(),
                wixData.query('Students').eq('status', 'pending').count()
            ]);
            
            return {
                totalStudents: totalCount,
                activeStudents: activeCount,
                pendingStudents: pendingCount
            };
        } catch (error) {
            ErrorHandler.handle(error, 'Get Student Statistics');
            return {
                totalStudents: 0,
                activeStudents: 0,
                pendingStudents: 0
            };
        }
    }
    
    // 获取课程统计数据
    static async getCourseStatistics() {
        try {
            const [totalCourses, activeCourses] = await Promise.all([
                wixData.query('Courses').count(),
                wixData.query('Courses').eq('status', 'active').count()
            ]);
            
            return {
                totalCourses: totalCourses,
                activeCourses: activeCourses
            };
        } catch (error) {
            ErrorHandler.handle(error, 'Get Course Statistics');
            return {
                totalCourses: 0,
                activeCourses: 0
            };
        }
    }
    
    // 获取系统统计数据
    static async getSystemStatistics() {
        try {
            const [errorCount, pendingInvoices] = await Promise.all([
                wixData.query('ErrorLogs')
                    .ge('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000))
                    .count(),
                wixData.query('Invoices').eq('status', 'pending').count()
            ]);
            
            return {
                securityAlerts: errorCount,
                pendingInvoices: pendingInvoices
            };
        } catch (error) {
            ErrorHandler.handle(error, 'Get System Statistics');
            return {
                securityAlerts: 0,
                pendingInvoices: 0
            };
        }
    }
    
    // 保存统计数据到数据库
    static async saveStatistics(stats) {
        try {
            const results = await wixData.query('PR-Statistics')
                .limit(1)
                .find();
            
            if (results.items.length > 0) {
                stats._id = results.items[0]._id;
                return await wixData.update('PR-Statistics', stats);
            } else {
                return await wixData.insert('PR-Statistics', stats);
            }
        } catch (error) {
            ErrorHandler.handle(error, 'Save Statistics');
            throw error;
        }
    }
    
    // 更新统计数据显示
    static updateStatisticsDisplay(stats) {
        try {
            // 更新学生统计
            if ($w('#totalStudentsText')) {
                $w('#totalStudentsText').text = stats.totalStudents?.toString() || '0';
            }
            if ($w('#activeStudentsText')) {
                $w('#activeStudentsText').text = stats.activeStudents?.toString() || '0';
            }
            
            // 更新课程统计
            if ($w('#totalCoursesText')) {
                $w('#totalCoursesText').text = stats.totalCourses?.toString() || '0';
            }
            
            // 更新系统统计 - 现在显示工单统计
            if ($w('#securityAlertsText')) {
                $w('#securityAlertsText').text = '本月提交工单';
            }
            if ($w('#pendingInvoicesText')) {
                $w('#pendingInvoicesText').text = '本月已解决工单';
            }
            
            // 更新最后更新时间
            if ($w('#lastUpdatedText') && stats.lastUpdated) {
                const updateTime = new Date(stats.lastUpdated).toLocaleString('zh-CN');
                $w('#lastUpdatedText').text = `最后更新: ${updateTime}`;
            }
        } catch (error) {
            ErrorHandler.handle(error, 'Update Statistics Display');
        }
    }
    
    // 启动自动更新
    static startAutoUpdate() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        this.updateTimer = setInterval(() => {
            this.updateStatistics(false);
        }, this.UPDATE_INTERVAL);
    }
    
    // 停止自动更新
    static stopAutoUpdate() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }
}

// 更新统计数据（保持向后兼容）
function updateStatistics() {
    return StatisticsManager.updateStatistics(true);
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
    
    // 获取当前用户信息
    const currentUser = getCurrentUser();
    const clientId = currentUser.id;
    const clientName = currentUser.name;
    const email = currentUser.email;
    
    // 构建Lark工单提交表单URL，包含预填充的用户信息
    const larkTicketFormUrl = `https://anycross.larksuite.com/base/form/share?token=xxxx&client_id=${clientId}&clientName=${encodeURIComponent(clientName)}&email=${encodeURIComponent(email)}`;
    
    // 在新窗口打开Lark表单
    wixWindow.openLightbox('ticketSubmissionLightbox', {
        url: larkTicketFormUrl,
        clientId: clientId,
        clientName: clientName,
        email: email
    });
    
    // 记录工单提交事件到统计数据
    updateTicketStatistics('submitted');
}

// 处理状态检查
function handleStatusCheck() {
    // 实现状态检查逻辑
    console.log('状态检查已点击');
    
    // 打开工单状态检查模态框
    wixWindow.openLightbox('ticketStatusLightbox')
        .then(ticketId => {
            if (ticketId) {
                // 如果用户输入了工单ID，查询该工单的状态
                return checkTicketStatus(ticketId);
            }
        })
        .catch(error => {
            console.error('工单状态检查错误:', error);
            wixWindow.openLightbox('errorLightbox', {
                title: '工单状态检查错误',
                message: '无法检查工单状态，请稍后再试。'
            });
        });
}

// 检查工单状态
async function checkTicketStatus(ticketId) {
    try {
        // 从CMS-10 Tickets集合查询工单信息
        const ticketsCollection = wixData.collection('Tickets');
        const ticketResult = await ticketsCollection.get(ticketId);
        
        if (!ticketResult) {
            throw new Error('未找到工单');
        }
        
        // 获取工单详情
        const ticketDetails = {
            ticketId: ticketResult.ticketId,
            submittedDate: ticketResult.submittedDate,
            title: ticketResult.title,
            category: ticketResult.category,
            priority: ticketResult.priority,
            status: ticketResult.status,
            description: ticketResult.description,
            comments: ticketResult.comments || [],
            resolution: ticketResult.resolution,
            resolvedDate: ticketResult.resolvedDate,
            completionSummary: ticketResult.completionSummary,
            proposeToCloseSendAt: ticketResult.proposeToCloseSendAt,
            larkSyncStatus: ticketResult.larkSyncStatus,
            larkSyncTime: ticketResult.larkSyncTime
        };
        
        // 显示工单详情模态框
        wixWindow.openLightbox('ticketDetailsLightbox', ticketDetails);
        
        // 记录工单查询事件到统计数据
        updateTicketStatistics('checked');
        
        return ticketDetails;
    } catch (error) {
        console.error('查询工单状态错误:', error);
        wixWindow.openLightbox('errorLightbox', {
            title: '工单查询错误',
            message: error.message || '无法查询工单状态，请确认工单ID是否正确。'
        });
        throw error;
    }
}

// 更新工单统计数据
async function updateTicketStatistics(action) {
    try {
        // 获取当前统计数据
        const statisticsCollection = wixData.collection('PR-Statistics');
        const statisticsQuery = await statisticsCollection.find();
        let statistics = statisticsQuery.items[0];
        
        if (!statistics) {
            // 如果没有统计数据，创建默认统计数据
            statistics = await createDefaultStatistics();
        }
        
        // 根据操作类型更新相应的统计数据
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        
        // 确保月度工单统计数据存在
        if (!statistics.ticketStats) {
            statistics.ticketStats = {};
        }
        
        const monthKey = `${currentYear}-${currentMonth}`;
        if (!statistics.ticketStats[monthKey]) {
            statistics.ticketStats[monthKey] = {
                submitted: 0,
                resolved: 0,
                closed: 0,
                checked: 0
            };
        }
        
        // 更新相应的计数器
        statistics.ticketStats[monthKey][action]++;
        
        // 保存更新后的统计数据
        await statisticsCollection.update(statistics);
        
        // 刷新显示的统计数据
        loadStatistics();
        
        console.log(`工单统计数据已更新: ${action}`);
        return statistics;
    } catch (error) {
        console.error('更新工单统计数据错误:', error);
        // 错误处理，但不中断用户操作
        return null;
    }
}

// 更新工单状态
async function updateTicketStatus(ticketId, newStatus, comments, resolution) {
    try {
        // 从CMS-10 Tickets集合查询工单信息
        const ticketsCollection = wixData.collection('Tickets');
        const ticketResult = await ticketsCollection.get(ticketId);
        
        if (!ticketResult) {
            throw new Error('未找到工单');
        }
        
        // 更新工单状态
        const updatedTicket = { ...ticketResult };
        updatedTicket.status = newStatus;
        
        // 添加评论（如果有）
        if (comments) {
            if (!updatedTicket.comments) {
                updatedTicket.comments = [];
            }
            
            updatedTicket.comments.push({
                text: comments,
                date: new Date(),
                author: getCurrentUser().name
            });
        }
        
        // 如果状态为已解决，添加解决方案和解决日期
        if (newStatus === 'resolved' && resolution) {
            updatedTicket.resolution = resolution;
            updatedTicket.resolvedDate = new Date();
        }
        
        // 如果状态为已关闭，添加完成总结
        if (newStatus === 'closed') {
            updatedTicket.completionSummary = comments || '工单已关闭';
        }
        
        // 更新Lark同步状态
        updatedTicket.larkSyncStatus = 'pending';
        
        // 保存更新后的工单
        const savedTicket = await ticketsCollection.update(updatedTicket);
        
        // 同步到Lark
        syncTicketToLark(savedTicket);
        
        // 更新统计数据
        if (newStatus === 'resolved') {
            updateTicketStatistics('resolved');
        } else if (newStatus === 'closed') {
            updateTicketStatistics('closed');
        }
        
        return savedTicket;
    } catch (error) {
        console.error('更新工单状态错误:', error);
        throw error;
    }
}

// 同步工单到Lark
async function syncTicketToLark(ticket) {
    try {
        // 构建Lark API请求数据
        const larkData = {
            ticketId: ticket.ticketId,
            status: ticket.status,
            title: ticket.title,
            category: ticket.category,
            priority: ticket.priority,
            description: ticket.description,
            comments: ticket.comments,
            resolution: ticket.resolution,
            resolvedDate: ticket.resolvedDate,
            completionSummary: ticket.completionSummary
        };
        
        // 调用后端模块发送到Lark
        const result = await backend_larkIntegration.syncTicketToLark(larkData);
        
        // 更新同步状态
        const ticketsCollection = wixData.collection('Tickets');
        await ticketsCollection.update({
            ...ticket,
            larkSyncStatus: 'synced',
            larkSyncTime: new Date()
        });
        
        console.log('工单已同步到Lark:', result);
        return result;
    } catch (error) {
        console.error('同步工单到Lark错误:', error);
        
        // 更新同步状态为失败
        const ticketsCollection = wixData.collection('Tickets');
        await ticketsCollection.update({
            ...ticket,
            larkSyncStatus: 'failed',
            larkSyncTime: new Date()
        });
        
        throw error;
    }
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
// Lark Base 同步功能
// ==========================================

// 打开 Lark 同步模态框
function openLarkSyncModal() {
    // 加载学生列表
    loadStudentsForLarkSync();
    
    // 显示 Lark 同步模态框
    $w('#larkSyncLightbox').show();
    
    console.log('Lark 同步模态框已打开');
}

// 加载学生列表用于 Lark 同步
function loadStudentsForLarkSync() {
    wixData.query("Students")
        .find()
        .then((results) => {
            const students = results.items;
            
            // 填充学生下拉菜单
            const options = students.map(student => ({
                label: `${student.firstName} ${student.lastName} - ${student.email}`,
                value: student._id
            }));
            
            $w('#syncStudentDropdown').options = options;
            
            // 更新同步状态
            updateSyncStatus(students);
            
            console.log('学生列表已加载用于 Lark 同步:', students.length);
        })
        .catch((error) => {
            console.error('加载学生列表错误:', error);
            showErrorMessage('加载学生列表失败');
        });
}

// 更新同步状态
function updateSyncStatus(students) {
    const syncedCount = students.filter(s => s.syncStatus === 'synced').length;
    const pendingCount = students.filter(s => s.syncStatus === 'pending').length;
    const errorCount = students.filter(s => s.syncStatus === 'error').length;
    
    $w('#syncedCountText').text = syncedCount.toString();
    $w('#pendingCountText').text = pendingCount.toString();
    $w('#errorCountText').text = errorCount.toString();
    $w('#totalStudentsText').text = students.length.toString();
}

// 测试 Lark 连接
function testLarkConnection() {
    $w('#testConnectionStatus').text = '正在测试连接...';
    $w('#testConnectionStatus').show();
    
    testLarkBaseConnection()
        .then((result) => {
            if (result.success) {
                $w('#testConnectionStatus').text = '连接成功！' + (result.details ? ` 表名: ${result.details.tableName}` : '');
                $w('#testConnectionStatus').style.color = '#28a745';
            } else {
                $w('#testConnectionStatus').text = '连接失败: ' + result.error;
                $w('#testConnectionStatus').style.color = '#dc3545';
            }
        })
        .catch((error) => {
            console.error('测试 Lark 连接错误:', error);
            $w('#testConnectionStatus').text = '连接错误: ' + error.message;
            $w('#testConnectionStatus').style.color = '#dc3545';
        });
}

// 同步单个学生到 Lark
function syncStudentToLark() {
    const studentId = $w('#syncStudentDropdown').value;
    
    if (!studentId) {
        showErrorMessage('请选择要同步的学生');
        return;
    }
    
    $w('#syncStatus').text = '正在同步...';
    $w('#syncStatus').show();
    
    syncToLark(studentId)
        .then((result) => {
            if (result.success) {
                $w('#syncStatus').text = '同步成功！';
                $w('#syncStatus').style.color = '#28a745';
                
                // 更新学生记录的同步状态
                return wixData.get('Students', studentId)
                    .then((student) => {
                        student.syncStatus = 'synced';
                        student.lastSyncWithLark = new Date();
                        student.larkBaseRecordId = result.larkRecordId;
                        return wixData.update('Students', student);
                    });
            } else {
                $w('#syncStatus').text = '同步失败: ' + result.error;
                $w('#syncStatus').style.color = '#dc3545';
                
                // 更新学生记录的同步状态
                return wixData.get('Students', studentId)
                    .then((student) => {
                        student.syncStatus = 'error';
                        student.larkSyncData = student.larkSyncData || {};
                        student.larkSyncData.syncErrors = student.larkSyncData.syncErrors || [];
                        student.larkSyncData.syncErrors.push({
                            date: new Date(),
                            error: result.error
                        });
                        return wixData.update('Students', student);
                    });
            }
        })
        .then(() => {
            // 重新加载学生列表以更新状态
            loadStudentsForLarkSync();
        })
        .catch((error) => {
            console.error('同步学生到 Lark 错误:', error);
            $w('#syncStatus').text = '同步错误: ' + error.message;
            $w('#syncStatus').style.color = '#dc3545';
        });
}

// 同步所有学生到 Lark
function syncAllStudentsToLark() {
    $w('#syncAllStatus').text = '正在同步所有学生...';
    $w('#syncAllStatus').show();
    
    // 获取所有学生 ID
    wixData.query('Students')
        .find()
        .then((results) => {
            const studentIds = results.items.map(student => student._id);
            
            if (studentIds.length === 0) {
                $w('#syncAllStatus').text = '没有学生需要同步';
                return;
            }
            
            // 批量同步
            return batchSync('wix_to_lark', studentIds);
        })
        .then((result) => {
            if (result.success) {
                $w('#syncAllStatus').text = `同步完成！成功: ${result.successful}, 失败: ${result.failed}, 总计: ${result.total}`;
                $w('#syncAllStatus').style.color = result.failed > 0 ? '#ffc107' : '#28a745';
            } else {
                $w('#syncAllStatus').text = '批量同步失败: ' + result.error;
                $w('#syncAllStatus').style.color = '#dc3545';
            }
            
            // 重新加载学生列表以更新状态
            loadStudentsForLarkSync();
        })
        .catch((error) => {
            console.error('批量同步学生错误:', error);
            $w('#syncAllStatus').text = '批量同步错误: ' + error.message;
            $w('#syncAllStatus').style.color = '#dc3545';
        });
}

// 从 Lark 拉取学生数据
function pullStudentsFromLark() {
    $w('#pullStatus').text = '正在从 Lark 拉取数据...';
    $w('#pullStatus').show();
    
    // 这里需要实现从 Lark Base 拉取数据的逻辑
    // 可以通过 Lark Base API 获取学生记录，然后更新到 Wix 数据库
    
    // 示例：假设我们有一个学生的 Lark Base 记录 ID
    const larkRecordId = $w('#larkRecordIdInput').value;
    
    if (!larkRecordId) {
        showErrorMessage('请输入 Lark Base 记录 ID');
        return;
    }
    
    syncFromLark(larkRecordId)
        .then((result) => {
            if (result.success) {
                $w('#pullStatus').text = '数据拉取成功！';
                $w('#pullStatus').style.color = '#28a745';
                
                // 重新加载学生列表以更新状态
                loadStudentsForLarkSync();
            } else {
                $w('#pullStatus').text = '数据拉取失败: ' + result.error;
                $w('#pullStatus').style.color = '#dc3545';
            }
        })
        .catch((error) => {
            console.error('从 Lark 拉取数据错误:', error);
            $w('#pullStatus').text = '数据拉取错误: ' + error.message;
            $w('#pullStatus').style.color = '#dc3545';
        });
}

// ==========================================
// 课程取消功能
// ==========================================

// 打开课程取消模态框
function openCourseCancellationModal() {
    // 加载可取消的课程列表
    loadCancellableCourses();
    
    // 显示课程取消模态框
    $w('#courseCancellationLightbox').show();
    
    console.log('课程取消模态框已打开');
}

// 加载可取消的课程列表
function loadCancellableCourses() {
    wixData.query("Courses")
        .eq("status", "active") // 只显示活跃课程
        .find()
        .then((results) => {
            const options = results.items.map(course => ({
                label: `${course.title} - ${course.subject}`,
                value: course._id
            }));
            
            // 填充课程下拉菜单
            $w('#cancelCourseDropdown').options = options;
            
            console.log('可取消课程已加载:', results.items.length);
        })
        .catch((error) => {
            console.error('加载可取消课程错误:', error);
            showErrorMessage('Failed to load courses for cancellation');
        });
}

// 计算两周后的日期
function calculateCancellationDate() {
    const today = new Date();
    const cancellationDate = new Date(today);
    cancellationDate.setDate(today.getDate() + 14); // 添加14天（2周自然日）
    
    return cancellationDate;
}

// 格式化日期显示
function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    
    return date.toLocaleDateString('en-US', options);
}

// 确认课程取消
function confirmCourseCancellation() {
    // 获取选中的课程ID
    const selectedCourseId = $w('#cancelCourseDropdown').value;
    
    if (!selectedCourseId) {
        showErrorMessage('Please select a course to cancel');
        return;
    }
    
    // 计算取消日期
    const cancellationDate = calculateCancellationDate();
    const formattedDate = formatDate(cancellationDate);
    
    // 显示确认信息
    const confirmationMessage = `Course cancellation requires 2 weeks advance notice.\n\n` +
                               `The selected course will be cancelled on: ${formattedDate}\n\n` +
                               `Are you sure you want to proceed with this cancellation?`;
    
    // 使用 Wix 确认对话框
    wixWindow.openLightbox('confirmationDialog', {
        title: 'Course Cancellation Confirmation',
        message: confirmationMessage,
        courseId: selectedCourseId,
        cancellationDate: cancellationDate
    })
    .then((result) => {
        if (result && result.confirmed) {
            processCancellation(selectedCourseId, cancellationDate);
        }
    })
    .catch((error) => {
        console.error('确认对话框错误:', error);
        // 备用确认方式
        if (confirm(confirmationMessage)) {
            processCancellation(selectedCourseId, cancellationDate);
        }
    });
}

// 处理课程取消流程
function processCancellation(courseId, cancellationDate) {
    // 检查用户权限
    checkUserPermissions('cancel_course')
        .then((hasPermission) => {
            if (!hasPermission) {
                showErrorMessage('You do not have permission to cancel courses');
                return Promise.reject('权限不足');
            }
            
            // 获取课程信息
            return wixData.get("Courses", courseId);
        })
        .then((course) => {
            // 更新课程状态为"待取消"
            const updatedCourse = {
                ...course,
                status: 'pending_cancellation',
                cancellationDate: cancellationDate,
                cancellationRequestDate: new Date(),
                lastModified: new Date()
            };
            
            return wixData.update("Courses", updatedCourse);
        })
        .then((result) => {
            // 创建取消记录
            const cancellationRecord = {
                courseId: courseId,
                courseName: result.title,
                requestDate: new Date(),
                scheduledCancellationDate: cancellationDate,
                status: 'scheduled',
                requestedBy: 'admin', // 可以从用户会话获取
                reason: $w('#cancellationReasonTextarea').value || 'Administrative cancellation'
            };
            
            return wixData.insert("CourseCancellations", cancellationRecord);
        })
        .then((cancellationResult) => {
            // 发送通知到相关学生和教师
            sendCancellationNotifications(courseId, cancellationDate);
            
            // 发送到 Lark
            sendLarkNotification({
                type: 'course_cancellation',
                courseId: courseId,
                cancellationDate: formatDate(cancellationDate),
                requestDate: new Date().toLocaleString()
            });
            
            // 显示成功消息
            showSuccessMessage(`Course cancellation scheduled for ${formatDate(cancellationDate)}`);
            
            // 关闭模态框
            $w('#courseCancellationLightbox').hide();
            
            // 刷新课程数据
            loadCourses();
            
            console.log('课程取消已安排:', cancellationResult);
        })
        .catch((error) => {
            console.error('课程取消处理错误:', error);
            showErrorMessage('Failed to schedule course cancellation. Please try again.');
        });
}

// 发送取消通知
function sendCancellationNotifications(courseId, cancellationDate) {
    // 查找该课程的所有学生
    wixData.query("Students")
        .contains("courses", courseId)
        .find()
        .then((students) => {
            students.items.forEach(student => {
                // 这里可以集成邮件服务发送通知
                console.log(`通知学生 ${student.name} 课程取消信息`);
            });
        })
        .catch((error) => {
            console.error('发送学生通知错误:', error);
        });
    
    // 查找该课程的教师
    wixData.query("Courses")
        .eq("_id", courseId)
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                const course = results.items[0];
                if (course.teacherId) {
                    // 发送教师通知
                    console.log(`通知教师课程取消信息`);
                }
            }
        })
        .catch((error) => {
            console.error('发送教师通知错误:', error);
        });
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
   - 创建 CourseCancellations 数据集用于存储课程取消记录

4. 元素 ID 检查：
   - 确保所有 Wix 元素的 ID 与代码中使用的 ID 完全匹配
   - 特别注意 Lightbox、输入字段和按钮的 ID
   - 新增课程取消相关元素：
     * #cancelCourseBtn - 课程取消按钮
     * #courseCancellationLightbox - 课程取消模态框
     * #cancelCourseDropdown - 课程选择下拉菜单
     * #cancellationReasonTextarea - 取消原因文本框
     * #confirmCancellationBtn - 确认取消按钮
     * #closeCancellationModalBtn - 关闭模态框按钮

5. 课程取消功能说明：
   - 课程取消需要提前2周（14个自然日）通知
   - 系统会自动计算取消日期并显示确认信息
   - 取消请求会创建记录并通知相关学生和教师
   - 支持 Lark 通知集成
   - 页面显示为英文，但代码注释为中文

6. 测试：
   - 在预览模式下测试所有功能
   - 验证表单提交和数据库操作
   - 测试响应式设计
   - 验证 Lark 通知
   - 特别测试课程取消功能的日期计算和确认流程

注意事项：
- 此代码使用 Wix Velo 语法，不是标准 JavaScript
- 确保您的 Wix 计划支持数据库功能
- 在生产环境中使用前，请彻底测试所有功能
- 定期备份您的数据库和代码
- 课程取消功能需要管理员权限验证
- 建议设置邮件通知服务以自动通知相关人员
*/

// ==========================================
// 功能总结与实现说明
// ==========================================

/*
本代码文件实现了完整的管理员仪表板系统，包含以下主要功能模块：

1. 【页面初始化与权限管理】
   - 触发器：$w.onReady() - 页面加载完成时自动触发
   - 数据源：wixUsers.currentUser, Admins数据集
   - 运行流程：检查用户权限 → 初始化页面 → 设置事件处理器 → 加载初始数据 → 设置响应式设计
   - 结束状态：页面完全初始化，用户权限验证完成，所有功能可用

2. 【统计数据管理】
   - 触发器：页面加载、refreshStatistics()手动刷新、定时器自动更新
   - 数据源：PR-Statistics数据集、Students数据集、Courses数据集
   - 运行流程：查询统计数据 → 计算学生/课程/工单统计 → 更新UI显示 → 缓存数据
   - 结束状态：统计卡片显示最新数据，包括总学生数、活跃学生数、工单统计等

3. 【学生管理功能】
   - 触发器：
     * 添加学生：addStudentBtn点击 → openStudentModal('add')
     * 移除学生：removeStudentBtn点击 → openStudentModal('remove')
     * 表单提交：submitAddStudentBtn点击 → submitAddStudent()
   - 数据源：Students数据集、Courses数据集
   - 运行流程：打开模态框 → 填写表单 → 验证数据 → 保存到数据库 → 更新统计 → 发送通知
   - 结束状态：学生记录创建/删除成功，相关统计更新，通知发送完成

4. 【AP学生注册管理】
   - 触发器：
     * 注册AP学生：addAPStudentBtn点击 → openAPStudentModal()
     * 移除AP学生：removeAPStudentBtn点击 → openRemoveAPModal()
     * 表单提交：registerAPStudentBtn点击 → registerAPStudent()
   - 数据源：Students数据集（isAP=true筛选）
   - 运行流程：打开AP学生模态框 → 多步骤表单填写 → 文件上传 → 数据验证 → 保存记录 → 更新AP学生统计
   - 结束状态：AP学生记录创建/删除，文件上传完成，相关文档存储

5. 【课程管理功能】
   - 触发器：
     * 课程管理：manageCourseBtn点击 → openCourseModal()
     * 课程取消：cancelCourseBtn点击 → openCourseCancellationModal()
     * 确认取消：confirmCancellationBtn点击 → confirmCourseCancellation()
   - 数据源：Courses数据集、Students数据集
   - 运行流程：选择课程 → 计算取消日期 → 确认操作 → 更新课程状态 → 通知相关人员
   - 结束状态：课程状态更新，取消通知发送，学生和教师收到通知

6. 【搜索与筛选功能】
   - 触发器：
     * 课程搜索：courseSearchInput.onInput() → filterCourses()
     * 学生搜索：studentSearchInput.onInput() → filterStudentRepeater()
     * AP学生搜索：apStudentSearchInput.onInput() → filterAPStudentRepeater()
   - 数据源：实时输入的搜索关键词，相应的数据集
   - 运行流程：获取搜索词 → 查询数据库 → 客户端筛选 → 更新Repeater显示
   - 结束状态：搜索结果实时显示，支持模糊匹配和多字段搜索

7. 【工单系统管理】
   - 触发器：
     * 提交工单：submitTicketBtn点击 → handleTicketSubmission()
     * 查询状态：checkTicketStatusBtn点击 → handleStatusCheck()
     * 更新状态：updateTicketStatusBtn点击 → updateTicketStatus()
   - 数据源：Tickets数据集、PR-Statistics数据集
   - 运行流程：创建/查询工单 → 更新状态 → 同步到Lark → 更新统计数据 → 发送通知
   - 结束状态：工单状态更新，相关人员收到通知，统计数据同步

8. 【Lark集成功能】
   - 触发器：
     * 同步测试：testLarkConnectionBtn点击 → testLarkConnection()
     * 单个同步：syncStudentToLark()调用
     * 批量同步：syncAllStudentsToLark()调用
     * 数据拉取：pullStudentsFromLark()调用
   - 数据源：Students数据集、Lark Base API
   - 运行流程：连接Lark API → 数据格式转换 → 同步操作 → 状态更新 → 错误处理
   - 结束状态：数据同步完成，同步状态记录，错误日志保存

9. 【文件上传管理】
   - 触发器：ehcpFileUpload.onChange() → handleFileUpload()
   - 数据源：用户上传的文件、文件验证规则
   - 运行流程：文件选择 → 格式验证 → 大小检查 → 上传到Wix → 文件验证 → 状态更新
   - 结束状态：文件上传完成，验证通过，文件URL保存到数据库

10. 【权限与安全管理】
    - 触发器：页面加载时自动检查，操作前权限验证
    - 数据源：wixUsers当前用户、Admins数据集、权限配置
    - 运行流程：获取用户信息 → 查询权限级别 → 验证操作权限 → 允许/拒绝操作
    - 结束状态：用户权限确认，操作权限控制，安全日志记录

11. 【响应式设计与UI管理】
    - 触发器：窗口大小变化、设备方向改变
    - 数据源：窗口尺寸、设备类型检测
    - 运行流程：检测屏幕尺寸 → 调整布局 → 优化移动端显示 → 更新UI组件
    - 结束状态：界面适配完成，用户体验优化

12. 【错误处理与日志系统】
    - 触发器：任何操作发生错误时自动触发
    - 数据源：错误对象、操作上下文、用户信息
    - 运行流程：捕获错误 → 分类处理 → 用户友好提示 → 错误日志记录 → 必要时发送报告
    - 结束状态：错误妥善处理，用户收到清晰提示，技术团队收到错误报告

13. 【性能优化与缓存管理】
    - 触发器：数据查询时、定时清理、内存压力时
    - 数据源：查询结果、缓存配置、性能指标
    - 运行流程：检查缓存 → 数据查询 → 结果缓存 → 定时清理 → 性能监控
    - 结束状态：查询性能优化，内存使用合理，用户体验流畅

14. 【导航与页面管理】
    - 触发器：导航按钮点击 → handleNavigation(section)
    - 数据源：页面路由配置、用户权限
    - 运行流程：验证访问权限 → 更新导航状态 → 页面跳转 → 加载目标页面数据
    - 结束状态：页面成功跳转，导航状态更新，目标页面数据加载完成

【数据流总览】
输入源：用户交互、定时器、外部API、文件上传
↓
数据处理：验证、转换、计算、筛选
↓
数据存储：Wix数据库、本地缓存、Lark Base
↓
输出展示：UI更新、通知发送、文件下载、报告生成

【系统集成点】
- Wix数据库：所有业务数据的主要存储
- Lark Base：外部数据同步和备份
- 文件存储：Wix媒体管理器
- 通知系统：Lark Webhook、邮件服务
- 权限系统：Wix用户管理

【性能特点】
- 异步操作：所有数据库操作和API调用都是异步的
- 缓存机制：频繁查询的数据会被缓存5分钟
- 防抖处理：搜索输入有防抖延迟，避免频繁查询
- 错误恢复：网络错误会自动重试，用户操作有回滚机制
- 内存管理：定期清理缓存，避免内存泄漏

【安全措施】
- 权限验证：每个操作都会检查用户权限
- 数据验证：所有输入数据都会进行格式和安全验证
- 文件安全：上传文件会检查类型、大小和内容
- API安全：外部API调用使用加密和认证
- 日志记录：所有重要操作都会记录日志用于审计
*/