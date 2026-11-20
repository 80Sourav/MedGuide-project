# 🏥 MedGuide — AI-Powered Healthcare Management

**MedGuide** is a full-stack healthcare management application built using the MERN stack. It helps users manage prescriptions, medicines, appointments, reminders, and medical history in one place.

The application integrates **OCR and Generative AI** to extract information from uploaded prescriptions and provide easy-to-understand medical summaries.

## ✨ Features

- 🔐 **User Authentication** — Secure registration and login using JWT and bcrypt.
- 🤖 **AI Prescription Analysis** — Extract prescription text using Tesseract OCR and analyze it with Gemini AI or Groq.
- 💊 **Medicine Management** — Add, edit, delete, and track medicines and dosages.
- 📅 **Appointment Management** — Schedule and manage doctor appointments.
- ⏰ **Reminders** — Create reminders for medicines, appointments, and refills.
- 🩺 **Medical History** — Maintain allergies, medical conditions, surgeries, and health records.
- 💬 **AI Chat** — Ask questions about uploaded prescriptions.
- 📊 **Dashboard** — View medicine details, health statistics, and upcoming appointments.

## 🛠️ Tech Stack

| Frontend | Backend | Database & Tools |
|---|---|---|
| React.js | Node.js | MongoDB |
| Tailwind CSS | Express.js | Mongoose |
| Vite | JWT & bcryptjs | Tesseract OCR |
| Axios | Multer | Gemini AI & Groq |
| React Router | REST APIs | Git & GitHub |

## 🏗️ Architecture

**React Frontend → Express REST API → Controllers & Services → MongoDB**

Prescription processing:

**Upload Prescription → Multer → Tesseract OCR → Gemini/Groq AI → MongoDB → React UI**

## 📁 Project Structure

- **backend/**
  - `config/` — Database configuration
  - `controllers/` — Request handling and business logic
  - `models/` — Mongoose schemas
  - `routes/` — API endpoints
  - `middleware/` — Authentication, errors, and file uploads
  - `services/` — OCR and AI integration
  - `utils/` — Helper functions
  - `server.js` — Backend entry point
- **frontend/**
  - `src/components/` — Reusable React components
  - `src/pages/` — Application pages
  - `src/context/` — Global state management
  - `src/services/` — Backend API integration
  - `src/hooks/` — Custom React hooks
  - `src/App.jsx` — Application routing
  - `src/main.jsx` — Frontend entry point

## ⚙️ Installation

**1. Clone the repository**

`git clone https://github.com/80Sourav/MedGuide.git`

`cd MedGuide`

**2. Backend Setup**

`cd backend`

`npm install`

Create a `.env` file inside `backend` and configure:

- `PORT=5000`
- `MONGO_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_secure_jwt_secret`
- `GEMINI_API_KEY=your_gemini_api_key`
- `GROQ_API_KEY=your_groq_api_key` (optional alternative)

Start the backend:

`npm run dev`

**3. Frontend Setup**

Open another terminal:

`cd frontend`

`npm install`

Create `frontend/.env` with:

`VITE_API_URL=http://localhost:5000/api`

Start the frontend:

`npm run dev`

Open **http://localhost:3000** in your browser.

## 🔐 Security & Development Status

MedGuide is currently a development/portfolio project, not a production-ready medical platform.

Before deploying publicly, the development authentication fallback must be removed, uploaded prescriptions must be protected from unauthorized access, and hardcoded JWT secret fallbacks must be eliminated. PDF upload handling also requires additional OCR support.

Never commit `.env` files, API keys, or private medical documents.

## 🚀 Future Improvements

- Real-time medicine notifications
- Secure cloud prescription storage
- Improved PDF and handwritten prescription recognition
- Doctor and patient role management
- Automated testing and deployment

## 👨‍💻 Developer

**80Sourav**

GitHub: https://github.com/80Sourav

---

*⚕️ Disclaimer: MedGuide is an educational project. AI-generated medical information may contain errors and must not replace professional medical advice.*

**Made with ❤️ using the MERN Stack and AI.**