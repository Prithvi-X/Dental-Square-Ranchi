# Dental Square — Clinic Management & Healthcare Platform
**Location**: 1st Floor, Amravati Complex, Circular Road, Lalpur, Ranchi, Jharkhand 834001  
**Phone**: +91 91556 61202  
**Clinic Timings**: Monday – Saturday: 10:00 AM – 07:30 PM | Sunday: 10:00 AM – 02:00 PM  

A full-stack, zero-dependency clinical healthcare and practice management platform built for **Dental Square**, Ranchi. Powered by Node.js native standard library (`node:http`, `node:sqlite`, `node:crypto`) with ACID compliance, atomic double-booking protection, and enterprise privacy standards.

---

## Specialists & Clinical Leadership

- **Dr. Anuj Kumar**
  - **Qualifications**: BDS, MDS (Oral & Maxillofacial Surgery)
  - **Specialization**: Oral & Maxillofacial Surgeon, Specialist Implantologist
  - **Experience**: 14+ Years in Dentistry & Maxillofacial Surgery
  - **Registration**: 28901-A (Karnataka State Dental Council - KSDC)
  - **Expertise**: Dental Implants, Surgical Wisdom Tooth Extractions, Facial Trauma, Maxillofacial Pathology

- **Dr. Kumari Vandana Chaudhury**
  - **Qualifications**: BDS-Dental, MDS-Endodontics
  - **Specialization**: Dentist & Specialist Endodontist
  - **Experience**: 33 Years of Clinical Experience
  - **Expertise**: Microscopic Root Canal Treatments (RCT), Cosmetic Restorations, Smile Design, Preventive Dentistry

---

## Core System Architecture & Features

### 1. Public Patient Website & Procedure Showcase (`index.html`)
- High-definition visual presentation with official clinic signage and verified practitioner credentials.
- Verified showcase of 9 major dental specialities: Dental Implants, Root Canal Treatments, Oral & Maxillofacial Surgery, Laser Dentistry, Teeth Cleaning & Polishing, Orthodontics, Pediatric Dentistry, Periodontics, and Hair Restoration.
- Interactive FAQ, emergency assistance hotline, and direct Google Maps navigation.

### 2. Phase 2 Online Appointment Booking Engine (`book.html`)
- **Seamless 8-Step Stepper Flow**:
  1. Service Selection
  2. Specialist Selection (Dr. Anuj Kumar, Dr. Kumari Vandana Chaudhury, or Any Available)
  3. Dynamic Date Picker (Next 21 days with weekday/Sunday clinic hour awareness)
  4. Time Slot Availability (Real-time availability status)
  5. Patient Contact Information
  6. Review & Slot Deposit Notice (₹500 simulated deposit)
  7. Demo Payment Simulation & 10-Minute Temporary Slot Hold (Live countdown timer, mock UPI/Card selectors, simulated failure mode)
  8. Instant Booking Confirmation (DS-XXXXXX reference, PAY-DEMO-XXXXXX payment code, and RFC-5545 `.ics` Calendar integration)
- **Concurrency & Double-Booking Protection**:
  - SQLite atomic transactions (`BEGIN IMMEDIATE`) backed by unique partial indexes guarantee zero double-booking even under concurrent traffic spikes.
  - Temporary slot holds expire automatically after 10 minutes via lazy cleanup.

### 3. Phase 3 Staff Dashboard & Live Queue System (`dashboard.html`)
- Role-based cryptographic PIN authentication:
  - Reception (PIN: `1024`)
  - Dr. Anuj Kumar (PIN: `2048`)
  - Dr. Kumari Vandana Chaudhury (PIN: `4096`)
  - Clinic Owner (PIN: `8192`)
- Live reception patient check-in generating daily sequential clinic tokens (`T-01`, `T-02`, ...).
- Real-time operatory states: Waiting, In Consultation, Completed, and No-Show.
- Strict clinician isolation: Dentists can only call and manage their own assigned queue.

### 4. Phase 4 Clinical EHR & Workspace (`patient.html`)
- Unified longitudinal patient records with conservative identity resolution.
- **Interactive 5-Surface Adult Permanent FDI Dentition Odontogram**:
  - Full support for adult permanent teeth (11–18, 21–28, 31–38, 41–48).
  - 5 anatomical surfaces: Mesial, Distal, Occlusal, Buccal, Lingual, plus Whole Tooth.
  - Prototype clinical finding taxonomy (Caries, Missing, Restored, RCT, Fracture, Impacted, Crown) with soft-archive audit preservation.
- Author-restricted clinical consultation notes, multi-stage treatment plans, and immutable medical prescriptions.

### 5. Phase 5 Follow-ups & WhatsApp Messaging Platform
- Deterministic clinical follow-up state machine (`PENDING` &rarr; `DUE` &rarr; `CONTACTED` &rarr; `SCHEDULED` &rarr; `COMPLETED`).
- Automated WhatsApp communication service with Meta Cloud API integration and Mock fallback.
- 5 standardized clinic message templates with strict privacy whitelisting (zero diagnostic or medication leaks over text).
- Webhook delivery receipt processing (`SENT` &rarr; `DELIVERED` &rarr; `READ`) and background job scheduler.

---

## Technology Stack

- **Runtime**: Node.js (v20+ recommended, tested on Node.js v25)
- **Database**: SQLite via Node.js Native SQLite (`node:sqlite`)
- **Server**: Native Node HTTP (`node:http`) & Crypto (`node:crypto`)
- **Dependencies**: **0 external npm packages** (Zero attack surface, instant startup)
- **Frontend**: Semantic HTML5, Vanilla JavaScript, CSS3 with Phase 0/1 Design Tokens

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) version 20.0.0 or higher.

### 2. Clone the Repository
```bash
git clone https://github.com/Prithvi-X/Dental-Square-Ranchi.git
cd Dental-Square-Ranchi
```

### 3. Start the Server
```bash
npm start
# or
node server/server.js
```

The database (`data/dental_square.db`) is automatically initialized and seeded on first run.

### 4. Access the Application
- **Public Homepage**: [http://localhost:3000/](http://localhost:3000/)
- **Online Booking**: [http://localhost:3000/book.html](http://localhost:3000/book.html)
- **Clinic Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Clinical Workspace**: [http://localhost:3000/patient.html](http://localhost:3000/patient.html)
- **API Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## License
Private & Proprietary — Developed for Dental Square, Lalpur, Ranchi. All rights reserved.
