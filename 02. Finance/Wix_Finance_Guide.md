# Wix Finance Dashboard Implementation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Required Wix Elements](#required-wix-elements)

4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Deployment and Maintenance](#deployment-and-maintenance)

## Project Overview

### Purpose
This guide provides comprehensive instructions for implementing a finance management dashboard in Wix, specifically designed for Purple Ruler Academy's educational services, including tutoring programs, curriculum systems, and student reintegration support.

### Key Features
- **Pricing Plan Management:** Display and manage Purple Ruler Academy curriculum pricing
- **Student Type Classification:** Support for Full Time/Part Time students and school reintegration
- **Payment Tracking:** Monitor student payments across different curriculum packages
- **Transaction Management:** Track payments for Core Subjects, Extended Programs, and Therapy services
- **Financial Overview:** Real-time statistics for paid, outstanding, and overdue payments
- **Curriculum-Based Billing:** Specialized pricing for Purple Ruler and Blueprint programs

### Technical Stack
- **Frontend:** HTML5, CSS3, JavaScript
- **Styling:** CSS Grid, Flexbox, CSS Variables
- **Icons:** Font Awesome 6.0
- **Responsive Design:** Mobile-first approach
- **Interactive Elements:** Plan selection, notifications, hover effects

## Required Wix Elements

### Page Elements
- **Sidebar Navigation:** Consistent with mentor portal design
- **Header Section:** Finance management title with action buttons
- **Statistics Cards:** Financial overview with color-coded metrics
- **Pricing Plans Grid:** Interactive curriculum package selection
- **Transaction Table:** Recent payment history and status tracking
- **Payment Information:** Bank transfer and online payment details

### Database Collections
1. **Students**
   - studentId (Primary Key)
   - name (Text)
   - email (Text)
   - studentType (Text) // "Full Time" or "Part Time"
   - curriculumPackage (Text) // "Core Subjects", "Core Plus", "All Subjects", "Blueprint"
   - status (Text) // "Active", "Inactive", "Graduated"

2. **Transactions**
   - transactionId (Primary Key)
   - studentId (Reference)
   - date (Date)
   - description (Text)
   - amount (Number)
   - status (Text) // "Paid", "Pending", "Overdue"
   - curriculumType (Text)

3. **CurriculumPackages**
   - packageId (Primary Key)
   - name (Text)
   - weeklyRate (Number)
   - hourlyRate (Number) // For Blueprint
   - features (Text)
   - targetAudience (Text) // "Individual", "Schools"
   - curriculumProvider (Text) // "Purple Ruler", "School Curriculum"

4. **FinancialSummary**
   - summaryId (Primary Key)
   - totalPaid (Number)
   - outstandingPayments (Number)
   - overduePayments (Number)
   - activeStudents (Number)
   - lastUpdated (Date)



## Step-by-Step Implementation

### Step 1: Page Setup
1. **Create Finance Page**
   - Create finance.html with Purple Ruler Academy branding
   - Implement responsive layout using CSS Grid and Flexbox
   - Set up CSS variables for consistent theming

2. **Add Navigation**
   - Integrate with mentor portal sidebar navigation
   - Set active state for Finance menu item
   - Ensure consistent styling with other portal pages

### Step 2: Layout Structure
1. **Header Section**
   - Page title: "Finance Management"
   - Action buttons: "Generate Invoice" and "Export Report"
   - Consistent styling with mentor portal theme

2. **Statistics Section**
   - Paid amount card (£12,450) with success color
   - Outstanding payment card (£2,340) with warning color
   - Overdue payment card (£890) with danger color
   - Active students count (45) with info color

3. **Main Content Area**
   - Purple Ruler Academy curriculum pricing section
   - Interactive pricing plan cards with selection functionality
   - Recent transactions table with status indicators
   - Payment information section with bank and online details

### Step 3: Statistics Cards
1. **Paid Card**
   - Display total paid amount (£12,450)
   - Green color scheme for positive indicator
   - Large font size for emphasis

2. **Outstanding Payment Card**
   - Show pending payments (£2,340)
   - Yellow/warning color for attention
   - Track payments awaiting collection

3. **Overdue Payment Card**
   - Display overdue amounts (£890)
   - Red color for urgent attention
   - Highlight payments requiring follow-up

4. **Active Students Card**
   - Show current student count (45)
   - Blue color for informational display
   - Link to student management system

### Step 4: Pricing Plans Section
1. **Core Subjects Plan**
   - £135 per week per student
   - Purple Ruler Academy online school
   - Individual tutoring and core subjects support
   - Featured plan with enhanced styling

2. **Core Subjects + PSHE Careers + PE and Art**
   - £162 per week per student
   - Extended curriculum including PSHE, PE, and Art
   - Comprehensive tutoring program

3. **All Subjects + Therapy**
   - £207 per week per student
   - Complete package with therapeutic support
   - Mental health resources and specialized interventions

4. **Purple Ruler Blueprint (For Schools)**
   - £29.17 per hour
   - 1-6 students per session
   - Uses school's curriculum for reintegration
   - Special badge indicating school-focused service

### Step 5: Transaction Management
1. **Recent Transactions Table**
   - Date, Student, Description, Amount, Status columns
   - Color-coded status badges (Paid, Pending, Overdue)
   - View action buttons for detailed transaction information
   - Hover effects for better user interaction

2. **Transaction Status Indicators**
   - Green badges for paid transactions
   - Yellow badges for pending payments
   - Red badges for overdue payments
   - Consistent styling with statistics cards

### Step 6: Interactive Features
1. **Plan Selection Functionality**
   - Click to select pricing plans
   - Visual feedback with selected state styling
   - Success notifications for plan selection
   - Remove previous selections automatically

2. **Payment Information Display**
   - Bank transfer details with account information
   - Online payment options (PayPal, Stripe, Direct Debit)
   - Clear formatting for easy reference
   - Copy-friendly account details

3. **Notification System**
   - Success notifications for plan selection
   - Auto-dismiss after 3 seconds
   - Slide-in animation effects
   - Manual close option available

### Step 7: Responsive Design
1. **Mobile Layout (< 768px)**
   - Sidebar becomes full-width overlay
   - Statistics cards stack vertically (1 column)
   - Pricing plans display in single column
   - Header actions stack vertically
   - Table becomes horizontally scrollable

2. **Tablet Layout (768px - 1200px)**
   - Sidebar remains fixed at 250px width
   - Statistics grid adapts to available space
   - Pricing plans use auto-fit grid (minimum 300px)
   - Touch-friendly button sizes

3. **Desktop Layout (> 1200px)**
   - Full 4-column statistics grid
   - Hover effects on pricing cards
   - Enhanced visual feedback
   - Optimal spacing and typography

## JavaScript Functionality

### Plan Selection System
```javascript
function selectPlan(planType) {
    // Remove selected class from all cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    event.currentTarget.classList.add('selected');
    
    // Show confirmation notification
    showNotification(`${selectedPlan} plan selected!`, 'success');
}
```

### Notification System
```javascript
function showNotification(message, type = 'info') {
    // Create notification with slide-in animation
    // Auto-dismiss after 3 seconds
    // Manual close option available
}
```

### CSS Variables Implementation
```css
:root {
    --primary-color: #663399;
    --primary-dark: #4a2570;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
    --info-color: #17a2b8;
}
```

## Deployment and Maintenance

### Pre-Launch Checklist
- [ ] Purple Ruler Academy branding implemented
- [ ] All pricing plans configured correctly
- [ ] Student type classification working
- [ ] Transaction status tracking functional
- [ ] Responsive design tested across devices
- [ ] Plan selection interactions working
- [ ] Payment information display accurate

### Post-Launch Monitoring
- Monitor plan selection analytics
- Track student enrollment by curriculum type
- Review payment status accuracy
- Update pricing as curriculum evolves
- Maintain consistency with mentor portal

### Regular Maintenance
- Update curriculum package pricing
- Review transaction categorization
- Maintain payment method information
- Optimize plan selection user experience
- Ensure data consistency across portal

### Integration Considerations
- Link with student management system
- Connect to mentor dashboard navigation
- Integrate with session booking system
- Sync with reports generation
- Maintain consistent user experience

### Performance Optimization
- Optimize pricing card hover animations
- Implement efficient plan selection
- Cache financial summary data
- Optimize responsive breakpoints
- Minimize CSS and JavaScript files

### Purple Ruler Academy Specific Features
- **Curriculum Differentiation:** Clear distinction between Purple Ruler and school curriculum
- **Student Type Support:** Full Time vs Part Time classification
- **Reintegration Focus:** Special Blueprint program for schools
- **Therapeutic Services:** Integration of mental health support pricing
- **Flexible Pricing:** Weekly rates for individuals, hourly for groups

This guide provides a comprehensive framework for implementing Purple Ruler Academy's finance management system, ensuring proper curriculum-based billing and student payment tracking capabilities.