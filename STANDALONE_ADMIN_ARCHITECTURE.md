# Standalone Admin Dashboard Architecture & Decoupling Guide

This document explains why and how the Admin/Kitchen Dashboard is decoupled from the public customer storefront into an independent standalone application, how they run on separate localhosts, and how they communicate seamlessly in real time.

---

## 1. Problem Statement: Why Embedded Admin in Customer UI is an Anti-Pattern

In the original codebase:
1. The Admin Dashboard (`StandaloneStaffPortal.tsx` and `StaffAuthGuard.tsx`) was bundled directly inside the customer-facing `App.tsx`.
2. Access was hidden behind:
   - A tiny padlock icon (`<Lock className="w-3 h-3" />`) in `Footer.tsx` linking to `?portal=staff`.
   - A secret keyboard shortcut `Ctrl+Shift+K` or `Cmd+Shift+K`.
   - URL parameters (`/staff`, `?portal=staff`, `#staff`).
3. **Severe Security & Architecture Risks:**
   - **Exposed Customer Data:** All previous customer orders (including phone numbers, physical home addresses, delivery notes, and payment handles) were downloaded into the customer's browser bundle in demo or storage state.
   - **Client-Side PIN Vulnerability:** The kitchen master PIN (`8492`) and override key were stored in client JavaScript files, trivially discoverable by inspecting browser sources.
   - **Bundle Bloat:** Customers downloaded kitchen management UI, audio chimes, audit logs, and fraud analysis tools they never use.
   - **Isolated Storage Across Ports:** In browser security models, `http://localhost:3000` and `http://localhost:3001` have separate `localStorage` partitions. Without a shared communication bridge, running them on different ports resulted in zero synchronization.

---

## 2. Decoupling Blueprint: The 3-Tier Architecture

To achieve clean separation and seamless communication, we implement a decoupled 3-tier architecture:

```
┌──────────────────────────────────────┐        ┌──────────────────────────────────────┐
│       CUSTOMER STOREFRONT            │        │       ADMIN / KITCHEN PORTAL         │
│      http://localhost:3000           │        │       http://localhost:3001          │
│                                      │        │                                      │
│  - Public menu & cart                │        │  - Master PIN auth guard             │
│  - WhatsApp / iMessage checkout      │        │  - Live incoming order queue         │
│  - Live Order Tracker (SSE)          │        │  - Audio chime notifications         │
│  - Lulu Concierge AI                 │        │  - One-click status management       │
│  - 0% Admin code in bundle           │        │  - Fraud & duplicate detection       │
└──────────────────┬───────────────────┘        └──────────────────┬───────────────────┘
                   │                                               │
                   │               REST API & SSE                  │
                   ▼                                               ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              SHARED SYNC API SERVER                                  │
│                              http://localhost:5000                                   │
│                                                                                      │
│  - REST Endpoints: /api/orders, /api/orders/:id/status, /api/auth/login, /api/logs    │
│  - Server-Sent Events (SSE) Stream: /api/events (Instant bi-directional push)        │
│  - Automatic In-Memory + Disk Sync with fallback to LocalStorage                     │
│  - Permissive CORS for localhost:3000, localhost:3001, and production origins        │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Code Modifications Made to Remove Admin from Customer UI

### A. Removed Padlock Icon from Footer (`src/components/Footer.tsx`)
* **Before:** A quiet padlock link `<a href="?portal=staff"><Lock /></a>` sat in the copyright bar.
* **After:** Removed completely. Public footer now only contains legitimate customer links (Menu, Story, Tracker, Privacy Policy, Terms).

### B. Cleaned Public App (`src/App.tsx`)
* **Before:** `App.tsx` contained `isStaffRoute()`, `handleKeyDown` (Ctrl+Shift+K), and rendered `<StaffAuthGuard>` conditionally.
* **After:** Pure customer storefront. No staff routes, no secret keys, no admin state.

### C. Created Standalone Admin Entry
* **HTML Entry:** `admin.html` (dedicated lightweight HTML page with proper title and meta tags for kitchen staff).
* **Vite Config:** `vite.admin.config.ts` running Vite on port `3001` pointing to `admin.html`.
* **Admin Root Component:** `src/admin/AdminApp.tsx` and `src/admin/main.tsx` providing isolated authentication, session management, and dashboard controls.

---

## 4. How They Communicate Seamlessly Across Different Localhosts

### The Cross-Origin Challenge
Browsers enforce the **Same-Origin Policy**:
* `http://localhost:3000` cannot read `localStorage` of `http://localhost:3001`.
* If a customer creates an order on port 3000, an admin on port 3001 will never see it via `localStorage` alone.

### The Solution: Shared Sync API Server (`server/index.ts`)
We run a lightweight Express server on port `5000`:
1. **Order Creation:** When a customer checks out on port 3000:
   - Client sends `POST http://localhost:5000/api/orders`.
   - The server stores the order and broadcasts an `order_created` event to the SSE stream.
2. **Instant Kitchen Alert:**
   - The Admin Dashboard on port 3001 is connected to `http://localhost:5000/api/events`.
   - It receives the event instantly, plays the audio chime, and displays the order in the "Pending Verification" queue.
3. **Status Update (Kitchen to Customer):**
   - Chef Lulu clicks **"Verify & Move to Kitchen"** on port 3001.
   - Admin sends `PATCH http://localhost:5000/api/orders/:id/status` with `preparing_in_kitchen`.
   - The server broadcasts an `order_updated` event.
   - The customer's **Live Order Tracker** on port 3000 instantly advances its progress bar to "In Lulu's Kitchen" with zero page refresh!
4. **Offline Resilience:** If the server is not started, both apps seamlessly fall back to local mock data and `localStorage` without crashing.

---

## 5. Testing & Verification Workflow (Step-by-Step)

### Step 1: Start All Services
In your terminal, run:
```bash
npm run dev:all
```
This concurrently boots:
* **Sync API Server:** `http://localhost:5000`
* **Customer Storefront:** `http://localhost:3000`
* **Admin Dashboard:** `http://localhost:3001`

*(Alternatively, you can open 3 terminal tabs and run `npm run server`, `npm run dev:customer`, and `npm run dev:admin`)*

### Step 2: Open Both Windows Side-by-Side
* Window A: Navigate to `http://localhost:3000` (Customer View)
* Window B: Navigate to `http://localhost:3001` (Admin View)

### Step 3: Log In to the Admin Terminal
* In Window B, enter default Master PIN: `8492`.
* You will enter the Kitchen Dashboard with live revenue stats and order columns.

### Step 4: Place a Customer Order
* In Window A (`localhost:3000`):
  1. Add **"Jollof with Goat Meat"** to the Order Bag.
  2. Open the Order Bag drawer and fill in customer info (Name, Phone, Address, CashApp tag).
  3. Click **"Order via WhatsApp / Direct Checkout"**.
  4. Note the generated Order ID (e.g. `MUK-8492`).

### Step 5: Verify Instant Kitchen Reception
* Immediately switch to Window B (`localhost:3001`):
  - Notice the audio chime rings.
  - The new order appears at the top of the **Pending Payment** queue with the matching memo ID.

### Step 6: Update Kitchen Status & Watch Customer Live Tracker
* In Window B, click **"Verify & Mark Cooking"**.
* In Window A, navigate to **"Track Order"** (or click "Track My Order" in confirmation):
  - Notice the status progress bar shows **"In Lulu’s Kitchen"** in real time!
* In Window B, click **"Dispatch Courier"**:
  - Notice the status on Window A instantly shifts to **"Out for Delivery"** with assigned courier notes!

---

## 6. Pre-Production & Production Deployment Guide

| Component | Dev Host | Recommended Production Target | Configuration |
| :--- | :--- | :--- | :--- |
| **Customer Storefront** | `http://localhost:3000` | `https://mukasebylulu.com` (Vercel / Cloudflare Pages / Netlify) | Set `VITE_API_URL="https://api.mukasebylulu.com/api"` |
| **Admin Dashboard** | `http://localhost:3001` | `https://kitchen.mukasebylulu.com` (Protected Cloud Run / Vercel with Auth) | Set `VITE_API_URL="https://api.mukasebylulu.com/api"` |
| **Sync API Server** | `http://localhost:5000` | `https://api.mukasebylulu.com` (Node.js / Cloud Run / Railway / Render) | Configure CORS origins for `mukasebylulu.com` and `kitchen.mukasebylulu.com` |

### Security Hardening for Production:
1. Replace in-memory orders with a persistent database (PostgreSQL, Supabase, or MongoDB).
2. Protect the `/api/orders/:id/status` endpoint with JWT Bearer tokens issued upon successful PIN authentication.
3. Configure rate limiting and IP allowlisting for the admin domain.
