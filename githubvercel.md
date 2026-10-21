# The Complete Beginner's Guide: GitHub, Vercel & Render Deployment

This guide is written for complete beginners. By following these exact steps, you will:
1. Fix the Vercel build error you experienced.
2. Push your clean code to GitHub without merge conflicts.
3. Deploy all **3 parts of your project** from this **single codebase**:
   * **Part 1 (Customer Storefront)** → Deployed on **Vercel**
   * **Part 2 (Admin / Kitchen Terminal with Auth)** → Deployed on **Vercel** as a 2nd project
   * **Part 3 (Shared Sync API Server)** → Deployed on **Render** (or **Railway**)
4. Connect them so customer orders on Vercel show up live in the admin terminal in real time!

---

## 0. Why Did Vercel Fail? (The Quick Explanation)

When you tried deploying on Vercel, the build failed because git merge conflict markers (lines like `<<<<<<< HEAD`, `=======`, and `>>>>>>> main`) had accidentally been saved inside your `package.json` and source code files. 

Because `package.json` must be strict JSON, npm crashed as soon as it tried to read it. **We have already cleaned and repaired all conflict markers locally.** Now we just need to push this clean state to GitHub.

---

## The Big Picture: How 1 Repo Powers 3 Separate Live Apps

You do **NOT** need to split your code into 3 separate repositories! Modern web platforms allow you to connect the same GitHub repository multiple times with different commands:

```
                          ┌───────────────────────────┐
                          │   Your 1 GitHub Repo      │
                          │   (0verdoz/mukase-by-lulu)│
                          └─────────────┬─────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
           ▼                            ▼                            ▼
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  Vercel (Project 1)  │     │  Vercel (Project 2)  │     │  Render / Railway    │
│  Customer Storefront │     │  Admin / Kitchen     │     │  Sync API Server     │
│                      │     │                      │     │                      │
│ Build:               │     │ Build:               │     │ Start:               │
│ npm run build:customer│    │ npm run build:admin  │     │ npx tsx server/index │
│ Output: dist         │     │ Output: dist-admin   │     │                      │
│ URL: mukase.vercel...│     │ URL: admin.vercel... │     │ URL: api.onrender... │
└──────────┬───────────┘     └──────────┬───────────┘     └──────────▲───────────┘
           │                            │                            │
           └────────────────────────────┴────────────────────────────┘
                        Connected via VITE_API_URL
```

---

## Phase 1: Push Your Clean Code to GitHub

Open your terminal in `c:\Users\HP\Downloads\mukase-by-lulu---authentic-west-african-kitchen` and run these exact commands:

### Step 1.1: Verify your git status
```bash
git status
```
You will see the modified clean files (including fixed `package.json`).

### Step 1.2: Stage all changes
```bash
git add .
```

### Step 1.3: Commit the clean code
```bash
git commit -m "Fix package.json and prepare standalone production builds"
```

### Step 1.4: Push to GitHub
If your default branch is `master`:
```bash
git push origin master
```
*(If you use `main` instead, run `git push origin main`)*

Your clean code is now live on GitHub with zero syntax errors!

---

## Phase 2: Deploy the Backend Sync Server (Render or Railway) FIRST

> **Why do this first?**  
> Because both the Customer Storefront and the Admin Terminal need to know your live server URL (`https://your-api.onrender.com`) when they build!

We will use **Render** (it is 100% free and requires no credit card).

### Step 2.1: Create your Render Account
1. Go to [https://render.com](https://render.com) and click **Sign Up**.
2. Choose **Continue with GitHub** so it links automatically.

### Step 2.2: Create a New Web Service
1. In your Render Dashboard, click the blue **New +** button at the top right.
2. Select **Web Service**.
3. Select **Build and deploy from a Git repository** -> Click **Next**.
4. You will see your GitHub repos. Find **`mukase-by-lulu`** and click **Connect**.  
   *(If you don't see it, click "Configure access" to give Render permission to your repo)*.

### Step 2.3: Fill in the Service Settings
Fill in these exact fields:

| Field | What to Enter |
| :--- | :--- |
| **Name** | `mukase-sync-api` (or any name you like) |
| **Region** | Choose whichever is closest to you (e.g. Frankfurt, Ohio, Oregon) |
| **Branch** | `master` (or `main`, matching what you pushed in Phase 1) |
| **Root Directory** | Leave blank |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npx tsx server/index.ts` |
| **Instance Type** | Select **Free** |

### Step 2.4: Add Environment Variables
Scroll down to the **Environment Variables** section and click **Add Environment Variable**:
* **Key:** `PORT`
* **Value:** `5000`
* **Key:** `NODE_ENV`
* **Value:** `production`

### Step 2.5: Deploy!
Click **Create Web Service** at the bottom of the page.
* Render will spend 1-2 minutes installing dependencies and booting your server.
* Once it's finished, you will see a green **Live** badge.
* At the top left, under the service name, copy your live public URL!  
  *(It will look like `https://mukase-sync-api.onrender.com`)*.

### Step 2.6: Test Your Live API
Open a new browser tab and paste your Render URL followed by `/api/health`:
```
https://mukase-sync-api.onrender.com/api/health
```
If you see `{"status":"ok", ...}`, **congratulations! Your backend sync engine is live on the internet!**

---

## Phase 3: Deploy Customer Storefront on Vercel

Now we deploy the public e-commerce store where customers view the menu, add jollof to their bag, and order via WhatsApp.

### Step 3.1: Log in to Vercel
1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.

### Step 3.2: Create Project 1 (Customer Storefront)
1. On your Vercel Dashboard, click **Add New...** -> **Project**.
2. Find **`0verdoz/mukase-by-lulu`** and click **Import**.

### Step 3.3: Configure Project Settings
In the configuration screen:
1. **Project Name:** `mukase-customer` (or `mukase-by-lulu`)
2. **Framework Preset:** Select **Vite**
3. **Root Directory:** `./` (leave default)

### Step 3.4: Set Build and Output Settings (Crucial!)
Click the toggle to expand **Build and Output Settings**:
* **Build Command:** Toggle ON -> Enter: `npm run build:customer`
* **Output Directory:** Leave as `dist`
* **Install Command:** Leave default (`npm install`)

### Step 3.5: Set Environment Variables
Expand **Environment Variables** and add:
* **NAME:** `VITE_API_URL`
* **VALUE:** `https://mukase-sync-api.onrender.com/api`  
  *(Use the exact Render URL you got from Phase 2, and make sure to include `/api` at the end!)*
* **NAME:** `GEMINI_API_KEY` (Optional)
* **VALUE:** Your Google Gemini API key if you want the Lulu Concierge AI chatbot to answer customer questions.

### Step 3.6: Click Deploy
Click **Deploy**!
* Vercel will run the build in ~20 seconds.
* When it finishes, you get a live URL like `https://mukase-customer.vercel.app`!
* Click it: Your customer store is alive with the menu, bag drawer, story page, and order tracker!

---

## Phase 4: Deploy Admin / Kitchen Terminal on Vercel (Project 2)

Here is the secret: **You can deploy the exact same GitHub repo a second time on Vercel with different settings!**

### Step 4.1: Create Project 2 in Vercel
1. Go back to your main [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Select the **EXACT SAME REPO** (`0verdoz/mukase-by-lulu`) and click **Import** again!

### Step 4.2: Configure Project Settings
1. **Project Name:** `mukase-admin` (or `mukase-kitchen`)
2. **Framework Preset:** Select **Vite**
3. **Root Directory:** `./` (leave default)

### Step 4.3: Set Build and Output Settings for Admin
Expand **Build and Output Settings**:
* **Build Command:** Toggle ON -> Enter: `npm run build:admin`
* **Output Directory:** Toggle ON -> Enter: `dist-admin`
* **Install Command:** Leave default (`npm install`)

### Step 4.4: Add Environment Variables
Expand **Environment Variables**:
* **NAME:** `VITE_API_URL`
* **VALUE:** `https://mukase-sync-api.onrender.com/api`

### Step 4.5: Click Deploy
Click **Deploy**!
* Vercel builds the standalone admin portal into `dist-admin`.
* In seconds, you will receive your live admin URL: `https://mukase-admin.vercel.app`!

---

## Phase 5: How to Lock & Protect the Admin Dashboard on Vercel

You don't want unauthorized people accessing the kitchen portal. You have **two layers of security**:

### Layer 1: In-App Master PIN Guard (Already Built-in)
* When anyone visits `https://mukase-admin.vercel.app`, they are immediately blocked by Chef Lulu's PIN terminal.
* Default Master PIN: **`8492`**.
* It includes brute-force rate-limiting, lockout timers, and audit logs.

### Layer 2: Vercel Password Protection (Extra Strong Security)
If you want to prevent anyone from even seeing the website unless they enter a secret password:
1. In your Vercel Dashboard, click on your **`mukase-admin`** project.
2. Click the **Settings** tab at the top.
3. Click **Deployment Protection** in the left menu.
4. Scroll to **Password Protection**:
   * Toggle **Password Protection** to **ON**.
   * Enter a strong password (e.g. `LuluKitchen2026!`).
   * Click **Save**.
5. Now, whenever someone visits `https://mukase-admin.vercel.app`, Vercel shows a secure password challenge screen before allowing access!

---

## Phase 6: End-to-End Live Production Verification Test

Now that all 3 services are deployed, test that they communicate across the internet:

1. **Open the Admin Terminal on your computer:**  
   Navigate to `https://mukase-admin.vercel.app`. Enter PIN `8492`.  
   *Notice the green status bar at the top: `Sync Engine: LIVE (Port ...)`*.
2. **Open the Customer Storefront on your phone:**  
   Navigate to `https://mukase-customer.vercel.app`.
3. **Place an order on your phone:**  
   * Add **"Jollof with Goat Meat"** to your Order Bag.
   * Open the bag, type your name (e.g. "Abena"), phone number, address, and CashApp tag.
   * Click **Order via WhatsApp**.
   * Take note of the Order ID (e.g., `MUK-7382`).
4. **Watch the Admin Screen:**  
   * In under 1 second, the kitchen chime rings!
   * The order `MUK-7382` pops up in the **Pending Payment** queue!
5. **Update Status in Kitchen:**  
   * On your computer screen, click **"Verify & Mark Cooking"**.
   * On your phone, go to **"Live Order Tracker"** and lookup `MUK-7382`.
   * The progress tracker immediately moves to **"In Lulu's Kitchen"** live!

---

## Summary Cheat-Sheet

| Service | Host | GitHub Repo | Build Command | Output Folder | URL Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sync API** | Render / Railway | `mukase-by-lulu` | `npm install` | *(Start: `npx tsx server/index.ts`)* | `https://mukase-sync-api.onrender.com` |
| **Customer Store** | Vercel | `mukase-by-lulu` | `npm run build:customer` | `dist` | `https://mukase-customer.vercel.app` |
| **Admin Terminal** | Vercel | `mukase-by-lulu` | `npm run build:admin` | `dist-admin` | `https://mukase-admin.vercel.app` |

All three run from **your single GitHub repository**. Every time you push a change with `git push`, Vercel and Render automatically rebuild their respective parts!
