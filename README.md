# NoteSpace ⚡

> **Share knowledge. Study together.**  
> A modern, open-source note-sharing platform for college students.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v3-06B6D4)

**NoteSpace** is a static, serverless web application designed to help students share class notes, summaries, and cheat sheets. Built with performance and UX in mind, it features a glassmorphic design, real-time database interactions, and secure authentication.

---

## 🚀 Features

### 👤 Authentication & User Profiles
*   **Secure Sign-up/Login**: Powered by Supabase Auth (Email/Password).
*   **User Profiles**: Custom avatars, stats (likes/followers), and bio.
*   **Persistent Sessions**: Stay logged in across page refreshes.

### 📝 Note Management
*   **Rich Note Creation**: Markdown-style content support.
*   **Image Uploads**: Drag & drop image hosting via Supabase Storage.
*   **Tagging System**: Organize notes by subject (e.g., `#biology`, `#cs101`).
*   **Search**: Real-time filtering by title, content, or tags.

### 💬 Social Interaction
*   **Likes**: Heart your favorite notes.
*   **Comments**: Discuss topics and ask questions on specific notes.
*   **Admin Role**: Moderators can manage content and maintain community standards.

### 🎨 Modern UI/UX
*   **Glassmorphism**: Premium frosted glass aesthetics.
*   **Responsive**: Mobile-first design using Tailwind CSS.
*   **Dark Mode Editor**: Comfortable writing environment.

---

## 🛠️ Tech Stack

*   **Frontend**: React (Vite)
*   **Styling**: Tailwind CSS + Lucide Icons
*   **Backend (BaaS)**: Supabase (PostgreSQL, Auth, Storage)
*   **Hosting**: GitHub Pages (Static)

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/notespace.git
cd notespace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase (Backend)
You need a free Supabase project to run this app.

1.  **Create Project**: Go to [Supabase.com](https://supabase.com) and create a new project.
2.  **Run SQL Setup**:
    *   Open the **SQL Editor** in your Supabase Dashboard.
    *   Copy the contents of `complete_db_setup.txt` (included in this repo).
    *   Paste and click **Run** to generate tables and policies.
3.  **Disable Email Confirm**:
    *   Go to **Authentication** > **Providers** > **Email**.
    *   Disable "Confirm email" (for easier testing).

### 4. Set Environment Variables
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*Get these from Project Settings > API.*

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌍 Deployment

This app is optimized for **GitHub Pages**.

1.  **Build the Project**:
    ```bash
    npm run build
    ```
2.  **Deploy**:
    *   Push the contents of the `dist` folder to a `gh-pages` branch.
    *   OR, configure GitHub Actions to build and deploy automatically on push to `main`.

> **Note on Routing**: This app uses `HashRouter` (`/#/`) to ensure compatibility with static hosting like GitHub Pages without needing server-side rewrite rules.

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
