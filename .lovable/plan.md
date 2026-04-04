

# NSCET Webinar Management System — Full Frontend Plan

## Design Direction
Modern minimal with clean whites, subtle shadows, and a professional blue/indigo accent palette. Responsive across all devices.

## Pages & Modules to Build

### 1. Admin Authentication
- Login page with email/password (mock auth with localStorage)
- Session management with protected routes
- Logout functionality

### 2. Admin Dashboard
- Overview stats: total webinars, registrations, certificates issued, emails sent
- Recent webinars list with quick actions
- Charts for registration trends and attendance rates
- Quick-create webinar button

### 3. Webinar Management (CRUD)
- Create/Edit webinar form: title, topic, description, date/time, mentor name, mentor photo upload, department, registration fee (fixed ₹99)
- Webinar listing with search, filter by status (upcoming/completed/draft)
- Delete with confirmation dialog
- Status badges (Upcoming, Live, Completed)

### 4. Poster Generation Module (12+ Themes)
- Auto-generate posters from webinar data (mentor name, photo, topic, date/time, fee ₹99)
- **12+ poster themes**: Professional Blue, Elegant Dark, Tech Gradient, Minimal White, Vibrant Orange, Academic Green, Creative Purple, Bold Red, Soft Pastel, Neon Glow, Classic Gold, Modern Teal, Geometric, Abstract Wave
- Live preview as you switch themes
- Download poster as image (HTML Canvas export)
- Each theme has distinct typography, colors, and layout

### 5. Registration Link & QR Code
- Auto-generate unique registration URL per webinar
- QR code generation displayed alongside the link
- Copy-to-clipboard and download QR functionality

### 6. Public Registration Page
- Dynamic registration form accessible via unique URL
- Fields: Name, Student ID, Email, Phone, Department, Year
- Input validation (email format, required fields)
- Confirmation screen after registration
- Fee display: ₹99

### 7. Participant Management
- Searchable/sortable participant table per webinar
- Export participant list
- Participant database across all webinars
- Previous attendees flagged for future outreach

### 8. Attendance Tracking
- Mark attendance by Student ID
- Cross-reference: only registered IDs can be marked present
- Attendance summary with present/absent counts
- Export attendance report

### 9. Certificate Generation
- Auto-generate certificates only for participants whose **registered Student ID matches attended Student ID**
- Non-registered but attended IDs are blocked from certificates
- Certificate preview with participant name, webinar details, date
- Bulk generate & download as PDF
- Professional certificate template

### 10. Bulk Email Module (Mock UI)
- Compose invitation emails with webinar details
- Reminder email scheduling UI
- Post-event follow-up email composer
- **Previous attendees auto-populated** as recipients for future webinar emails
- Email log table showing sent/pending/failed status

### 11. Feedback Collection
- Post-webinar feedback form (rating, comments)
- Feedback summary with average ratings

### 12. Reports & Analytics Dashboard
- Registration statistics per webinar
- Attendance percentage charts
- Email campaign performance (sent/opened/clicked mock data)
- Certificates issued count
- Feedback analysis with rating distribution

### Key Business Rules Implemented
- Registration fee always ₹99 (non-editable)
- Certificate generation requires matching registered + attended Student ID
- Previous attendees' emails stored for future webinar notifications
- Poster auto-generated from faculty input fields

### Navigation Structure
- **Sidebar**: Dashboard, Webinars, Participants, Attendance, Certificates, Emails, Feedback, Analytics
- **Top bar**: NSCET branding, admin profile, notifications, logout

