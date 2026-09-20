# 07. Dental Square — Reusable Component Strategy & UI Specifications

---

## 1. Component System Architecture

Digital Dental Square builds all interfaces from a coherent, strictly standardized design system. Once a component is designed, it is reused across all screens to guarantee visual and interaction consistency:

```
Component Architecture Hierarchy:
├── Level 1: Global Primitives (Buttons, Inputs, Modals, Drawers, Badges)
├── Level 2: Feedback & Layout States (Skeletons, Empty States, Error Cards)
├── Level 3: Dental Domain Components (Odontogram, Queue Cards, Treatment Timelines)
└── Level 4: Composite Screen Views (Reception Queue Board, Operatory Chairside View)
```

---

## 2. Global Primitive Components

### 2.1 Buttons & Action Triggers
- **Primary Button**: Solid Clinical Teal (`#0D5C58`) or Royal Navy (`#0F2C59`) with white text. Height: 40px, Border Radius: 8px, Typography: 14px SemiBold.
  - *Rule*: Only ONE primary button per screen context (e.g., `[Book an Appointment]`, `[Call Next Token]`, `[Save Plan]`).
- **Secondary Button**: Crisp 1px border (`#E2E8F0`), surface white, deep text (`#1E2229`). Used for secondary, non-destructive actions.
- **Tertiary / Ghost Button**: Borderless text button with hover highlight (`#F1F5F9`). Used for drill-down links (`View Details →`).
- **Destructive Button**: Crimson border/fill (`#DC2626`). Requires an explicit confirmation modal before executing deletions.

### 2.2 Form Controls & Inputs
- **Text & Number Fields**: 40px height, 1px border (`#E2E8F0`), focus ring: `2px solid #0D5C58`. Clear inline error text in soft red (`#DC2626`).
- **Custom Selects & Dropdowns**: Keyboard-navigable (`↑`/`↓`/`Enter`/`Esc`), clear checkmark on active selection.
- **Date & Time Slot Picker**: Custom calendar interface optimized for morning (09:30–13:00) and evening (16:30–20:30) clinic slots.
- **Global Search Omnibox (`Ctrl+K`)**: Floating search modal providing instant keyboard typeahead across Patients, Appointments, and Procedures.

---

## 3. Dental Domain-Specific Components

### 3.1 `<DentalOdontogram />` & `<ToothSurface />`
The primary visual interface for dental examination and treatment planning:

```
FDI Two-Digit Numbering Layout (Adult Dentition):
Upper Right (Quadrant 1)             Upper Left (Quadrant 2)
18 17 16 15 14 13 12 11   |   21 22 23 24 25 26 27 28
------------------------------------------------------
48 47 46 45 44 43 42 41   |   31 32 33 34 35 36 37 38
Lower Right (Quadrant 4)             Lower Left (Quadrant 3)
```

- **Interactive 5-Facet Polygon (`<ToothSurface />`)**:
  - **O**: Occlusal / Incisal (Center)
  - **M**: Mesial (Toward midline)
  - **D**: Distal (Away from midline)
  - **B**: Buccal / Facial (Cheek side)
  - **L**: Lingual / Palatal (Tongue/palate side)
- **Visual Condition Overlays**:
  - `Sound`: Clean pearl outline (`#E2E8F0`)
  - `Caries / Decay`: Soft red tint (`#FEE2E2`, border `#DC2626`)
  - `Restoration / Composite`: Slate blue fill (`#4A6FA5`)
  - `Root Canal Treated (RCT)`: Vertical canal lines in Teal (`#0D5C58`)
  - `Crown / Cap`: Diagonal crosshatch with soft amber border (`#D97706`)
  - `Missing / Extracted`: Subtle diagonal slash (`#94A3B8`)
  - `Dental Implant`: Titanium base indicator
- **Notation Standard**: FDI Two-Digit is the prototype default and must be confirmed against Dental Square's actual clinical workflow before production deployment. A configuration toggle allows switching to Universal notation (1–32).
- **Pediatric Toggle**: One-tap switch to primary dentition (Teeth 51–85).

---

### 3.2 `<TokenQueueCard />`
Glanceable card representing a patient in today's clinic flow:

```
+-----------------------------------------------------------+
| TOKEN 07      [ 🟢 In Lounge · Waiting 12m ]               |
| Rajesh Sharma  ·  Male, 34 yrs  ·  +91 94311 XXXXX        |
| Doctor: Dr. Vandana Choudhary  ·  Operatory 2             |
| Procedure: #26 Root Canal Treatment (Stage 2)             |
| [ Call into Chair 2 ]       [ Reschedule ]                |
+-----------------------------------------------------------+
```

---

### 3.3 `<TreatmentTimeline />` & `<TreatmentProgress />`
Visualizes multi-stage clinical journeys (e.g., Endodontic or Surgical pathways):

```
(✓) Step 1: Access Opening & Pulpectomy (Completed - Sep 12)
      ↓
(✓) Step 2: Biomechanical Preparation & Shaping (Completed - Sep 15)
      ↓
(●) Step 3: Canal Obturation (In Progress Today - Sep 18)
      ↓
(○) Step 4: Core Build-up & Crown Preparation (Scheduled - Sep 22)
      ↓
(○) Step 5: Permanent Zirconia Crown Placement (Pending)
```

- Clear status indicators: **Completed** (green check), **Active Today** (blue filled circle), **Pending** (open circle).
- Prevents premature drop-offs by keeping both clinician and patient aligned on remaining visits.

---

### 3.4 Clinical Documentation Blocks
- **`<ClinicalNoteBlock />` (SOAP Format)**:
  - Structured fields for Subjective (chief complaint), Objective (clinical findings & vitality), Assessment (diagnosis), and Plan (treatment executed today + next steps).
  - Quick-insert macro snippets for standard protocols (e.g., local anesthesia dosages).
- **`<PrescriptionBlock />`**:
  - 5-column medication table: *Drug Name · Dosage · Frequency · Duration · Food Instructions*.
  - Built-in drug allergy safety warnings (e.g., Penicillin alert).
  - One-tap `[Print Rx]` and `[Send via WhatsApp]`.
- **`<ClinicalFinding />` & `<ProcedureBadge />`**:
  - Standardized compact pills for clinical conditions (*"Caries Class II #26"*, *"Gingivitis"*, *"Crown Prep"*).

---

### 3.5 Administrative & Tracking Cards
- **`<AppointmentCard />`**: Scheduled slot, patient name, doctor, status pill (`Confirmed`, `Arrived`, `In Chair`, `Completed`).
- **`<FollowUpCard />`**: Due date, reason for follow-up (*"Post-op surgical check"*, *"Crown reminder"*), 1-tap call/message action.
- **`<KPICard />`**: Primary numerical KPI, supporting subtitle, comparison delta, and mandatory `View Details →` link.
- **`<NeedsAttentionItem />`**: Actionable triage item linking directly to a patient cohort.

---

## 4. Universal Component Lifecycle States

Every interactive component supports standardized states:

| State | Visual Treatment & Behavior |
| :--- | :--- |
| **Default** | Resting visual state with standard borders and typography. |
| **Hover** | Subtle 1px border darkening (`#CBD5E1`), cursor pointer, soft background highlight. |
| **Focus** | High-contrast focus ring (`2px solid #0D5C58`), outline offset 2px, accessible via keyboard. |
| **Pressed / Active**| Slight scale compression (0.98x), darker background fill. |
| **Disabled** | Muted opacity (0.5), cursor not-allowed, stripped of hover triggers. |
| **Loading** | Accessible spinner or animated skeleton placeholder preserving exact container dimensions. |
| **Success** | Soft green border/icon (`#0D7A68`), reassuring confirmation feedback. |
| **Error** | Soft red border/icon (`#DC2626`), clear adjacent error message. |

---

## 5. Feedback & Empty State Standards

```
Rule: Never display unexplained blank white space or empty tables.
```

- **Empty Appointments**: *"Your schedule is clear. [ + Check in Walk-in Patient ]"*
- **Empty Follow-ups**: *"You're all caught up. No follow-ups due today."*
- **Empty Treatment Plans**: *"No active treatment plans. [ Create Treatment Plan ]"*
- **Empty Analytics**: *"More insights will appear as your clinic data grows."*
- **Error State**: Calm, non-technical copy: *"We couldn't load today's appointments. [ Try Again ]"*
- **Skeleton Loading**: Light gray pulsating placeholders (`#F1F5F9`) matching the exact layout of final cards, preventing jarring cumulative layout shift (CLS).
