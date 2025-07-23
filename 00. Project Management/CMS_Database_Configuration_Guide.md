# CMS Database Configuration Guide

> **Document Version**: 3.0  
> **Last Updated**: July 21, 2025  
> **Maintainer**: System Administrator  
> **Architecture Design**: Based on four core CMS systems  
> **Consistency Check**: Completed ✅  
> **Implementation Status**: Running 🚀

This document details the database collection configuration required for the tutor management system, designed and optimized based on a four-CMS architecture approach.

## 📋 Table of Contents

### English Contents
1. [Introduction](#cms-database-configuration-guide)
2. [Student Management](#student-management-collections)
   - [CMS-1: Student Registration Information Collection](#cms-1-student-registration-information-collection)
   - [CMS-2: Student Course Assignment Collection](#cms-2-student-course-assignment-collection)
   - [CMS-7: Students Collection](#cms-7-students-collection)
   - [CMS-8: StudentCommunication Collection](#cms-8-studentcommunication-collection)
3. [Course Management](#course-management)
   - [CMS-3: Course Information Management Collection](#cms-3-course-information-management-collection)
4. [Reporting](#reporting)
   - [CMS-4: Student Report Collection](#cms-4-student-report-collection)
   - [CMS-9: PR-Statistics Collection](#cms-9-pr-statistics-collection)
5. [Administration](#administration)
   - [CMS-5: CMS Data Sync Log Collection](#cms-5-cms-data-sync-log-collection)
   - [CMS-6: Admins Collection](#cms-6-admins-collection)
   - [CMS-10: Tickets Collection](#cms-10-tickets-collection)
6. [Data Flow Diagram](#data-flow-diagram)

### 中文目录
1. [介绍](#cms-database-configuration-guide)
2. [学生管理](#student-management-collections)
   - [CMS-1: 学生注册信息集合](#cms-1-student-registration-information-collection)
   - [CMS-2: 学生课程分配集合](#cms-2-student-course-assignment-collection)
   - [CMS-7: 学生集合](#cms-7-students-collection)
   - [CMS-8: 学生沟通集合](#cms-8-studentcommunication-collection)
3. [课程管理](#course-management)
   - [CMS-3: 课程信息管理集合](#cms-3-course-information-management-collection)
4. [报告](#reporting)
   - [CMS-4: 学生报告集合](#cms-4-student-report-collection)
   - [CMS-9: PR-统计集合](#cms-9-pr-statistics-collection)
5. [管理](#administration)
   - [CMS-5: CMS数据同步日志集合](#cms-5-cms-data-sync-log-collection)
   - [CMS-6: 管理员集合](#cms-6-admins-collection)
   - [CMS-10: 工单集合](#cms-10-tickets-collection)
6. [数据流程图](#data-flow-diagram)


### CMS-1: Student Registration Information Collection
**Used in Pages**: Admin Dashboard Page  
**Code Call**: `wixData.query('StudentRegistrations')`  
**Notes**: Already established in Wix CMS, collection ID is `StudentRegistrations`

```javascript
{
  _id: "text", // Auto-generated
  registrationId: "text", // Registration Number
  firstName: "text", // First Name
  lastName: "text", // Last Name
  email: "text", // Email Address
  phone: "text", // Phone Number
  dateOfBirth: "text", // Date of Birth
  guardianParentName: "text", // Guardian/Parent Name
  guardianEmail: "text", // Guardian Email
  guardianPhone: "text", // Guardian Phone
  product: "text", // "Tutoring", "PRA - Core Subject", "PRA - All Subject", "PRA - All Subject + Therapy", "Purple Ruler Blueprint"
  subjects: ["text"], // Subjects of Interest
  preferredSchedule: "text", // Preferred Schedule
  send: "text", // Special Requirements
  classId: "text", // Selected Course Group ID, chosen from existing groups with future classes
  registrationStatus: "text", // pending, approved, rejected, Activated
  ehcpDocument: "text", // EHCP Document Attachment URL
  
  // Additional Lark-specific fields
  startDate: "text", // Start Date
  examBoard: "text", // Examination Board
  caseworkerContact: "text", // Caseworker Contact Information
  school: "text", // School
  address: "text", // Address
  
  /* Data Flow Description:
   * 数据流程说明：
   * 1. 学生注册页面（Student Registration Page）或管理员页面（Admin Dashboard）中添加/编辑学生信息时，
   *    数据首先保存到CMS-1（StudentRegistrations集合）。
   * 2. 保存成功后，系统会直接同步到Lark Base。
   * 3. 系统调用backend_larkBaseSync.jsw中的syncStudentFromWixToLark函数，
   *    将学生数据转换为Lark格式并通过HTTP请求发送到Lark Anycross。
   * 4. 同步状态和结果会更新到CMS-1的larkTransferStatus和相关字段中。
   * 5. 同步历史记录在Development Kit V1.0的Wix Sync Record中。
   * 6. 具体数据更新在PRT Operation的ST0 Website Enrollment中。
   * 7. 在Lark Base中，会创建一条记录，跟踪数据是从哪个CMS ID同步过来的，
   *    记录同步成功和失败的情况。
   * 
   * Data Flow Description:
   * 1. When adding/editing student information in the Student Registration Page or Admin Dashboard,
   *    data is first saved to CMS-1 (StudentRegistrations collection).
   * 2. After successful saving, the system directly synchronizes to Lark Base.
   * 3. The system calls the syncStudentFromWixToLark function in backend_larkBaseSync.jsw,
   *    converts student data to Lark format and sends it to Lark Anycross via HTTP request.
   * 4. Synchronization status and results are updated to larkTransferStatus and related fields in CMS-1.
   * 5. Synchronization history is recorded in the Wix Sync Record of Development Kit V1.0.
   * 6. The actual data is updated in ST0 Website Enrollment of PRT Operation.
   * 7. In Lark Base, a record is created that tracks which CMS ID the data was synchronized from,
   *    recording both successful and failed synchronizations.
   */
  
  larkTransferStatus: "text", // not_sent, sending, sent, confirmed, failed
  larkStudentId: "text", // Student ID in Lark System
  transferAttempts: "number", // Number of Transfer Attempts
  lastTransferAttempt: "text", // Last Transfer Attempt Time
  transferError: "text", // Transfer Error Information
  approvedBy: "text", // Approver ID
  approvedDate: "text", // Approval Time
  notes: "text", // Notes
  _createdDate: "text",
  _updatedDate: "text"
}
```

### CMS-2: Student Course Assignment Collection
**Used in Pages**: Course Assignment Page, Student Management Page  
**Code Call**: `wixData.query('Import74')`

/* Data Flow Description:
 * 数据流程说明：
 * 1. Lark中的PRT Operation的ST1通过HTTP请求将数据写入此CMS-2集合。
 * 2. 数据从Lark发送后，通过API端点接收并处理请求。
 * 3. 系统验证数据格式和必填字段后，将数据保存到Import74集合中。
 * 4. 同步状态记录在syncStatus字段中，最后同步时间记录在lastSyncWithLark字段中。
 * 
 * Data Flow Description:
 * 1. Data from ST1 in PRT Operation of Lark is written to this CMS-2 collection via HTTP request.
 * 2. After data is sent from Lark, it is received and processed through an API endpoint.
 * 3. The system validates the data format and required fields before saving it to the Import74 collection.
 * 4. Synchronization status is recorded in the syncStatus field, and the last synchronization time is recorded in the lastSyncWithLark field.
 */

```javascript
{
  _id: "text",
  no: "text", // Assignment Number
  wix_id: "text", // Wix System Student ID
  student_name: "text", // Student Name
  student_email: "text", // Student Email
  role: "text", // Student Role
  larkStudentId: "text", // Lark System Student ID
  cleverId: "text", // Clever System Student ID
  class_id: "text", // Class ID
  courseId: "text", // Class Name
  subject: "text", // Subject
  schoolName: "text", // School Name
  ls_link: "text", // Online Classroom Link
  lark_link: "text", // Zoom Meeting ID
  larkPassword: "text", // Zoom Password
  status: "text", // Activated or deactivated
  assignedDate: "text", // Assignment Date
  startDate: "text", // Start Date
  endDate: "text", // End Date
  assignedBy: "text", // Assigner ID
  lastSyncWithLark: "text", // Last Sync Time With Lark
  syncStatus: "text", // synced, pending, failed
  notes: "text", // Notes
  _createdDate: "text",
  _updatedDate: "text"
}
```

## Course Management

### CMS-3: Course Information Management Collection
**Used on Pages**: Course Management Page, Schedule Management  
**Code Call**: `wixData.query('Import86')`

> Note: This collection has been established in Wix, Collection ID is `Import86`, can be used directly in code.

/* Data Flow Description:
 * 数据流程说明：
 * 1. Lark的PRT Logistic的C4通过HTTP请求将数据写入此CMS-3集合。
 * 2. 数据从Lark发送后，通过专用API端点接收并处理请求。
 * 3. 系统验证课程信息的完整性和有效性后，将数据保存到Import86集合中。
 * 4. 课程信息更新后，相关的课程安排和教师分配也会相应更新。
 * 
 * Data Flow Description:
 * 1. Data from C4 in PRT Logistic of Lark is written to this CMS-3 collection via HTTP request.
 * 2. After data is sent from Lark, it is received and processed through a dedicated API endpoint.
 * 3. The system validates the completeness and validity of course information before saving it to the Import86 collection.
 * 4. After course information is updated, related course schedules and instructor assignments are also updated accordingly.
 */

```javascript
{
  _id: "text",
  scheduleId: "text", // Course schedule number
  class_id: "text", // Class ID
  courseId: "text", // Course name
  subject: "text", // Subject
  instructorName: "text", // Instructor name
  instructorId: "text", // Instructor ID
  scheduledDate: "text", // What is this used for
  startTime: "text", // Start time
  endTime: "text", // End time
  duration: "number", // Course duration (minutes)
  courseType: "text", // individual, group, workshop, assessment
  maxStudents: "number", // Maximum number of students
  enrolledStudents: "number", // Number of enrolled students
  status: "text", // scheduled, in_progress, completed, cancelled, rescheduled
  onlineClassroomLink: "text", // Online classroom link
  courseMaterials: ["text"], // Course material links
  agenda: "text", // Course agenda
  prerequisites: ["text"], // Prerequisites
  c4No: "text", // Lark system course ID
  lastSyncWithLark: "text", // Last sync time with Lark
  syncStatus: "text", // synced, pending, failed
  _createdDate: "text",
  _updatedDate: "text"
}
```

## Reporting

### CMS-4: Student Report Collection
**Used on Pages**: Student Report Page, Parent Portal  
**Code Call**: `wixData.query('StudentReports')`

> Note: This collection has been established in Wix CMS, Collection ID is `StudentReports`, can be used directly in code.

**数据流程**：
- 数据由Lark的PRT Operation的R2通过HTTP请求写入CMS-4集合
- 当教师在Lark的PRT Operation的R2中提交学生报告时，数据会通过HTTP请求发送到Wix系统
- 然后，数据会被处理并写入到`StudentReports`集合中
- 每次数据同步时，系统会记录同步状态和时间

**Data Flow**:
- Data is written to the CMS-4 collection from Lark's PRT Operation R2 via HTTP requests
- When teachers submit student reports in Lark's PRT Operation R2, the data is sent to the Wix system via HTTP requests
- The data is then processed and written to the `StudentReports` collection
- The system records the synchronization status and time with each data sync

```javascript
{
  _id: "text",
  reportId: "text", // Report number
  wix_id: "text", // Wix student ID
  student_name: "text", // Student name
  student_email: "text", // Student email
  role: "text", // Student role
  larkStudentId: "text", // Lark student ID
  classId: "text", // Class ID
  courseId: "text", // Course ID
  reportType: "text", // daily, weekly, monthly, assessment, final, session - session is a report for each class
  
  // Lark Base transfer fields
  lessonTime: "text", // Lesson time
  status: "text", // Attendance status: Attended or Missed
  quizStart: "text", // Quiz at the beginning of the lesson
  quizEnd: "text", // Quiz at the end of the lesson
  lessonContent: "text", // Lesson content
  studentNote: "text", // Note for students if they are absent
  internalNote: "text", // Note for the school, e.g., which knowledge points teachers can help with
  behavior: "text", // If the student has bad behavior
  examType: "text", // Exam type
  baselineComment: "text", // Baseline exam comments
  studentEmail: "text", // Student email
  subject: "text", // Subject
  school: "text", // School
  
  academicPerformance: {
    overallGrade: "text", // Overall grade
    subjectGrades: [{
      subject: "text",
      grade: "text",
      score: "number"
    }],
    attendance: "number", // Attendance rate
    participation: "text", // Participation evaluation
    homework: "text" // Homework completion
  },
  reportStatus: "text", // draft, pending_review, approved, sent_to_parent
  _createdDate: "text",
  _updatedDate: "text"
}
```

## Administration

### CMS-5 :CMS Data Sync Log Collection
**Used on Pages**: System Management Page, Data Sync Monitoring  
**Code Call**: `wixData.query('DataSyncLogs')`

> Note: This collection has been established in Wix CMS, Collection ID is `DataSyncLogs`, can be used directly in code. 此集合主要用于记录Wix向Lark写入数据的日志，不包含Lark到Wix的数据流程。

**数据流程**：
- 当Wix系统向Lark发送数据时（如学生注册、课程分配、课程安排、学生报告等），会自动记录同步日志
- 每次数据同步操作都会创建一条新的日志记录，包含同步类型、方向、源系统、目标系统等信息
- 系统会记录请求数据、响应数据、同步状态以及任何错误信息
- 如果同步失败，系统会记录错误信息并可能尝试重新同步
- 日志记录还包括同步开始时间、结束时间和持续时间，用于性能监控和问题排查

**Data Flow**:
- When the Wix system sends data to Lark (such as student registrations, course assignments, course schedules, student reports, etc.), synchronization logs are automatically recorded
- Each data synchronization operation creates a new log entry, including sync type, direction, source system, target system, and other information
- The system records request data, response data, sync status, and any error messages
- If synchronization fails, the system records error information and may attempt to resynchronize
- Log entries also include sync start time, end time, and duration for performance monitoring and troubleshooting

```javascript
{
  _id: "text",
  logId: "text", // Log number
  syncType: "text", // student_registration, course_assignment, course_schedule, student_report
  direction: "text", // wix_to_lark（仅记录Wix到Lark的数据同步）
  sourceSystem: "text", // wix（源系统始终为Wix）
  targetSystem: "text", // lark（目标系统始终为Lark）
  recordId: "text", // Related record ID
  syncStatus: "text", // success, failed, pending, retrying
  requestData: "text", // Request data in JSON format
  responseData: "text", // Response data in JSON format
  errorMessage: "text", // Error message
  retryCount: "number", // Retry count
  syncStartTime: "text", // Sync start time
  syncEndTime: "text", // Sync end time
  duration: "number", // Sync duration (milliseconds)
  _createdDate: "text",
  _updatedDate: "text"
}
```

---

### CMS-6: Admins Collection
**Used on Pages**: Admin Dashboard, Session Management, Student Management  
**Code Call**: `wixData.query('Admins')`  
**Lark Integration**: Synchronized with admin data in Lark Base, report links and student counts from C01.Client Info

/* Data Flow Description:
 * 数据流程说明：
 * 1. 管理员信息首先保存在CMS-6（Admins集合）中。
 * 2. 当新学生注册并在Lark的ST0 Website Enrollment中创建记录后，系统会检查ST0 Student SCR中是否有相同clientId和Email的记录。
 * 3. 如果找到匹配记录，系统识别为同一学生，并将CMS中学生状态更新为pending。
 * 4. 然后系统会在Lark的C01.Client Info中更新相应管理员管理的学生数量。
 * 5. 最后，更新的学生数量会同步到CMS-6的managedStudents字段中。
 * 6. 报告链接和密码信息也从Lark的PRT Operation的C01.Client Info更新到CMS-6中。
 * 
 * Data Flow Description:
 * 1. Admin information is first saved in CMS-6 (Admins collection).
 * 2. When a new student registers and a record is created in ST0 Website Enrollment in Lark, the system checks if there is a record with the same clientId and Email in ST0 Student SCR.
 * 3. If a matching record is found, the system identifies it as the same student and updates the student status in CMS to pending.
 * 4. Then the system updates the number of students managed by the respective admin in C01.Client Info in Lark.
 * 5. Finally, the updated student count is synchronized to the managedStudents field in CMS-6.
 * 6. Report links and password information are also updated from C01.Client Info in Lark PRT Operation to CMS-6.
 */

```javascript
{
  _id: "text", // CMS6 - Wix native field
  userId: "text", // Related to Users collection
  adminId: "text", // Admin ID
  firstName: "text",
  lastName: "text",
  email: "text",
  phone: "text",
  department: "text", // Department
  position: "text", // Position
  permissions: ["text"], // Permission list - Already implemented in Wix
  status: "text", // active, inactive, on_leave
  lastLogin: "text", // Last login time
  managedStudents: "number", // Number of managed students
  joinDate: "text", // Join date
  
  // Report links and passwords - Updated from Lark PRT Operation C01.Client Info
  studentSessionReportUrl: "text", // Student Session Report URL
  studentSessionReportPassword: "text", // Default: StudentSession2024
  
  attendanceReportUrl: "text", // Attendance Report URL
  attendanceReportPassword: "text", // Default: Attendance2024
  
  safeguardingReportUrl: "text", // Safeguarding Report URL
  safeguardingReportPassword: "text", // Default: Safeguarding2024
  
  studentTermlyReportUrl: "text", // Student Termly Report URL
  studentTermlyReportPassword: "text", // Default: Termly2024
  
  behaviourReportUrl: "text", // Behaviour Report URL
  behaviourReportPassword: "text", // Default: Behaviour2024
  
  teacherSCRReportUrl: "text", // Teacher SCR Report URL
  teacherSCRReportPassword: "text", // Default: TeacherSCR2024
  
  
  _createdDate: "text",
  _updatedDate: "text"
}
```

---

## 🧑‍🎓 Student Management Collections

### CMS-7: Students Collection
**Used on Pages**: Student Management Page, Mentor Dashboard, Session Management, Admin Dashboard  
**Code Call**: `wixData.query('Students')`  
**Related CMS**: Related to CMS-1, CMS-2  
**Lark Integration**: Synchronized with student records in Lark Base  
**Description**: This collection merges the original Students and APStudents collections, distinguishing different types of students through studentType and isAP fields

/* Data Flow Description:
 * 数据流程说明：
 * 1. 新学生注册数据首先保存在CMS-1（StudentRegistrations集合）中。
 * 2. 注册数据同步到Lark的ST0 Website Enrollment。
 * 3. 系统检查Lark的ST0 Student SCR中是否有相同clientId和Email的记录。
 * 4. 如果找到匹配记录，系统将其识别为同一学生，并在CMS-7中创建或更新学生记录，状态设为pending。
 * 5. 学生数据从ST0 Student SCR同步到CMS-7，包括个人信息、学习信息和其他相关字段。
 * 6. 同步完成后，系统更新Lark的C01.Client Info中相应管理员的学生数量。
 * 7. 最后，更新的学生数量同步到CMS-6的managedStudents字段。
 * 
 * Data Flow Description:
 * 1. New student registration data is first saved in CMS-1 (StudentRegistrations collection).
 * 2. Registration data is synchronized to ST0 Website Enrollment in Lark.
 * 3. The system checks if there is a record with the same clientId and Email in ST0 Student SCR in Lark.
 * 4. If a matching record is found, the system identifies it as the same student and creates or updates a student record in CMS-7 with status set to pending.
 * 5. Student data is synchronized from ST0 Student SCR to CMS-7, including personal information, learning information, and other relevant fields.
 * 6. After synchronization, the system updates the number of students managed by the respective admin in C01.Client Info in Lark.
 * 7. Finally, the updated student count is synchronized to the managedStudents field in CMS-6.
 */

> Note: This collection has been established in Wix CMS, Collection ID is `Students`, can be used directly in code.

```javascript
{
  _id: "text",
  studentId: "text", // Student ID
  registrationId: "text", // Related to CMS-1 registration record
  firstName: "text",
  lastName: "text",
  email: "text",
  phone: "text",
  dateOfBirth: "text",
  enrollmentDate: "text", // Enrollment date
  status: "text", // active, inactive, graduated, suspended
  studentType: "text", // "alternative" (AP student) or "tutoring" (regular tutoring student) - compatible with old code, new code should use product field
  product: "text", // "Tutoring"(regular tutoring), "PRA - Core Subject", "PRA - All Subject", "PRA - All Subject + Therapy", "Purple Ruler Blueprint"
  grade: "text", // Grade
  school: "text", // School name
  guardianParentName: "text", // Parent/guardian name
  guardianEmail: "text", // Parent/guardian email
  guardianPhone: "text", // Parent/guardian phone
  emergencyContact: {
    name: "text",
    phone: "text",
    relationship: "text"
  },
  medicalInfo: "text", // Medical information
  specialNeeds: "text", // Special needs
  
  // Basic learning information
  subject: "text", // Single subject (regular student) or course category (AP student)
  subjects: ["text"], // List of study subjects
  
  // AP student specific fields
  curriculum: "text", // Course category: "Core Subjects", "Core Subjects + PSHE Careers + PE and Art", "All Subjects + Therapy", "Purple Ruler Blueprint"
  apCourses: ["text"], // AP course list
  apExamDates: [{
    subject: "text", // AP subject
    examDate: "text", // Exam date
    registrationDeadline: "text", // Registration deadline
    status: "text" // registered, pending, completed
  }],
  targetColleges: ["text"], // Target college list
  gpa: "number", // GPA score
  satScore: "number", // SAT score
  actScore: "number", // ACT score
  extracurriculars: ["text"], // Extracurricular activities
  counselorNotes: "text", // Counselor notes
  ehcpDocument: "text", // EHCP document URL
  
  // Management and statistics fields
  currentAdmin: "text", // Current admin ID
  totalSessions: "number", // Total number of sessions
  attendanceRate: "number", // Attendance rate
  averageGrade: "number", // Average grade
  isAP: "boolean", // Whether AP student (kept for compatibility)
  
  // Lark integration fields
   larkStudentId: "text", // Lark system student ID
   larkBaseRecordId: "text", // Record ID in Lark Base
   lastSyncWithLark: "text", // Last sync time with Lark
   syncStatus: "text", // synced, pending, failed
   larkSyncData: {
     lastPushDate: "text", // Last push time to Lark
     lastPullDate: "text", // Last pull time from Lark
     syncErrors: ["text"] // Sync error records
   },
  
  // System fields
   _createdDate: "text",
   _updatedDate: "text"
}
```

### CMS-8: StudentCommunication Collection
**Used on Pages**: Student Management Page  
**Code Call**: `wixData.query('StudentCommunication')`

```javascript
{
  _id: "text",
  communicationId: "text",
  studentId: "text", // Related to Students
  adminId: "text", // Related to Admins
  type: "text", // email, phone, meeting, note
  subject: "text", // Subject
  content: "text", // Content
  priority: "text", // low, normal, high, urgent
  status: "text", // sent, delivered, read, replied
  sentDate: "text", // Sent date
  responseDate: "text", // Response date
  attachments: ["text"], // Attachment URL list
  _createdDate: "text",
  _updatedDate: "text"
}
```

---
### CMS-9: PR-Statistics Collection
**Used on Pages**: Mentor Dashboard  
**Code Call**: `wixData.query('PR-Statistics')`
**Lark Integration**: Data synchronized from Lark's C01.Client Info via HTTP request

> **Note**: This collection has been established in Wix CMS with Collection ID `PR-Statistics` and can be used directly in code.

**Data Flow**:
- Statistics data is synchronized from Lark's C01.Client Info through HTTP requests
- When changes occur in Lark, the system automatically updates this collection
- The synchronization process ensures real-time statistics are available on the Mentor Dashboard

```javascript
{
  _id: "text",
  totalStudents: "number", // Total number of students
  activeStudents: "number", // Number of active students
  securityAlerts: "number", // Number of security alerts
  pendingInvoices: "number", // Number of pending invoices
  totalSessions: "number", // Total number of sessions
  completedSessions: "number", // Number of completed sessions
  totalRevenue: "number", // Total revenue
  monthlyRevenue: "number", // Monthly revenue
  lastUpdated: "text", // Last update time
  _createdDate: "text",
  _updatedDate: "text"
}
```

### CMS-10: Tickets Collection
**Used on Pages**: Admin Dashboard, System Management  
**Code Call**: `wixData.query('Tickets')`
**Lark Integration**: Data synchronized from Lark's C01.Client Info via HTTP request
**UI Components**: Includes student dropdown menu for admin selection

**Data Flow**:

1. 当用户创建新工单时，系统首先将工单信息保存到CMS-10 Tickets Collection中。
2. 保存后，系统会通过后端API将工单的关键信息（包括client_id、name、Email等）同步到Lark的PRT-UI的T01.Ticket System表格中。
3. 同步过程通过`backend_larkIntegration.jsw`中的`syncTicketToLark`函数实现。
4. 同步完成后，系统会更新CMS-10中工单的`larkSyncStatus`和`larkSyncTime`字段，记录同步状态和时间。
5. 当工单状态发生变化时（如解决、关闭等），系统会再次触发同步，确保Lark中的数据与CMS保持一致。

1. When a user creates a new ticket, the system first saves the ticket information to CMS-10 Tickets Collection.
2. After saving, the system synchronizes key ticket information (including client_id, name, Email, etc.) to Lark's PRT-UI T01.Ticket System table through the backend API.
3. The synchronization is implemented through the `syncTicketToLark` function in `backend_larkIntegration.jsw`.
4. After synchronization, the system updates the `larkSyncStatus` and `larkSyncTime` fields in CMS-10 to record the synchronization status and time.
5. When the ticket status changes (such as resolved, closed, etc.), the system triggers synchronization again to ensure that the data in Lark remains consistent with the CMS.

```javascript
{
  _id: "text",
  ticketId: "text", // Ticket number
  title: "text", // Ticket title
  description: "text", // Problem description
  category: "text", // technical, billing, general, feature_request
  priority: "text", // low, normal, high, urgent
  status: "text", // open, in_progress, resolved, closed
  submittedBy: "text", // Submitter ID
  assignedTo: "text", // Assigned to (Admin ID)
  client_id: "text", // Client ID for Lark synchronization
  name: "text", // Client name
  email: "text", // Client email
  submittedDate: "text", // Submission time
  resolvedDate: "text", // Resolution time
  resolution: "text", // Solution
  attachments: ["text"], // Attachment URL list
  comments: [{
    commentId: "text",
    userId: "text",
    comment: "text",
    timestamp: "text"
  }],
  larkSyncStatus: "text", // Synchronization status with Lark
  larkSyncTime: "text", // Last synchronization time with Lark
  _createdDate: "text",
  _updatedDate: "text"
}
```

## Data Flow Diagram

The following diagram illustrates the data flow between Wix CMS collections and Lark Base:

```
+---------------------+    +----------------------+    +----------------------+
|                     |    |                      |    |                      |
|  CMS-1: Student     |<-->|  Lark: ST0 Website   |<-->|  CMS-7: Students     |
|  Registration       |    |  Enrollment          |    |  Collection          |
|                     |    |                      |    |                      |
+---------------------+    +----------------------+    +----------------------+
         |                           |                          |
         |                           v                          |
         |                  +----------------------+            |
         |                  |                      |            |
         |                  |  Lark: ST0 Student   |------------+
         |                  |  SCR                 |
         |                  |                      |
         |                  +----------------------+
         |                           |
         |                           v
+---------------------+    +----------------------+    +----------------------+
|                     |    |                      |    |                      |
|  CMS-6: Admins      |<-->|  Lark: C01.Client    |<-->|  CMS-9: PR-Statistics|
|  Collection         |    |  Info                |    |  Collection          |
|                     |    |                      |    |                      |
+---------------------+    +----------------------+    +----------------------+
                                     ^                          ^
                                     |                          |
+---------------------+    +----------------------+    +----------------------+
|                     |    |                      |    |                      |
|  CMS-2: Student     |<-->|  Lark: PRT Operation |<-->|  CMS-4: Student      |
|  Course Assignment  |    |  ST1 & R2            |    |  Report Collection   |
|                     |    |                      |    |                      |
+---------------------+    +----------------------+    +----------------------+
                                     ^                          
                                     |                          
+---------------------+    +----------------------+    +----------------------+
|                     |    |                      |    |                      |
|  CMS-3: Course      |<-->|  Lark: PRT Logistic  |<-->|  CMS-10: Tickets     |
|  Information        |    |  C4                  |    |  Collection          |
|                     |    |                      |    |                      |
+---------------------+    +----------------------+    +----------------------+
                                                                ^
                                                                |
                                                      +----------------------+
                                                      |                      |
                                                      |  Lark: PRT-UI        |
                                                      |  T01.Ticket System   |
                                                      |                      |
                                                      +----------------------+
```

### Data Flow Description

#### English Description

The system's data flow follows these key patterns:

1. **Student Registration Flow**:
   - Student data enters through CMS-1 (Registration)
   - Syncs to Lark's ST0 Website Enrollment
   - Processed in ST0 Student SCR
   - Creates/updates records in CMS-7 (Students)

2. **Course Management Flow**:
   - Course data from Lark's PRT Logistic C4 syncs to CMS-3
   - Student course assignments from Lark's ST1 sync to CMS-2

3. **Reporting Flow**:
   - Student reports from Lark's R2 sync to CMS-4
   - Statistics from C01.Client Info sync to CMS-9

4. **Admin Management Flow**:
   - Admin data in CMS-6 receives student counts from C01.Client Info
   - Admin report links sync from Lark to CMS-6

5. **Support Ticket Flow**:
   - Tickets in CMS-10 sync with Lark's T01.Ticket System
   - Bidirectional updates maintain consistency

#### 中文描述

系统的数据流遵循以下关键模式：

1. **学生注册流程**：
   - 学生数据通过CMS-1（注册）输入
   - 同步到Lark的ST0 Website Enrollment
   - 在ST0 Student SCR中处理
   - 在CMS-7（学生）中创建/更新记录

2. **课程管理流程**：
   - 来自Lark的PRT Logistic C4的课程数据同步到CMS-3
   - 来自Lark的ST1的学生课程分配同步到CMS-2

3. **报告流程**：
   - 来自Lark的R2的学生报告同步到CMS-4
   - 来自C01.Client Info的统计数据同步到CMS-9

4. **管理员管理流程**：
   - CMS-6中的管理员数据从C01.Client Info接收学生数量
   - 管理员报告链接从Lark同步到CMS-6

5. **支持工单流程**：
   - CMS-10中的工单与Lark的T01.Ticket System同步
   - 双向更新保持一致性