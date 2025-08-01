# AP Student Registration Page - Feature Description

## Overview
The AP Student Registration Page allows administrators to register new AP (Additional Provision) students with comprehensive information collection including personal details, EHCP documentation, caseworker information, and educational background. This page features advanced file upload functionality using Wix forms to handle EHCP documentation securely and efficiently.

## Element Naming Reference

### Student Information Section
- `studentFirstName`: Student's first name input field
- `studentLastName`: Student's last name input field
- `studentDateOfBirth`: Student's date of birth picker
- `studentEmail`: Student's email address input
- `classStartDate`: Class start date picker
- `ehcpStatus`: EHCP status selection dropdown

### EHCP Documentation Section
- `ehcpFile`: Wix form file upload element for EHCP documents
- `ehcpDetails`: Additional EHCP details text area
- `file-remove`: Remove uploaded file button

### Caseworker Information Section
- `caseworkerName`: Caseworker's full name input
- `caseworkerEmail`: Caseworker's email address input

### Guardian/Parent Information Section
- `guardianName`: Guardian/parent full name input
- `guardianEmail`: Guardian/parent email address input
- `guardianPhone`: Guardian/parent phone number input

### Emergency Contact Section
- `emergencyContact`: Emergency contact phone number input
- `emergencyName`: Emergency contact name input

### Educational Background Section
- `homeAddress`: Student's home address text area
- `previousEducation`: Previous education details text area

### Educational Plan Selection Section
- `selectedPlan`: Educational plan selection dropdown

### Additional Questions Section
- `homeLessonsWithoutSupervision`: Home lessons supervision question
- `supportLongerThanFourWeeks`: Long-term support question

### Form Container and Controls
- `apRegistrationForm`: Main form container
- `submitBtn`: Submit registration button
- `resetBtn`: Reset form button
- `backBtn`: Back navigation button

## Feature Flow Description

### Feature 1: Student Information Collection
**User Action**: Fill in student personal details
**CMS Data Source**: No direct CMS read operation
**Display Result**:
- Collects basic student information including `studentFirstName`, `studentLastName`, `studentDateOfBirth`
- Captures `studentEmail` for communication purposes
- Sets `classStartDate` for enrollment planning
- Determines `ehcpStatus` for appropriate support planning

### Feature 2: EHCP Documentation Upload (Wix Form Integration)
**User Action**: Upload EHCP documents using `ehcpFile` element
**Technical Implementation**: 
- Utilizes Wix form file upload functionality for secure document handling
- Generates Wix media links for uploaded documents
- Stores file references in Wix media library
**Display Result**:
- `ehcpFile`: Wix form file upload element with drag-and-drop support
- File validation for document types (PDF, DOC, DOCX)
- Progress indicator during upload process
- `file-remove`: Option to remove uploaded files
- `ehcpDetails`: Additional text area for EHCP-related notes

### Feature 3: Contact Information Management
**User Action**: Enter caseworker and guardian contact details
**CMS Data Source**: No direct CMS read operation
**Display Result**:
- Captures `caseworkerName` and `caseworkerEmail` for professional coordination
- Records `guardianName`, `guardianEmail`, and `guardianPhone` for family communication
- Collects `emergencyContact` and `emergencyName` for safety protocols

### Feature 4: Educational Background Assessment
**User Action**: Provide educational history and address information
**CMS Data Source**: No direct CMS read operation
**Display Result**:
- `homeAddress`: Comprehensive address collection for service delivery
- `previousEducation`: Detailed educational background for appropriate placement
- `selectedPlan`: Educational plan selection based on student needs

### Feature 5: Additional Support Questions
**User Action**: Answer specific support-related questions
**CMS Data Source**: No direct CMS read operation
**Display Result**:
- `homeLessonsWithoutSupervision`: Assessment of independent learning capability
- `supportLongerThanFourWeeks`: Long-term support planning question

### Feature 6: Form Submission and Data Processing
**User Action**: Click on `submitBtn` to submit registration
**CMS Data Source**: 
- Creates comprehensive student record in CMS-7 (Students Collection)
- Stores file references and Wix media links in CMS-5 (DataSyncLogs)
- Sends complete registration data to Lark Anycross via HTTP POST to: `https://open-sg.larksuite.com/anycross/trigger/callback/MGQ0ZmQwNjJmZjAyZGJlNzM0YTRiMTQ1MDcwYTM1YjY1`
**Display Result**:
- Validates all required fields are completed
- Processes Wix form file uploads and generates media links
- If validation passes, displays confirmation message:
  - Title: "AP Student Registration Submitted"
  - Message: "Thank you for your submission. The student registration has been processed and all relevant parties will be notified via email."
  - Single action button: "OK"
- Upon successful submission:
  - Clears form data
  - Returns to main admin dashboard
  - Sends automated notifications to caseworker and guardian

### Feature 7: Form Management
**User Action**: Use form control buttons
**CMS Data Source**: No CMS operation
**Display Result**:
- `resetBtn`: Clears all form fields and uploaded files
- `backBtn`: Returns to previous page with confirmation dialog if form has data
- Auto-save functionality for form data preservation

## Technical Considerations

### Wix Form File Upload Optimization
**Recommended Approach**: Using Wix form file upload is the optimal solution because:
1. **Security**: Wix handles file validation, virus scanning, and secure storage
2. **Media Management**: Automatic integration with Wix media library
3. **Scalability**: Built-in CDN and file optimization
4. **Compliance**: GDPR and data protection compliance built-in
5. **User Experience**: Native drag-and-drop interface with progress indicators

### File Processing Workflow
1. User uploads file via Wix form element (`ehcpFile`)
2. Wix processes and stores file in media library
3. System generates secure media URL
4. Media URL is included in registration data
5. Complete data package sent to Lark Anycross endpoint
6. File references stored in CMS for future access

---

# AP学生注册页面 - 功能描述

## 概述
AP学生注册页面允许管理员注册新的AP（额外支持）学生，收集包括个人详细信息、EHCP文档、个案工作者信息和教育背景在内的全面信息。此页面采用Wix表单的高级文件上传功能，安全高效地处理EHCP文档。

## 功能流程描述

### 功能1：学生信息收集
**用户操作**：填写学生个人详细信息
**显示结果**：收集基本学生信息，包括姓名、出生日期、邮箱、课程开始日期和EHCP状态

### 功能2：EHCP文档上传（Wix表单集成）
**用户操作**：使用`ehcpFile`元素上传EHCP文档
**技术实现**：
- 利用Wix表单文件上传功能进行安全文档处理
- 为上传的文档生成Wix媒体链接
- 在Wix媒体库中存储文件引用
**显示结果**：支持拖放的文件上传界面，文件验证，上传进度指示器

### 功能3：联系信息管理
**用户操作**：输入个案工作者和监护人联系详情
**显示结果**：收集专业协调和家庭沟通所需的联系信息

### 功能4：教育背景评估
**用户操作**：提供教育历史和地址信息
**显示结果**：收集服务提供和适当安置所需的详细背景信息

### 功能5：额外支持问题
**用户操作**：回答特定的支持相关问题
**显示结果**：评估独立学习能力和长期支持规划需求

### 功能6：表单提交和数据处理
**用户操作**：点击`submitBtn`提交注册
**CMS数据源**：
- 在CMS-7（学生集合）中创建综合学生记录
- 在CMS-5（DataSyncLogs）中存储文件引用和Wix媒体链接
- 通过HTTP POST将完整注册数据发送到Lark Anycross：`https://open-sg.larksuite.com/anycross/trigger/callback/MGQ0ZmQwNjJmZjAyZGJlNzM0YTRiMTQ1MDcwYTM1YjY1`
**显示结果**：验证所有必填字段，处理文件上传，显示确认消息并发送自动通知

### 功能7：表单管理
**用户操作**：使用表单控制按钮
**显示结果**：重置表单、返回上一页、自动保存功能

## 技术考虑

### Wix表单文件上传优化
**推荐方案**：使用Wix表单文件上传是最优解决方案，因为它提供安全性、媒体管理、可扩展性、合规性和优秀的用户体验。