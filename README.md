# 💬 Chatify – Real-Time Chat Application

Chatify is a full-stack real-time messaging application built using the MERN stack. It enables users to communicate instantly with secure authentication, live messaging, and online user tracking using Socket.IO.

---

## 🚀 Live Demo

👉 https://full-stack-chat-app-z6xg.onrender.com

---

## ✨ Features

- 🔐 User Authentication (JWT + Cookies)
- 💬 Real-Time Messaging using Socket.IO
- 👥 Online Users Presence Tracking
- ⚡ Instant Message Delivery (Low Latency)
- 🔄 Multi-User & Multi-Tab Support
- 🗂️ Persistent Chat History (MongoDB)
- 🎨 Responsive UI (Tailwind + DaisyUI)

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS + DaisyUI
- Zustand
- Socket.IO Client

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication

---

## ⚙️ How It Works

```text
User A sends message
      ↓
Backend finds receiver socket
      ↓
Message sent using io.to(socketId)
      ↓
Receiver gets message instantly

📂 Project Structure
Chatify/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── models/
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── store/
│   │   └── components/
│
└── package.json


⚡ Installation & Setup
1. Clone Repository
git clone https://github.com/YOUR_USERNAME/Chatify.git
cd Chatify
2. Install Dependencies
npm install --prefix backend
npm install --prefix frontend
3. Setup Environment Variables

Create .env in backend:

MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
4. Run Project
npm run dev --prefix backend
npm run dev --prefix frontend