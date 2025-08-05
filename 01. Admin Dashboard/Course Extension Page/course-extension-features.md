# Course Extension Page - Feature Description

## Overview
The Course Extension Page allows administrators to extend course durations for students who need additional time to complete their coursework. This page provides a comprehensive interface for searching, selecting, and configuring course extensions with detailed student information.

## Element Naming Reference

### Search Section
- `searchInput`: Course search input field
- `searchBtn`: Search button

### Course Repeater Section
- `courseRepeater`: Container for course list
- `courseContainer`: Individual course container
- `courseId`: Course identification display
- `courseSubject`: Course subject display
- `studentCountNumber`: Student count number (bold)
- `studentCountText`: Student count text ("students")
- `studentNames`: Student names text field
- `extendBtn`: Extend course button

### Extension Details Panel
- `extensionDetailsPanel`: Main details panel container
- `extensionPlaceholder`: Placeholder content container
- `extensionPlaceholderText`: Placeholder instruction text
- `extensionPlaceholderIcon`: Placeholder icon element
- `selectedExtensionCourseInfo`: Selected course information panel
- `extensionCourseHeader`: Course header section
- `extensionCourseTitle`: Selected course title
- `extensionCourseSubject`: Selected course subject
- `courseIdPopUp`: Course ID display in the right panel popup after course selection
- `studentsTextDisplay`: Student names display area

### Extension Form Elements
- `extensionEndDate`: Extension end date input
- `updatedFocusArea`: Updated focus area text field
- `extensionDescription`: Extension description text area
- `closeBtn`: Close modal button
- `clearSelectionBtn`: Clear selection button
- `submitExtensionBtn`: Submit extension request button

### Modal/Lightbox Elements
- `courseExtensionLightbox`: Course extension lightbox
- `extensionCourseList`: Extension course list
- `extensionSearchInput`: Extension search input

### Confirmation Lightbox Elements
- `confirmationLightbox`: Confirmation lightbox
- `confirmationTitle`: Confirmation title
- `confirmationMessage`: Confirmation message
- `confirmationOkBtn`: Confirmation OK button

## Feature Flow Description

### Feature 0: Page Load and Initial Course Display
**User Action**: Page automatically loads
**CMS Data Source**:
- **User Authentication**: Get current user's `wix_id`, use `wixData.query('Admins').eq('userId', wix_id)` to query CMS-6 (Admins Collection) to obtain user's `school`
- **Course Data**: Use `wixData.query('Import86').eq('schoolName', userSchool)` to query CMS-3 (Import86 - Course Information Management Collection) to get school-specific courses
- **Student Count**: Query CMS-2 (Import74 - Student Course Assignment Collection) to count students matching `class_id` with `status: 'Activated'`
- **Student Names**: Retrieve `student_name` from CMS-2 records matching `class_id` with `status: 'Activated'`
**Display Result**:
- Automatically display school-specific courses in `courseRepeater`
- `courseId`: Display `class_id` field from CMS-3
- `courseSubject`: Display `subject` field from CMS-3
- `studentCountNumber`: Display count of records from CMS-2 matching `class_id` with `status: 'Activated'`
- `studentCountText`: Fixed text "students"
- `studentNames`: List `student_name` from CMS-2 records matching `class_id` with `status: 'Activated'`
- Filter courses based on school ID matching, ensuring users can only see courses from their school

### Feature 1: Course Search and Display
**User Action**: Click on `searchInput` field and enter search criteria
**CMS Data Source**: 
- **Course Information**: Reads from CMS-3 (Import86 - Course Information Management Collection)
- **Student Count**: Queries CMS-2 (Import74 - Student Course Assignment Collection) to count students with matching `class_id` and `status: 'Activated'`
- **Student Names**: Retrieves `student_name` from CMS-2 records with matching `class_id` and `status: 'Activated'`
**Display Result**: 
- Filters and displays matching courses in `courseRepeater`
- `courseId`: Shows CMS-3 `class_id` field
- `courseSubject`: Shows CMS-3 `subject` field
- `studentCountNumber`: Displays count of CMS-2 records with matching `class_id` and `status: 'Activated'`
- `studentCountText`: Fixed text "students"
- `studentNames`: Lists `student_name` from CMS-2 records with matching `class_id` and `status: 'Activated'`

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
- Shows `courseIdPopUp` with the selected course ID
- Populates `studentsTextDisplay` with detailed student information

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


### 功能0：页面加载和初始课程显示
**用户操作**：页面自动加载
**CMS数据源**：
- **用户身份验证**：获取当前用户的 `wix_id`，使用 `wixData.query('Admins').eq('userId', wix_id)` 查询CMS-6（管理员集合）以获取用户的 `school`
- **课程数据**：使用 `wixData.query('Import86').eq('schoolName', userSchool)` 查询CMS-3（Import86 - 课程信息管理集合），获取学校特定的课程
- **学生数量**：查询CMS-2（Import74 - 学生课程分配集合）统计与 `class_id` 匹配且 `status: 'Activated'` 的学生数量
- **学生姓名**：从CMS-2中与 `class_id` 匹配且 `status: 'Activated'` 的记录中获取 `student_name`
**显示结果**：
- 在 `courseRepeater` 中自动显示学校特定的课程
- `courseId`：显示CMS-3中的 `class_id` 字段
- `courseSubject`：显示CMS-3中的 `subject` 字段
- `studentCountNumber`：显示CMS-2中与 `class_id` 匹配且 `status: 'Activated'` 的记录数量
- `studentCountText`：固定文本 "students"
- `studentNames`：列出CMS-2中与 `class_id` 匹配且 `status: 'Activated'` 的记录中的 `student_name`
- 基于学校ID匹配过滤课程，确保用户只能看到其所在学校的课程
### 功能1：课程搜索和显示
**用户操作**：点击 `searchInput` 字段并输入搜索条件
**CMS数据源**：
- **课程信息**：从CMS-3（Import86 - 课程信息管理集合）读取数据
- **学生数量**：查询CMS-2（Import74 - 学生课程分配集合）统计与 `class_id` 匹配且 `status: 'Activated'` 的学生数量
- **学生姓名**：从CMS-2中与 `class_id` 匹配且 `status: 'Activated'` 的记录中获取 `student_name`
**显示结果**：
- 在 `courseRepeater` 中过滤并显示匹配的课程
- `courseId`：显示CMS-3中的 `class_id` 字段
- `courseSubject`：显示CMS-3中的 `subject` 字段
- `studentCountNumber`：显示CMS-2中与 `class_id` 匹配且 `status: 'Activated'` 的记录数量
- `studentCountText`：固定文本 "students"
- `studentNames`：列出CMS-2中与 `class_id` 匹配且 `status: 'Activated'` 的记录中的 `student_name`

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
- 显示 `courseIdPopUp` 包含选中课程的ID
- 用详细学生信息填充 `studentsTextDisplay`

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