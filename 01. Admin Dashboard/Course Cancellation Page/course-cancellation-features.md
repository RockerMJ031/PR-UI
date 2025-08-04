# Course Cancellation Page - Feature Description

## Overview
The Course Cancellation Page allows administrators to cancel courses that need to be discontinued due to various reasons such as low enrollment, instructor unavailability, or other operational considerations. This page provides a comprehensive interface for searching, selecting, and configuring course cancellations with detailed student information and proper documentation.

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
- `cancelBtn`: Cancel course button

### Cancellation Details Panel
- `cancellationDetailsPanel`: Main details panel container
- `cancellationPlaceholder`: Placeholder content container
- `cancellationPlaceholderText`: Placeholder instruction text
- `cancellationPlaceholderIcon`: Placeholder icon element
- `selectedCancellationCourseInfo`: Selected course information panel
- `cancellationCourseHeader`: Course header section
- `cancellationCourseTitle`: Selected course title
- `cancellationCourseSubject`: Selected course subject
- `courseIdPopUp`: Course ID display in the right panel popup after course selection
- `studentsTextDisplay`: Student names display area

### Cancellation Form Elements
- `cancellationStartDate`: Cancellation effective date input
- `reasonForCancellation`: Cancellation reason text area
- `closeBtn`: Close modal button
- `submitCancellationBtn`: Submit cancellation request button

## Feature Flow Description

### Feature 0: Page Load and Initial Course Display
**User Action**: Page loads automatically
**CMS Data Source**: 
- **User Authentication**: Get current user's `wix_id` and query CMS-6 (Admins Collection) using `wixData.query('Admins').eq('userId', wix_id)` to get user's `schoolID`
- **Course Data**: Query CMS-3 (Import86 - Course Information Management Collection) using `wixData.query('Import86').eq('schoolID', userSchoolID)` to get school-specific courses
- **Student Count**: Queries CMS-2 (Import74 - Student Course Assignment Collection) to count students with matching `class_id` and `status: 'Activated'`
- **Student Names**: Retrieves `student_name` from CMS-2 records with matching `class_id` and `status: 'Activated'`
**Display Result**: 
- Automatically displays school-specific courses in `courseRepeater`
- `courseId`: Shows CMS-3 `class_id` field
- `courseSubject`: Shows CMS-3 `subject` field
- `studentCountNumber`: Displays count of CMS-2 records with matching `class_id` and `status: 'Activated'`
- `studentCountText`: Fixed text "students"
- `studentNames`: Lists `student_name` from CMS-2 records with matching `class_id` and `status: 'Activated'`
- Filters courses based on school ID matching to ensure users only see courses from their school

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

### Feature 2: Course Selection for Cancellation
**User Action**: Click on `cancelBtn` ("Cancel" button) for a specific course
**CMS Data Source**: 
- Reads detailed course information from CMS-3 (Import86)
- Retrieves student assignment data from CMS-2 (Import74 - Student Course Assignment Collection)
- Fetches student details from CMS-7 (Students Collection)
**Display Result**:
- Hides `cancellationPlaceholder` containing `cancellationPlaceholderText` and `cancellationPlaceholderIcon`
- Shows `selectedCancellationCourseInfo` panel
- Displays `cancellationCourseTitle` and `cancellationCourseSubject` in `cancellationCourseHeader`
- Shows `courseIdPopUp` with the selected course ID
- Populates `studentsTextDisplay` with detailed student information

### Feature 3: Cancellation Configuration
**User Action**: Fill in cancellation details in the form
**CMS Data Source**: No direct CMS read operation
**Display Result**:
- `cancellationStartDate`: Date picker for when the cancellation becomes effective
- `reasonForCancellation`: Text area for detailed cancellation justification and explanation

### Feature 4: Cancellation Submission
**User Action**: Click on `submitCancellationBtn` (Submit Cancellation Request)
**CMS Data Source**: 
- Creates records in CMS-5 (DataSyncLogs) for tracking the cancellation operation with detailed user and course information
- Sends cancellation request data to Lark Anycross via HTTP POST to: `https://open-sg.larksuite.com/anycross/trigger/callback/MGU2YzhkZjRlMDk5ZmY0ZDY2NDIyMjRmNjdmODY5NjYw`
**Display Result**:
- Validates all required fields are completed:
  - `courseId` (course must be selected)
  - `cancellationStartDate` (effective date must be selected)
  - `reasonForCancellation` (detailed reason must be provided)
- If validation passes, displays a confirmation lightbox with:
  - Title: "Cancellation Request Submitted"
  - Message: "Thank you for your submission. A ticket has been generated and you will receive email updates on the progress."
  - Single action button: "OK"
- Upon clicking "OK":
  - Closes the cancellation modal
  - Returns to the main course list view

### Feature 5: Clear Selection
**User Action**: Click on `clearSelectionBtn` (if available)
**CMS Data Source**: No CMS operation
**Display Result**:
- Clears `selectedCancellationCourseInfo`
- Shows `cancellationPlaceholder` with `cancellationPlaceholderText` and `cancellationPlaceholderIcon`
- Resets all form fields (`cancellationStartDate`, `reasonForCancellation`)

### Feature 6: Modal Management
**User Action**: Click on `closeBtn` or outside modal area
**CMS Data Source**: No CMS operation
**Display Result**:
- Closes the cancellation modal
- Returns to main admin dashboard view
- Preserves any unsaved form data for user convenience

---

# 课程取消页面 - 功能描述

## 概述
课程取消页面允许管理员取消因各种原因需要停止的课程，如注册人数不足、讲师不可用或其他运营考虑。此页面提供了一个全面的界面，用于搜索、选择和配置课程取消，并显示详细的学生信息和适当的文档记录。

## 功能流程描述

### 功能0：页面加载和初始课程显示
**用户操作**：页面自动加载
**CMS数据源**：
- **用户身份验证**：获取当前用户的 `wix_id`，使用 `wixData.query('Admins').eq('userId', wix_id)` 查询CMS-6（管理员集合）以获取用户的 `schoolID`
- **课程数据**：使用 `wixData.query('Import86').eq('schoolID', userSchoolID)` 查询CMS-3（Import86 - 课程信息管理集合），获取学校特定的课程
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

### 功能2：选择课程进行取消
**用户操作**：点击特定课程的 `cancelBtn`（"Cancel" 按钮）
**CMS数据源**：
- 从CMS-3（Import86）读取详细课程信息
- 从CMS-2（Import74 - 学生课程分配集合）检索学生分配数据
- 从CMS-7（学生集合）获取学生详细信息
**显示结果**：
- 隐藏包含 `cancellationPlaceholderText` 和 `cancellationPlaceholderIcon` 的 `cancellationPlaceholder`
- 显示 `selectedCancellationCourseInfo` 面板
- 在 `cancellationCourseHeader` 中显示 `cancellationCourseTitle` 和 `cancellationCourseSubject`
- 显示 `courseIdPopUp` 包含选中课程的ID
- 用详细学生信息填充 `studentsTextDisplay`

### 功能3：取消配置
**用户操作**：在表单中填写取消详细信息
**CMS数据源**：无直接CMS读取操作
**显示结果**：
- `cancellationStartDate`：取消生效日期的日期选择器
- `reasonForCancellation`：详细取消理由和说明的文本区域

### 功能4：提交取消申请
**用户操作**：点击 `submitCancellationBtn`（Submit Cancellation Request）
**CMS数据源**：
- 在CMS-5（DataSyncLogs）中创建记录以跟踪取消操作，包含详细的用户和课程信息
- 通过HTTP POST将取消申请数据发送到Lark Anycross：`https://open-sg.larksuite.com/anycross/trigger/callback/MGU2YzhkZjRlMDk5ZmY0ZDY2NDIyMjRmNjdmODY5NjYw`
**显示结果**：
- 验证所有必填字段是否已完成：
  - `courseId`（必须选择课程）
  - `cancellationStartDate`（必须选择生效日期）
  - `reasonForCancellation`（必须提供详细原因）
- 如果验证通过，显示确认lightbox包含：
  - 标题："取消申请已提交"
  - 消息："感谢您的提交。我们已为您生成工单，将通过邮件持续更新进展。"
  - 单个操作按钮："确定"
- 点击"确定"后：
  - 关闭取消模态框
  - 返回主课程列表视图

### 功能5：清除选择
**用户操作**：点击 `clearSelectionBtn`（如果可用）
**CMS数据源**：无CMS操作
**显示结果**：
- 清除 `selectedCancellationCourseInfo`
- 显示带有 `cancellationPlaceholderText` 和 `cancellationPlaceholderIcon` 的 `cancellationPlaceholder`
- 重置所有表单字段（`cancellationStartDate`、`reasonForCancellation`）

### 功能6：模态框管理
**用户操作**：点击 `closeBtn` 或模态框外部区域
**CMS数据源**：无CMS操作
**显示结果**：
- 关闭取消模态框
- 返回主管理员仪表板视图
- 为用户便利保留任何未保存的表单数据