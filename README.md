# SplitMates Frontend Web Application

Welcome to the SplitMates Client App. This is a high-fidelity React single-page application built on Vite, styled with a modern design system using Tailwind CSS, and brought to life with responsive micro-animations powered by Framer Motion.

## 🚀 Key Features

* **AI Optimal Settlement**:
  * A dedicated modal utilizing SplitMates AI (Gemini) to minimize transaction paths between group members.
  * Interactive Sparkles-themed AI Insights cards outlining the balance logic.
* **Advanced Split Structures**:
  * Clean form interface supporting **Equal**, **Exact Amounts**, **Percentage**, and **Shares** split allocations.
  * Live calculations, individual member avatar allocation lists, and live validation status alerts.
* **Interactive Landing Page**:
  * Ambient spotlight animations.
  * Dynamic bento features grid with hover rotation micro-actions.
  * Alternating entry timeline steps and visual comparisons.
  * Sequential plan card transitions.
* **Responsive Dashboard & Group Details**:
  * Realtime updates, charts, customized category badges, and quick settlements.

---

## 🛠️ Technology Stack

* **Build Tool**: Vite
* **UI Framework**: React
* **Styling**: Tailwind CSS (Tailwind v4 theme variables)
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **State Management**: Zustand
* **Routing**: React Router DOM (v6)
* **HTTP Client**: Axios (configured with intercepts in `src/services/`)

---

## 📁 Directory Structure

```text
split-mates-frontend/
├── src/
│   ├── assets/          # Static design vectors
│   ├── components/      # Reusable UI elements
│   │   ├── Common/      # Navigation and layout shell
│   │   ├── Expense/     # Add/View Expense forms, tags, receipts
│   │   ├── Friends/     # Friends listings, search results, approvals
│   │   ├── Group/       # Group detail sheets, invite wrappers
│   │   ├── Settlement/  # Settlement forms, optimal modals, summary lists
│   │   ├── landing/     # Interactive sections for landing page
│   │   └── ui/          # Standard design components (Inputs, Buttons)
│   ├── hooks/           # useFetch and standard hook utilities
│   ├── pages/           # High-level views (Dashboard, Settlements, Landing)
│   ├── services/        # Service layers wrapper for backend endpoints
│   ├── stores/          # Zustand global state slices (User, Group, Settlement)
│   ├── utils/           # Shared Zod validation schemas
│   ├── App.css          # Core custom styles and Tailwind theme overrides
│   ├── App.jsx          # Route maps & layout providers
│   └── main.jsx         # App entry mount
```

---

## 🔧 Installation & Running Locally

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Configure Environment (`.env`)
Create a `.env` file in the root folder with the address of your local backend server:

```ini
VITE_API_URL="http://localhost:3000/api"
```

### 3. Setup Commands
Install package dependencies:

```bash
# Install dependencies
npm install
```

### 4. Running the Development Server

```bash
# Start local server with hot reloading (defaults to port 5173)
npm run dev
```

### 5. Building for Production

```bash
# Compile and optimize assets
npm run build

# Preview the compiled build locally
npm run preview
```
