🚀 CivicFix – Smart Community Issue Reporting System

CivicFix is a full-stack web application that allows citizens to report local issues (like electricity, water, road problems) and automatically routes them to the correct organization for resolution.

🌟 Features
👤 User
Register & Login (JWT आधारित authentication)
Raise issues with:
Title, Description
Category (Electric / Water / Road)
City (for routing)
📍 Exact location (Google Maps link)
Image upload
Track issue status:
Pending
In Progress
Resolved
🏢 Organization
View assigned issues automatically (Smart Routing)
Update status:
🚀 Start Solving → in_progress
✅ Mark Completed → resolved
Receive notifications
🔔 Notifications
User gets updates when status changes
Organization gets new issue alerts
🧠 Smart Routing Logic

Issues are automatically assigned based on:

User City + Category → Matching Organization

Example:

City: Sambalpur
Category: Electric
→ Assigned to Electricity Dept (Sambalpur)
🛠 Tech Stack
Frontend
React (Vite)
CSS / Basic UI
Fetch API
Backend
FastAPI
SQLAlchemy ORM
JWT Authentication
Database
PostgreSQL (Neon)
Deployment
Backend: Render
Frontend: Vercel / Netlify (recommended)
📂 Project Structure
civicfix/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── db/
│   │   ├── dependencies.py
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── api.js
│   │   └── App.jsx
│
└── README.md
⚙️ Backend Setup
1. Create virtual environment
python -m venv venv
venv\Scripts\activate
2. Install dependencies
pip install -r requirements.txt
3. Create .env
DATABASE_URL=your_neon_postgres_url
SECRET_KEY=your_secret_key
4. Run server
uvicorn app.main:app --reload
🌐 Frontend Setup
cd frontend
npm install
npm run dev
🔗 API Base URL

For local:

http://localhost:8000

For deployed backend:

https://your-render-url.onrender.com
📍 Google Maps Location Feature

Users can attach a Google Maps link for precise location tracking.

Example:

https://maps.google.com/?q=21.4704,83.9701
🔄 Issue Status Flow
User creates issue
        ↓
Status = Pending
        ↓
Organization clicks "Start Solving"
        ↓
Status = In Progress
        ↓
Organization clicks "Mark Completed"
        ↓
Status = Resolved
        ↓
User gets notification
🚀 Future Improvements
📍 Map Picker (click to select location)
🗺 Mini map preview in issue card
📊 Admin dashboard analytics
📱 Mobile responsive UI
🔔 Real-time notifications (WebSockets)
👨‍💻 Author

Prateek Kumar Hota

📄 License

This project is for educational and portfolio purposes.