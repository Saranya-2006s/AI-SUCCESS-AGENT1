<div align="center">

# 🎓.............AI College Success Agent..............

### Your Intelligent Academic Companion Powered by AI

<img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react"/>
<img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript"/>
<img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js"/>
<img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb"/>
<img src="https://img.shields.io/badge/Firebase-Authentication-orange?style=for-the-badge&logo=firebase"/>
<img src="https://img.shields.io/badge/Gemini-AI-purple?style=for-the-badge&logo=google"/>

An AI-powered academic assistant that helps students manage studies, assignments, attendance, placements, schedules, and personalized learning using Google Gemini AI.

---

</div>

# ✨ Features

## 📚 Academic Management

- Smart Study Planner
- Assignment Manager
- Timetable Management
- Library Resources
- Goal Generator
- Analytics Dashboard

---

## 🤖 AI Features

- AI Chat Assistant
- Personalized Study Plans
- Intelligent Goal Recommendations
- Academic Guidance
- Learning Support

---

## 📈 Student Analytics

- Attendance Prediction
- Progress Tracking
- Performance Dashboard
- Productivity Analytics

---

## 💼 Placement Preparation

- Aptitude Practice
- Placement Resources
- Interview Preparation
- Career Guidance

---

# 🏗 Project Architecture

```text
                        +----------------------+
                        |      Student         |
                        +----------+-----------+
                                   |
                                   |
                          React + TypeScript
                                   |
        ---------------------------------------------------
        |          |          |         |                 |
        |          |          |         |                 |
 Dashboard  Study Planner  AI Chat  Analytics   Assignment Manager
        |          |          |         |                 |
        ---------------------------------------------------
                                   |
                              Express Server
                                   |
             ---------------------------------------
             |                                     |
      Google Gemini AI                     Firebase Services
             |                                     |
             -------------------+-------------------
                                 |
                           MongoDB Database
                                 |
                     Student Data / Tasks / Goals
```

---

# 🛠 Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Recharts

## Backend

- Node.js
- Express.js

## Database

- MongoDB

## AI

- Google Gemini API

## Cloud

- Firebase

---

# 📂 Project Structure

```
AI-COLLEGE-SUCCESS-AGENT
│
├── src
│   ├── components
│   ├── data
│   ├── firebase.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
│
├── server.ts
├── package.json
├── vite.config.ts
├── firebase-blueprint.json
└── firestore.rules
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/AI-COLLEGE-SUCCESS-AGENT.git
```

Move into project

```bash
cd AI-COLLEGE-SUCCESS-AGENT
```

Install dependencies

```bash
npm install
```

Configure environment

```bash
cp .env.example .env
```

Start Development Server

```bash
npm run dev
```

---

# ⚙ Environment Variables

Create a `.env` file

```env
GEMINI_API_KEY=your_api_key

MONGODB_URI=your_mongodb_connection_string

FIREBASE_API_KEY=

FIREBASE_AUTH_DOMAIN=

FIREBASE_PROJECT_ID=

FIREBASE_STORAGE_BUCKET=

FIREBASE_MESSAGING_SENDER_ID=

FIREBASE_APP_ID=
```

---

# 📱 Application Modules

✅ Dashboard

✅ Study Planner

✅ Assignment Manager

✅ AI Chatbot

✅ Attendance Predictor

✅ Goal Generator

✅ Analytics

✅ Library

✅ Placement Preparation

✅ Timetable

---

# 🔄 Application Workflow

```text
Student
   │
   ▼
React Frontend
   │
   ▼
Express Backend
   │
   ├──────────────► Google Gemini AI
   │
   ├──────────────► Firebase
   │
   └──────────────► MongoDB
                      │
                      ▼
               Student Records
               Assignments
               Attendance
               Goals
               Analytics
```

---

# 📊 Database Collections

```text
students

assignments

attendance

studyPlans

goals

analytics

timetable

placement

library
```

---

# 🎯 Future Enhancements

- AI Voice Assistant
- OCR Notes Scanner
- Smart Attendance using Face Recognition
- Mobile Application
- Real-Time Notifications
- AI Exam Predictor
- PDF Study Material Generator
- AI Resume Builder

---

# 📷 Screenshots

```
screenshots/

├── dashboard.png

├── chatbot.png

├── planner.png

├── analytics.png

├── attendance.png
```

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

3. Commit your changes

4. Push the branch

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Saranya S**

AI Developer | Full Stack Developer

---

<div align="center">

### ⭐ If you like this project, don't forget to star the repository!

Made with ❤️ using React, TypeScript, MongoDB, Firebase and Google Gemini AI
