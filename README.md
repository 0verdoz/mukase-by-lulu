# Mukase by Lulu — Authentic West African Kitchen

**Mukase by Lulu** is a comprehensive e-commerce platform for authentic West African cuisine. It seamlessly blends the public customer storefront with a full-featured admin/kitchen dashboard, powered by Google Gemini AI for smart concierge services.

This repository contains a **Production-Ready Build** (see `dist/` and `dist-admin/`) along with the full source code.

---

## 📂 Repository Structure

- **[src/](src/)** — Full source code for both applications.
  - **[src/components/](src/components/)** — Reusable UI components (Navbar, Cart, Menu, etc.).
  - **[src/admin/](src/admin/)** — Standalone admin/kitchen dashboard application.
- **[dist/](dist/)** — Compiled production build for the Customer Storefront.
- **[dist-admin/](dist-admin/)** — Compiled production build for the Admin/Kitchen Dashboard.
- **[server/](server/)** — Node.js Sync API server.
- **[public/](public/)** — Public assets and shared HTML entry points (`index.html`, `admin.html`).
- **[scripts/](scripts/)** — Utility and build scripts.

---

## ⚙️ Run Locally

### Prerequisites

- **Node.js** (v14 or higher recommended)

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Copy [.env.example](.env.example) to [.env.local](.env.local) and add your Gemini API key:

```env
GEMINI_API_KEY="your-google-gemini-api-key"
# For local dev, usually localhost unless you have complex proxy setup
VITE_API_URL="http://localhost:5000/api"
```

### 3. Run the Application

#### Start Everything Concurrently (Recommended)

This starts:

- Customer Storefront (port 3000)
- Admin Dashboard (port 3001)
- Shared Sync API Server (port 5000)

```bash
npm run dev:all
```

#### Start Separately

**Customer Storefront:**

```bash
npm run dev
```

→ Access: **[http://localhost:3000](http://localhost:3000)**

**Admin/Kitchen Dashboard:**

```bash
npm run dev:admin
```

→ Access: **[http://localhost:3001](http://localhost:3001)**

**Sync API Server:**

```bash
npm run server
```

→ Access: **[http://localhost:5000](http://localhost:5000)**

---

## 🚀 Production Build

Build and serve both the customer store and the admin dashboard.

```bash
# Build both customer and admin
npm run build

# Serve customer production build (lightweight)
npm run preview
```

---

## 🔐 Admin Access

The Admin Dashboard is completely separated for security. Access it directly at `http://localhost:3001`.

- **Authentication**: Master PIN: `8492`
- **Features**: View orders, track status, manage menu, and view audit logs.

---

## 🎯 Key Features

- **🛒 E-Commerce**: Full product catalog, customization options, and checkout flow.
- **🤖 AI Concierge**: Powered by Google Gemini to answer customer questions.
- **🔐 Full Admin Dashboard**: Separate, secure portal for kitchen staff with live order tracking.
- **🌐 Cross-Platform**: Built with Vite and React, ready for web and mobile.
