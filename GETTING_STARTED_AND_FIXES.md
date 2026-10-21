# Mukase by Lulu — Codebase Audit & Getting Started Guide

This document details the issues identified across the codebase, why `npm start` failed, and all changes required to run, build, and develop the application smoothly.

---

## 1. Executive Summary of Audit Findings

### Issue 1: Missing `"start"` Script in `package.json` (Direct Cause of Error)
* **Symptom:** Running `npm start` exited with `npm error Missing script: "start"`.
* **Root Cause:** In `package.json`, only `"dev"`, `"build"`, `"preview"`, `"clean"`, and `"lint"` scripts were defined. Node/npm does not provide a default `start` script for Vite projects.
* **Fix:** Add `"start": "vite --port=3000 --host=0.0.0.0"` (or a launcher script) to `package.json`.

### Issue 2: Windows Shell Incompatibility in `"clean"` Script
* **Symptom:** Running `npm run clean` on Windows PowerShell or CMD fails with `'rm' is not recognized as an internal or external command`.
* **Root Cause:** `"clean": "rm -rf dist server.js"` relies on Unix shell commands.
* **Fix:** Use a cross-platform node script or Node's `fs.rmSync` (e.g. `node -e "fs.rmSync('dist', {recursive:true, force:true})"`).

### Issue 3: Deprecated `__dirname` in `vite.config.ts` (Vite 8 Deprecation Warning)
* **Symptom:** Vite logs a deprecation warning:
  ```
  (!) Your Vite config uses features that are unsupported by configLoader: 'native'
  - __dirname (vite.config.ts:11:27). Use import.meta.dirname instead
  ```
* **Root Cause:** In modern ESM modules (which Vite 8 uses by default), `__dirname` is deprecated in favor of `import.meta.dirname`.
* **Fix:** Replace `__dirname` with `import.meta.dirname` in `vite.config.ts`.

### Issue 4: Missing Environment Configuration (`.env.local`)
* **Symptom:** If AI chat or production URLs are used, missing environment variables will fall back to defaults or fail silently.
* **Root Cause:** `.env.example` defines `GEMINI_API_KEY` and `APP_URL`, but no active `.env` or `.env.local` exists.
* **Fix:** Create a `.env.local` file with fallback values and instructions for the Google Gemini API key.

### Issue 5: Mobile Navigation Absence in Header
* **Symptom:** On mobile screens (< 768px), the main links ("Kitchen Menu", "Our Kitchen Story", "Track Order", "Lulu Concierge") are hidden via `hidden md:flex`, leaving only the logo and the bag button. Users on mobile had no direct way to reach the Kitchen Story or Live Order Tracker without clicking footer buttons.
* **Fix:** Add a responsive mobile hamburger menu / navigation overlay to `Navbar.tsx` to ensure 100% mobile accessibility.

### Issue 6: Unlinked & Dormant Components
* **Symptom:** `KitchenDashboard.tsx` (an older monolithic kitchen dashboard) exists in `src/components/` but is never imported or used. `StandaloneStaffPortal.tsx` replaced it, but was awkwardly wedged inside the customer bundle.
* **Fix:** Consolidate kitchen management into the dedicated standalone admin portal.

---

## 2. Step-by-Step Changes Needed to Get the App Running

### Step 1: Update `package.json` Scripts
Add `"start"`, `"dev:customer"`, `"dev:admin"`, `"server"`, and `"dev:all"`:
```json
{
  "scripts": {
    "start": "vite --port=3000 --host=0.0.0.0",
    "dev": "vite --port=3000 --host=0.0.0.0",
    "dev:customer": "vite --port=3000 --host=0.0.0.0",
    "dev:admin": "vite --config vite.admin.config.ts --port=3001 --host=0.0.0.0",
    "server": "tsx server/index.ts",
    "dev:all": "node scripts/dev-all.js",
    "build": "vite build && vite build --config vite.admin.config.ts",
    "build:customer": "vite build",
    "build:admin": "vite build --config vite.admin.config.ts",
    "preview": "vite preview",
    "clean": "node -e \"const fs=require('fs'); fs.rmSync('dist', {recursive:true, force:true}); fs.rmSync('dist-admin', {recursive:true, force:true});\"",
    "lint": "tsc --noEmit"
  }
}
```

### Step 2: Modernize `vite.config.ts`
Update path aliasing to use `import.meta.dirname`:
```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
```

### Step 3: Create `.env.local`
Create `.env.local` in the project root:
```env
# Gemini API Key for Lulu Concierge AI Chatbot
GEMINI_API_KEY=""

# Shared Backend API URL (for local development)
VITE_API_URL="http://localhost:5000/api"
```

---

## 3. How to Run the App (Commands Cheat-Sheet)

| Goal | Command | URL |
| :--- | :--- | :--- |
| **Start Customer Storefront** | `npm start` or `npm run dev` | `http://localhost:3000` |
| **Start Admin Dashboard (Standalone)** | `npm run dev:admin` | `http://localhost:3001` |
| **Start Shared Sync API Server** | `npm run server` | `http://localhost:5000` |
| **Start Everything Concurrently** | `npm run dev:all` | Customer (3000) + Admin (3001) + API (5000) |
| **Typecheck / Lint** | `npm run lint` | CLI output |
| **Production Build** | `npm run build` | Generates `dist/` and `dist-admin/` |

---

## 4. Mobile Responsiveness Checklist & Verification
* **Touch Targets:** All interactive buttons and selectors have minimum 44px tap targets.
* **Drawer & Modal Overlays:** `CartDrawer`, `ItemCustomizeModal`, and `OrderConfirmationModal` scale dynamically with safe padding on iOS Safari and Android Chrome.
* **Responsive Grid:** Menu items and order cards display in single-column on mobile (<640px), 2-column on tablet (768px), and 3-column on desktop (1024px+).
* **Navigation:** Mobile hamburger menu allows 1-tap switching between Menu, Story, and Live Order Tracker.
