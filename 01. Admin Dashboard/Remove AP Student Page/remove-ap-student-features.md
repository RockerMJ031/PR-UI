# Remove AP Student Page - Feature Description

## Overview
The Remove AP Student Page allows administrators to remove students from the AP program. This page provides a simple interface for selecting students and confirming their removal with appropriate safeguards and confirmation steps.

## Element Naming Reference

Modal/Lightbox Elements:
- removeStudentModal: 移除学生模态框
- studentList: 学生列表
- confirmationLightbox: 确认提交灯箱
- successLightbox: 成功提示灯箱

Confirmation Elements:
- confirmationTitle: 确认标题
- confirmationMessage: 确认消息
- confirmBtn: 确认按钮
- cancelBtn: 取消按钮

Success Elements:
- successTitle: 成功标题
- successMessage: 成功消息
- successOkBtn: 确认按钮

## Feature Flow Description

### Feature 0: Page Load and Initial Student Display
**User Action**: Page loads when administrator accesses the Remove AP Student functionality
**CMS Data Source**: 
- CMS-6 (Admins Collection) for user authentication and schoolID retrieval
- CMS-7 (Students Collection) for student data based on schoolID
**Display Result**: 
- Authenticates current user and retrieves their schoolID from CMS-6
- Loads all students associated with the user's schoolID from CMS-7
- Displays students in `studentList` (Repeater container) with:
  - Student ID in data attributes
  - Student name in `.student-name`
  - Student AP plan information in `.ap-plan`
  - Status label (ACTIVE/PAUSED) in `.student-status`
  - Remove button in `.remove-btn`
- Shows loading state during data retrieval
- Handles error states if data loading fails
- Provides fallback data if no students are found

### Feature 1: Student Selection and Display
**User Action**: Open Remove AP Student modal
**CMS Data Source**: Reads from CMS-7 (Students Collection)
**Display Result**: 
- Shows `removeStudentModal` with student selection interface
- Displays student list in `studentList` (Repeater container)
- Each student entry shows:
  - Student name in `.student-name`
  - Student information (grade and courses) in `.student-info`
  - Status label (ACTIVE/PAUSED) in `.student-status`
  - Remove button in `.remove-btn`

### Feature 2: Remove Button Click
**User Action**: Click on `remove-btn` ("× Remove" button) for a specific student
**CMS Data Source**: No direct CMS read operation
**Display Result**:
- Shows confirmation dialog with:
  - Title: "Confirm Student Removal"
  - Message: "Are you sure you want to remove this student from the AP program? This action cannot be undone."
  - Two action buttons: "Cancel" and "Confirm Removal"

### Feature 3: Confirmation Action
**User Action**: Click on `confirmBtn` ("Confirm Removal" button)
**CMS Data Source**: 
- Updates student status in CMS-7 (Students Collection)
- Creates records in CMS-5 (DataSyncLogs) for tracking the removal operation
- Sends removal notification data to Lark Anycross via HTTP POST
**Display Result**:
- Processes the student removal request
- Closes confirmation dialog
- Shows success lightbox with:
  - Title: "Student Removal Submitted"
  - Message: "Thank you for your submission. A ticket has been generated and you will receive email updates on the progress."
  - Single action button: "OK"

### Feature 4: Success Confirmation
**User Action**: Click on `successOkBtn` ("OK" button) in success lightbox
**CMS Data Source**: No CMS operation
**Display Result**:
- Closes success lightbox
- Closes the remove student modal (`removeStudentModal`)
- Returns to main admin dashboard view
- Refreshes student list to reflect the removal

### Feature 5: Cancel Action
**User Action**: Click on `cancelBtn` ("Cancel" button) in confirmation dialog
**CMS Data Source**: No CMS operation
**Display Result**:
- Closes confirmation dialog
- Returns to student selection view
- No changes made to student data

### Feature 6: Modal Management
**User Action**: Click on close button or outside modal area
**CMS Data Source**: No CMS operation
**Display Result**:
- Closes `removeStudentModal`
- Returns to main admin dashboard view
- No data changes are made

---

# 移除AP学生页面 - 功能描述

## 概述
移除AP学生页面允许管理员从AP项目中移除学生。此页面提供了一个简单的界面，用于选择学生并通过适当的安全措施和确认步骤确认移除操作。

## 功能流程描述

### 功能0：页面加载和初始学生显示
**用户操作**：管理员访问移除AP学生功能时页面加载
**CMS数据源**：
- CMS-6（管理员集合）用于用户身份验证和schoolID获取
- CMS-7（学生集合）根据schoolID获取学生数据
**显示结果**：
- 验证当前用户身份并从CMS-6获取其schoolID
- 从CMS-7加载与用户schoolID关联的所有学生
- 在 `studentList`（Repeater容器）中显示学生，包含：
  - 数据属性中的学生ID
  - `.student-name` 中的学生姓名
  - `.ap-plan` 中的学生AP计划信息
  - `.student-status` 中的状态标签（ACTIVE/PAUSED）
  - `.remove-btn` 中的移除按钮
- 数据检索期间显示加载状态
- 如果数据加载失败则处理错误状态
- 如果未找到学生则提供备用数据

### 功能1：学生选择和显示
**用户操作**：打开移除AP学生模态框
**CMS数据源**：从CMS-7（学生集合）读取数据
**显示结果**：
- 显示带有学生选择界面的 `removeStudentModal`
- 在 `studentList`（Repeater容器）中显示学生列表
- 每个学生条目显示：
  - `.student-name` 中的学生姓名
  - `.student-info` 中的学生信息（年级和课程）
  - `.student-status` 中的状态标签（ACTIVE/PAUSED）
  - `.remove-btn` 中的移除按钮

### 功能2：点击移除按钮
**用户操作**：点击特定学生的 `remove-btn`（"× Remove" 按钮）
**CMS数据源**：无直接CMS读取操作
**显示结果**：
- 显示确认对话框包含：
  - 标题："确认移除学生"
  - 消息："您确定要从AP项目中移除此学生吗？此操作无法撤销。"
  - 两个操作按钮："取消" 和 "确认移除"

### 功能3：确认操作
**用户操作**：点击 `confirmBtn`（"确认移除" 按钮）
**CMS数据源**：
- 在CMS-7（学生集合）中更新学生状态
- 在CMS-5（DataSyncLogs）中创建记录以跟踪移除操作
- 通过HTTP POST将移除通知数据发送到Lark Anycross
**显示结果**：
- 处理学生移除请求
- 关闭确认对话框
- 显示成功lightbox包含：
  - 标题："学生移除已提交"
  - 消息："感谢您的提交。我们已为您生成工单，将通过邮件持续更新进展。"
  - 单个操作按钮："确定"

### 功能4：成功确认
**用户操作**：点击成功lightbox中的 `successOkBtn`（"确定" 按钮）
**CMS数据源**：无CMS操作
**显示结果**：
- 关闭成功lightbox
- 关闭移除学生模态框（`removeStudentModal`）
- 返回主管理员仪表板视图
- 刷新学生列表以反映移除操作

### 功能5：取消操作
**用户操作**：点击确认对话框中的 `cancelBtn`（"取消" 按钮）
**CMS数据源**：无CMS操作
**显示结果**：
- 关闭确认对话框
- 返回学生选择视图
- 不对学生数据进行任何更改

### 功能6：模态框管理
**用户操作**：点击关闭按钮或模态框外部区域
**CMS数据源**：无CMS操作
**显示结果**：
- 关闭 `removeStudentModal`
- 返回主管理员仪表板视图
- 不进行任何数据更改