# AP Student Registration Page - Element References

## Form Element IDs

### Student Information Section
- `studentFirstName`
- `studentLastName`
- `studentDateOfBirth`
- `studentEmail`
- `classStartDate`
- `ehcpStatus`

### EHCP Documentation Section
- `ehcpFile` (Wix Form File Upload Element)
- `ehcpDetails`
- `file-remove`

### Caseworker Information Section
- `caseworkerName`
- `caseworkerEmail`

### Guardian/Parent Information Section
- `guardianName`
- `guardianEmail`
- `guardianPhone`

### Emergency Contact Section
- `emergencyContact`
- `emergencyName`

### Educational Background Section
- `homeAddress`
- `previousEducation`

### Educational Plan Selection Section
- `selectedPlan`

### Additional Questions Section
- `homeLessonsWithoutSupervision`
- `supportLongerThanFourWeeks`



### Form Container
- `apRegistrationForm`

## Button Elements
- `submitBtn`
- `resetBtn`
- `backBtn`

## Technical Implementation Notes

### Wix Form File Upload Integration
The `ehcpFile` element utilizes Wix form file upload functionality for optimal file handling:

**Implementation Benefits:**
- **Security**: Built-in file validation, virus scanning, and secure storage
- **Media Management**: Automatic integration with Wix media library
- **Scalability**: CDN support and file optimization
- **Compliance**: GDPR and data protection compliance
- **User Experience**: Native drag-and-drop interface with progress indicators

**File Processing Workflow:**
1. User uploads file via Wix form element (`ehcpFile`)
2. Wix processes and stores file in media library
3. System generates secure media URL
4. Media URL included in registration data
5. Complete data sent to Lark Anycross endpoint: `https://open-sg.larksuite.com/anycross/trigger/callback/MGQ0ZmQwNjJmZjAyZGJlNzM0YTRiMTQ1MDcwYTM1YjY1`
6. File references stored in CMS for future access

**Supported File Types:** PDF, DOC, DOCX
**Maximum File Size:** As per Wix platform limits
**Storage Location:** Wix Media Library with secure access controls