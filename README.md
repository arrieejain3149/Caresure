# PillVox — Connected Elderly Care & Smart Medication Management System 🏥💊

> **"Because care should always feel personal"**  
> An integrated HealthTech ecosystem connecting remote family caregivers with elderly loved ones through a **dual-portal web application** and an **IoT sensor-monitored smart medicine box**.

[![Live App](https://img.shields.io/badge/Live%20App-Vercel-success?style=for-the-badge&logo=vercel)](https://caresure-he3m.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Pillvox-181717?style=for-the-badge&logo=github)](https://github.com/arrieejain3149/Pillvox.git)
[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016%20%7C%20React%2019-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Express & Node](https://img.shields.io/badge/Backend-Express%20%7C%20Node.js-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![Three.js 3D](https://img.shields.io/badge/3D%20Hardware-Three.js%20%7C%20R3F-black?style=for-the-badge&logo=three.js)](https://threejs.org)

---

## 🌟 The Problem We Solve

According to the World Health Organization (WHO), **over 50% of patients with chronic illnesses fail to take their medications as prescribed**. For senior citizens (aged 65+), this crisis is amplified by **polypharmacy**—taking 4 to 10 different pills daily across specific meal timings:

* ⚠️ **Accidental Double-Dosing & Omissions**: Cognitive fatigue causes seniors to forget whether a dose was taken, risking toxicity or health decline.
* 😰 **The "Sandwich Generation" Anxiety**: Working adult children living in different cities carry constant stress, relying on intrusive daily check-in calls that feel like policing.
* 📱 **Over-Complicated Technology**: Most mobile reminder apps are crammed with tiny fonts, complex menus, and ads that frustrate elderly users.
* 🚨 **Emergency Information Blind Spots**: During a fall or sudden medical episode, first responders have zero immediate visibility into the senior's active medications, drug allergies, or emergency contacts.

---

## 💡 The PillVox Solution

PillVox breaks the vicious cycle by creating a closed-loop healthcare bridge:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE PILLVOX ECOSYSTEM                           │
│                                                                        │
│  [CAREGIVER PORTAL] ──(Schedules & OCR)──► [PILLVOX CLOUD PLATFORM]   │
│         ▲                                             │                │
│         │ (Real-time adherence alerts)                ▼                │
│  [REMOTE NOTIFICATIONS] ◄── [SMART MEDICINE BOX & SENIOR PORTAL]       │
│                             (LED guidance + physical sensor triggers)  │
└────────────────────────────────────────────────────────────────────────┘
```

### 🔑 Core Features

1. **Dual-Portal Synchronized Architecture**:
   * **Caregiver Command Center (`/dashboard`)**: Remote management of multiple elderly family members, dosage schedules, adherence streaks, and real-time missed-dose alerts.
   * **Senior Patient Portal (`/patient/dashboard`)**: High-contrast, large-font interface stripped of cognitive clutter. Displays straightforward meal cues (*"Morning - After Breakfast"*) with tactile **"Mark as Taken"** confirmations.
2. **AI Prescription OCR Scanner (`/patients/[id]/medications/add`)**:
   * Caregivers snap a photo of a doctor's printed or handwritten prescription.
   * Built-in OCR engine automatically extracts medication names, dosages, and daily frequencies, eliminating manual typing errors.
3. **Emergency QR Medical Pass (`/patients/[id]/medical-card`)**:
   * Dynamic QR code generated for every senior.
   * Any paramedic or bystander can scan the code with a standard smartphone to immediately view blood group, drug allergies, pre-existing conditions, and guardian phone numbers without needing an app install.
4. **Interactive 3D Hardware Blueprint (`/hardware`)**:
   * Real-time Three.js 3D interactive model of the **PillVox Smart Medicine Box**.
   * Demonstrates 8 modular pill compartments, individual micro-switch sensors, main lid hall sensors, and Wi-Fi motherboard.
5. **Dignified Warm Beige & Espresso Design System**:
   * Unified palette of Warm Beige (`#faf6f0`), Soft Cream (`#ede0d0`), and Espresso Brown (`#4a2e1e`)—deliberately replacing cold clinical blues with emotional warmth, comfort, and legibility.

---

## 👥 Co-Founding Council & Democratic Governance

PillVox operates under a **Flat Co-Founding Council** of 5 equal partners (20% voting power each), representing balanced leadership across essential business disciplines:

```mermaid
flowchart LR
    F1["<b>Arihant</b><br/>Co-Founder &<br/>Head of Software Engineering<br/><i>(Execution Lead)</i>"]
    F2["<b>Ashutosh</b><br/>Co-Founder &<br/>Head of Product Innovation<br/><i>(Ideation Lead)</i>"]
    F3["<b>Lakshya</b><br/>Co-Founder &<br/>Head of IoT Hardware<br/><i>(Systems Lead)</i>"]
    F4["<b>Bhumika</b><br/>Co-Founder &<br/>Head of UX & Research<br/><i>(Design Lead)</i>"]
    F5["<b>Abhishek</b><br/>Co-Founder &<br/>Head of Operations & Finance<br/><i>(Business Lead)</i>"]
```

### 13-Specialist Startup Organizational Structure:
* **Software Engineering & Data Security (Led by Arihant)**: 3 Full-Stack Web/Mobile Developers & 1 Cybersecurity Specialist (HIPAA/DPDP health data encryption).
* **Product Innovation & AI (Led by Ashutosh)**: 1 AI Engineer (Prescription OCR & predictive adherence) & 1 UX Designer (Design system).
* **IoT Hardware & Systems (Led by Lakshya)**: 2 Firmware / Embedded IoT Engineers (ESP32 smart box telemetry).
* **UX Design & Customer Success (Led by Bhumika)**: 1 Customer Service Manager (Senior onboarding & user research feedback).
* **Business Operations & Finance (Led by Abhishek)**: 1 Finance Manager, 1 Marketing Manager, and 1 HR Manager.

---

## 🛠️ Architecture & Tech Stack

### Frontend (`/frontend`)
* **Framework**: Next.js 16 (App Router) & React 19
* **Styling**: Tailwind CSS v4
* **3D Interactive Hardware**: Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP
* **Adherence Charts**: Recharts
* **Emergency QR Engine**: `react-qr-code`
* **HTTP Client**: Axios with JWT interceptors
* **Deployment**: Vercel

### Backend (`/backend`)
* **Runtime**: Node.js & Express.js
* **Database**: MongoDB with Mongoose ODM
* **Authentication**: JWT & Bcrypt (Dual roles: Caregiver & Senior Patient)
* **OCR Document Scanner**: Tesseract.js (Optical Character Recognition)
* **IoT Hardware Integration**: REST Webhooks for ESP32 / Arduino Uno smart pill box

---

## 🚀 Local Development Quick Start

### 1. Prerequisites
* **Node.js**: v18+ (v20+ recommended)
* **MongoDB**: Local MongoDB or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

### 2. Run Both Frontend & Backend Concurrently
From the root project directory:
```bash
npm run dev
```

This concurrently fires up:
* 🌐 **Frontend Application**: `http://localhost:3000`
* ⚙️ **Backend REST API**: `http://localhost:5000` (`http://localhost:5000/api/health`)

---

## 📁 Repository Directory Structure

```
Pillvox/
├── backend/                  # Express REST API & Mongoose models
│   ├── config/               # Database connection & setup
│   ├── middleware/           # Auth & admin access guards
│   ├── models/               # Caregiver, Patient, Dose, Device, Alert schemas
│   ├── routes/               # API endpoints (auth, patients, medications, etc.)
│   └── server.js             # Main backend entrypoint
├── frontend/                 # Next.js 16 App Router UI
│   ├── app/                  # Pages: /dashboard, /patient, /hardware, etc.
│   ├── components/           # Navbar, 3D Canvas, Modals, Guards, Logo
│   ├── lib/                  # Axios API client & helpers
│   └── public/               # 3D GLB assets & static images
├── package.json              # Orchestrates concurrent full-stack dev scripts
└── README.md
```

---

## 📜 Academic Attribution

* **Course**: Essentials of Business Management (EBM)
* **Startup Theme**: HealthTech (Domain #3)
* **Live Webapp**: [https://caresure-he3m.vercel.app](https://caresure-he3m.vercel.app)
* **GitHub Repository**: [https://github.com/arrieejain3149/Pillvox.git](https://github.com/arrieejain3149/Pillvox.git)
