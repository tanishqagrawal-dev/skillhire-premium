# 🚀 SKiL MATRiX | Career Intelligence Platform

[**🔴 Live Demo**](https://skill-hire-62fda.web.app/)

## 📖 Overview
**SKiL MATRiX** is a next-generation career acceleration ecosystem designed to solve the "employability paradox" faced by millions of fresh graduates and job seekers. While traditional job boards only list vacancies, SKiL MATRiX acts as an intelligent bridge, analyzing the user's current baseline and charting a precise, data-driven path to their target role.

By integrating **AI-powered resume analysis, real-time market intelligence, and proprietary upskilling capability**, the platform simulates the experience of a premium career mentorship program. It transforms the job search from a game of chance into a calculated science.

### 🌟 Why SKiL MATRiX?
*   **For Students:** Demystifies the "Black Box" of ATS (Applicant Tracking Systems) and provides concrete steps to improve.
*   **For Professionals:** Offers market-aligned salary data and skill gap bridging to reach Senior/Lead roles.
*   **For Recruiters:** (Simulated) Provides a standardized metric (ATS Score) to evaluate potential efficiently.

---

## ✨ Key Features

### 📊 Advanced Dashboard
*   **Real-Time Analytics:** Interactive visualization of performance trajectories and skill gap radar charts.
*   **Market Intelligence:** Live ticker updates showing salary trends ($125k+), hot skills (e.g., TypeScript), and hiring velocity.
*   **Actionable Insights:** Smart "Daily Priorities" widget that sorts tasks by High/Medium/Low urgency based on goal proximity.
*   **Dynamic Personalization:** The interface "learns" the user, adapting greetings and data context instantly upon profile updates.

### 🧠 AI Coach & Analyzer
*   **Resume Analysis:** Seamlessly integrated Gemini AI simulation that scores specific resume sections and highlights missing keywords (e.g., "Docker", "GraphQL").
*   **Chat Assistant:** Always-on "SKiL MATRiX AI Coach" widget for instant answers to career queries ("How do I negotiate salary?", "Explain Heap Sort").
*   **Skill Bridging:** Automated recommendations to close identified skill gaps directly linked to learning resources.

### 🎓 SKiL MATRiX Academy
*   **Proprietary Learning Environment:** A custom-built course player that replaces external embeds with a distraction-free "Lecture Notes Viewer".
*   **Integrated Assessment:** Module-level progress tracking, interactive quizzes, and "Lock/Unlock" mechanisms for structured learning.
*   **Premium Content:** Courseware authored exclusively under the SKiL MATRiX brand to ensure pedagogical consistency.

### 🛠️ Career Tools Suite
*   **Resume Builder:** WYSIWYG editor with live preview, supporting multiple modern templates.
*   **Mock Interviews:** System design and coding interview simulations with timed challenges.
*   **DSA Practice:** Integrated coding environment for practicing high-frequency technical interview problems.
*   **Roadmap:** Visual, step-by-step career progression paths for various engineering roles.

---

## 🛠️ Tech Stack & Architecture

| Category | Technology |
|----------|------------|
| **Frontend** | HTML5, CSS3 (Vanilla + Custom Variables), JavaScript (ES6+) |
| **Design System** | Glassmorphism UI (Backdrop Filter), Lucide Icons, Google Fonts (Outfit) |
| **Visualization** | Chart.js for analytics and radar charts, Vanilla Tilt for 3D effects |
| **Backend / Auth** | Firebase (Authentication, Firestore) |
| **AI Integration** | Google Gemini API (Service Layer) |
| **Assets** | DiceBear Avatars, Unsplash & Pexels Imagery, SVG Repo |

---

## 📂 Project Structure

```bash
skillhire-premium-1/
├── assets/             # Branding, favicons, and static imagery
├── css/                # Modular, scalable CSS architecture
│   ├── dashboard.css   # Core dashboard layout and aesthetics
│   ├── courses.css     # Learning management system styles
│   ├── ai_coach.css    # Floating AI widget styling
│   └── ...
├── js/                 # Client-side application logic
│   ├── dashboard.js    # Central state management & DOM manipulation
│   ├── ai_coach.js     # AI interactions and chat state
│   ├── services/       # API abstraction layers (Gemini, Firebase)
│   └── ...
├── pages/              # Application sub-views
│   ├── dashboard.html  # Main command center
│   ├── signup.html     # Auth flow
│   └── ...
├── index.html          # Landing page conversion funnel
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/tanishqagrawal-dev/skillhire-premium.git
    ```
2.  **Open in Editor**
    Navigate to the project folder in VS Code or your preferred editor.
3.  **Run Locally**
    *   Serve the files using a simple HTTP server (e.g., VS Code "Live Server" extension).
    *   No complex build steps (npm/webpack) required for the vanilla frontend.
4.  **Firebase Config**
    *   Ensure `js/config.js` is populated with valid Firebase project credentials to enable Auth and Database features.

## 👥 User Roles
*   **Guest Mode:** Instant, friction-free access with a "User" persona to explore all features without signup.
*   **Authenticated User:** Full persistence of progress, profile customization ("Tanishq"), and saved Resume drafts.

## 📄 License
This project is for educational and portfolio purposes, demonstrating advanced frontend engineering techniques.

---
**Designed & Developed by *Part of the Deepmind Advanced Agentic Coding Initiative*
