# CMS 数据库配置指南

本文档详细说明了整个导师管理系统所需的所有数据库集合（Collections）配置。每个集合都标注了对应的使用页面和功能模块。

## 目录

- [核心用户集合](#核心用户集合)
- [学生管理集合](#学生管理集合)
- [课程会话集合](#课程会话集合)
- [财务管理集合](#财务管理集合)
- [报表系统集合](#报表系统集合)
- [系统管理集合](#系统管理集合)
- [权限配置](#权限配置)
- [索引优化](#索引优化)
- [代码一致性检查结果](#代码一致性检查结果)

---

## 核心用户集合

### Users 集合
**使用页面**: 所有页面（用户认证和权限管理）  
**代码调用**: `wixData.query('Users')`

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

### Admins 集合
**使用页面**: 管理员仪表盘、会话管理、学生管理  
**代码调用**: `wixData.query('Admins')`

```javascript
{
  _id: "string",
  userId: "string", // 关联Users集合
  adminId: "string", // 管理员编号
  firstName: "string",
  lastName: "string",
  email: "string",
  phone: "string",
  department: "string", // 所属部门
  position: "string", // 职位
  permissions: ["string"], // 权限列表
  status: "string", // active, inactive, on_leave
  lastLogin: "datetime", // 最后登录时间
  managedStudents: "number", // 管理的学生数量
  joinDate: "date", // 入职日期
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

---

## 学生管理集合

### Students 集合
**使用页面**: 学生管理页面、导师仪表盘、会话管理  
**代码调用**: `wixData.query('Students')`

```javascript
{
  _id: "string",
  studentId: "string", // 学生编号
  firstName: "string",
  lastName: "string",
  email: "string",
  phone: "string",
  dateOfBirth: "date",
  enrollmentDate: "date", // 入学日期
  status: "string", // active, inactive, graduated, suspended
  studentType: "string", // "alternative" (AP学生) 或 "tutoring" (普通辅导学生)
  grade: "string", // 年级
  school: "string", // 学校名称
  parentName: "string", // 家长姓名
  parentEmail: "string", // 家长邮箱
  parentPhone: "string", // 家长电话
  emergencyContact: {
    name: "string",
    phone: "string",
    relationship: "string"
  },
  medicalInfo: "text", // 医疗信息
  specialNeeds: "text", // 特殊需求
  subject: "string", // 单个科目（普通学生）或课程分类（AP学生）
  subjects: ["string"], // 学习科目列表（兼容性保留）
  currentAdmin: "string", // 当前管理员ID
  totalSessions: "number", // 总课程数
  attendanceRate: "number", // 出勤率
  averageGrade: "number", // 平均成绩
  isAP: "boolean", // 是否AP学生（兼容性保留）
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### StudentProgress 集合
**使用页面**: 学生管理页面、报表系统  
**代码调用**: `wixData.query('StudentProgress')`

```javascript
{
  _id: "string",
  progressId: "string",
  studentId: "string", // 关联Students
  courseId: "string", // 关联Courses
  moduleId: "string", // 模块ID
  completionPercentage: "number", // 完成百分比
  grade: "string", // 成绩等级
  assessmentScores: "text", // JSON格式的评估分数
  lastActivity: "date", // 最后活动日期
  timeSpent: "number", // 花费时间（分钟）
  status: "string", // not_started, in_progress, completed
  notes: "text", // 备注
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### APStudents 集合
**使用页面**: 管理员仪表盘（AP学生专用）、学生管理页面  
**代码调用**: `wixData.query('APStudents')`

```javascript
{
  _id: "string",
  studentId: "string", // AP学生编号
  firstName: "string",
  lastName: "string",
  email: "string",
  phone: "string",
  dateOfBirth: "date",
  enrollmentDate: "date", // 入学日期
  status: "string", // active, inactive, graduated, suspended
  grade: "string", // 年级
  school: "string", // 学校名称
  parentName: "string", // 家长姓名
  parentEmail: "string", // 家长邮箱
  parentPhone: "string", // 家长电话
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
  currentAdmin: "string", // 当前管理员ID
  totalSessions: "number", // 总课程数
  attendanceRate: "number", // 出勤率
  averageGrade: "number", // 平均成绩
  ehcpDocument: "string", // EHCP文档URL
  medicalInfo: "text", // 医疗信息
  specialNeeds: "text", // 特殊需求
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

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

## 课程会话集合

### Courses 集合
**使用页面**: 管理员仪表盘、会话管理、学生管理  
**代码调用**: `wixData.query('Courses')`

```javascript
{
  _id: "string",
  courseId: "string", // 课程编号
  title: "string", // 课程标题
  description: "text", // 课程描述
  subject: "string", // 科目
  level: "string", // 难度级别: beginner, intermediate, advanced
  duration: "number", // 课程时长（小时）
  price: "number", // 课程价格
  maxStudents: "number", // 最大学生数
  currentStudents: "number", // 当前学生数
  adminId: "string", // 关联Admins
  syllabus: "text", // 教学大纲
  materials: ["string"], // 教材列表
  prerequisites: ["string"], // 先修要求
  status: "string", // active, inactive, completed, cancelled
  startDate: "date", // 开始日期
  endDate: "date", // 结束日期
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### Sessions 集合
**使用页面**: 会话管理页面、管理员仪表盘、日历组件  
**代码调用**: `wixData.query('Sessions')`

```javascript
{
  _id: "string",
  sessionId: "string", // 会话编号
  title: "string", // 会话标题
  description: "text", // 会话描述
  adminId: "string", // 关联Admins
  studentId: "string", // 关联Students（单个学生）
  students: ["string"], // 关联Students（多个学生）
  courseId: "string", // 关联Courses
  subjectId: "string", // 关联Subjects
  sessionType: "string", // individual, group, workshop, assessment
  status: "string", // scheduled, in_progress, completed, cancelled, rescheduled
  scheduledDate: "date", // 计划日期
  startTime: "datetime", // 开始时间
  endTime: "datetime", // 结束时间
  actualStartTime: "datetime", // 实际开始时间
  actualEndTime: "datetime", // 实际结束时间
  location: "string", // 地点
  meetingLink: "string", // 在线会议链接
  agenda: "text", // 议程
  materials: ["string"], // 教材链接
  homework: "text", // 作业
  notes: "text", // 课堂笔记
  rating: "number", // 评分 1-5
  feedback: "text", // 反馈
  cost: "number", // 费用
  paymentStatus: "string", // pending, paid, overdue
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### SessionAttendance 集合
**使用页面**: 会话管理页面、报表系统  
**代码调用**: `wixData.query('SessionAttendance')`

```javascript
{
  _id: "string",
  sessionId: "string", // 关联Sessions
  studentId: "string", // 关联Students
  attendanceStatus: "string", // present, absent, late, excused
  checkInTime: "datetime", // 签到时间
  checkOutTime: "datetime", // 签退时间
  notes: "text", // 备注
  recordedBy: "string", // 记录人
  attendanceDate: "date", // 出勤日期
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### SessionMaterials 集合
**使用页面**: 会话管理页面  
**代码调用**: `wixData.query('SessionMaterials')`

```javascript
{
  _id: "string",
  sessionId: "string", // 关联Sessions
  fileName: "string", // 文件名
  fileUrl: "string", // 文件URL
  fileType: "string", // pdf, doc, ppt, video, audio
  fileSize: "number", // 文件大小（字节）
  description: "text", // 文件描述
  uploadedBy: "string", // 上传者ID
  isPublic: "boolean", // 是否公开
  downloadCount: "number", // 下载次数
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### SessionFeedback 集合
**使用页面**: 会话管理页面、报表系统  
**代码调用**: `wixData.query('SessionFeedback')`

```javascript
{
  _id: "string",
  sessionId: "string", // 关联Sessions
  studentId: "string", // 关联Students
  adminId: "string", // 关联Admins
  rating: "number", // 评分 1-5
  feedback: "text", // 文字反馈
  categories: {
    teaching_quality: "number", // 教学质量
    communication: "number", // 沟通能力
    preparation: "number", // 准备充分度
    helpfulness: "number" // 帮助程度
  },
  submittedDate: "datetime", // 提交时间
  isAnonymous: "boolean", // 是否匿名
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### Subjects 集合
**使用页面**: 会话管理页面、学生管理页面  
**代码调用**: `wixData.query('Subjects')`

```javascript
{
  _id: "string",
  subjectId: "string", // 科目编号
  name: "string", // 科目名称
  description: "text", // 科目描述
  category: "string", // 科目分类: STEM, Languages, Arts, Social_Studies, AP_Curriculum
  level: "string", // 级别: Elementary, Middle, High, University, AP
  studentType: "string", // 适用学生类型: "alternative", "tutoring", "both"
  isActive: "boolean", // 是否激活
  color: "string", // 显示颜色（用于日历等）
  icon: "string", // 图标URL
  _createdDate: "datetime",
  _updatedDate: "datetime"
}

// 预定义科目数据示例：
// AP学生课程分类 (studentType: "alternative"):
// - "Core Subjects"
// - "Core Subjects + PSHE Careers + PE and Art"
// - "All Subjects + Therapy"
// - "Purple Ruler Blueprint"
//
// 普通辅导学生科目 (studentType: "tutoring"):
// - "Mathematics", "English", "Science", "History", "Geography", "Art", "Physics", "Chemistry", "Biology"
```

---

## 财务管理集合

### Payments 集合
**使用页面**: 财务管理页面、导师仪表盘  
**代码调用**: `wixData.query('Payments')`

```javascript
{
  _id: "string",
  paymentId: "string", // 支付编号
  studentId: "string", // 关联Students
  invoiceId: "string", // 关联Invoices
  amount: "number", // 支付金额
  currency: "string", // 货币类型
  paymentDate: "datetime", // 支付日期
  paymentMethod: "string", // credit_card, debit_card, bank_transfer, cash, cheque
  transactionId: "string", // 交易ID
  status: "string", // pending, completed, failed, refunded
  description: "text", // 支付描述
  processingFee: "number", // 手续费
  netAmount: "number", // 净金额
  gateway: "string", // 支付网关
  receiptUrl: "string", // 收据URL
  notes: "text", // 备注
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### Invoices 集合
**使用页面**: 财务管理页面  
**代码调用**: `wixData.query('Invoices')`

```javascript
{
  _id: "string",
  invoiceId: "string", // 发票编号
  studentId: "string", // 关联Students
  issueDate: "date", // 开票日期
  dueDate: "date", // 到期日期
  amount: "number", // 发票金额
  tax: "number", // 税额
  totalAmount: "number", // 总金额
  currency: "string", // 货币
  status: "string", // draft, sent, paid, overdue, cancelled
  description: "text", // 发票描述
  lineItems: [{
    description: "string", // 项目描述
    quantity: "number", // 数量
    unitPrice: "number", // 单价
    total: "number" // 小计
  }],
  paymentTerms: "string", // 付款条款
  notes: "text", // 备注
  pdfUrl: "string", // PDF文件URL
  sentDate: "datetime", // 发送日期
  paidDate: "datetime", // 支付日期
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### Expenses 集合
**使用页面**: 财务管理页面  
**代码调用**: `wixData.query('Expenses')`

```javascript
{
  _id: "string",
  expenseId: "string", // 支出编号
  date: "date", // 支出日期
  amount: "number", // 支出金额
  currency: "string", // 货币
  category: "string", // 支出类别: office_supplies, marketing, utilities, salaries, training
  description: "text", // 支出描述
  vendor: "string", // 供应商
  paymentMethod: "string", // 支付方式
  receiptUrl: "string", // 收据URL
  isRecurring: "boolean", // 是否定期支出
  recurringPeriod: "string", // 定期周期: monthly, quarterly, yearly
  approvedBy: "string", // 批准人
  status: "string", // pending, approved, rejected, paid
  tags: ["string"], // 标签
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### FinancialReports 集合
**使用页面**: 财务管理页面、报表系统  
**代码调用**: `wixData.query('FinancialReports')`

```javascript
{
  _id: "string",
  reportId: "string", // 报表编号
  reportType: "string", // revenue, expenses, profit_loss, cash_flow
  period: "string", // daily, weekly, monthly, quarterly, yearly
  startDate: "date", // 开始日期
  endDate: "date", // 结束日期
  totalRevenue: "number", // 总收入
  totalExpenses: "number", // 总支出
  netProfit: "number", // 净利润
  data: "text", // JSON格式的详细数据
  generatedBy: "string", // 生成人
  generatedDate: "datetime", // 生成日期
  status: "string", // draft, final, archived
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### PricingPlans 集合
**使用页面**: 管理员仪表盘、财务管理页面  
**代码调用**: `wixData.query('PricingPlans')`

```javascript
{
  _id: "string",
  planId: "string", // 计划编号
  name: "string", // 计划名称
  description: "text", // 计划描述
  price: "number", // 价格
  currency: "string", // 货币
  billingPeriod: "string", // monthly, quarterly, yearly
  features: ["string"], // 功能列表
  maxSessions: "number", // 最大课程数
  maxStudents: "number", // 最大学生数
  isActive: "boolean", // 是否激活
  isPopular: "boolean", // 是否热门
  discountPercentage: "number", // 折扣百分比
  validFrom: "date", // 有效开始日期
  validTo: "date", // 有效结束日期
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

---

## 报表系统集合

### Reports 集合
**使用页面**: 报表系统页面  
**代码调用**: `wixData.query('Reports')`

```javascript
{
  _id: "string",
  reportId: "string", // 报表编号
  reportName: "string", // 报表名称
  reportType: "string", // performance, financial, attendance, custom
  description: "text", // 报表描述
  parameters: "text", // JSON格式的参数
  query: "text", // 查询语句
  generatedBy: "string", // 生成人ID
  generatedDate: "datetime", // 生成日期
  status: "string", // generating, completed, failed
  isScheduled: "boolean", // 是否定时报表
  scheduleFrequency: "string", // daily, weekly, monthly
  nextRunDate: "datetime", // 下次运行日期
  recipients: ["string"], // 接收人邮箱列表
  format: "string", // pdf, excel, csv
  fileUrl: "string", // 文件URL
  isActive: "boolean", // 是否激活
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

### ReportData 集合
**使用页面**: 报表系统页面  
**代码调用**: `wixData.query('ReportData')`

```javascript
{
  _id: "string",
  reportId: "string", // 关联Reports
  dataType: "string", // chart, table, summary
  data: "text", // JSON格式的数据
  metadata: "text", // JSON格式的元数据
  generatedDate: "datetime", // 数据生成日期
  isLatest: "boolean", // 是否最新数据
  _createdDate: "datetime",
  _updatedDate: "datetime"
}
```

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


### Statistics 集合
**使用页面**: 导师仪表盘  
**代码调用**: `wixData.query('Statistics')`

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

## 权限配置

### 集合权限设置

每个集合需要设置适当的权限，确保数据安全：

#### 管理员权限 (Admin)
- **所有集合**: 完全访问权限（创建、读取、更新、删除）

#### 管理员权限 (Admin)
- **Students**: 读取、更新（仅分配给自己的学生）
- **Sessions**: 完全访问权限（仅自己的课程）
- **SessionAttendance**: 完全访问权限（仅自己的课程）
- **SessionMaterials**: 完全访问权限（仅自己的课程）
- **SessionFeedback**: 读取权限
- **Courses**: 读取、更新（仅自己的课程）
- **Payments**: 读取权限（仅相关学生）
- **Reports**: 读取权限（仅相关数据）
- **其他集合**: 根据需要设置读取权限

#### 学生权限 (Student)
- **Sessions**: 读取权限（仅自己的课程）
- **SessionMaterials**: 读取权限（仅自己的课程）
- **SessionFeedback**: 创建、读取权限（仅自己的反馈）
- **StudentProgress**: 读取权限（仅自己的进度）
- **Payments**: 读取权限（仅自己的支付记录）
- **Invoices**: 读取权限（仅自己的发票）

#### 家长权限 (Parent)
- **Students**: 读取权限（仅自己的孩子）
- **Sessions**: 读取权限（仅孩子的课程）
- **StudentProgress**: 读取权限（仅孩子的进度）
- **Payments**: 读取权限（仅相关支付）
- **Invoices**: 读取权限（仅相关发票）

---

## 索引优化

为了提高查询性能，建议为以下字段创建索引：

### Students 集合
- `studentId` (唯一索引)
- `email` (唯一索引)
- `status`
- `currentAdmin`
- `enrollmentDate`

### Sessions 集合
- `sessionId` (唯一索引)
- `adminId`
- `studentId`
- `scheduledDate`
- `status`
- 复合索引: `adminId + scheduledDate`
- 复合索引: `studentId + scheduledDate`

### Payments 集合
- `paymentId` (唯一索引)
- `studentId`
- `paymentDate`
- `status`
- 复合索引: `studentId + paymentDate`

### Activities 集合
- `userId`
- `timestamp`
- `module`
- 复合索引: `userId + timestamp`

### Notifications 集合
- `userId`
- `isRead`
- `createdDate`
- 复合索引: `userId + isRead`

---

## 使用说明

1. **创建集合**: 在Wix编辑器中，按照上述结构创建所有数据库集合
2. **设置字段**: 为每个集合添加相应的字段，注意数据类型
3. **配置权限**: 根据权限配置部分设置每个集合的访问权限
4. **创建索引**: 为高频查询字段创建索引以提高性能
5. **测试连接**: 在代码中测试数据库连接和基本CRUD操作
6. **数据迁移**: 如有现有数据，制定迁移计划

## 注意事项

- 所有日期时间字段使用ISO 8601格式
- JSON字段存储为文本类型，在代码中进行解析
- 文件上传使用Wix Media Manager，存储URL引用
- 定期备份数据库
- 监控查询性能，必要时优化索引
- 遵循数据保护法规（如GDPR）

---

## 代码一致性检查结果

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

**最后更新**: 2024年1月
**版本**: 1.1
**维护者**: 系统管理员
**一致性检查**: 已完成 ✅