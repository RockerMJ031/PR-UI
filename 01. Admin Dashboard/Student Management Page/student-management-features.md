# Student Management Page - Feature Description

## Overview
The Student Management Page allows administrators to manage student course enrollments through a comprehensive interface. This page provides options to remove all courses for a student or remove specific courses, with search functionality and appropriate confirmation steps.

## Element Naming Reference

Modal/Lightbox Elements:
- removeStudentModal: 学生管理模态框
- studentList: 学生列表
- confirmationLightbox: 确认提交灯箱
- successLightbox: 成功提示灯箱

Option Elements:
- removeAllCoursesBtn: 移除所有课程按钮
- removeSpecificCourseBtn: 移除特定课程按钮

Search Elements:
- searchInput: 搜索输入框
- searchBtn: 搜索按钮

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

### Feature 1: Modal Opening and Student Display
**User Action**: Open Student Management modal
**CMS Data Source**: Reads from CMS-7 (Students Collection)
**Data Filtering**:
- Queries current user's school field from user profile
- Matches student records in CMS-7 where school field equals current user's school
- Only displays students with status "Activated"
**Display Result**: 
- Shows `removeStudentModal` with student management interface
- Displays two option buttons: `removeAllCoursesBtn` and `removeSpecificCourseBtn`
- Shows search section with `searchInput` and `searchBtn`
- Displays filtered student list in `studentList` (Repeater container)
- Each student entry shows:
  - Student name in `.student-name`
  - Student ID in `.student-id`
  - Student email in `.student-email`
  - Course count in `.course-count`
  - Course list in `.course-list`

### Feature 2: Remove All Courses Option Selection
**User Action**: Click on `removeAllCoursesBtn` ("Remove all courses for student" button)
**CMS Data Source**: No direct CMS read operation
**Display Result**:
- Highlights the "Remove all courses" option (inactive state styling)
- Deactivates the "Remove specific course" option
- Updates the interface to show "Remove All Courses" action buttons for each student
- Enables bulk removal functionality for selected students

### Feature 3: Remove Specific Course Option Selection
**User Action**: Click on `removeSpecificCourseBtn` ("Remove specific course" button)
**CMS Data Source**: No direct CMS read operation
**Display Result**:
- Highlights the "Remove specific course" option (orange active styling)
- Deactivates the "Remove all courses" option
- Updates the interface to show individual course removal options
- Enables granular course selection for each student

### Feature 4: Student Search Functionality
**User Action**: Enter search term in `searchInput` and click `searchBtn`
**CMS Data Source**: Queries CMS-7 (Students Collection) with search filters
**Display Result**:
- Filters the student list based on search criteria
- Updates `studentList` to show only matching students
- Maintains the selected removal option (all courses or specific course)
- Shows "No results found" message if no students match the search

### Feature 5: Course Removal Confirmation
**User Action**: Click on "Remove All Courses" button for a specific student
**CMS Data Source**: No direct CMS read operation
**Display Result**:
- Shows confirmation dialog with:
  - Title: "Confirm Course Removal"
  - Message: "Are you sure you want to remove all courses for this student? This action cannot be undone."
  - Two action buttons: "Cancel" and "Confirm Removal"

### Feature 6: Removal Processing
**User Action**: Click on `confirmBtn` ("Confirm Removal" button)
**CMS Data Source**: 
- Updates student course enrollment in CMS-7 (Students Collection)
- Creates records in CMS-5 (DataSyncLogs) for tracking the removal operation
- Sends course removal notification data to Lark Anycross via HTTP POST
**Display Result**:
- Processes the course removal request
- Closes confirmation dialog
- Shows success lightbox with:
  - Title: "Course Removal Submitted"
  - Message: "Thank you for your submission. A ticket has been generated and you will receive email updates on the progress."
  - Single action button: "OK"

### Feature 7: Success Confirmation
**User Action**: Click on `successOkBtn` ("OK" button) in success lightbox
**CMS Data Source**: No CMS operation
**Display Result**:
- Closes success lightbox
- Refreshes student list to reflect the course removal
- Maintains current search filters and option selection
- Updates course count and course list for affected students

### Feature 8: Cancel Action
**User Action**: Click on `cancelBtn` ("Cancel" button) in confirmation dialog
**CMS Data Source**: No CMS operation
**Display Result**:
- Closes confirmation dialog
- Returns to student management view
- No changes made to student course data

### Feature 9: Modal Management
**User Action**: Click on `closeBtn` or outside modal area
**CMS Data Source**: No CMS operation
**Display Result**:
- Closes `removeStudentModal`
- Returns to main admin dashboard view
- No data changes are made

---

# 学生管理页面 - 功能描述

## 概述
学生管理页面允许管理员通过综合界面管理学生课程注册。此页面提供移除学生所有课程或移除特定课程的选项，具有搜索功能和适当的确认步骤。

## 功能流程描述

### 功能1：模态框打开和学生显示
**用户操作**：打开学生管理模态框
**CMS数据源**：从CMS-7（学生集合）读取数据
**数据过滤**：
- 查询当前用户的school字段
- 匹配CMS-7中school字段与当前用户school字段相同的学生记录
- 仅显示状态为"Activated"的学生
**显示结果**：
- 显示包含学生管理界面的 `removeStudentModal`
- 显示两个选项按钮：`removeAllCoursesBtn` 和 `removeSpecificCourseBtn`
- 显示包含 `searchInput` 和 `searchBtn` 的搜索部分
- 在 `studentList`（Repeater容器）中显示过滤后的学生列表
- 每个学生条目显示：
  - `.student-name` 中的学生姓名
  - `.student-id` 中的学生ID
  - `.student-email` 中的学生邮箱
  - `.course-count` 中的课程数量
  - `.course-list` 中的课程列表

### 功能2：移除所有课程选项选择
**用户操作**：点击 `removeAllCoursesBtn`（"移除学生所有课程" 按钮）
**CMS数据源**：无直接CMS读取操作
**显示结果**：
- 高亮显示"移除所有课程"选项（非活动状态样式）
- 取消激活"移除特定课程"选项
- 更新界面以显示每个学生的"移除所有课程"操作按钮
- 启用所选学生的批量移除功能

### 功能3：移除特定课程选项选择
**用户操作**：点击 `removeSpecificCourseBtn`（"移除特定课程" 按钮）
**CMS数据源**：无直接CMS读取操作
**显示结果**：
- 高亮显示"移除特定课程"选项（橙色活动样式）
- 取消激活"移除所有课程"选项
- 更新界面以显示单独的课程移除选项
- 启用每个学生的精细课程选择

### 功能4：学生搜索功能
**用户操作**：在 `searchInput` 中输入搜索词并点击 `searchBtn`
**CMS数据源**：使用搜索过滤器查询CMS-7（学生集合）
**显示结果**：
- 根据搜索条件过滤学生列表
- 更新 `studentList` 以仅显示匹配的学生
- 保持所选的移除选项（所有课程或特定课程）
- 如果没有学生匹配搜索，显示"未找到结果"消息

### 功能5：课程移除确认
**用户操作**：点击特定学生的"移除所有课程"按钮
**CMS数据源**：无直接CMS读取操作
**显示结果**：
- 显示确认对话框包含：
  - 标题："确认课程移除"
  - 消息："您确定要移除此学生的所有课程吗？此操作无法撤销。"
  - 两个操作按钮："取消" 和 "确认移除"

### 功能6：移除处理
**用户操作**：点击 `confirmBtn`（"确认移除" 按钮）
**CMS数据源**：
- 在CMS-7（学生集合）中更新学生课程注册
- 在CMS-5（DataSyncLogs）中创建记录以跟踪移除操作
- 通过HTTP POST将课程移除通知数据发送到Lark Anycross
**显示结果**：
- 处理课程移除请求
- 关闭确认对话框
- 显示成功lightbox包含：
  - 标题："课程移除已提交"
  - 消息："感谢您的提交。我们已为您生成工单，将通过邮件持续更新进展。"
  - 单个操作按钮："确定"

### 功能7：成功确认
**用户操作**：点击成功lightbox中的 `successOkBtn`（"确定" 按钮）
**CMS数据源**：无CMS操作
**显示结果**：
- 关闭成功lightbox
- 刷新学生列表以反映课程移除
- 保持当前搜索过滤器和选项选择
- 更新受影响学生的课程数量和课程列表

### 功能8：取消操作
**用户操作**：点击确认对话框中的 `cancelBtn`（"取消" 按钮）
**CMS数据源**：无CMS操作
**显示结果**：
- 关闭确认对话框
- 返回学生管理视图
- 不对学生课程数据进行任何更改

### 功能9：模态框管理
**用户操作**：点击 `closeBtn` 或模态框外部区域
**CMS数据源**：无CMS操作
**显示结果**：
- 关闭 `removeStudentModal`
- 返回主管理员仪表板视图
- 不进行任何数据更改