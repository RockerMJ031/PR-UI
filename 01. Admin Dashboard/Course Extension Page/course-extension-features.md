# Course Extension Page - Feature Description

## Overview
The Course Extension Page allows administrators to extend course durations for students who need additional time to complete their coursework. This page provides a comprehensive interface for searching, selecting, and configuring course extensions with detailed student information.

## Element Naming Reference

Modal/Lightbox Elements:
- courseExtensionLightbox: 课程延期灯箱
- extensionCourseList: 延期课程列表
- extensionSearchInput: 延期搜索输入框

Confirmation Lightbox Elements:
- confirmationLightbox: 确认提交灯箱
- confirmationTitle: 确认标题
- confirmationMessage: 确认消息
- confirmationOkBtn: 确认按钮

## Feature Flow Description

### Feature 1: Course Search and Display
**User Action**: Click on `searchInput` field and enter search criteria
**CMS Data Source**: Reads from CMS-3 (Import86 - Course Information Management Collection)
**Display Result**: 
- Filters and displays matching courses in `courseRepeater`
- Shows `courseId`, `courseName`, `courseSubject` for each course
- Displays `studentCountNumber` and `studentCountText` showing enrolled student count
- Lists `studentNames` as comma-separated text for each course

### Feature 2: Course Selection for Extension
**User Action**: Click on `extendBtn` ("Extend" button) for a specific course
**CMS Data Source**: 
- Reads detailed course information from CMS-3 (Import86)
- Retrieves student assignment data from CMS-2 (Import74 - Student Course Assignment Collection)
- Fetches student details from CMS-7 (Students Collection)
**Display Result**:
- Hides `extensionPlaceholder` containing `extensionPlaceholderText` and `extensionPlaceholderIcon`
- Shows `selectedExtensionCourseInfo` panel
- Displays `extensionCourseTitle` and `extensionCourseSubject` in `extensionCourseHeader`
- Populates `students-text-display` with detailed student information

### Feature 3: Extension Configuration
**User Action**: Fill in extension details in the form
**CMS Data Source**: No direct CMS read operation
**Display Result**:
- `extensionEndDate`: Date picker for new course end date
- `updatedFocusArea`: Text field for modified curriculum focus
- `extensionDescription`: Text area for extension justification and details

### Feature 4: Extension Submission
**User Action**: Click on `submitExtensionBtn` (Submit Extension Request)
**CMS Data Source**: 
- Creates records in CMS-5 (DataSyncLogs) for tracking the extension operation with detailed user and course information
- Sends extension request data to Lark Anycross via HTTP POST to: `https://open-sg.larksuite.com/anycross/trigger/callback/MGU2YzhkZjRlMDk5ZmY0ZDY2NDIyMjRmNjdmODY5NjYw`
**Display Result**:
- Validates all required fields are completed:
  - `courseId` (course must be selected)
  - `extensionEndDate` (new end date must be selected)
  - `updatedFocusArea` (focus area must be specified)
  - `extensionDescription` (detailed description must be provided)
- If validation passes, displays a confirmation lightbox with:
  - Title: "Extension Request Submitted"
  - Message: "Thank you for your submission. A ticket has been generated and you will receive email updates on the progress."
  - Single action button: "OK"
- Upon clicking "OK":
  - Closes the extension modal (`courseExtensionLightbox`)
  - Returns to the main course list view

### Feature 5: Clear Selection
**User Action**: Click on `clearSelectionBtn`
**CMS Data Source**: No CMS operation
**Display Result**:
- Clears `selectedExtensionCourseInfo`
- Shows `extensionPlaceholder` with `extensionPlaceholderText` and `extensionPlaceholderIcon`
- Resets all form fields (`extensionEndDate`, `updatedFocusArea`, `extensionDescription`)

### Feature 6: Modal Management
**User Action**: Click on `closeBtn` or outside modal area
**CMS Data Source**: No CMS operation
**Display Result**:
- Closes `courseExtensionLightbox` modal
- Returns to main admin dashboard view
- Preserves any unsaved form data for user convenience

---

# 课程延期页面 - 功能描述

## 概述
课程延期页面允许管理员为需要额外时间完成课程的学生延长课程持续时间。此页面提供了一个全面的界面，用于搜索、选择和配置课程延期，并显示详细的学生信息。

## 功能流程描述

### 功能1：课程搜索和显示
**用户操作**：点击 `searchInput` 字段并输入搜索条件
**CMS数据源**：从CMS-3（Import86 - 课程信息管理集合）读取数据
**显示结果**：
- 在 `courseRepeater` 中过滤并显示匹配的课程
- 为每个课程显示 `courseId`、`courseName`、`courseSubject`
- 显示 `studentCountNumber` 和 `studentCountText` 展示已注册学生数量
- 将 `studentNames` 以逗号分隔的文本形式列出每个课程的学生

### 功能2：选择课程进行延期
**用户操作**：点击特定课程的 `extendBtn`（"Extend" 按钮）
**CMS数据源**：
- 从CMS-3（Import86）读取详细课程信息
- 从CMS-2（Import74 - 学生课程分配集合）检索学生分配数据
- 从CMS-7（学生集合）获取学生详细信息
**显示结果**：
- 隐藏包含 `extensionPlaceholderText` 和 `extensionPlaceholderIcon` 的 `extensionPlaceholder`
- 显示 `selectedExtensionCourseInfo` 面板
- 在 `extensionCourseHeader` 中显示 `extensionCourseTitle` 和 `extensionCourseSubject`
- 用详细学生信息填充 `students-text-display`

### 功能3：延期配置
**用户操作**：在表单中填写延期详细信息
**CMS数据源**：无直接CMS读取操作
**显示结果**：
- `extensionEndDate`：新课程结束日期的日期选择器
- `updatedFocusArea`：修改课程重点的文本字段
- `extensionDescription`：延期理由和详细信息的文本区域

### 功能4：提交延期申请
**用户操作**：点击 `submitExtensionBtn`（Submit Extension Request）
**CMS数据源**：
- 在CMS-5（DataSyncLogs）中创建记录以跟踪延期操作，包含详细的用户和课程信息
- 通过HTTP POST将延期申请数据发送到Lark Anycross：`https://open-sg.larksuite.com/anycross/trigger/callback/MGU2YzhkZjRlMDk5ZmY0ZDY2NDIyMjRmNjdmODY5NjYw`
**显示结果**：
- 验证所有必填字段是否已完成：
  - `courseId`（必须选择课程）
  - `extensionEndDate`（必须选择新的结束日期）
  - `updatedFocusArea`（必须指定重点领域）
  - `extensionDescription`（必须提供详细描述）
- 如果验证通过，显示确认lightbox包含：
  - 标题："延期申请已提交"
  - 消息："感谢您的提交。我们已为您生成工单，将通过邮件持续更新进展。"
  - 单个操作按钮："确定"
- 点击"确定"后：
  - 关闭延期模态框（`courseExtensionLightbox`）
  - 返回主课程列表视图

### 功能5：清除选择
**用户操作**：点击 `clearSelectionBtn`
**CMS数据源**：无CMS操作
**显示结果**：
- 清除 `selectedExtensionCourseInfo`
- 显示带有 `extensionPlaceholderText` 和 `extensionPlaceholderIcon` 的 `extensionPlaceholder`
- 重置所有表单字段（`extensionEndDate`、`updatedFocusArea`、`extensionDescription`）

### 功能6：模态框管理
**用户操作**：点击 `closeBtn` 或模态框外部区域
**CMS数据源**：无CMS操作
**显示结果**：
- 关闭 `courseExtensionLightbox` 模态框
- 返回主管理员仪表板视图
- 为用户便利保留任何未保存的表单数据