# CareSure - Smart Medication Management System 🏥💊

CareSure is an IoT-enabled digital health platform connecting elderly patients, caregivers, and smart pill-dispenser hardware to eliminate medication non-adherence, prevent accidental overdoses, and provide emergency health records via QR code.

Built for **Essentials of Business Management (EBM)** startup project — Area: **Healthtech**.

---

## 🚀 Quick Start (One Command to Run Both)

### 1. Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **MongoDB**: Either local MongoDB (`mongodb://127.0.0.1:27017/caresure`) or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection string.

### 2. Environment Variables
Both frontend and backend come preconfigured with development defaults:
- `backend/.env` (Configured for port 5000 and MongoDB)
- `frontend/.env.local` (Configured with `NEXT_PUBLIC_API_URL=http://localhost:5000/api`)

### 3. Run Locally
From this root folder:
```bash
npm run dev
```
This concurrently starts:
- 🌐 **Frontend Application**: `http://localhost:3000`
- ⚙️ **Backend REST API**: `http://localhost:5000` (`http://localhost:5000/api/health`)

---

## 🛠️ Architecture & Tech Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **3D Interactive Hardware View**: Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP
- **Analytics & Charts**: Recharts
- **QR Code Engine**: `react-qr-code` (Emergency Medical Card)
- **Networking**: Axios

### Backend (`/backend`)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & Bcrypt (Dual roles: Caregiver & Patient)
- **OCR Engine**: Tesseract.js (Prescription document text extraction)
- **IoT Hardware Integration**: REST Webhooks for Arduino Uno / ESP32 / ESP8266 smart pill box

---

## 📁 Repository Structure
```
CareSure/
├── backend/            # Express.js REST API & Mongoose models
│   ├── config/         # MongoDB connection & initialization
│   ├── middleware/     # Auth & validation guards
│   ├── models/         # Caregiver, Patient, Dose, Device, Alert schemas
│   ├── routes/         # Auth, Patient, Medication, Hardware, Admin endpoints
│   └── server.js       # Main server entrypoint
├── frontend/           # Next.js 16 App Router UI
│   ├── app/            # Routes: /login, /dashboard, /hardware, /patient, etc.
│   ├── components/     # Guards, 3D Canvas, Navbar, QR Modals
│   ├── lib/            # Axios API client & helpers
│   └── public/         # 3D GLB models & static assets
├── package.json        # Root scripts to orchestrate fullstack dev
└── README.md
```
