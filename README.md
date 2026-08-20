# PursuitPath — Job Discovery & Pursuit Portal 

**PursuitPath** is a full-stack career management command center built on the **MERN stack**. It transforms the chaotic job search process into a structured, data-driven journey. Unlike traditional job boards, PursuitPath focuses on the "post-discovery" phase, allowing users to track applications through a visual pipeline and analyze their compatibility with roles using a custom Match Score engine.

---

## Key Features

### 1. Unified Job Discovery
- Integrates with the **Adzuna API** to fetch real-time job listings.
- Features a **Hybrid Search** that combines global API results with "Path Partner" jobs posted directly by recruiters on the platform.

### 2. Kanban Pursuit Board
- A draggable pipeline: **Wishlist ➔ Applied ➔ Interviewing ➔ Offer ➔ Rejected**.
- Persistent state management—your application stages stay saved in MongoDB even after refresh.

### 3. Intelligent Match Engine
- Custom algorithm that parses job titles and descriptions.
- Compares job requirements against the user's saved **Professional Profile**.
- Visualizes compatibility with a dynamic Match Percentage bar.

### 4. Role-Based Access Control (RBAC)
- **Candidates:** Discover jobs, manage profiles, and track pursuits.
- **Recruiters:** Post manual vacancies, set application deadlines, and view "Available Talent" analytics and "Average Match" scores for their listings.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt.js
- **State & Drag-and-Drop:** @hello-pangea/dnd
- **Notifications:** React Hot Toast

---

## 🚀 Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Bhuvana123398/PursuitPath.git