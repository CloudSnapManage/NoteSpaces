# CampusNotes - Free Note Sharing for Students

A React-based web application for sharing notes, hosted on GitHub Pages with Supabase backend.

## 🚀 Setup & Deployment Guide

### 1. Supabase Setup (Backend)
1. Go to [Supabase](https://supabase.com/) and create a new free project.
2. Go to the **SQL Editor** in the sidebar.
3. Copy the content of `SUPABASE_SETUP.sql` from this project and paste it into the SQL Editor. Run the query.
   * *Note: This creates the Tables, Row Level Security policies, and Storage policies.*
4. Go to **Storage** in the sidebar:
   * Create a new bucket named `note-images`.
   * Ensure "Public" is toggled ON.

### 2. Environment Variables
1. Create a `.env` file in the root directory (local development).
2. Add your keys from Supabase Dashboard -> Project Settings -> API:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

### 4. Deploy to GitHub Pages
1. Push this code to a GitHub repository.
2. Go to your repository **Settings** -> **Secrets and variables** -> **Actions**.
3. Add repository secrets for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   * *Alternatively*, for a pure static deployment without Actions:
     * Create a `.env.production` file with your keys (Note: These keys are visible in the browser bundle regardless, which is safe for the `ANON` key if RLS is set up correctly).
4. **Manual Build & Deploy**:
   ```bash
   npm run build
   ```
   * Push the contents of the `dist` folder to a `gh-pages` branch, OR
   * Go to Repo Settings -> Pages -> Build and deployment -> Source: **GitHub Actions** (Recommended for React apps) or simply select the branch if you pushed the built assets.

   **Easiest Static Host Method:**
   1. In `vite.config.ts`, ensure `base: './'` is set (already done).
   2. Run `npm run build`.
   3. Upload the contents of the `dist` folder to any static host, or push the `dist` folder content to a `gh-pages` branch.

### 5. Authentication
* By default, Supabase requires email confirmation.
* For testing: Go to Supabase Auth -> Providers -> Email -> **Disable "Confirm email"** to allow instant login after registration.

## Features
* **Authentication**: Secure login/signup.
* **Storage**: Upload images for free.
* **Database**: Real-time note storage with tags.
* **UI**: Fully responsive Tailwind CSS design.
