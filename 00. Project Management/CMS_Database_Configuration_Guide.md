# CMS Database Configuration Guide

> **Document Version**: 3.0  
> **Last Updated**: July 21, 2025  
> **Maintainer**: System Administrator  
> **Architecture Design**: Based on four core CMS systems  
> **Consistency Check**: Completed ✅  
> **Implementation Status**: Running 🚀

This document details the database collection configuration required for the tutor management system, designed and optimized based on a four-CMS architecture approach.

## 📋 Table of Contents




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
   *    将学生数据转换为Lark格式并发送到Lark Base。
   * 4. 同步状态和结果会更新到CMS-1的larkTransferStatus和相关字段中。
   * 5. 同步日志记录在LarkSyncLogs集合中，用于追踪和调试。
   * 6. 在Lark Base中，会创建一条记录，跟踪数据是从哪个CMS ID同步过来的，
   *    记录同步成功和失败的情况。
   * 
   * Data Flow Description:
   * 1. When adding/editing student information in the Student Registration Page or Admin Dashboard,
   *    data is first saved to CMS-1 (StudentRegistrations collection).
   * 2. After successful saving, the system directly synchronizes to Lark Base.
   * 3. The system calls the syncStudentFromWixToLark function in backend_larkBaseSync.jsw,
   *    converts student data to Lark format and sends it to Lark Base.
   * 4. Synchronization status and results are updated to larkTransferStatus and related fields in CMS-1.
   * 5. Synchronization logs are recorded in the LarkSyncLogs collection for tracking and debugging.
   * 6. In Lark Base, a record is created that tracks which CMS ID the data was synchronized from,
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

### CMS-3: Course Information Management Collection
**Used on Pages**: Course Management Page, Schedule Management  
**Code Call**: `wixData.query('Import86')`

> Note: This collection has been established in Wix, Collection ID is `Import86`, can be used directly in code.

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

### CMS-4: Student Report Collection
**Used on Pages**: Student Report Page, Parent Portal  
**Code Call**: `wixData.query('StudentReports')`

> Note: This collection has been established in Wix CMS, Collection ID is `StudentReports`, can be used directly in code.

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

### CMS-5 :CMS Data Sync Log Collection
**Used on Pages**: System Management Page, Data Sync Monitoring  
**Code Call**: `wixData.query('DataSyncLogs')`

> Note: This collection has been established in Wix CMS, Collection ID is `DataSyncLogs`, can be used directly in code.

```javascript
{
  _id: "text",
  logId: "text", // Log number
  syncType: "text", // student_registration, course_assignment, course_schedule, student_report
  direction: "text", // wix_to_lark, lark_to_wix
  sourceSystem: "text", // wix, lark
  targetSystem: "text", // wix, lark
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

### CMS-6: Users Collection
**Used on Pages**: All pages (User Authentication and Permission Management)  
**Code Call**: `wixData.query('Users')`

> Note: This collection has been established in Wix CMS, Collection ID is `Users`, can be used directly in code.

```javascript
{
  _id: "text", // Auto-generated
  firstName: "text", // First name
  lastName: "text", // Last name
  email: "text", // Email address
  phone: "text", // Phone number
  role: "text", // Role: admin, student, parent, staff
  avatar: "text", // Avatar URL
  preferences: {
    theme: "text", // light, dark
    language: "text", // en, zh, fr
    notifications: {
      email: "boolean",
      push: "boolean",
      sms: "boolean"
    },
    dashboard: {
      layout: "text", // default, compact, detailed
      widgets: ["text"] // List of displayed widgets
    }
  },
  lastLogin: "text", // Last login time
  isActive: "boolean", // Whether activated
  createdDate: "text", // Creation time
  _createdDate: "text", // Wix automatic field
  _updatedDate: "text" // Wix automatic field
}
```

### CMS-7: Admins Collection
**Used on Pages**: Admin Dashboard, Session Management, Student Management  
**Code Call**: `wixData.query('Admins')`

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
  _createdDate: "text",
  _updatedDate: "text"
}
```

---

## 🧑‍🎓 Student Management Collections

### CMS-8: Students Collection (Unified Version)
**Used on Pages**: Student Management Page, Mentor Dashboard, Session Management, Admin Dashboard  
**Code Call**: `wixData.query('Students')`  
**Related CMS**: Related to CMS-1, CMS-2  
**Lark Integration**: Synchronized with student records in Lark Base  
**Description**: This collection merges the original Students and APStudents collections, distinguishing different types of students through studentType and isAP fields

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

### CMS-9: StudentCommunication Collection
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
### CMS-10: PR-Statistics Collection
**Used on Pages**: Mentor Dashboard  
**Code Call**: `wixData.query('PR-Statistics')`

> **Note**: This collection has been established in Wix CMS with Collection ID `PR-Statistics` and can be used directly in code.

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

### CMS-11: Tickets Collection
**Used on Pages**: Admin Dashboard, System Management  
**Code Call**: `wixData.query('Tickets')`

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
  _createdDate: "text",
  _updatedDate: "text"
}
```