# AMULYA DENTAL CLINIC - Full-Stack Web Application

A full-stack, mobile-first clinic web application built with **Next.js (App Router)**, **Tailwind CSS**, and **SQLite with Prisma**.

---

## 🌟 Centralized Configuration (`clinicConfig.ts`)

All clinic details are managed in one single configuration file:
📁 [`src/config/clinicConfig.ts`](./src/config/clinicConfig.ts)

When customizing for a new doctor or clinic client, **simply edit this one file**:
- **Clinic Name & Tagline**: e.g., `AMULYA DENTAL CLINIC`
- **Doctor Profile**: Name, qualifications, registration number, bio, clinical specialties, awards
- **Contact & WhatsApp**: Phone numbers, raw WhatsApp URL targets, email
- **Address & Google Maps**: Full address, directions link (`https://maps.app.goo.gl/zpmYzc6vvLryB4Fg8`), and interactive embed
- **Timings & Shifts**: Morning Shift (`09:30 AM – 01:30 PM`), Evening Shift (`05:00 PM – 09:00 PM`), available slots, and Sunday rules
- **Treatments & Services**: Full catalogue with categories (Dental, Skin, Cosmetic), durations, fees, highlights, and popular badges
- **Admin Password**: Password for accessing the admin appointment dashboard

---

## 🛠️ Features & Sections

1. **Sticky Header & Top Bar**:
   - Quick shift timing display
   - Direct click-to-call phone number
   - "Book Appointment" CTA button
   - Mobile responsive drawer navigation

2. **Medical Hero Section**:
   - Class-B Autoclave 100% Sterile badge
   - Doctor credentials summary
   - Verified stats: 12+ Years Experience, 10,000+ Happy Smiles, 4.9 Star Rating
   - Dual action CTAs: Instant Online Booking & Direct Call

3. **Treatments & Services Catalogue**:
   - Filterable categories: All, Dental Care, Skin Clinic, Cosmetic Smiles
   - Duration, fee, and bullet highlights
   - "Book This Treatment" button that pre-selects the treatment in the booking modal

4. **Doctor Profile**:
   - Qualifications (`BDS, MDS, FAM`)
   - Areas of clinical expertise & awards
   - 1-on-1 personalized consultation note

5. **Clinic Timings & Operational Shifts**:
   - Visual Morning (`09:30 AM – 01:30 PM`) and Evening (`05:00 PM – 09:00 PM`) shift cards
   - Consultation slots list
   - Emergency support note

6. **Location & Interactive Google Map**:
   - Complete physical address and transit info (Metro, Parking, Wheelchair accessibility)
   - Embedded interactive Google Map
   - Direct button opening Google Maps App navigation (`https://maps.app.goo.gl/zpmYzc6vvLryB4Fg8`)

7. **Interactive Booking Modal**:
   - Pre-selects clicked treatment
   - Date picker (minimum date today)
   - Shift toggle (Morning vs Evening) and time slot selector
   - Patient contact details
   - Instant SQLite database saving with booking reference ID
   - 1-click WhatsApp confirmation sharing

8. **Admin Dashboard (`/admin`)**:
   - Authenticated with `clinicConfig.adminPassword` (Default: `amulya@admin2026`)
   - Summary statistics (Total, Today's, Confirmed, Completed, Cancelled)
   - Search by patient name, phone, or treatment
   - Update appointment status or delete records
   - 1-click WhatsApp chat & direct call buttons to the patient

---

## 🚀 Running the Application

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Dashboard Access
Visit [http://localhost:3000/admin](http://localhost:3000/admin).  
Default password: `amulya@admin2026`

### Database
Powered by **SQLite** (`prisma/dev.db`) using **Prisma ORM**. Zero external database configuration required.
To inspect or view the database in a GUI:
```bash
npx prisma studio
```
