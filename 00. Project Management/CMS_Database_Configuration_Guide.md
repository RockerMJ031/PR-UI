# CMS 数据库配置指南

> **文档版本**: 3.0  
> **最后更新**: 2025年7月21日  
> **维护者**: 系统管理员  
> **架构设计**: 基于四个核心CMS系统  
> **一致性检查**: 已完成 ✅  
> **实施状态**: 运行中 🚀

本文档详细说明了导师管理系统所需的数据库集合配置，基于四个CMS架构方案进行了设计和优化。

## 📋 目录

- [新架构概述](#新架构概述)
- [新架构CMS集合](#新架构cms集合)
- [核心用户集合](#核心用户集合)
- [学生管理集合](#学生管理集合)
- [课程会话集合](#课程会话集合)
- [财务管理集合](#财务管理集合)
- [报表系统集合](#报表系统集合)
- [系统管理集合](#系统管理集合)
- [权限配置](#权限配置)
- [索引优化](#索引优化)
- [使用说明](#使用说明)
- [注意事项](#注意事项)
- [代码一致性检查结果](#代码一致性检查结果)
- [架构优势](#架构优势)

---

## 🏗️ 新架构概述

### 四个核心CMS系统

1. **学生注册信息CMS (CMS-1)** - 处理学生初始注册，作为Wix到Lark的数据缓冲
2. **学生/ClassID与Wix_ID对应CMS (CMS-2)** - 管理学生课程分配和在线教室链接
3. **课程信息CMS (CMS-3)** - 管理课程安排和状态
4. **学生报告CMS (CMS-4)** - 处理课程报告和学习记录

### 数据流架构

```
学生注册 → CMS-1 (Wix) → HTTP请求 → Lark Base
                ↓
            CMS-2 (学生课程管理)
                ↓
            CMS-3 (课程安排)
                ↓
Lark Base → HTTP推送 → CMS-4 (学生报告)
```

---

## 📊 新架构CMS集合

### CMS-1: 学生注册信息集合
**使用页面**: 学生注册页面、管理员审核页面  
**代码调用**: `wixData.query('StudentRegistrations')`  
**注释**: 已经在Wix中建立CMS，collection ID为 `StudentRegistrations`

```javascript
{
  _id: "string", // 自动生成
  registrationId: "string", // 注册编号
  firstName: "string", // 名字
  lastName: "string", // 姓氏
  email: "string", // 邮箱地址
  phone: "string", // 电话号码
  dateOfBirth: "date", // 出生日期
  guardianParentName: "string", // 家长姓名
  guardianEmail: "string", // 家长邮箱
  guardianPhone: "string", // 家长电话
  product: "string", // "Tutoring"(普通辅导), "PRA - Core Subject", "PRA - All Subject", "PRA - All Subject + Therapy", "Purple Ruler Blueprint"
  subjects: ["string"], // 感兴趣的科目
  preferredSchedule: "string", // 偏好时间安排
  send: "text", // 特殊要求
  classId: "string", // 选择加入的课程组ID，从现有未来有课的group中选择
  registrationStatus: "string", // ending, approved, rejected, Activated
  ehcpDocument: "string", // EHCP文件附件URL
  larkTransferStatus: "string", // not_sent, sending, sent, confirmed, failed
  larkStudentId: "string", // Lark系统中的学生ID
  transferAttempts: "number", // 传输尝试次数
  lastTransferAttempt: "datetime", // 最后传输尝试时间
  transferError: "text", // 传输错误信息
  approvedBy: "string", // 审批人ID
  approvedDate: "datetime", // 审批时间
  notes: "text", // 备注
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### CMS-2: 学生课程分配集合
**使用页面**: 课程分配页面、学生管理页面  
**代码调用**: `wixData.query('Import74')`

```javascript
{
  _id: "string",
  no: "string", // 分配编号
  wix_id: "string", // Wix系统学生ID
  student_name: "string", // 学生姓名
  student_email: "string", // 学生邮箱
  role: "string", // 学生角色
  larkStudentId: "string", // Lark系统学生ID
  cleverId: "string", // Clever系统学生ID
  class_id: "string", // 班级ID
  courseId: "string", // 班级名称
  subject: "string", // 科目
  schoolName: "string", // 学校名称
  ls_link: "string", // 在线教室链接
  lark_link: "string", // Zoom会议ID
  larkPassword: "string", // Zoom密码
  status: "string", // Activated 或者 deactivated
  assignedDate: "datetime", // 分配日期
  startDate: "date", // 开始日期
  endDate: "date", // 结束日期
  assignedBy: "string", // 分配人ID
  lastSyncWithLark: "datetime", // 最后与Lark同步时间
  syncStatus: "string", // synced, pending, failed
  notes: "text", // 备注
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### CMS-3: 课程信息管理集合
**使用页面**: 课程管理页面、时间表管理  
**代码调用**: `wixData.query('Import86')`

> 注意：该集合已在Wix中建立，Collection ID为`Import86`，可在代码中直接使用。

```javascript
{
  _id: "string",
  scheduleId: "string", // 课程安排编号
  class_id: "string", // 班级ID
  courseId: "string", // 课程名称
  subject: "string", // 科目
  instructorName: "string", // 讲师姓名
  instructorId: "string", // 讲师ID
  scheduledDate: "date", // 这是用来做什么的
  startTime: "datetime", // 开始时间
  endTime: "datetime", // 结束时间
  duration: "number", // 课程时长（分钟）
  courseType: "string", // individual, group, workshop, assessment
  maxStudents: "number", // 最大学生数
  enrolledStudents: "number", // 已报名学生数
  status: "string", // scheduled, in_progress, completed, cancelled, rescheduled
  onlineClassroomLink: "string", // 在线教室链接
  courseMaterials: ["string"], // 课程材料链接
  agenda: "text", // 课程议程
  prerequisites: ["string"], // 先修要求
  c4No: "string", // Lark系统课程ID
  lastSyncWithLark: "datetime", // 最后与Lark同步时间
  syncStatus: "string", // synced, pending, failed
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### CMS-4: 学生报告集合
**使用页面**: 学生报告页面、家长门户  
**代码调用**: `wixData.query('StudentReports')`

> 注意：该集合已在Wix CMS中建立，Collection ID为`StudentReports`，可在代码中直接使用。

```javascript
{
  _id: "string",
  reportId: "string", // 报告编号
  wix_id: "string", // Wix学生ID
  student_name: "string", // 学生姓名
  student_email: "string", // 学生邮箱
  role: "string", // 学生角色
  larkStudentId: "string", // Lark学生ID
  classId: "string", // 班级ID
  courseId: "string", // 课程ID
  reportType: "string", // daily, weekly, monthly, assessment, final, session - session是一个每次课的报告
  
  // Lark Base 传递字段
  lessonTime: "datetime", // 课程时间
  status: "string", // 出勤状态：Attended或Missed
  quizStart: "text", // 课程开始的Quiz
  quizEnd: "text", // 课程结束的Quiz
  lessonContent: "text", // 课程内容
  studentNote: "text", // 写给学生的话，如果他们缺席的话
  internalNote: "text", // 写给学校的话，比如学校的老师可以帮助那些知识点
  behavior: "text", // 如果学生有不好的行为的话
  examType: "string", // 考试类型
  baselineComment: "text", // baseline exam的评语
  studentEmail: "string", // 学生邮箱
  subject: "string", // 科目
  school: "string", // 学校
  
  academicPerformance: {
    overallGrade: "string", // 总体成绩
    subjectGrades: [{
      subject: "string",
      grade: "string",
      score: "number"
    }],
    attendance: "number", // 出勤率
    participation: "string", // 参与度评价
    homework: "string" // 作业完成情况
  },
  reportStatus: "string", // draft, pending_review, approved, sent_to_parent
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### CMS数据同步日志集合 (CMS-5)
**使用页面**: 系统管理页面、数据同步监控  
**代码调用**: `wixData.query('DataSyncLogs')`

> 注意：该集合已在Wix CMS中建立，Collection ID为`DataSyncLogs`，可在代码中直接使用。 // This collection has been added to Wix CMS, Collection ID is `DataSyncLogs`, can be used directly in code.

```javascript
{
  _id: "string",
  logId: "string", // 日志编号
  syncType: "string", // student_registration, course_assignment, course_schedule, student_report
  direction: "string", // wix_to_lark, lark_to_wix
  sourceSystem: "string", // wix, lark
  targetSystem: "string", // wix, lark
  recordId: "string", // 相关记录ID
  syncStatus: "string", // success, failed, pending, retrying
  requestData: "text", // JSON格式的请求数据
  responseData: "text", // JSON格式的响应数据
  errorMessage: "text", // 错误信息
  retryCount: "number", // 重试次数
  syncStartTime: "datetime", // 同步开始时间
  syncEndTime: "datetime", // 同步结束时间
  duration: "number", // 同步耗时（毫秒）
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

---

## 👥 核心用户集合

### Users 集合 (CMS-6)
**使用页面**: 所有页面（用户认证和权限管理）  
**代码调用**: `wixData.query('Users')`

> 注意：该集合已在Wix CMS中建立，Collection ID为`Users`，可在代码中直接使用。 // This collection has been added to Wix CMS, Collection ID is `Users`, can be used directly in code.

```javascript
{
  _id: "string", // 自动生成
  firstName: "string", // 名字
  lastName: "string", // 姓氏
  email: "string", // 邮箱地址
  phone: "string", // 电话号码
  role: "string", // 角色: admin, student, parent, staff
  avatar: "string", // 头像URL
  preferences: {
    theme: "string", // light, dark
    language: "string", // en, zh, fr
    notifications: {
      email: "boolean",
      push: "boolean",
      sms: "boolean"
    },
    dashboard: {
      layout: "string", // default, compact, detailed
      widgets: ["string"] // 显示的小部件列表
    }
  },
  lastLogin: "datetime", // 最后登录时间
  isActive: "boolean", // 是否激活
  createdDate: "datetime", // 创建时间
  _createdDate: "datetime", // Wix自动字段
  _updatedDate: "datetime" // Wix自动字段
}
```

### Admins 集合 - CMS 5
**使用页面**: 管理员仪表盘、会话管理、学生管理  
**代码调用**: `wixData.query('Admins')`

```javascript
{
  _id: "string", // CMS5 - Wix原生自带字段
  userId: "string", // 关联Users集合
  adminId: "string", // 管理员编号
  firstName: "string",
  lastName: "string",
  email: "string",
  phone: "string",
  department: "string", // 所属部门
  position: "string", // 职位
  permissions: ["string"], // 权限列表 - 已在Wix中实现
  status: "string", // active, inactive, on_leave
  lastLogin: "datetime", // 最后登录时间
  managedStudents: "number", // 管理的学生数量
  joinDate: "date", // 入职日期
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

---

## 🧑‍🎓 学生管理集合

### Students 集合（统一版）(CMS-7)
**使用页面**: 学生管理页面、导师仪表盘、会话管理、管理员仪表盘  
**代码调用**: `wixData.query('Students')`  
**关联CMS**: 与CMS-1、CMS-2关联  
**Lark集成**: 与Lark Base中的学生记录同步  
**说明**: 此集合合并了原先的Students和APStudents集合，通过studentType和isAP字段区分不同类型的学生

> 注意：该集合已在Wix CMS中建立，Collection ID为`Students`，可在代码中直接使用。 // This collection has been added to Wix CMS, Collection ID is `Students`, can be used directly in code.

```javascript
{
  _id: "string",
  studentId: "string", // 学生编号
  registrationId: "string", // 关联CMS-1注册记录
  firstName: "string",
  lastName: "string",
  email: "string",
  phone: "string",
  dateOfBirth: "date",
  enrollmentDate: "date", // 入学日期
  status: "string", // active, inactive, graduated, suspended
  studentType: "string", // "alternative" (AP学生) 或 "tutoring" (普通辅导学生) - 兼容旧代码，新代码应使用product字段
  product: "string", // "Tutoring"(普通辅导), "PRA - Core Subject", "PRA - All Subject", "PRA - All Subject + Therapy", "Purple Ruler Blueprint"
  grade: "string", // 年级
  school: "string", // 学校名称
  guardianParentName: "string", // 家长姓名
  guardianEmail: "string", // 家长邮箱
  guardianPhone: "string", // 家长电话
  emergencyContact: {
    name: "string",
    phone: "string",
    relationship: "string"
  },
  medicalInfo: "text", // 医疗信息
  specialNeeds: "text", // 特殊需求
  
  // 基础学习信息
  subject: "string", // 单个科目（普通学生）或课程分类（AP学生）
  subjects: ["string"], // 学习科目列表
  
  // AP学生特有字段
  curriculum: "string", // 课程分类: "Core Subjects", "Core Subjects + PSHE Careers + PE and Art", "All Subjects + Therapy", "Purple Ruler Blueprint"
  apCourses: ["string"], // AP课程列表
  apExamDates: [{
    subject: "string", // AP科目
    examDate: "date", // 考试日期
    registrationDeadline: "date", // 报名截止日期
    status: "string" // registered, pending, completed
  }],
  targetColleges: ["string"], // 目标大学列表
  gpa: "number", // GPA成绩
  satScore: "number", // SAT分数
  actScore: "number", // ACT分数
  extracurriculars: ["string"], // 课外活动
  counselorNotes: "text", // 顾问备注
  ehcpDocument: "string", // EHCP文档URL
  
  // 管理和统计字段
  currentAdmin: "string", // 当前管理员ID
  totalSessions: "number", // 总课程数
  attendanceRate: "number", // 出勤率
  averageGrade: "number", // 平均成绩
  isAP: "boolean", // 是否AP学生（兼容性保留）
  
  // Lark集成字段
   larkStudentId: "string", // Lark系统学生ID
   larkBaseRecordId: "string", // Lark Base中的记录ID
   lastSyncWithLark: "datetime", // 最后与Lark同步时间
   syncStatus: "string", // synced, pending, failed
   larkSyncData: {
     lastPushDate: "datetime", // 最后推送到Lark的时间
     lastPullDate: "datetime", // 最后从Lark拉取的时间
     syncErrors: ["string"] // 同步错误记录
   },
  
  // 系统字段
   _createdDate: "datetime",
   _updatedDate: "datetime"
}
```

### Lark Base 集成说明
**目的**: 实现Wix与Lark Base的学生数据单一中心记录(Single Central Record)  
**同步方向**: 双向同步，优先从Lark Base推送到Wix  
**同步频率**: 自动（系统触发）和手动（管理员触发）

#### 同步实现方案
1. **Lark Base到Wix的推送**:
   - 通过Lark Base的自动化功能，在学生记录更新时触发推送
   - 使用Lark开放API将数据推送到Wix后端
   - Wix后端接收数据并更新Students集合

2. **Wix到Lark Base的同步**:
   - 在学生数据更新时，通过后端集成模块将变更推送到Lark Base
   - 使用`larkStudentId`和`larkBaseRecordId`作为关联键

3. **冲突处理**:
   - 时间戳比较：使用`lastSyncWithLark`与Lark Base记录的更新时间比较
   - 字段级别合并：对于不同来源更新的不同字段，进行智能合并
   - 冲突记录：在`larkSyncData.syncErrors`中记录同步冲突

4. **数据映射**:
   - Wix字段与Lark Base字段之间建立明确的映射关系
   - 特殊字段（如EHCP文档）通过URL引用方式处理

5. **安全考虑**:
   - 所有API调用使用安全令牌认证
   - 敏感数据传输采用加密方式
   - 同步操作记录完整日志

### StudentCommunication 集合
**使用页面**: 学生管理页面  
**代码调用**: `wixData.query('StudentCommunication')`

```javascript
{
  _id: "string",
  communicationId: "string",
  studentId: "string", // 关联Students
  adminId: "string", // 关联Admins
  type: "string", // email, phone, meeting, note
  subject: "string", // 主题
  content: "text", // 内容
  priority: "string", // low, normal, high, urgent
  status: "string", // sent, delivered, read, replied
  sentDate: "datetime", // 发送时间
  responseDate: "datetime", // 回复时间
  attachments: ["string"], // 附件URL列表
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

---

## 📚 课程会话集合

<!-- Sessions集合已被CMS-3（Import86）集合替代 -->


<!-- 暂时注释掉此功能，现在使用Lark Base链接
### ScheduledReports 集合
**使用页面**: 报表系统页面  
**代码调用**: `wixData.query('ScheduledReports')`

```javascript
{
  _id: "string",
  scheduleId: "string", // 计划编号
  reportId: "string", // 关联Reports
  name: "string", // 计划名称
  frequency: "string", // daily, weekly, monthly, quarterly
  dayOfWeek: "number", // 星期几（1-7）
  dayOfMonth: "number", // 月份中的第几天
  time: "string", // 执行时间 HH:MM
  timezone: "string", // 时区
  isActive: "boolean", // 是否激活
  lastRun: "datetime", // 最后运行时间
  nextRun: "datetime", // 下次运行时间
  recipients: ["string"], // 接收人列表
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

**注意**: 此功能已暂时移除，现在使用Lark Base链接进行报表管理。
-->

### PR-Statistics 集合 (CMS-8)
**使用页面**: 导师仪表盘  
**代码调用**: `wixData.query('PR-Statistics')`

> **注**: 此集合已在Wix CMS中建立，Collection ID为`PR-Statistics`，可在代码中直接使用。
> **Note**: This collection has been established in Wix CMS with Collection ID `PR-Statistics` and can be used directly in code.

```javascript
{
  _id: "string",
  totalStudents: "number", // 总学生数
  activeStudents: "number", // 活跃学生数
  securityAlerts: "number", // 安全警报数
  pendingInvoices: "number", // 待处理发票数
  totalSessions: "number", // 总课程数
  completedSessions: "number", // 已完成课程数
  totalRevenue: "number", // 总收入
  monthlyRevenue: "number", // 月收入
  lastUpdated: "datetime", // 最后更新时间
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### Tickets 集合
**使用页面**: 管理员仪表盘、系统管理  
**代码调用**: `wixData.query('Tickets')`

```javascript
{
  _id: "string",
  ticketId: "string", // 工单编号
  title: "string", // 工单标题
  description: "text", // 问题描述
  category: "string", // technical, billing, general, feature_request
  priority: "string", // low, normal, high, urgent
  status: "string", // open, in_progress, resolved, closed
  submittedBy: "string", // 提交人ID
  assignedTo: "string", // 分配给（管理员ID）
  submittedDate: "datetime", // 提交时间
  resolvedDate: "datetime", // 解决时间
  resolution: "text", // 解决方案
  attachments: ["string"], // 附件URL列表
  comments: [{
    commentId: "string",
    userId: "string",
    comment: "text",
    timestamp: "datetime"
  }],
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

---

## 🔐 权限配置

### 新架构CMS权限设置

基于四个核心CMS系统的权限配置：

#### CMS-1 (学生注册信息) 权限
- **系统管理员**: 完全访问权限
- **招生管理员**: 创建、读取、更新权限
- **普通管理员**: 读取权限
- **学生/家长**: 创建权限（仅自己的注册信息）

#### CMS-2 (学生课程分配) 权限
- **系统管理员**: 完全访问权限
- **课程管理员**: 创建、读取、更新权限
- **普通管理员**: 读取、更新权限（仅分配给自己的学生）
- **学生**: 读取权限（仅自己的分配信息）
- **家长**: 读取权限（仅孩子的分配信息）

#### CMS-3 (课程信息管理) 权限
- **系统管理员**: 完全访问权限
- **课程管理员**: 完全访问权限
- **普通管理员**: 读取、更新权限（仅自己的课程）
- **学生**: 读取权限（仅自己的课程）
- **家长**: 读取权限（仅孩子的课程）

#### CMS-4 (学生报告) 权限
- **系统管理员**: 完全访问权限
- **报告管理员**: 创建、读取、更新权限
- **普通管理员**: 创建、读取权限（仅自己学生的报告）
- **学生**: 读取权限（仅自己的报告）
- **家长**: 读取权限（仅孩子的报告）

#### 数据同步日志权限
- **系统管理员**: 完全访问权限
- **技术管理员**: 读取权限
- **其他角色**: 无权限

### 传统集合权限设置

每个集合需要设置适当的权限，确保数据安全：

#### 超级管理员权限 (Super Admin)
- **所有集合**: 完全访问权限（创建、读取、更新、删除）
- **系统配置**: 完全控制权限
- **用户管理**: 完全控制权限

#### 管理员权限 (Admin)
- **Students**: 读取、更新（仅分配给自己的学生）
- **Sessions**: 完全访问权限（仅自己的课程）
- **SessionAttendance**: 完全访问权限（仅自己的课程）
- **SessionMaterials**: 完全访问权限（仅自己的课程）
- **SessionFeedback**: 读取权限
- **Courses**: 读取、更新（仅自己的课程）
- **Payments**: 读取权限（仅相关学生）
- **Reports**: 读取权限（仅相关数据）
- **新CMS集合**: 根据上述CMS权限设置

#### 学生权限 (Student)
- **Sessions**: 读取权限（仅自己的课程）
- **SessionMaterials**: 读取权限（仅自己的课程）
- **SessionFeedback**: 创建、读取权限（仅自己的反馈）
- **StudentProgress**: 读取权限（仅自己的进度）
- **Payments**: 读取权限（仅自己的支付记录）
- **Invoices**: 读取权限（仅自己的发票）
- **StudentReports**: 读取权限（仅自己的报告）
- **StudentCourseAssignments**: 读取权限（仅自己的分配）

#### 家长权限 (Parent)
- **Students**: 读取权限（仅自己的孩子）
- **Sessions**: 读取权限（仅孩子的课程）
- **StudentProgress**: 读取权限（仅孩子的进度）
- **Payments**: 读取权限（仅相关支付）
- **Invoices**: 读取权限（仅相关发票）
- **StudentReports**: 读取权限（仅孩子的报告）
- **StudentCourseAssignments**: 读取权限（仅孩子的分配）

---

## 🔍 索引优化

为了提高查询性能，建议为以下字段创建索引：

### 新架构CMS集合索引

#### StudentRegistrations 集合 (CMS-1)
- `registrationId` (唯一索引)
- `email` (唯一索引)
- `registrationStatus`
- `larkTransferStatus`
- `classId`
- `_createdDate`
- 复合索引: `registrationStatus + larkTransferStatus`
- 复合索引: `email + registrationStatus`
- 复合索引: `classId + registrationStatus`

#### StudentCourseAssignments 集合 (CMS-2)
- `assignmentId` (唯一索引)
- `wix_id`
- `student_name`
- `student_email`
- `larkStudentId`
- `classId`
- `assignmentStatus`
- `syncStatus`
- 复合索引: `wix_id + assignmentStatus`
- 复合索引: `classId + assignmentStatus`
- 复合索引: `larkStudentId + syncStatus`

#### CourseSchedules 集合 (CMS-3)
- `scheduleId` (唯一索引)
- `classId`
- `instructorId`
- `scheduledDate`
- `courseStatus`
- `syncStatus`
- 复合索引: `instructorId + scheduledDate`
- 复合索引: `classId + courseStatus`
- 复合索引: `scheduledDate + courseStatus`

#### StudentReports 集合 (CMS-4)
- `reportId` (唯一索引)
- `wix_id`
- `student_name`
- `student_email`
- `larkStudentId`
- `classId`
- `reportStatus`
- `generatedDate`
- 复合索引: `wix_id + reportStatus`
- 复合索引: `classId + generatedDate`
- 复合索引: `larkStudentId + reportStatus`

#### DataSyncLogs 集合
- `logId` (唯一索引)
- `syncType`
- `syncStatus`
- `sourceSystem`
- `syncStartTime`
- 复合索引: `syncType + syncStatus`
- 复合索引: `syncStartTime + syncStatus`
- 复合索引: `sourceSystem + syncType`

### 传统集合索引优化

#### Students 集合
- `studentId` (唯一索引)
- `registrationId` (外键索引)
- `email` (唯一索引)
- `status`
- `currentAdmin`
- `enrollmentDate`
- `larkStudentId`
- `syncStatus`
- 复合索引: `currentAdmin + status`
- 复合索引: `larkStudentId + syncStatus`

#### Sessions 集合
- `sessionId` (唯一索引)
- `adminId`
- `studentId`
- `scheduledDate`
- `status`
- 复合索引: `adminId + scheduledDate`
- 复合索引: `studentId + scheduledDate`

#### Courses 集合
- `courseId` (唯一索引)
- `scheduleId` (外键索引)
- `larkCourseId`
- `adminId`
- `status`
- `syncStatus`
- 复合索引: `adminId + status`
- 复合索引: `larkCourseId + syncStatus`

#### Payments 集合
- `paymentId` (唯一索引)
- `studentId`
- `paymentDate`
- `status`
- 复合索引: `studentId + paymentDate`

#### Activities 集合
- `userId`
- `timestamp`
- `module`
- 复合索引: `userId + timestamp`

#### Notifications 集合
- `userId`
- `isRead`
- `createdDate`
- 复合索引: `userId + isRead`

---

## 📝 使用说明

### 新架构CMS实施步骤

<!-- 暂时注释掉此功能，现在报告直接从Lark Base中生成
#### 第一阶段：创建CMS-1（学生注册信息）
1. **创建StudentRegistrations集合**
   - 在Wix编辑器中创建集合
   - 设置所有必需字段和数据类型
   - 配置权限（学生/家长可创建，管理员可管理）
   - 创建索引以优化查询性能

2. **实现注册表单**
   - 创建学生注册页面
   - 实现文件上传功能（使用Wix Media Manager）
   - 添加表单验证和错误处理
   - **实现课程组选择功能**：
     - 从CourseSchedules集合中查询未来有课的group
     - 动态生成classId下拉选择框
     - 显示课程名称、开始时间和可用名额信息

3. **配置Wix到Lark的HTTP传输**
   - 实现HTTP请求函数
   - 处理文件附件传输（URL或base64编码）
   - 添加重试机制和错误日志
   - **处理classId同步**：
     - 将classId作为关键字段传输到Lark
     - 确保Lark系统能正确识别和处理课程组信息
     - 实现注册与课程自动关联机制

#### 第二阶段：优化CMS-2（学生课程分配）
1. **更新StudentCourseAssignments集合**
   - 添加Lark同步相关字段
   - 实现安全的在线教室链接管理
   - 配置基于会话的临时链接生成

2. **实现安全机制**
   - 添加session管理
   - 实现token验证
   - 设置链接过期时间
-->

#### 第三阶段：集成CMS-3（课程信息管理）
1. **创建CourseSchedules集合**
   - 复用现有Courses集合结构
   - 添加Lark同步字段
   - 实现时区处理

2. **实现双向同步**
   - Wix到Lark的课程信息同步
   - Lark到Wix的状态更新同步

#### 第四阶段：部署CMS-4（学生报告）
1. **创建StudentReports集合**
   - 设置复杂的报告数据结构
   - 配置家长访问权限
   - 实现报告生成和审批流程

2. **实现Lark到Wix数据推送**
   - 配置webhook接收端点
   - 实现数据验证和处理
   - 添加家长通知机制

### 传统集合配置步骤

1. **创建集合**: 在Wix编辑器中，按照上述结构创建所有数据库集合
2. **设置字段**: 为每个集合添加相应的字段，注意数据类型
3. **配置权限**: 根据权限配置部分设置每个集合的访问权限
4. **创建索引**: 为高频查询字段创建索引以提高性能
5. **测试连接**: 在代码中测试数据库连接和基本CRUD操作
6. **数据迁移**: 如有现有数据，制定迁移计划

### 数据同步监控

1. **创建DataSyncLogs集合**
2. **实现同步状态监控**
3. **设置自动重试机制**
4. **配置错误告警**

---

## ⚠️ 注意事项

### 新架构特别注意事项

#### 数据一致性
- 实现事务性操作确保数据一致性
- 设置数据校验规则防止不一致
- 定期执行数据一致性检查

#### 文件附件处理
- 优先使用Wix Media Manager存储文件
- 对于小文件（<1MB）可使用base64编码传输
- 大文件通过URL引用传递给Lark
- 设置文件大小和类型限制

#### API限制和性能
- 实现请求队列避免API限制
- 使用批处理减少API调用次数
- 设置合理的重试间隔
- 监控API使用量和响应时间

#### 安全性考虑
- 在线教室链接使用临时token
- 实现session管理和过期机制
- 敏感数据加密存储
- 定期轮换API密钥

### 通用注意事项

- 所有日期时间字段使用ISO 8601格式
- JSON字段存储为文本类型，在代码中进行解析
- 文件上传使用Wix Media Manager，存储URL引用
- 定期备份数据库
- 监控查询性能，必要时优化索引
- 遵循数据保护法规（如GDPR）
- 实现错误处理和日志记录
- 设置数据保留策略
- 定期进行安全审计

---

## 🔄 代码一致性检查结果

### 已验证的集合使用情况

经过对所有代码文件的检查，以下是各个模块中实际使用的数据库集合：

#### 01. 管理员仪表盘 (Admin Dashboard)
- ✅ `Statistics` - 统计数据
- ✅ `Courses` - 课程信息
- ✅ `Students` - 学生信息
- ✅ `PricingPlans` - 定价计划

#### 02. 财务管理 (Finance)
- ✅ `Payments` - 支付记录
- ✅ `Invoices` - 发票管理
- ✅ `Expenses` - 支出记录
- ✅ `FinancialReports` - 财务报表

#### 03. 学生管理 (Students)
- ✅ `Students` - 学生基本信息
- ✅ `Courses` - 课程信息
- ✅ `Admins` - 管理员信息
- ✅ `StudentProgress` - 学生进度
- ✅ `StudentCommunication` - 学生沟通记录

#### 04. 会话管理 (Sessions)
- ✅ `Sessions` - 会话记录
- ✅ `Students` - 学生信息
- ✅ `Admins` - 管理员信息
- ✅ `Subjects` - 科目信息
- ✅ `SessionAttendance` - 出勤记录

#### 05. 报表系统 (Reports)
- ✅ `Reports` - 报表配置
- ✅ `ScheduledReports` - 定时报表（已修正命名）
- ✅ `Students` - 学生数据
- ✅ `Sessions` - 会话数据
- ✅ `SessionAttendance` - 出勤数据
- ✅ `Invoices` - 发票数据
- ✅ `Payments` - 支付数据

#### 06. 主仪表盘 (Index)
- ✅ `SystemStats` - 系统统计
- ✅ `Students` - 学生信息
- ✅ `Admins` - 管理员信息
- ✅ `Sessions` - 会话信息
- ✅ `Invoices` - 发票信息
- ✅ `SessionAttendance` - 出勤信息
- ✅ `Activities` - 活动记录
- ✅ `Notifications` - 通知管理
- ✅ `Users` - 用户信息

#### 特殊集合
- ✅ `APStudents` - AP学生专用（已添加到配置）

### UI分类展示建议

基于用户反馈，建议在学生管理界面采用分类展示：

#### 学生管理页面布局
```
学生管理
├── 普通学生 (Students)
│   ├── 学生列表
│   ├── 添加学生
│   └── 学生详情
└── AP学生 (APStudents)
    ├── AP学生列表
    ├── 添加AP学生
    ├── AP考试管理
    ├── 升学指导
    └── AP学生详情
```

#### 实现方式
1. **标签页分离**: 使用Tab组件分别显示普通学生和AP学生
2. **独立路由**: 为两种学生类型设置不同的页面路径
3. **统一搜索**: 提供跨类型的全局学生搜索功能
4. **数据统计**: 分别统计两种学生类型的数量和状态

### 命名一致性修正

在检查过程中发现并修正了以下命名不一致问题：

1. **ReportSchedules → ScheduledReports**
   - 原配置: `ReportSchedules`
   - 代码中实际使用: `ScheduledReports`
   - ✅ 已修正为 `ScheduledReports`

2. **新增APStudents集合**
   - 代码中使用但配置中缺失: `APStudents`
   - ✅ 已添加到配置文档

### 集合使用频率统计

| 集合名称 | 使用文件数 | 主要功能 |
|---------|-----------|----------|
| Students | 6 | 学生信息管理 |
| Sessions | 4 | 会话管理 |
| Admins | 3 | 管理员信息 |
| Courses | 3 | 课程管理 |
| Reports | 2 | 报表生成 |
| Invoices | 3 | 发票管理 |
| Payments | 2 | 支付处理 |
| Statistics | 2 | 统计数据 |
| SystemStats | 1 | 系统统计 |
| Activities | 1 | 活动记录 |
| Notifications | 1 | 通知管理 |
| 其他集合 | 1-2 | 专用功能 |

### 权限一致性验证

所有集合的权限配置已根据实际使用情况进行了验证和调整：

- ✅ 管理员权限：所有集合完全访问
- ✅ 管理员权限：相关集合的适当访问权限
- ✅ 学生权限：仅自己相关数据的读取权限
- ✅ 家长权限：仅孩子相关数据的读取权限

### 索引优化建议

基于代码中的查询模式，已为以下高频查询字段建议了索引：

- ✅ 主键字段（所有集合）
- ✅ 外键关联字段
- ✅ 状态字段
- ✅ 日期时间字段
- ✅ 复合查询字段

### 验证状态

🟢 **完全一致**: 所有集合名称和调用方式已验证一致  
🟢 **权限配置**: 已根据实际使用场景配置  
🟢 **字段定义**: 已包含代码中使用的所有字段  
🟢 **索引优化**: 已根据查询模式优化  

---

## 🚀 架构优势

### 新CMS架构带来的改进

1. **数据健壮性提升**
   - Wix作为数据缓冲，减少直接API调用失败风险
   - 多层数据验证确保数据质量
   - 完整的错误处理和重试机制

2. **系统解耦**
   - 清晰的数据流向，避免循环依赖
   - 独立的CMS模块，便于维护和扩展
   - 灵活的同步策略

3. **安全性增强**
   - 基于会话的临时链接管理
   - 分层权限控制
   - 敏感数据加密存储

4. **可扩展性**
   - 模块化设计便于功能扩展
   - 标准化的数据接口
   - 支持未来业务需求变化